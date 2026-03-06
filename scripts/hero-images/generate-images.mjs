#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
const DEFAULT_IMAGE_MODEL =
  process.env.OPENAI_IMAGE_MODEL || process.env.DALL_E_MODEL || "dall-e-3";
const GPT_IMAGE_QUALITY_VALUES = new Set(["low", "medium", "high", "auto"]);
const GPT_IMAGE_SIZE_VALUES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);

function normalizeModelToken(value = "") {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function isGptImageModel(model = "") {
  return String(model).trim().toLowerCase().startsWith("gpt-image");
}

function normalizeQualityForModel(model, quality) {
  const normalizedQuality = String(quality || "").trim().toLowerCase();

  if (isGptImageModel(model)) {
    if (!normalizedQuality || normalizedQuality === "standard") {
      return "auto";
    }
    return GPT_IMAGE_QUALITY_VALUES.has(normalizedQuality) ? normalizedQuality : normalizedQuality;
  }

  return normalizedQuality || "standard";
}

function normalizeSizeForModel(model, size) {
  const normalizedSize = String(size || "").trim().toLowerCase();

  if (isGptImageModel(model)) {
    if (!normalizedSize || normalizedSize === "1792x1024") {
      return "1536x1024";
    }
    return GPT_IMAGE_SIZE_VALUES.has(normalizedSize) ? normalizedSize : normalizedSize;
  }

  return normalizedSize || "1792x1024";
}

function resolveRequestedModels(entry, args) {
  const compareModelsRaw = args.get("--compare-models", "");
  if (compareModelsRaw) {
    return Array.from(
      new Set(
        compareModelsRaw
          .split(",")
          .map(item => item.trim())
          .filter(Boolean)
      )
    );
  }

  const explicitModel = args.get("--model", "").trim();
  if (explicitModel) {
    return [explicitModel];
  }

  return [entry?.modelPlan?.model || DEFAULT_IMAGE_MODEL];
}

function resolveGenerationOptions(entry, args, model) {
  const size = normalizeSizeForModel(
    model,
    args.get("--size", "").trim() || entry?.modelPlan?.size || "1792x1024"
  );
  const quality = normalizeQualityForModel(
    model,
    args.get("--quality", "").trim() || entry?.modelPlan?.quality || "standard"
  );
  const styleArg = args.get("--style", "").trim() || process.env.OPENAI_IMAGE_STYLE || "";

  const body = {
    model,
    prompt: entry.prompt,
    size,
    quality,
    n: 1,
  };

  if (styleArg && model === "dall-e-3") {
    body.style = styleArg;
  }

  return body;
}

export function buildGenerationPlan(entries, args) {
  const slugFilter = args.get("--slug", "").trim();
  const limit = Number.parseInt(args.get("--limit", "0"), 10);
  const filteredEntries = slugFilter
    ? entries.filter(entry => entry.slug === slugFilter)
    : entries;

  const limitedEntries =
    Number.isFinite(limit) && limit > 0 ? filteredEntries.slice(0, limit) : filteredEntries;

  return limitedEntries.flatMap(entry =>
    resolveRequestedModels(entry, args).map(model => ({
      entry,
      model,
      options: resolveGenerationOptions(entry, args, model),
    }))
  );
}

function targetFilename(slug, model, ext, planLength, defaultModel) {
  if (planLength === 1 && model === defaultModel) {
    return `${slug}${ext}`;
  }
  return `${slug}--${normalizeModelToken(model)}${ext}`;
}

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

async function generateWithOpenAI(entry, apiKey, options) {
  const response = await fetch(OPENAI_IMAGES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
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

  const prompts = await readJson(PROMPTS_PATH);
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];
  const plan = buildGenerationPlan(entries, args);
  const slugFilter = args.get("--slug", "").trim();

  if (plan.length === 0) {
    throw new Error(
      slugFilter
        ? `[generate-images] No prompt entry found for slug '${slugFilter}'.`
        : "[generate-images] No prompt entries available for generation."
    );
  }

  await ensureDirectory(DOWNLOADS_DIR);

  if (isDryRun) {
    console.log(`[generate-images] DRY RUN. Requests planned: ${plan.length}`);
    for (const item of plan) {
      console.log(
        `- ${item.entry.slug}: model=${item.model} target=${item.entry.targetImagePath}`
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
    `[generate-images] Running generation for ${plan.length} request(s) using ${OPENAI_IMAGES_ENDPOINT}`
  );

  let success = 0;
  const failures = [];

  for (const item of plan) {
    try {
      const { bytes, ext } = await generateWithOpenAI(item.entry, apiKey, item.options);
      const defaultModel = item.entry?.modelPlan?.model || DEFAULT_IMAGE_MODEL;
      const filePath = path.join(
        DOWNLOADS_DIR,
        targetFilename(item.entry.slug, item.model, ext, plan.length, defaultModel)
      );
      await fs.writeFile(filePath, bytes);
      success += 1;
      console.log(
        `- ${item.entry.slug} [${item.model}]: saved ${toRepoRelative(filePath)} (${bytes.length} bytes)`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ slug: item.entry.slug, model: item.model, message });
      console.error(`- ${item.entry.slug} [${item.model}]: FAILED -> ${message}`);
    }
  }

  console.log(`[generate-images] Success: ${success}/${plan.length}`);

  if (failures.length > 0) {
    console.error(`[generate-images] Failures: ${failures.length}`);
    process.exit(1);
  }
}

const executedAsScript =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executedAsScript) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
