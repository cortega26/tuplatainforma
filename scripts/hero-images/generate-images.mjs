#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import {
  DOWNLOADS_DIR,
  PROMPTS_PATH,
  ensureDirectory,
  parseArgs,
  readJson,
  toRepoRelative,
} from "./lib.mjs";

const OPENAI_IMAGES_ENDPOINT =
  process.env.OPENAI_IMAGES_ENDPOINT || "https://api.openai.com/v1/images/generations";

function inferExtensionFromMime(mime = "") {
  if (mime.includes("png")) return ".png";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
  return ".png";
}

async function downloadBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download generated image (${response.status}) ${url}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    bytes,
    ext: inferExtensionFromMime(contentType),
  };
}

async function generateWithOpenAI(entry, apiKey) {
  const model = entry?.modelPlan?.model || process.env.DALL_E_MODEL || "dall-e-3";
  const size = entry?.modelPlan?.size || "1792x1024";
  const quality = entry?.modelPlan?.quality || "standard";

  const body = {
    model,
    prompt: entry.prompt,
    size,
    quality,
    n: 1,
  };

  const response = await fetch(OPENAI_IMAGES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(
      `OpenAI image generation failed for ${entry.slug} (${response.status}): ${payload}`
    );
  }

  const payload = await response.json();
  const first = payload?.data?.[0] || null;

  if (first?.b64_json) {
    return {
      bytes: Buffer.from(first.b64_json, "base64"),
      ext: ".png",
    };
  }

  if (first?.url) {
    return downloadBytes(first.url);
  }

  throw new Error(`OpenAI image payload for ${entry.slug} does not include b64_json or url.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const shouldRun = args.has("--run");
  const isDryRun = !shouldRun || args.has("--dry-run");
  const limit = Number.parseInt(args.get("--limit", "0"), 10);

  const prompts = await readJson(PROMPTS_PATH);
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];
  const slice = Number.isFinite(limit) && limit > 0 ? entries.slice(0, limit) : entries;

  await ensureDirectory(DOWNLOADS_DIR);

  if (isDryRun) {
    console.log(`[generate-images] DRY RUN. Entries planned: ${slice.length}`);
    for (const entry of slice) {
      console.log(
        `- ${entry.slug}: model=${entry.modelPlan?.model || "dall-e-3"} target=${entry.targetImagePath}`
      );
    }
    console.log("[generate-images] Use --run with OPENAI_API_KEY to execute generation.");
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when using --run.");
  }

  console.log(
    `[generate-images] Running generation for ${slice.length} prompts using ${OPENAI_IMAGES_ENDPOINT}`
  );

  let success = 0;
  const failures = [];

  for (const entry of slice) {
    try {
      const { bytes, ext } = await generateWithOpenAI(entry, apiKey);
      const filePath = path.join(DOWNLOADS_DIR, `${entry.slug}${ext}`);
      await fs.writeFile(filePath, bytes);
      success += 1;
      console.log(`- ${entry.slug}: saved ${toRepoRelative(filePath)} (${bytes.length} bytes)`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ slug: entry.slug, message });
      console.error(`- ${entry.slug}: FAILED -> ${message}`);
    }
  }

  console.log(`[generate-images] Success: ${success}/${slice.length}`);

  if (failures.length > 0) {
    console.error(`[generate-images] Failures: ${failures.length}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
