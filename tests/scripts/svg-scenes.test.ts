import { describe, expect, it } from "vitest";
import { parseArgs } from "../../scripts/hero-images/lib.mjs";
import {
  getSvgSceneDefinition,
  listSvgSceneIds,
  renderSvgScene,
} from "../../scripts/hero-images/svg/scene-registry.mjs";
import { buildRenderPlan } from "../../scripts/hero-images/render-svg-scenes.mjs";

const promptEntries = [
  {
    slug: "seguro-de-cesantia",
    approvedModelId: "cesantia",
    palette: { hex: "#d97706" },
  },
  {
    slug: "fraude-tarjeta-que-hacer",
    approvedModelId: "deuda-credito",
    palette: { hex: "#d97706" },
  },
];

describe("svg scene registry", () => {
  it("exposes the implemented scene ids", () => {
    expect(listSvgSceneIds()).toEqual(["ahorro", "cesantia", "deuda-credito"]);
  });

  it("renders deterministic svg for cesantia", () => {
    const first = renderSvgScene("cesantia");
    const second = renderSvgScene("cesantia");

    expect(first).toBe(second);
    expect(first).toContain('data-scene-id="cesantia"');
    expect(first).toContain('data-pose="seated-slouched"');
    expect(first).toContain('data-object="closed-laptop"');
    expect(first).toContain("#d97706");
  });

  it("renders deterministic svg for deuda-credito with improved prop composition", () => {
    const first = renderSvgScene("deuda-credito");
    const second = renderSvgScene("deuda-credito");

    expect(first).toBe(second);
    expect(first).toContain('data-scene-id="deuda-credito"');
    expect(first).toContain('data-pose="standing-hand-head"');
    expect(first).toContain('data-object="paper-stack"');
    expect(first).toContain('data-object="credit-card"');
    expect(first).toContain('data-rig="debt-figure"');
    expect(first).toContain('data-layout="debt-pile"');
    expect(first).toContain('data-layout="debt-card"');
  });

  it("allows background override", () => {
    const svg = renderSvgScene("ahorro", { background: "#059669" });

    expect(svg).toContain("#059669");
    expect(svg).toContain('data-object="jar"');
  });

  it("returns null for unknown scene definition", () => {
    expect(getSvgSceneDefinition("unknown-scene")).toBeNull();
  });
});

describe("svg render planning", () => {
  it("builds a slug-targeted plan from prompts.json entries", () => {
    const plan = buildRenderPlan(promptEntries, parseArgs(["--slug", "seguro-de-cesantia"]));

    expect(plan).toEqual([
      {
        sceneId: "cesantia",
        filenameBase: "seguro-de-cesantia",
        background: "#d97706",
        source: "slug:seguro-de-cesantia",
      },
    ]);
  });

  it("defaults to rendering all implemented scenes", () => {
    const plan = buildRenderPlan(promptEntries, parseArgs([]));

    expect(plan.map(item => item.sceneId)).toEqual(["ahorro", "cesantia", "deuda-credito"]);
  });
});
