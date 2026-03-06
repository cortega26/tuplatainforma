import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseHistoryPage, runLegalCitationAudit } from "../../scripts/legal-citations/core.mjs";

const tempRoots: string[] = [];

function createTempProject() {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-legal-citations-"));
  tempRoots.push(root);
  mkdirSync(path.join(root, "src", "data", "laws"), { recursive: true });
  mkdirSync(path.join(root, "src", "data", "blog"), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("legal citation audit", () => {
  it("flags non-canonical law frontmatter ids and alias ids in blog content", async () => {
    const root = createTempProject();

    writeFileSync(
      path.join(root, "src", "data", "laws", "ley-21133-honorarios-retencion.md"),
      `---
numero: "21.133"
bcnUrl: https://www.bcn.cl/leychile/navegar?idNorma=1126386
---
Texto completo: https://www.bcn.cl/leychile/navegar?idNorma=1126386
`,
      "utf8"
    );
    writeFileSync(
      path.join(root, "src", "data", "blog", "boleta.md"),
      `---
title: "Boleta"
---
- Ley N° 21.133: https://www.bcn.cl/leychile/navegar?idNorma=1129870
`,
      "utf8"
    );

    const result = await runLegalCitationAudit({ rootDir: root });

    expect(result.issues.map(issue => issue.type)).toEqual(
      expect.arrayContaining([
        "law_noncanonical_idnorma",
        "alias_idnorma_detected",
      ])
    );
    expect(result.issues.some(issue => issue.message.includes("1128420"))).toBe(true);
  });

  it("passes for canonical ids without live verification", async () => {
    const root = createTempProject();

    writeFileSync(
      path.join(root, "src", "data", "laws", "ley-18010-credito-dinero.md"),
      `---
numero: "18.010"
bcnUrl: https://www.bcn.cl/leychile/navegar?idNorma=29438
---
Texto completo: https://www.bcn.cl/leychile/navegar?idNorma=29438
`,
      "utf8"
    );
    writeFileSync(
      path.join(root, "src", "data", "blog", "cae.md"),
      `---
title: "CAE"
---
- Ley N° 18.010: https://www.bcn.cl/leychile/navegar?idNorma=29438
`,
      "utf8"
    );

    const result = await runLegalCitationAudit({ rootDir: root });

    expect(result.issues).toEqual([]);
  });

  it("parses BCN history pages for law number and idNorma", () => {
    const parsed = parseHistoryPage(`
      <html>
        <body>
          <h1>Ley Nº 21.133</h1>
          <a href="http://www.leychile.cl/N?i=1128420">Texto</a>
        </body>
      </html>
    `);

    expect(parsed).toEqual({
      numero: "21.133",
      idNorma: "1128420",
    });
  });
});
