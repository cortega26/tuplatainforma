#!/usr/bin/env node
import path from "node:path";
import {
  MANIFEST_PATH,
  PROMPTS_PATH,
  parseArgs,
  readJson,
  sha256Hex,
  toRepoRelative,
} from "./hero-images/lib.mjs";

const TEXT_EVIDENCE_PATTERNS = [
  /text contains '/i,
  /article text/i,
  /article body/i,
  /body\/title context/i,
];

const METADATA_ONLY_PATTERNS = [/metadata fallback/i];
const PURE_FALLBACK_PATTERNS = [/used fallback scene/i];
const VALID_INTENTS = new Set(["explicar", "alertar", "comparar", "guiar", "calcular"]);
const VALID_TONES = new Set(["neutral", "serio", "alerta", "educativo", "progreso"]);
const VALID_TEMPLATES = new Set(["A", "B", "C"]);

function getPathOverride(envKey, fallback) {
  const value = process.env[envKey];
  if (!value) return fallback;
  return path.isAbsolute(value) ? value : path.resolve(process.cwd(), value);
}

function pushIssue(collection, slug, message) {
  collection.push({ slug, message });
}

function hasTextEvidence(visualEvidence) {
  return visualEvidence.some(entry =>
    TEXT_EVIDENCE_PATTERNS.some(pattern => pattern.test(entry))
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const strictFallback = args.has("--strict-fallback") || process.env.HERO_PROMPTS_STRICT_FALLBACK === "1";
  const manifestPath = getPathOverride("HERO_MANIFEST_PATH", MANIFEST_PATH);
  const promptsPath = getPathOverride("HERO_PROMPTS_PATH", PROMPTS_PATH);

  const manifest = await readJson(manifestPath);
  const prompts = await readJson(promptsPath);

  const articles = Array.isArray(manifest.articles) ? manifest.articles : [];
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];
  const entryBySlug = new Map(entries.map(entry => [entry.slug, entry]));

  const errors = [];
  const warnings = [];

  if (entries.length !== articles.length) {
    pushIssue(
      errors,
      "*",
      `Prompt count mismatch. manifest=${articles.length} prompts=${entries.length}`
    );
  }

  for (const article of articles) {
    const entry = entryBySlug.get(article.slug);
    if (!entry) {
      pushIssue(errors, article.slug, "Missing prompt entry for publishable article.");
      continue;
    }

    if (entry.sourcePath !== article.sourcePath) {
      pushIssue(
        errors,
        article.slug,
        `sourcePath mismatch. manifest=${article.sourcePath} prompts=${entry.sourcePath}`
      );
    }

    if (!VALID_TEMPLATES.has(entry.template)) {
      pushIssue(errors, article.slug, `Invalid template '${entry.template}'.`);
    }

    if (typeof entry.sceneId !== "string" || entry.sceneId.trim() === "") {
      pushIssue(errors, article.slug, "Missing sceneId.");
    }

    if (typeof entry.readerSituation !== "string" || entry.readerSituation.trim() === "") {
      pushIssue(errors, article.slug, "Missing readerSituation.");
    }

    if (!VALID_INTENTS.has(entry.primaryIntent)) {
      pushIssue(errors, article.slug, `Invalid primaryIntent '${entry.primaryIntent}'.`);
    }

    if (!VALID_TONES.has(entry.toneClass)) {
      pushIssue(errors, article.slug, `Invalid toneClass '${entry.toneClass}'.`);
    }

    if (!Array.isArray(entry.visualEvidence) || entry.visualEvidence.length === 0) {
      pushIssue(errors, article.slug, "Missing visualEvidence.");
    } else {
      const normalizedEvidence = entry.visualEvidence
        .map(item => String(item ?? "").trim())
        .filter(Boolean);

      if (normalizedEvidence.length === 0) {
        pushIssue(errors, article.slug, "visualEvidence is empty after normalization.");
      }

      if (!hasTextEvidence(normalizedEvidence)) {
        pushIssue(
          errors,
          article.slug,
          "visualEvidence must include at least one article-text-backed reason."
        );
      }

      if (normalizedEvidence.some(item => METADATA_ONLY_PATTERNS.some(pattern => pattern.test(item)))) {
        pushIssue(errors, article.slug, "Metadata-only fallback detected in visualEvidence.");
      }

      if (
        normalizedEvidence.some(item => PURE_FALLBACK_PATTERNS.some(pattern => pattern.test(item)))
      ) {
        pushIssue(
          strictFallback ? errors : warnings,
          article.slug,
          `Fallback scene detected after article read${strictFallback ? " (strict mode)." : "."}`
        );
      }
    }

    if (typeof entry.prompt !== "string" || entry.prompt.trim() === "") {
      pushIssue(errors, article.slug, "Missing prompt.");
    } else if (entry.promptHash !== sha256Hex(entry.prompt)) {
      pushIssue(errors, article.slug, "promptHash does not match prompt content.");
    }

    if (typeof entry.selectors?.ruleId !== "string" || entry.selectors.ruleId.trim() === "") {
      pushIssue(errors, article.slug, "Missing selectors.ruleId.");
    }

    if (!Array.isArray(entry.selectors?.matchedKeywords)) {
      pushIssue(errors, article.slug, "Missing selectors.matchedKeywords.");
    }
  }

  console.log(`[check-hero-prompts] Manifest: ${toRepoRelative(manifestPath)}`);
  console.log(`[check-hero-prompts] Prompts: ${toRepoRelative(promptsPath)}`);
  console.log(`[check-hero-prompts] Checked entries: ${articles.length}`);
  console.log(`[check-hero-prompts] Fallback mode: ${strictFallback ? "strict" : "warn"}`);

  if (warnings.length > 0) {
    console.warn(`[check-hero-prompts] Warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.warn(`- ${warning.slug}: ${warning.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`[check-hero-prompts] FAIL: ${errors.length} issue(s)`);
    for (const error of errors) {
      console.error(`- ${error.slug}: ${error.message}`);
    }
    process.exit(1);
  }

  console.log("[check-hero-prompts] OK");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
