#!/usr/bin/env node
import {
  POOL_MANIFEST_PATH,
  parseArgs,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { buildPoolEntries, summarizePoolEntries } from "./pool-lib.mjs";

function parseCsv(value = "") {
  return String(value)
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const templates = parseCsv(args.get("--templates", ""));
  const colorKeys = parseCsv(args.get("--colors", ""));
  const variants = Number.parseInt(args.get("--variants", "1"), 10) || 1;

  const entries = buildPoolEntries({
    templates,
    colorKeys,
    variants,
  });
  const summary = summarizePoolEntries(entries);

  const manifest = {
    schemaVersion: 1,
    source: "scripts/hero-images/config.mjs",
    generatedAt: new Date().toISOString(),
    count: entries.length,
    summary,
    entries,
  };

  await writeJson(POOL_MANIFEST_PATH, manifest);

  console.log(`[build-pool-manifest] Canonical combinations: ${summary.canonicalCombinationCount}`);
  console.log(`[build-pool-manifest] Requested assets: ${summary.requestedAssetCount}`);
  console.log(`[build-pool-manifest] Approved model count: ${summary.approvedModelCount}`);
  console.log(`[build-pool-manifest] Color count: ${summary.colorCount}`);
  console.log(
    `[build-pool-manifest] By template: ${Object.entries(summary.byTemplate)
      .map(([template, count]) => `${template}=${count}`)
      .join(", ")}`
  );
  console.log(`[build-pool-manifest] Output: ${toRepoRelative(POOL_MANIFEST_PATH)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
