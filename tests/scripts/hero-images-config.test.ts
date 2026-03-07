import { describe, expect, it } from "vitest";
import {
  buildPromptA,
  buildPromptB,
  buildPromptC,
} from "../../scripts/hero-images/config.mjs";

describe("hero-images prompt builders", () => {
  it("buildPromptA is deterministic and preserves core constraints", () => {
    const first = buildPromptA(
      "#0d9488",
      "seated at a table, leaning slightly forward",
      "calculator, stacked papers"
    );
    const second = buildPromptA(
      "#0d9488",
      "seated at a table, leaning slightly forward",
      "calculator, stacked papers"
    );

    expect(first).toBe(second);
    expect(first).toContain("Background: solid color #0d9488.");
    expect(first).toContain(
      "Scene: one geometric human figure seated at a table, leaning slightly forward, shown from behind or as a faceless silhouette"
    );
    expect(first).toContain(
      "The figure is near calculator, stacked papers. All objects are flat geometric shapes, same illustration style."
    );
    expect(first).toContain("Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.");
    expect(first).toContain("Color palette: 3 colors maximum, all flat fills.");
    expect(first).toContain("Composition: all elements within the central 80% of the canvas.");
    expect(first).toContain("Canvas: 1200x630 pixels, landscape.");
    expect(first).toContain("Do not add extra objects beyond the named scene props.");
  });

  it("buildPromptB keeps icon-focused constraints", () => {
    const prompt = buildPromptB("#4f46e5", "activity pulse line");

    expect(prompt).toContain("Scene: one simple geometric activity pulse line icon, centered");
    expect(prompt).toContain("Background: solid color #4f46e5.");
    expect(prompt).toContain("Color palette: 2 colors maximum, all flat fills.");
    expect(prompt).toContain("Canvas: 1200x630 pixels, landscape.");
  });

  it("buildPromptC reserves left area for post-production text", () => {
    const prompt = buildPromptC("#059669", "bar chart icon");

    expect(prompt).toContain("Background: solid color #059669");
    expect(prompt).toContain("keep the left two-thirds of the canvas completely empty for text overlay");
    expect(prompt).toContain("Color palette: 2 colors maximum, all flat fills.");
    expect(prompt).toContain("Canvas: 1200x630 pixels, landscape.");
  });
});
