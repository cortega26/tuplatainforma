#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PROMPTS_PATH, ensureDirectory, parseArgs, readJson, toRepoRelative } from "./lib.mjs";
import { renderSvgScene, listSvgSceneIds, getSvgSceneDefinition } from "./svg/scene-registry.mjs";

export const PREVIEWS_DIR = path.join(process.cwd(), "scripts", "hero-images", "previews");

export function buildRenderPlan(entries, args) {
  const slug = args.get("--slug", "").trim();
  const scene = args.get("--scene", "").trim();

  if (slug) {
    const entry = entries.find(item => item.slug === slug);
    if (!entry) {
      throw new Error(`[render-svg-scenes] No prompt entry found for slug '${slug}'.`);
    }
    if (!getSvgSceneDefinition(entry.approvedModelId)) {
      throw new Error(
        `[render-svg-scenes] approvedModelId '${entry.approvedModelId}' is not implemented in the SVG renderer yet.`
      );
    }
    return [
      {
        sceneId: entry.approvedModelId,
        filenameBase: slug,
        background: entry.palette?.hex,
        source: `slug:${slug}`,
      },
    ];
  }

  if (scene) {
    if (!getSvgSceneDefinition(scene)) {
      throw new Error(`[render-svg-scenes] Unknown scene '${scene}'.`);
    }
    return [
      {
        sceneId: scene,
        filenameBase: scene,
        background: "",
        source: `scene:${scene}`,
      },
    ];
  }

  return listSvgSceneIds().map(sceneId => ({
    sceneId,
    filenameBase: sceneId,
    background: "",
    source: `scene:${sceneId}`,
  }));
}

async function writePng(svg, outputPath) {
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompts = await readJson(PROMPTS_PATH);
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];
  const plan = buildRenderPlan(entries, args);

  await ensureDirectory(PREVIEWS_DIR);

  for (const item of plan) {
    const svg = renderSvgScene(item.sceneId, { background: item.background });
    const svgPath = path.join(PREVIEWS_DIR, `${item.filenameBase}.svg`);
    const pngPath = path.join(PREVIEWS_DIR, `${item.filenameBase}.png`);

    await fs.writeFile(svgPath, `${svg}\n`, "utf8");
    await writePng(svg, pngPath);

    console.log(
      `[render-svg-scenes] ${item.source} -> ${toRepoRelative(svgPath)} + ${toRepoRelative(pngPath)}`
    );
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
