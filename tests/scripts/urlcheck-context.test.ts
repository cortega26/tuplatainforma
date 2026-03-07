import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { enrichInternalBrokenContext } from "../../scripts/urlcheck/context.mjs";

const tempRoots: string[] = [];

function createTempSite() {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-url-context-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("urlcheck context enrichment", () => {
  it("extracts anchor text from referrer HTML", async () => {
    const siteRoot = createTempSite();
    writeFileSync(
      path.join(siteRoot, "index.html"),
      [
        "<!doctype html>",
        '<a href="/posts/cae-costo-real-credito-chile/">Guia CAE 2026</a>',
      ].join("\n"),
      "utf8"
    );

    const [item] = await enrichInternalBrokenContext(
      [
        {
          url: "http://127.0.0.1:4300/posts/cae-costo-real-credito-chile/",
          parent: "http://127.0.0.1:4300/",
          status: 404,
          category: "404",
        },
      ],
      { contentRoot: siteRoot, siteBase: "" }
    );

    expect(item.context).toBe("Guia CAE 2026");
  });

  it("resolves nested referrer paths and supports relative href targets", async () => {
    const siteRoot = createTempSite();
    mkdirSync(path.join(siteRoot, "posts", "origen"), { recursive: true });
    writeFileSync(
      path.join(siteRoot, "posts", "origen", "index.html"),
      '<a href="../destino/">Revisa destino</a>',
      "utf8"
    );

    const [item] = await enrichInternalBrokenContext(
      [
        {
          url: "http://127.0.0.1:4300/posts/destino/",
          parent: "http://127.0.0.1:4300/posts/origen/",
          status: 404,
          category: "404",
        },
      ],
      { contentRoot: siteRoot, siteBase: "" }
    );

    expect(item.context).toBe("Revisa destino");
  });
});
