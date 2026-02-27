import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/check-domain-boundaries.mjs");
const tempRoots: string[] = [];

function createTempProject(): string {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-boundary-"));
  tempRoots.push(root);
  mkdirSync(path.join(root, "src", "domain"), { recursive: true });
  return root;
}

function runBoundaryCheck(rootDir: string, args: string[] = []) {
  return spawnSync("node", [SCRIPT_PATH, ...args], {
    env: {
      ...process.env,
      DOMAIN_BOUNDARY_ROOT: rootDir,
    },
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("check-domain-boundaries script", () => {
  it("scans all nested domain source files recursively", () => {
    const root = createTempProject();
    mkdirSync(path.join(root, "src", "domain", "nested", "deeper"), {
      recursive: true,
    });
    writeFileSync(
      path.join(root, "src", "domain", "TaxEngine.ts"),
      "export const x = 1;\n"
    );
    writeFileSync(
      path.join(root, "src", "domain", "nested", "Model.tsx"),
      "export const y = 2;\n"
    );
    writeFileSync(
      path.join(root, "src", "domain", "nested", "helper.js"),
      "export const z = 3;\n"
    );
    writeFileSync(
      path.join(root, "src", "domain", "nested", "deeper", "legacy.jsx"),
      "export const w = 4;\n"
    );
    writeFileSync(
      path.join(root, "src", "domain", "README.md"),
      "# ignored by extension filter\n"
    );

    const result = runBoundaryCheck(root, ["--min-files", "0"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Found 4 matching domain source files.");
    expect(result.stdout).toContain("Scanned 4 domain files");
    expect(result.stdout).toContain("Domain boundary check passed.");
  });

  it("fails with forbidden imports", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "src", "domain", "Illegal.ts"),
      'import { y } from "astro:content";\nexport const x = y;\n'
    );
    writeFileSync(
      path.join(root, "src", "domain", "Safe.ts"),
      "export const ok = true;\n"
    );

    const result = runBoundaryCheck(root, ["--min-files", "0"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Scanned 2 domain files");
    expect(result.stderr).toContain("Domain boundary violations found:");
    expect(result.stderr).toContain('forbidden import "astro:content"');
  });

  it("fails when scan coverage is suspiciously low", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "src", "domain", "OnlyOne.ts"),
      "export const one = 1;\n"
    );

    const result = runBoundaryCheck(root, ["--min-files", "3"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Boundary scan coverage suspiciously low (1 files found)."
    );
    expect(result.stderr).toContain("Coverage threshold: 3 files.");
  });

  it("prints audit debug output", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "src", "domain", "TaxEngine.ts"),
      "export const x = 1;\n"
    );
    writeFileSync(
      path.join(root, "src", "domain", "nested.ts"),
      "export const y = 2;\n"
    );

    const result = runBoundaryCheck(root, ["--debug", "--min-files", "0"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Debug cwd:");
    expect(result.stdout).toContain("Debug scan pattern:");
    expect(result.stdout).toContain("Debug file list (first 2):");
    expect(result.stdout).toContain("Found 2 matching domain source files.");
  });
});
