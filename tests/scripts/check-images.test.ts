import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/check-images.mjs");
const tempRoots: string[] = [];

function createTempProject() {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-check-images-"));
  tempRoots.push(root);
  mkdirSync(path.join(root, "src", "data", "blog"), { recursive: true });
  mkdirSync(path.join(root, "public", "images", "posts", "demo"), {
    recursive: true,
  });
  return root;
}

function writeArticle(root: string, frontmatter: string, body: string) {
  writeFileSync(
    path.join(root, "src", "data", "blog", "demo.md"),
    `---\n${frontmatter}\n---\n\n${body}\n`,
    "utf8"
  );
}

function runImageCheck(rootDir: string) {
  return spawnSync("node", [SCRIPT_PATH], {
    env: {
      ...process.env,
      IMAGE_CHECK_ROOT: rootDir,
    },
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("check-images script", () => {
  it("passes when inline article images use AVIF", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "public", "images", "posts", "demo", "chart.avif"),
      "fake-avif",
      "utf8"
    );
    writeArticle(
      root,
      `title: "Demo"
description: "Demo article description"
slug: demo
pubDate: "2026-03-07T00:00:00Z"
author: "Equipo Monedario"
category: general
cluster: ahorro-e-inversion
lang: es-CL`,
      `![Grafico](/images/posts/demo/chart.avif)`
    );

    const result = runImageCheck(root);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("inline=1");
  });

  it("fails when an inline article image is non-AVIF without justification", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "public", "images", "posts", "demo", "chart.webp"),
      "fake-webp",
      "utf8"
    );
    writeArticle(
      root,
      `title: "Demo"
description: "Demo article description"
slug: demo
pubDate: "2026-03-07T00:00:00Z"
author: "Equipo Monedario"
category: general
cluster: ahorro-e-inversion
lang: es-CL`,
      `![Grafico](/images/posts/demo/chart.webp)`
    );

    const result = runImageCheck(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'inline image "/images/posts/demo/chart.webp" must use .avif'
    );
  });

  it("allows a justified non-AVIF inline image when frontmatter exceptions match exactly", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "public", "images", "posts", "demo", "chart.webp"),
      "fake-webp",
      "utf8"
    );
    writeArticle(
      root,
      `title: "Demo"
description: "Demo article description"
slug: demo
pubDate: "2026-03-07T00:00:00Z"
author: "Equipo Monedario"
category: general
cluster: ahorro-e-inversion
lang: es-CL
inlineImageExceptions:
  - src: /images/posts/demo/chart.webp
    reason: "Legacy upstream chart only available in this format."`,
      `![Grafico](/images/posts/demo/chart.webp)`
    );

    const result = runImageCheck(root);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("inline=1");
  });

  it("fails when an inline image exception is declared but unused", () => {
    const root = createTempProject();
    writeFileSync(
      path.join(root, "public", "images", "posts", "demo", "chart.avif"),
      "fake-avif",
      "utf8"
    );
    writeArticle(
      root,
      `title: "Demo"
description: "Demo article description"
slug: demo
pubDate: "2026-03-07T00:00:00Z"
author: "Equipo Monedario"
category: general
cluster: ahorro-e-inversion
lang: es-CL
inlineImageExceptions:
  - src: /images/posts/demo/unused.webp
    reason: "Legacy upstream chart only available in this format."`,
      `![Grafico](/images/posts/demo/chart.avif)`
    );

    const result = runImageCheck(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'declares inlineImageExceptions entry "/images/posts/demo/unused.webp" that is not used'
    );
  });
});
