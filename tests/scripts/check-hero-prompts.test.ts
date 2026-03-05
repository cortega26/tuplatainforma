import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/check-hero-prompts.mjs");
const tempRoots: string[] = [];

function createTempDir(): string {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-hero-prompts-"));
  tempRoots.push(root);
  return root;
}

function writeJson(filePath: string, value: unknown) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256(input: string) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function runCheck(rootDir: string, extraArgs: string[] = []) {
  return spawnSync("node", [SCRIPT_PATH, ...extraArgs], {
    env: {
      ...process.env,
      HERO_MANIFEST_PATH: path.join(rootDir, "manifest.json"),
      HERO_PROMPTS_PATH: path.join(rootDir, "prompts.json"),
    },
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("check-hero-prompts script", () => {
  it("passes when prompts include text-backed semantic evidence", () => {
    const root = createTempDir();
    const prompt =
      "Create a flat vector background for a personal finance graphic. Background: solid color #4f46e5.";

    writeJson(path.join(root, "manifest.json"), {
      articles: [
        {
          slug: "que-es-la-uf",
          sourcePath: "src/data/blog/que-es-la-uf.md",
        },
      ],
    });
    writeJson(path.join(root, "prompts.json"), {
      entries: [
        {
          slug: "que-es-la-uf",
          sourcePath: "src/data/blog/que-es-la-uf.md",
          template: "C",
          sceneId: "C:activity pulse line",
          readerSituation: "Persona entendiendo un indicador economico que afecta pagos cotidianos.",
          primaryIntent: "explicar",
          toneClass: "educativo",
          visualEvidence: [
            "text contains 'uf' in article body/title context",
            "primary intent classified as 'explicar' from article text",
          ],
          prompt,
          promptHash: sha256(prompt),
          selectors: {
            ruleId: "uf",
            matchedKeywords: ["uf"],
          },
        },
      ],
    });

    const result = runCheck(root);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("[check-hero-prompts] OK");
  });

  it("fails when evidence is metadata-only", () => {
    const root = createTempDir();
    const prompt =
      "Create a flat vector editorial illustration for a personal finance website.";

    writeJson(path.join(root, "manifest.json"), {
      articles: [
        {
          slug: "deuda-generica",
          sourcePath: "src/data/blog/deuda-generica.md",
        },
      ],
    });
    writeJson(path.join(root, "prompts.json"), {
      entries: [
        {
          slug: "deuda-generica",
          sourcePath: "src/data/blog/deuda-generica.md",
          template: "A",
          sceneId: "A:Deuda / Credito",
          readerSituation: "Persona enfrentando documentos, cuotas o decisiones de deuda.",
          primaryIntent: "explicar",
          toneClass: "serio",
          visualEvidence: ["metadata fallback matched 'deuda'"],
          prompt,
          promptHash: sha256(prompt),
          selectors: {
            ruleId: "deuda",
            matchedKeywords: ["deuda"],
          },
        },
      ],
    });

    const result = runCheck(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Metadata-only fallback detected");
    expect(result.stderr).toContain("visualEvidence must include at least one article-text-backed reason");
  });

  it("warns on fallback scene by default and fails in strict fallback mode", () => {
    const root = createTempDir();
    const prompt = "Create a flat vector icon illustration for a personal finance website.";

    writeJson(path.join(root, "manifest.json"), {
      articles: [
        {
          slug: "general",
          sourcePath: "src/data/blog/general.md",
        },
      ],
    });
    writeJson(path.join(root, "prompts.json"), {
      entries: [
        {
          slug: "general",
          sourcePath: "src/data/blog/general.md",
          template: "B",
          sceneId: "B:simple smartphone outline",
          readerSituation: "Persona revisando informacion financiera practica para tomar una decision.",
          primaryIntent: "explicar",
          toneClass: "neutral",
          visualEvidence: [
            "text contains 'decision' in article body/title context",
            "used fallback scene after reading article without a dominant visual cue",
          ],
          prompt,
          promptHash: sha256(prompt),
          selectors: {
            ruleId: "fallback",
            matchedKeywords: [],
          },
        },
      ],
    });

    const warnResult = runCheck(root);
    expect(warnResult.status).toBe(0);
    expect(warnResult.stderr).toContain("Warnings: 1");

    const strictResult = runCheck(root, ["--strict-fallback"]);
    expect(strictResult.status).toBe(1);
    expect(strictResult.stderr).toContain("Fallback scene detected after article read (strict mode)");
  });
});
