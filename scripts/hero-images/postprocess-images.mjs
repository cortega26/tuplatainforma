#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  DOWNLOADS_DIR,
  PROMPTS_PATH,
  PUBLISHED_HERO_MAX_BYTES,
  ensureDirectory,
  parseArgs,
  readJson,
  toRepoRelative,
} from "./lib.mjs";

const SUPPORTED_INPUTS = [".avif", ".webp", ".png", ".jpg", ".jpeg"];

async function findInputFile(slug) {
  for (const ext of SUPPORTED_INPUTS) {
    const candidate = path.join(DOWNLOADS_DIR, `${slug}${ext}`);
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // ignore
    }
  }
  return null;
}

async function convertToAvif(inputPath, outputPath, maxBytes) {
  const qualitySteps = [65, 60, 55, 50, 45, 40];

  for (const quality of qualitySteps) {
    const buffer = await sharp(inputPath)
      .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
      .avif({ effort: 6, quality })
      .toBuffer();

    if (buffer.length <= maxBytes) {
      await fs.writeFile(outputPath, buffer);
      return { quality, bytes: buffer.length };
    }
  }

  const fallback = await sharp(inputPath)
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .avif({ effort: 9, quality: 35 })
    .toBuffer();

  await fs.writeFile(outputPath, fallback);
  return { quality: 35, bytes: fallback.length };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const maxBytes = Number.parseInt(
    args.get("--max-bytes", String(PUBLISHED_HERO_MAX_BYTES)),
    10
  );

  const prompts = await readJson(PROMPTS_PATH);
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];

  await ensureDirectory(DOWNLOADS_DIR);

  const missing = [];
  const oversized = [];

  for (const entry of entries) {
    const inputPath = await findInputFile(entry.slug);
    if (!inputPath) {
      missing.push(entry.slug);
      continue;
    }

    const outputPath = path.join(DOWNLOADS_DIR, `${entry.slug}.avif`);
    const result = await convertToAvif(inputPath, outputPath, maxBytes);
    const status = result.bytes <= maxBytes ? "OK" : "OVER";

    if (status === "OVER") {
      oversized.push({ slug: entry.slug, bytes: result.bytes });
    }

    console.log(
      `[postprocess-images] ${entry.slug} -> ${toRepoRelative(outputPath)} (${result.bytes} bytes, q=${result.quality}, ${status})`
    );
  }

  if (missing.length > 0) {
    console.error(`[postprocess-images] Missing staged sources for ${missing.length} slug(s):`);
    for (const slug of missing) {
      console.error(`- ${slug}`);
    }
    process.exit(1);
  }

  if (oversized.length > 0) {
    console.error(`[postprocess-images] ${oversized.length} file(s) remain over budget (${maxBytes} bytes):`);
    for (const item of oversized) {
      console.error(`- ${item.slug}: ${item.bytes} bytes`);
    }
    process.exit(1);
  }

  console.log(`[postprocess-images] Completed for ${entries.length} prompt(s).`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
