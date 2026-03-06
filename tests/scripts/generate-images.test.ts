import { describe, expect, it } from "vitest";
import { buildGenerationPlan } from "../../scripts/hero-images/generate-images.mjs";
import { parseArgs } from "../../scripts/hero-images/lib.mjs";

const baseEntries = [
  {
    slug: "que-es-la-uf",
    prompt: "prompt a",
    targetImagePath: "/images/hero/que-es-la-uf.avif",
    modelPlan: {
      model: "dall-e-3",
      size: "1792x1024",
      quality: "standard",
    },
  },
  {
    slug: "fraude-tarjeta-que-hacer",
    prompt: "prompt b",
    targetImagePath: "/images/hero/fraude-tarjeta-que-hacer.avif",
    modelPlan: {
      model: "dall-e-3",
      size: "1792x1024",
      quality: "standard",
    },
  },
];

describe("generate-images planning", () => {
  it("supports explicit model override", () => {
    const args = parseArgs(["--model", "gpt-image-1"]);
    const plan = buildGenerationPlan(baseEntries, args);

    expect(plan).toHaveLength(2);
    expect(plan.map(item => item.model)).toEqual(["gpt-image-1", "gpt-image-1"]);
    expect(plan.map(item => item.options.size)).toEqual(["1536x1024", "1536x1024"]);
    expect(plan.map(item => item.options.quality)).toEqual(["auto", "auto"]);
  });

  it("supports compare mode for one slug", () => {
    const args = parseArgs([
      "--slug",
      "que-es-la-uf",
      "--compare-models",
      "dall-e-3,gpt-image-1",
    ]);
    const plan = buildGenerationPlan(baseEntries, args);

    expect(plan).toHaveLength(2);
    expect(plan.every(item => item.entry.slug === "que-es-la-uf")).toBe(true);
    expect(plan.map(item => item.model)).toEqual(["dall-e-3", "gpt-image-1"]);
    expect(plan.map(item => item.options.size)).toEqual(["1792x1024", "1536x1024"]);
    expect(plan.map(item => item.options.quality)).toEqual(["standard", "auto"]);
  });

  it("keeps plan deterministic under limit", () => {
    const args = parseArgs(["--limit", "1"]);
    const first = buildGenerationPlan(baseEntries, args);
    const second = buildGenerationPlan(baseEntries, args);

    expect(first).toEqual(second);
    expect(first).toHaveLength(1);
    expect(first[0]?.entry.slug).toBe("que-es-la-uf");
  });

  it("returns no requests when slug filter does not exist", () => {
    const args = parseArgs(["--slug", "missing-slug"]);
    const plan = buildGenerationPlan(baseEntries, args);

    expect(plan).toEqual([]);
  });

  it("preserves explicit GPT quality override", () => {
    const args = parseArgs(["--model", "gpt-image-1", "--quality", "high"]);
    const plan = buildGenerationPlan(baseEntries, args);

    expect(plan.map(item => item.options.quality)).toEqual(["high", "high"]);
  });

  it("preserves explicit GPT size override", () => {
    const args = parseArgs(["--model", "gpt-image-1", "--size", "1024x1024"]);
    const plan = buildGenerationPlan(baseEntries, args);

    expect(plan.map(item => item.options.size)).toEqual(["1024x1024", "1024x1024"]);
  });
});
