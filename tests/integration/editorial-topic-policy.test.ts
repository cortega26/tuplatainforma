import { describe, expect, it } from "vitest";
import {
  getTransitionalOwnershipEntry,
  isDocumentedTransitionalPlacement,
} from "../../src/config/editorial-topic-policy.mjs";
import { getHubArticleAssignments } from "../../src/config/editorial-hub-model.mjs";

describe("editorial topic ownership policy", () => {
  it("documents the presupuesto article as a transitional placement", () => {
    const entry = getTransitionalOwnershipEntry(
      "como-hacer-presupuesto-mensual-chile"
    );

    expect(entry).not.toBeNull();
    expect(entry?.canonicalOwnerCluster).toBe("presupuesto-control-financiero");
    expect(entry?.targetHubPath).toBe("/guias/presupuesto-control-financiero/");
    expect(
      isDocumentedTransitionalPlacement({
        slug: "como-hacer-presupuesto-mensual-chile",
        cluster: "empleo-ingresos",
        category: "general",
      })
    ).toBe(true);
  });

  it("keeps the IPC article out of the transitional registry after UF hardening", () => {
    const entry = getTransitionalOwnershipEntry(
      "que-es-el-ipc-chile-como-se-calcula"
    );

    expect(entry).toBeNull();
    expect(
      isDocumentedTransitionalPlacement({
        slug: "que-es-el-ipc-chile-como-se-calcula",
        cluster: "empleo-ingresos",
        category: "general",
      })
    ).toBe(false);
  });

  it("keeps APV related in the pensions hub instead of core", () => {
    const assignments = getHubArticleAssignments("pensiones-afp");

    expect(
      assignments.core.map((item: (typeof assignments.core)[number]) => item.slug)
    ).not.toContain("que-es-el-apv");
    expect(
      assignments.related.map(
        (item: (typeof assignments.related)[number]) => item.slug
      )
    ).toContain("que-es-el-apv");
  });
});
