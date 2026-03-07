#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  POOL_ASSETS_DIR,
  POOL_INBOX_DIR,
  POOL_MANIFEST_PATH,
  POOL_RUN_STATE_PATH,
  ensureDirectory,
  parseArgs,
  readJson,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { parsePoolAssetFilename, runItemKey } from "./pool-lib.mjs";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function listImportFiles(sourceDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter(entry => entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map(entry => path.join(sourceDir, entry.name))
    .sort();
}

function ensureRunStateShape(state, assetsDir) {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: state?.createdAt ?? now,
    updatedAt: now,
    assetsDir: state?.assetsDir ?? toRepoRelative(assetsDir),
    outputFormat: state?.outputFormat ?? "avif",
    manifest: state?.manifest ?? {
      path: toRepoRelative(POOL_MANIFEST_PATH),
    },
    completedCount: state?.completedCount ?? 0,
    failedCount: state?.failedCount ?? 0,
    lastSuccessful: state?.lastSuccessful ?? null,
    items: state?.items ?? {},
    rateLimitedUntil: state?.rateLimitedUntil ?? null,
  };
}

function recomputeRunStateCounts(state) {
  state.completedCount = Object.values(state.items).filter(item => item?.status === "completed").length;
  state.failedCount = Object.values(state.items).filter(item => item?.status === "failed").length;
}

async function convertToAvif(sourcePath) {
  return sharp(sourcePath).avif({ effort: 6, quality: 64 }).toBuffer();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDir = args.get("--source-dir", "").trim() || POOL_INBOX_DIR;
  const assetsDir = args.get("--assets-dir", "").trim() || POOL_ASSETS_DIR;
  const runStatePath = args.get("--run-state-path", "").trim() || POOL_RUN_STATE_PATH;
  const deleteSource = args.has("--delete-source");

  const manifest = await readJson(POOL_MANIFEST_PATH);
  const manifestEntries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const manifestByPoolId = new Map(manifestEntries.map(entry => [entry.poolId, entry]));
  const state = ensureRunStateShape(await readJson(runStatePath).catch(() => null), assetsDir);
  const files = await listImportFiles(sourceDir);

  let imported = 0;
  const skipped = [];

  for (const sourcePath of files) {
    const parsed = parsePoolAssetFilename(path.basename(sourcePath));
    if (!parsed) {
      skipped.push(`${toRepoRelative(sourcePath)}: filename does not match pool naming convention`);
      continue;
    }

    const entry = manifestByPoolId.get(parsed.poolId);
    if (!entry) {
      skipped.push(`${toRepoRelative(sourcePath)}: unknown poolId ${parsed.poolId}`);
      continue;
    }

    const maxVariants = Math.max(1, Number.parseInt(String(entry.variants ?? "1"), 10) || 1);
    if (parsed.variantNumber > maxVariants) {
      skipped.push(
        `${toRepoRelative(sourcePath)}: variant ${parsed.variantNumber} exceeds configured variants (${maxVariants})`
      );
      continue;
    }

    const assetDir = path.join(assetsDir, parsed.poolId);
    await ensureDirectory(assetDir);
    const avifBuffer = await convertToAvif(sourcePath);
    const targetPath = path.join(assetDir, `${parsed.poolId}--v${parsed.variantNumber}.avif`);
    await fs.writeFile(targetPath, avifBuffer);

    const key = runItemKey(parsed.poolId, parsed.variantNumber);
    state.items[key] = {
      ...(state.items[key] ?? {}),
      poolId: parsed.poolId,
      variantNumber: parsed.variantNumber,
      status: "completed",
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      lastError: null,
      filePath: targetPath,
      bytes: avifBuffer.length,
      mime: "image/avif",
      ext: ".avif",
      importedFrom: toRepoRelative(sourcePath),
    };
    state.lastSuccessful = {
      poolId: parsed.poolId,
      variantNumber: parsed.variantNumber,
      key,
      filePath: toRepoRelative(targetPath),
      completedAt: new Date().toISOString(),
    };

    if (deleteSource) {
      await fs.unlink(sourcePath);
    }

    imported += 1;
  }

  recomputeRunStateCounts(state);
  state.updatedAt = new Date().toISOString();
  await writeJson(runStatePath, state);

  console.log(`[import-pool-images] Imported: ${imported}`);
  console.log(`[import-pool-images] Run state: ${toRepoRelative(runStatePath)}`);

  if (skipped.length > 0) {
    console.log(`[import-pool-images] Skipped: ${skipped.length}`);
    for (const item of skipped) {
      console.log(`- ${item}`);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
