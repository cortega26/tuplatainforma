import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/audit-topic-overlap.mjs");

describe("audit-topic-overlap script", () => {
  it("prints transitional placement and hub ownership summaries", () => {
    const result = spawnSync("node", [SCRIPT_PATH], {
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "[audit-topic-overlap] Transitional placement summary"
    );
    expect(result.stdout).toContain("como-hacer-presupuesto-mensual-chile");
    expect(result.stdout).toContain("que-es-el-ipc-chile-como-se-calcula");
    expect(result.stdout).toContain("[audit-topic-overlap] Hub ownership summary");
    expect(result.stdout).toContain("pensiones-afp | core=");
    expect(result.stdout).toContain(
      "related=cuanto-descuenta-la-afp-de-tu-sueldo,que-es-el-apv"
    );
  });
});
