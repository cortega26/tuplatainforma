#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import {
  POOL_ASSETS_DIR,
  POOL_MANIFEST_PATH,
  POOL_RUN_STATE_PATH,
  POOL_WORKLIST_PATH,
  POOL_WORKLIST_TEXT_PATH,
  parseArgs,
  readJson,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { buildPoolGenerationQueue } from "./pool-lib.mjs";

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function fileCount(dirPath) {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.filter(item => /\.[a-z0-9]+$/i.test(item)).length;
  } catch {
    return 0;
  }
}

async function completedKeysFromState(runStatePath) {
  try {
    const state = await readJson(runStatePath);
    const completed = new Set();
    for (const [key, item] of Object.entries(state?.items ?? {})) {
      if (item?.status !== "completed" || typeof item.filePath !== "string") continue;
      const targetPath = path.isAbsolute(item.filePath)
        ? item.filePath
        : path.resolve(process.cwd(), item.filePath);
      if (await fileExists(targetPath)) {
        completed.add(key);
      }
    }
    return completed;
  } catch {
    return new Set();
  }
}

function renderTextWorklist(items) {
  return items
    .map(
      item =>
        [
          `${item.index}. ${item.poolId} v${item.variantNumber}`,
          `Save as: ${item.targetFileName}`,
          `Prompt: ${item.prompt}`,
        ].join("\n")
    )
    .join("\n\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const assetsDir = args.get("--assets-dir", "").trim() || POOL_ASSETS_DIR;
  const runStatePath = args.get("--run-state-path", "").trim() || POOL_RUN_STATE_PATH;
  const outputJsonPath = args.get("--output-json", "").trim() || POOL_WORKLIST_PATH;
  const outputTextPath = args.get("--output-text", "").trim() || POOL_WORKLIST_TEXT_PATH;

  const manifest = await readJson(POOL_MANIFEST_PATH);
  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const completedKeys = await completedKeysFromState(runStatePath);

  const existingCounts = new Map();
  for (const entry of entries) {
    const assetDir = path.join(assetsDir, entry.poolId);
    existingCounts.set(entry.poolId, await fileCount(assetDir));
  }

  const queue = buildPoolGenerationQueue(entries, existingCounts, {
    completedKeys,
    limit: args.get("--limit", "0"),
    startAt: args.get("--start-at", "0"),
  });

  const items = queue.map((item, index) => ({
    index: index + 1,
    poolId: item.entry.poolId,
    variantNumber: item.variantNumber,
    targetFileName: `${item.entry.poolId}--v${item.variantNumber}.avif`,
    targetPath: toRepoRelative(path.join(assetsDir, item.entry.poolId, `${item.entry.poolId}--v${item.variantNumber}.avif`)),
    template: item.entry.template,
    approvedModelId: item.entry.approvedModelId,
    sceneId: item.entry.sceneId,
    colorKey: item.entry.colorKey,
    palette: item.entry.palette,
    prompt: item.entry.prompt,
  }));

  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceManifest: toRepoRelative(POOL_MANIFEST_PATH),
    sourceRunState: toRepoRelative(runStatePath),
    count: items.length,
    items,
  };

  await writeJson(outputJsonPath, payload);
  await fs.writeFile(outputTextPath, `${renderTextWorklist(items)}\n`, "utf8");

  console.log(`[export-pool-worklist] Remaining items: ${items.length}`);
  console.log(`[export-pool-worklist] JSON: ${toRepoRelative(outputJsonPath)}`);
  console.log(`[export-pool-worklist] Text: ${toRepoRelative(outputTextPath)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
