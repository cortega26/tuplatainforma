import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BASELINE_PATH } from "./constants.mjs";

export async function readBaseline() {
  try {
    const raw = await readFile(BASELINE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeBaseline(report, metadata = {}) {
  const updatedAtIso = new Date().toISOString();
  const reason = String(metadata.reason || "").trim();
  const updatedBy = String(metadata.updatedBy || "").trim() || "unknown";
  if (!reason) {
    throw new Error("baseline_update_reason_required");
  }

  const baseline = {
    version: 1,
    updatedAt: updatedAtIso,
    updated_at: updatedAtIso,
    updated_by: updatedBy,
    reason,
    policy: {
      maxInternalBrokenTotal: 0,
    },
    snapshot: {
      scannedLinks: report.scannedLinks,
      internalBrokenTotal: report.internalBrokenTotal,
      internalBrokenByStatus: report.internalBrokenByStatus,
      internalBrokenPathsSample: report.internalBroken.slice(0, 20).map((item) => item.url),
    },
  };

  await mkdir(path.dirname(BASELINE_PATH), { recursive: true });
  await writeFile(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
}

export function evaluateBaseline(report, baseline) {
  const maxInternalBrokenTotal = baseline?.policy?.maxInternalBrokenTotal ?? 0;
  return {
    maxInternalBrokenTotal,
    pass: report.internalBrokenTotal <= maxInternalBrokenTotal,
    delta: report.internalBrokenTotal - maxInternalBrokenTotal,
  };
}
