import { mkdir, writeFile } from "node:fs/promises";

const ARTIFACT_DIR = "scripts/urlcheck/artifacts";

export async function writeInternalBrokenArtifacts(internalBroken) {
  await mkdir(ARTIFACT_DIR, { recursive: true });

  const jsonPath = `${ARTIFACT_DIR}/internal-broken.json`;
  const csvPath = `${ARTIFACT_DIR}/internal-broken.csv`;

  const payload = internalBroken.map((item) => ({
    broken_url: item.url,
    status: item.status,
    referrer_url: item.parent || null,
    context: item.context || null,
    category: item.category,
  }));

  await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(csvPath, toCsv(payload), "utf8");

  return { jsonPath, csvPath };
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
