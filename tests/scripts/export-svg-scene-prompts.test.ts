import { describe, expect, it } from "vitest";
import {
  buildScenePromptEntries,
  buildScenePromptEntry,
} from "../../scripts/hero-images/export-svg-scene-prompts.mjs";

describe("svg scene replacement prompts", () => {
  it("builds prompt entries for every implemented svg scene", () => {
    expect(buildScenePromptEntries().map(entry => entry.sceneId)).toEqual([
      "ahorro",
      "cesantia",
      "deuda-credito",
    ]);
  });

  it("derives ahorro prompt data from the approved React prompt model", () => {
    const entry = buildScenePromptEntry("ahorro");

    expect(entry).toMatchObject({
      sceneId: "ahorro",
      approvedModelId: "ahorro",
      template: "A",
      background: "#0d9488",
      reactInputs: {
        posture: "standing, reaching forward",
        objects: "glass jar with coins",
        icon: "",
      },
    });
    expect(entry.prompt).toContain("Background: solid color #0d9488.");
    expect(entry.prompt).toContain(
      "Scene: one geometric human figure standing, reaching forward"
    );
  });
});
