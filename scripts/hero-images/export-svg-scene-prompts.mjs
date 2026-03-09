#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildPromptA,
  buildPromptB,
  buildPromptC,
  findApprovedPromptModel,
} from "./config.mjs";
import { parseArgs, toRepoRelative, writeJson } from "./lib.mjs";
import { getSvgSceneDefinition, listSvgSceneIds } from "./svg/scene-registry.mjs";

export const SVG_SCENE_PROMPTS_PATH = path.join(
  process.cwd(),
  "scripts",
  "hero-images",
  "svg-scene-prompts.json"
);

const TEMPLATES = ["A", "B", "C"];

function findScenePromptModel(approvedModelId) {
  for (const template of TEMPLATES) {
    const model = findApprovedPromptModel(template, approvedModelId);
    if (model) {
      return {
        template,
        model,
      };
    }
  }

  throw new Error(
    `[export-svg-scene-prompts] No approved prompt model found for scene '${approvedModelId}'.`
  );
}

function buildPrompt(template, model, background) {
  if (template === "A") {
    return buildPromptA(background, model.postura, model.objetos);
  }

  if (template === "B") {
    return buildPromptB(background, model.icono);
  }

  return buildPromptC(background, model.icono);
}

export function buildScenePromptEntry(sceneId) {
  const scene = getSvgSceneDefinition(sceneId);
  if (!scene) {
    throw new Error(`[export-svg-scene-prompts] Unknown scene '${sceneId}'.`);
  }

  const { template, model } = findScenePromptModel(scene.approvedModelId);
  const prompt = buildPrompt(template, model, scene.background);

  return {
    sceneId: scene.id,
    approvedModelId: scene.approvedModelId,
    label: scene.label,
    template,
    background: scene.background,
    reactInputs: {
      posture: model.postura ?? "",
      objects: model.objetos ?? "",
      icon: model.icono ?? "",
    },
    prompt,
  };
}

export function buildScenePromptEntries(sceneIds = listSvgSceneIds()) {
  return [...sceneIds]
    .sort((a, b) => a.localeCompare(b))
    .map(sceneId => buildScenePromptEntry(sceneId));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const requestedScene = args.get("--scene", "").trim();
  const outArg = args.get("--out", "").trim();
  const outPath = outArg ? path.resolve(process.cwd(), outArg) : SVG_SCENE_PROMPTS_PATH;
  const sceneIds = requestedScene ? [requestedScene] : listSvgSceneIds();

  const payload = {
    schemaVersion: 1,
    generatedFrom: "scripts/hero-images/export-svg-scene-prompts.mjs",
    sceneCount: sceneIds.length,
    entries: buildScenePromptEntries(sceneIds),
  };

  await writeJson(outPath, payload);

  console.log(
    `[export-svg-scene-prompts] Wrote ${payload.entries.length} prompt entr${
      payload.entries.length === 1 ? "y" : "ies"
    } to ${toRepoRelative(outPath)}`
  );
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
