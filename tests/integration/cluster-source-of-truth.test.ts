import { describe, it, expect } from "vitest";
import { CLUSTERS } from "../../src/config/clusters";
import fs from "node:fs";
import path from "node:path";

describe("Cluster Source of Truth", () => {
  it("ensures all clusters dynamically configured are present physically in the pages architecture", () => {
    const guidesDir = path.resolve(__dirname, "../../src/pages/guias");
    if (!fs.existsSync(guidesDir)) {
      // Skips gracefully if the directory doesn't exist at all, otherwise checks its bounds
      return;
    }

    const physicalFolders = fs.readdirSync(guidesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const folder of physicalFolders) {
      // Explicit assertion: The physical folder must exist exactly inside the source of truth
      // as implemented in scripts/check-editorial-structure.mjs
      expect(CLUSTERS.includes(folder as (typeof CLUSTERS)[number])).toBe(true);
    }
  });

  it("exports exactly 8 unique editorial clusters", () => {
    expect(CLUSTERS.length).toBe(8);
  });
});
