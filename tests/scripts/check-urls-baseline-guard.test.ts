import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/check-urls.mjs");

function runCheckUrls(args: string[], env: Record<string, string> = {}) {
  return spawnSync("node", [SCRIPT_PATH, ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      ...env,
    },
  });
}

describe("check-urls baseline update guard", () => {
  it("blocks baseline update in CI", () => {
    const result = runCheckUrls(["--update-baseline"], { CI: "true" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("baseline_update_forbidden_in_ci");
  });

  it("requires explicit authorization for baseline update", () => {
    const result = runCheckUrls(["--update-baseline"], { CI: "" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("baseline_update_not_authorized");
  });

  it("requires baseline reason when authorized", () => {
    const result = runCheckUrls(["--update-baseline", "--allow-baseline-update"], { CI: "" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("baseline_update_reason_required");
  });
});
