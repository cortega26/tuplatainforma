import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { URLCHECK_ARTIFACT_DIR } from "./constants.mjs";

const INTERNAL_BROKEN_JSON = "internal-broken.json";
const INTERNAL_BROKEN_CSV = "internal-broken.csv";
const REPORT_JSON = "urlcheck-report.json";

export async function writeUrlcheckArtifacts(report) {
  await mkdir(URLCHECK_ARTIFACT_DIR, { recursive: true });

  const internalBrokenPayload = report.internalBroken.map((item) => ({
    broken_url: item.url,
    status: item.status,
    referrer_url: item.parent || null,
    context: item.context || null,
    category: item.category,
  }));

  const internalBrokenJsonPath = path.join(URLCHECK_ARTIFACT_DIR, INTERNAL_BROKEN_JSON);
  const internalBrokenCsvPath = path.join(URLCHECK_ARTIFACT_DIR, INTERNAL_BROKEN_CSV);
  const reportJsonPath = path.join(URLCHECK_ARTIFACT_DIR, REPORT_JSON);

  const reportPayload = {
    generatedAt: new Date().toISOString(),
    mode: report.mode,
    scannedLinks: report.scannedLinks,
    internalBrokenTotal: report.internalBrokenTotal,
    internalBrokenByStatus: report.internalBrokenByStatus,
    internalBroken: internalBrokenPayload,
    externalFailuresTotal: report.externalFailures.length,
    externalFailuresByStatus: report.externalFailuresByStatus,
    topExternalHosts: report.topExternalHosts,
    retryStats: report.retryStats,
  };

  await writeFile(internalBrokenJsonPath, `${JSON.stringify(internalBrokenPayload, null, 2)}\n`, "utf8");
  await writeFile(internalBrokenCsvPath, toCsv(internalBrokenPayload), "utf8");
  await writeFile(reportJsonPath, `${JSON.stringify(reportPayload, null, 2)}\n`, "utf8");

  const artifacts = {
    internalBrokenJsonPath,
    internalBrokenCsvPath,
    reportJsonPath,
  };
  await assertArtifactIntegrity(artifacts);
  return artifacts;
}

async function assertArtifactIntegrity(artifacts) {
  try {
    await Promise.all([
      access(artifacts.internalBrokenJsonPath),
      access(artifacts.internalBrokenCsvPath),
      access(artifacts.reportJsonPath),
    ]);
  } catch {
    throw new Error("artifact_generation_failed");
  }
}

function toCsv(rows) {
  const headers = ["broken_url", "status", "referrer_url", "context", "category"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}
