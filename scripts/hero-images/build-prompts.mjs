#!/usr/bin/env node
import {
  MANIFEST_PATH,
  PROMPTS_PATH,
  heroPublicPath,
  readJson,
  sha256Hex,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { buildPromptFromPlan, selectPromptPlan } from "./prompt-plan.mjs";

async function main() {
  const manifest = await readJson(MANIFEST_PATH);
  const articles = Array.isArray(manifest.articles) ? manifest.articles : [];

  const entries = articles.map(article => {
    const plan = selectPromptPlan(article);
    const prompt = buildPromptFromPlan(plan);

    return {
      slug: article.slug,
      sourcePath: article.sourcePath,
      targetImagePath: heroPublicPath(article.slug, ".avif"),
      template: plan.template,
      sceneId: plan.sceneId,
      readerSituation: plan.semantic.readerSituation,
      primaryIntent: plan.semantic.primaryIntent,
      toneClass: plan.semantic.toneClass,
      visualEvidence: plan.semantic.visualEvidence,
      palette: {
        category: plan.colorKey,
        hex: plan.hex,
      },
      modelPlan: { ...plan.modelPlan },
      prompt,
      promptHash: sha256Hex(prompt),
      selectors: {
        ruleId: plan.ruleId,
        category: article.category,
        cluster: article.cluster,
        matchedKeywords: plan.matchedKeywords,
      },
    };
  });

  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  const prompts = {
    schemaVersion: 1,
    sourceManifest: toRepoRelative(MANIFEST_PATH),
    count: entries.length,
    entries,
  };

  await writeJson(PROMPTS_PATH, prompts);

  console.log(`[build-prompts] Entries: ${entries.length}`);
  console.log(`[build-prompts] Output: ${toRepoRelative(PROMPTS_PATH)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
