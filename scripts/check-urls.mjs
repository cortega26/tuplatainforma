#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { LinkChecker } from "linkinator";
import { ALLOWLIST_HOSTS, MODES } from "./urlcheck/constants.mjs";
import { startServerTarget } from "./urlcheck/server-target.mjs";
import { classifyLinks } from "./urlcheck/classify.mjs";
import { applyRetries } from "./urlcheck/retry.mjs";
import { buildReport, printReport } from "./urlcheck/report.mjs";
import { evaluateBaseline, readBaseline, writeBaseline } from "./urlcheck/baseline.mjs";
import { writeInternalBrokenArtifacts } from "./urlcheck/artifacts.mjs";
import { enrichInternalBrokenContext } from "./urlcheck/context.mjs";

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  const forcedMode = process.env.URLCHECK_MODE || "";

  if (flags.has("--canary")) {
    return { mode: "canary", canary: true, updateBaseline: false };
  }

  if (flags.has("--update-baseline")) {
    return {
      mode: forcedMode === "ci" ? "ci" : "local",
      canary: false,
      updateBaseline: true,
    };
  }

  return {
    mode: forcedMode === "ci" ? "ci" : "local",
    canary: false,
    updateBaseline: false,
  };
}

async function main() {
  const options = parseArgs(process.argv);
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
      allowlistHosts: ALLOWLIST_HOSTS,
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

    const artifacts = await writeInternalBrokenArtifacts(report.internalBroken);
    printReport(report);
    console.log(`[check-urls] artifacts: ${artifacts.jsonPath}, ${artifacts.csvPath}`);

    if (options.updateBaseline) {
      await writeBaseline(report);
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
