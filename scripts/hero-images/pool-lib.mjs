import crypto from "node:crypto";
import path from "node:path";
import {
  APPROVED_PROMPT_MODELS,
  COLORS,
  buildPromptA,
  buildPromptB,
  buildPromptC,
} from "./config.mjs";

function normalizeToken(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canonicalKey(template, approvedModelId, hex) {
  return `${template}::${approvedModelId}::${String(hex).trim().toLowerCase()}`;
}

export function runItemKey(poolId, variantNumber) {
  return `${poolId}::v${variantNumber}`;
}

export function poolIdFromParts(template, approvedModelId, hex) {
  return `${normalizeToken(template)}--${normalizeToken(approvedModelId)}--${normalizeToken(hex)}`;
}

export function parsePoolAssetFilename(fileName) {
  const match = String(fileName).match(/^(.*?)(?:--v(\d+))?(\.[a-z0-9]+)$/i);
  if (!match) return null;
  return {
    poolId: match[1] ?? "",
    variantNumber: Number.parseInt(match[2] ?? "1", 10) || 1,
    ext: (match[3] ?? "").toLowerCase(),
  };
}

function buildPromptForModel(template, hex, model) {
  if (template === "A") {
    return buildPromptA(hex, model.postura, model.objetos);
  }
  if (template === "B") {
    return buildPromptB(hex, model.icono);
  }
  return buildPromptC(hex, model.icono);
}

export function buildPoolEntries(options = {}) {
  const requestedTemplates =
    Array.isArray(options.templates) && options.templates.length > 0
      ? options.templates
      : ["A", "B", "C"];
  const requestedColorKeys =
    Array.isArray(options.colorKeys) && options.colorKeys.length > 0
      ? options.colorKeys
      : Object.keys(COLORS);
  const variants = Math.max(1, Number.parseInt(String(options.variants ?? "1"), 10) || 1);

  const entries = [];

  for (const template of requestedTemplates) {
    const approvedModels = APPROVED_PROMPT_MODELS[template] ?? [];
    for (const colorKey of requestedColorKeys) {
      const color = COLORS[colorKey];
      if (!color) continue;

      for (const model of approvedModels) {
        const prompt = buildPromptForModel(template, color.hex, model);
        const poolId = poolIdFromParts(template, model.id, color.hex);

        entries.push({
          poolId,
          lookupKey: canonicalKey(template, model.id, color.hex),
          template,
          approvedModelId: model.id,
          sceneId: model.sceneId,
          label: model.label,
          colorKey,
          palette: {
            hex: color.hex,
            label: color.label,
          },
          prompt,
          promptHash: crypto.createHash("sha256").update(prompt, "utf8").digest("hex"),
          variants,
        });
      }
    }
  }

  entries.sort((a, b) => a.poolId.localeCompare(b.poolId));
  return entries;
}

export function summarizePoolEntries(entries) {
  const byTemplate = {};
  const byTemplateAndColor = {};
  let requestedAssets = 0;

  for (const entry of entries) {
    byTemplate[entry.template] = (byTemplate[entry.template] ?? 0) + 1;
    requestedAssets += Math.max(1, Number.parseInt(String(entry.variants ?? "1"), 10) || 1);

    const templateColorKey = `${entry.template}::${entry.colorKey}`;
    byTemplateAndColor[templateColorKey] = (byTemplateAndColor[templateColorKey] ?? 0) + 1;
  }

  return {
    canonicalCombinationCount: entries.length,
    requestedAssetCount: requestedAssets,
    templateCount: Object.keys(byTemplate).length,
    colorCount: new Set(entries.map(entry => entry.colorKey)).size,
    approvedModelCount: new Set(entries.map(entry => `${entry.template}:${entry.approvedModelId}`)).size,
    byTemplate,
    byTemplateAndColor,
  };
}

function stableIndex(seed, count) {
  if (!Number.isInteger(count) || count <= 1) return 0;
  const hash = crypto.createHash("sha256").update(String(seed), "utf8").digest();
  return hash.readUInt32BE(0) % count;
}

export function buildPoolSelectionPlan(promptEntries, assetIndex) {
  const assignments = [];
  const missing = [];

  for (const entry of promptEntries) {
    const hex = entry?.palette?.hex || "";
    const lookupKey = canonicalKey(entry.template, entry.approvedModelId, hex);
    const candidates = [...(assetIndex.get(lookupKey) ?? [])].sort((a, b) =>
      a.filePath.localeCompare(b.filePath)
    );

    if (candidates.length === 0) {
      missing.push({
        slug: entry.slug,
        template: entry.template,
        approvedModelId: entry.approvedModelId,
        hex,
        lookupKey,
      });
      continue;
    }

    const selected = candidates[stableIndex(entry.slug, candidates.length)];
    assignments.push({
      slug: entry.slug,
      template: entry.template,
      approvedModelId: entry.approvedModelId,
      sceneId: entry.sceneId,
      palette: entry.palette,
      poolId: selected.poolId,
      filePath: selected.filePath,
      ext: path.extname(selected.filePath).toLowerCase(),
    });
  }

  assignments.sort((a, b) => a.slug.localeCompare(b.slug));
  missing.sort((a, b) => a.slug.localeCompare(b.slug));

  return { assignments, missing };
}

export function buildPoolGenerationQueue(entries, existingCounts = new Map(), options = {}) {
  const limit = Number.parseInt(String(options.limit ?? "0"), 10) || 0;
  const startAt = Math.max(0, Number.parseInt(String(options.startAt ?? "0"), 10) || 0);
  const completedKeys = options.completedKeys instanceof Set ? options.completedKeys : new Set();

  const queue = [];

  for (const entry of entries) {
    const existing = Math.max(0, existingCounts.get(entry.poolId) ?? 0);
    const targetVariants = Math.max(1, Number.parseInt(String(entry.variants ?? "1"), 10) || 1);
    const missing = Math.max(0, targetVariants - existing);

    for (let variantNumber = existing + 1; variantNumber <= existing + missing; variantNumber += 1) {
      if (completedKeys.has(runItemKey(entry.poolId, variantNumber))) continue;
      queue.push({ entry, variantNumber });
    }
  }

  const sliced = startAt > 0 ? queue.slice(startAt) : queue;
  return limit > 0 ? sliced.slice(0, limit) : sliced;
}
