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
    expect(first).toContain("Canvas: 1200x630 pixels, landscape.");
    expect(first).toContain("Do not include text, letters, numbers");
  });

  it("buildPromptB keeps icon-focused constraints", () => {
    const prompt = buildPromptB("#4f46e5", "activity pulse line");

    expect(prompt).toContain("single centered element only");
    expect(prompt).toContain("Background: solid color #4f46e5.");
    expect(prompt).toContain("White stroke lines only, 2px weight");
    expect(prompt).toContain("Canvas: 1200x630 pixels, landscape.");
  });

  it("buildPromptC reserves left area for post-production text", () => {
    const prompt = buildPromptC("#059669", "bar chart icon");

    expect(prompt).toContain("Background: solid color #059669");
    expect(prompt).toContain("left two-thirds of the canvas must be completely empty");
    expect(prompt).toContain("No text, no letters, no numbers");
    expect(prompt).toContain("Canvas: 1200x630 pixels, landscape.");
  });
});
