#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { LinkChecker } from "linkinator";
import { ALLOWLIST_HOSTS_CRITICAL, MODES } from "./urlcheck/constants.mjs";
import { startServerTarget } from "./urlcheck/server-target.mjs";
import { classifyLinks } from "./urlcheck/classify.mjs";
import { applyRetries } from "./urlcheck/retry.mjs";
import { buildReport, printReport } from "./urlcheck/report.mjs";
import { evaluateBaseline, readBaseline, writeBaseline } from "./urlcheck/baseline.mjs";
import { writeUrlcheckArtifacts } from "./urlcheck/artifacts.mjs";
import { enrichInternalBrokenContext } from "./urlcheck/context.mjs";

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  const forcedMode = process.env.URLCHECK_MODE || "";
  const canary = flags.has("--canary");
  const updateBaseline = flags.has("--update-baseline");
  const externalAudit = flags.has("--external-audit");
  const allowBaselineUpdate = flags.has("--allow-baseline-update");

  if (canary) {
    return {
      mode: "canary",
      canary: true,
      updateBaseline: false,
      externalAudit: false,
      allowBaselineUpdate,
    };
  }

  if (updateBaseline) {
    return {
      mode: forcedMode === "ci" ? "ci" : "local",
      canary,
      updateBaseline: true,
      externalAudit: false,
      allowBaselineUpdate,
    };
  }

  if (externalAudit) {
    return {
      mode: "external_audit",
      canary: false,
      updateBaseline: false,
      externalAudit: true,
      allowBaselineUpdate,
    };
  }

  return {
    mode: forcedMode === "ci" ? "ci" : "local",
    canary: false,
    updateBaseline: false,
    externalAudit: false,
    allowBaselineUpdate,
  };
}

async function main() {
  const options = parseArgs(process.argv);
  enforceOptionConflicts(options);
  enforceBaselineUpdatePolicy(options);

  const modeConfig = MODES[options.mode];
  if (!modeConfig) {
    throw new Error(`invalid_mode:${options.mode}`);
  }

  const target = await startServerTarget({ mode: options.mode });

  try {
    const checker = new LinkChecker();
    const config = await readLinkinatorConfig();
    const payload = await checker.check({
      path: target.targetUrl,
      recurse: true,
      concurrency: modeConfig.concurrency,
      timeout: modeConfig.timeoutMs,
      linksToSkip: config.skip,
      retry: false,
      retryErrors: false,
    });
    let links = payload.links;

    if (links.length === 0) {
      throw new Error("zero_links_scanned");
    }

    const retryResult = await applyRetries(links, {
      modeConfig,
      maxConcurrency: modeConfig.concurrency,
    });

    links = retryResult.links;

    const { internalBroken, externalFailures } = classifyLinks(links, {
      internalOrigins: target.internalOrigins,
      allowlistHosts: ALLOWLIST_HOSTS_CRITICAL,
    });
    const internalBrokenWithContext = await enrichInternalBrokenContext(internalBroken, {
      contentRoot: target.contentRoot,
      siteBase: target.siteBase,
    });

    const report = buildReport({
      mode: options.mode,
      scannedLinks: links.length,
      internalBroken: internalBrokenWithContext,
      externalFailures,
      retryStats: retryResult.retryStats,
    });

    const artifacts = await writeUrlcheckArtifacts(report);
    printReport(report);
    console.log(
      `[check-urls] artifacts: ${artifacts.internalBrokenJsonPath}, ${artifacts.internalBrokenCsvPath}, ${artifacts.reportJsonPath}`
    );

    if (options.externalAudit) {
      console.log(
        `[check-urls] External audit mode complete (non-blocking). internal_broken=${report.internalBrokenTotal} external_failures=${report.externalFailures.length}`
      );
      return;
    }

    if (options.updateBaseline) {
      await writeBaseline(report, {
        updatedBy: resolveBaselineUpdatedBy(),
        reason: process.env.URLCHECK_BASELINE_REASON,
      });
      console.log("[check-urls] Baseline updated.");
      return;
    }

    if (options.canary) {
      if (report.internalBrokenTotal < 1) {
        throw new Error("canary_expected_internal_broken_not_detected");
      }
      console.log("[check-urls] Canary detected known broken link as expected.");
      return;
    }

    const baseline = await readBaseline();
    const baselineEval = evaluateBaseline(report, baseline);
    console.log(
      `[check-urls] baseline_policy.max_internal_broken_total=${baselineEval.maxInternalBrokenTotal}`
    );

    if (!baselineEval.pass) {
      throw new Error(`internal_broken_exceeds_baseline:delta=${baselineEval.delta}`);
    }

    if (report.internalBrokenTotal > 0) {
      throw new Error(`internal_broken_detected:${report.internalBrokenTotal}`);
    }

    if (report.scannedLinks === 0) {
      throw new Error("zero_links_scanned_post_processing");
    }

    console.log(
      `[check-urls] OK. scanned=${report.scannedLinks} internal_broken=${report.internalBrokenTotal} external_failures=${report.externalFailures.length}`
    );
  } finally {
    await target.stop();
  }
}

main().catch((error) => {
  console.error(`[check-urls] FAIL: ${error.message}`);
  process.exit(1);
});

function enforceOptionConflicts(options) {
  if (options.canary && options.externalAudit) {
    throw new Error("invalid_options:canary_and_external_audit_are_mutually_exclusive");
  }
}

function enforceBaselineUpdatePolicy(options) {
  if (!options.updateBaseline) return;

  if (isCiEnvironment()) {
    throw new Error("baseline_update_forbidden_in_ci");
  }

  const authorized = options.allowBaselineUpdate || process.env.URLCHECK_ALLOW_BASELINE_UPDATE === "1";
  if (!authorized) {
    throw new Error(
      "baseline_update_not_authorized: set URLCHECK_ALLOW_BASELINE_UPDATE=1 or pass --allow-baseline-update"
    );
  }

  const reason = String(process.env.URLCHECK_BASELINE_REASON || "").trim();
  if (!reason) {
    throw new Error("baseline_update_reason_required: set URLCHECK_BASELINE_REASON to a non-empty value");
  }
}

function isCiEnvironment() {
  const value = String(process.env.CI || "").toLowerCase();
  return value === "true" || value === "1";
}

function resolveBaselineUpdatedBy() {
  const candidates = [
    process.env.URLCHECK_BASELINE_UPDATED_BY,
    process.env.GITHUB_ACTOR,
    process.env.USER,
    process.env.LOGNAME,
  ];

  for (const item of candidates) {
    const value = String(item || "").trim();
    if (value) return value;
  }

  return "unknown";
}

async function readLinkinatorConfig() {
  try {
    const raw = await readFile(".linkinatorrc", "utf8");
    const json = JSON.parse(raw);
    return {
      skip: Array.isArray(json?.skip) ? json.skip : [],
    };
  } catch {
    return { skip: [] };
  }
}
