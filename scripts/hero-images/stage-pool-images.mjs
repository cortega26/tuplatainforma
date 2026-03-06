#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  DOWNLOADS_DIR,
  POOL_ASSIGNMENTS_PATH,
  POOL_MANIFEST_PATH,
  PROMPTS_PATH,
  ensureDirectory,
  parseArgs,
  readJson,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { buildPoolSelectionPlan } from "./pool-lib.mjs";

const ALLOWED_ASSET_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function collectPoolAssetIndex(manifestEntries, assetsDir) {
  const assetIndex = new Map();

  for (const entry of manifestEntries) {
    const assetDir = path.join(assetsDir, entry.poolId);
    let files = [];
    try {
      files = await fs.readdir(assetDir);
    } catch {
      continue;
    }

    const records = files
      .filter(fileName => ALLOWED_ASSET_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .map(fileName => ({
        poolId: entry.poolId,
        filePath: path.join(assetDir, fileName),
      }));

    if (records.length === 0) continue;
    assetIndex.set(entry.lookupKey, records);
  }

  return assetIndex;
}

async function copyIfDifferent(sourcePath, targetPath) {
  const sourceBytes = await fs.readFile(sourcePath);
  try {
    const existingBytes = await fs.readFile(targetPath);
    if (existingBytes.equals(sourceBytes)) return false;
  } catch {
    // missing target
  }

  await fs.copyFile(sourcePath, targetPath);
  return true;
}

export async function stagePoolImages({
  slugFilter = "",
  assetsDir,
  outputDir,
  assignmentsPath,
} = {}) {
  const poolManifest = await readJson(POOL_MANIFEST_PATH);
  const prompts = await readJson(PROMPTS_PATH);
  const manifestEntries = Array.isArray(poolManifest.entries) ? poolManifest.entries : [];
  const promptEntries = (Array.isArray(prompts.entries) ? prompts.entries : []).filter(entry =>
    slugFilter ? entry.slug === slugFilter : true
  );
  const resolvedAssetsDir = assetsDir || path.join(path.dirname(POOL_MANIFEST_PATH), "assets");
  const resolvedOutputDir = outputDir || DOWNLOADS_DIR;
  const resolvedAssignmentsPath = assignmentsPath || POOL_ASSIGNMENTS_PATH;

  const assetIndex = await collectPoolAssetIndex(manifestEntries, resolvedAssetsDir);
  const { assignments, missing } = buildPoolSelectionPlan(promptEntries, assetIndex);

  await ensureDirectory(resolvedOutputDir);

  let copied = 0;
  for (const assignment of assignments) {
    const targetPath = path.join(resolvedOutputDir, `${assignment.slug}${assignment.ext}`);
    const didCopy = await copyIfDifferent(assignment.filePath, targetPath);
    if (didCopy) copied += 1;
  }

  const payload = {
    schemaVersion: 1,
    sourcePoolManifest: toRepoRelative(POOL_MANIFEST_PATH),
    count: assignments.length,
    assignments: assignments.map(item => ({
      ...item,
      filePath: toRepoRelative(item.filePath),
    })),
  };

  await writeJson(resolvedAssignmentsPath, payload);

  if (missing.length > 0) {
    const detail = missing
      .map(
        item =>
          `- ${item.slug}: template=${item.template} approvedModelId=${item.approvedModelId} hex=${item.hex}`
      )
      .join("\n");
    throw new Error(
      `[stage-pool-images] Missing pool assets for ${missing.length} prompt(s):\n${detail}`
    );
  }

  return {
    assignmentsCount: assignments.length,
    copied,
    assignmentsPath: resolvedAssignmentsPath,
    outputDir: resolvedOutputDir,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slugFilter = args.get("--slug", "").trim();
  const assetsDir = args.get("--assets-dir", "").trim();
  const outputDir = args.get("--output-dir", "").trim();
  const assignmentsPath = args.get("--assignments-path", "").trim();

  const result = await stagePoolImages({
    slugFilter,
    assetsDir,
    outputDir,
    assignmentsPath,
  });

  console.log(`[stage-pool-images] Assignments: ${result.assignmentsCount}`);
  console.log(`[stage-pool-images] Copied to output: ${result.copied}`);
  console.log(`[stage-pool-images] Output: ${toRepoRelative(result.assignmentsPath)}`);
}

const isMainModule =
  typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
