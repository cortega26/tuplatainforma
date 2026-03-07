import { describe, expect, it } from "vitest";
import {
  buildPoolEntries,
  buildPoolGenerationQueue,
  buildPoolSelectionPlan,
  parsePoolAssetFilename,
  poolIdFromParts,
  runItemKey,
  summarizePoolEntries,
} from "../../scripts/hero-images/pool-lib.mjs";

describe("hero-image pool manifest", () => {
  it("builds canonical pool entries from approved models and palette combinations", () => {
    const entries = buildPoolEntries({
      templates: ["A"],
      colorKeys: ["Credito / Deuda / Impuestos / Riesgo"],
      variants: 2,
    });

    const debt = entries.find(entry => entry.approvedModelId === "deuda-credito");

    expect(entries).toHaveLength(11);
    expect(debt).toBeTruthy();
    expect(debt?.poolId).toBe(poolIdFromParts("A", "deuda-credito", "#d97706"));
    expect(debt?.variants).toBe(2);
    expect(debt?.prompt).toContain("one hand raised to head");
    expect(debt?.prompt).toContain("pile of documents, credit card shape");
  });

  it("covers all approved templates for one color", () => {
    const entries = buildPoolEntries({
      templates: ["A", "B", "C"],
      colorKeys: ["Credito / Deuda / Impuestos / Riesgo"],
    });

    expect(entries).toHaveLength(27);
  });

  it("reports the manifest breakdown explicitly", () => {
    const entries = buildPoolEntries({
      templates: ["A", "B", "C"],
      colorKeys: ["Credito / Deuda / Impuestos / Riesgo", "Educativo / Conceptos / Guias"],
      variants: 2,
    });

    expect(summarizePoolEntries(entries)).toEqual({
      canonicalCombinationCount: 54,
      requestedAssetCount: 108,
      templateCount: 3,
      colorCount: 2,
      approvedModelCount: 27,
      byTemplate: {
        A: 22,
        B: 16,
        C: 16,
      },
      byTemplateAndColor: {
        "A::Credito / Deuda / Impuestos / Riesgo": 11,
        "A::Educativo / Conceptos / Guias": 11,
        "B::Credito / Deuda / Impuestos / Riesgo": 8,
        "B::Educativo / Conceptos / Guias": 8,
        "C::Credito / Deuda / Impuestos / Riesgo": 8,
        "C::Educativo / Conceptos / Guias": 8,
      },
    });
  });
});

describe("hero-image pool selection", () => {
  it("selects deterministically from matching pool assets", () => {
    const assetIndex = new Map([
      [
        "A::deuda-credito::#d97706",
        [
          { poolId: "a--deuda-credito--d97706", filePath: "/tmp/b.png" },
          { poolId: "a--deuda-credito--d97706", filePath: "/tmp/a.png" },
        ],
      ],
    ]);

    const promptEntries = [
      {
        slug: "informe-deudas-cmf-vs-dicom",
        template: "A",
        approvedModelId: "deuda-credito",
        sceneId: "A:deuda-credito",
        palette: { hex: "#d97706" },
      },
    ];

    const first = buildPoolSelectionPlan(promptEntries, assetIndex);
    const second = buildPoolSelectionPlan(promptEntries, assetIndex);

    expect(first).toEqual(second);
    expect(first.missing).toEqual([]);
    expect(first.assignments[0]?.filePath).toMatch(/^\/tmp\/[ab]\.png$/);
  });

  it("reports missing pool assets clearly", () => {
    const result = buildPoolSelectionPlan(
      [
        {
          slug: "slug-missing",
          template: "B",
          approvedModelId: "uf-indicadores",
          sceneId: "B:uf-indicadores",
          palette: { hex: "#4f46e5" },
        },
      ],
      new Map()
    );

    expect(result.assignments).toEqual([]);
    expect(result.missing).toEqual([
      {
        slug: "slug-missing",
        template: "B",
        approvedModelId: "uf-indicadores",
        hex: "#4f46e5",
        lookupKey: "B::uf-indicadores::#4f46e5",
      },
    ]);
  });
});

describe("hero-image pool generation queue", () => {
  it("skips completed variants and applies stable slicing controls", () => {
    const entries = [
      { poolId: "first", variants: 2 },
      { poolId: "second", variants: 1 },
      { poolId: "third", variants: 3 },
    ];
    const existingCounts = new Map([
      ["first", 1],
      ["second", 1],
      ["third", 0],
    ]);

    const full = buildPoolGenerationQueue(entries, existingCounts);
    expect(full.map(item => `${item.entry.poolId}:${item.variantNumber}`)).toEqual([
      "first:2",
      "third:1",
      "third:2",
      "third:3",
    ]);

    const sliced = buildPoolGenerationQueue(entries, existingCounts, {
      completedKeys: new Set(["first::v2"]),
      startAt: 1,
      limit: 2,
    });
    expect(sliced.map(item => `${item.entry.poolId}:${item.variantNumber}`)).toEqual([
      "third:2",
      "third:3",
    ]);
  });
});

describe("hero-image pool asset naming", () => {
  it("parses canonical imported asset names", () => {
    expect(parsePoolAssetFilename("a--deuda-credito--d97706--v2.png")).toEqual({
      poolId: "a--deuda-credito--d97706",
      variantNumber: 2,
      ext: ".png",
    });

    expect(parsePoolAssetFilename("b--uf-indicadores--4f46e5.avif")).toEqual({
      poolId: "b--uf-indicadores--4f46e5",
      variantNumber: 1,
      ext: ".avif",
    });
  });

  it("builds stable run-item keys", () => {
    expect(runItemKey("a--deuda-credito--d97706", 3)).toBe("a--deuda-credito--d97706::v3");
  });
});
