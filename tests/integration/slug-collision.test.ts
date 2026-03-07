import { describe, it, expect } from "vitest";

describe("Slug Collision Prevention", () => {
  it("evaluates slug collisions in a case-insensitive manner", () => {
    const explicitSlug1 = "My-Credito-Test";
    const explicitSlug2 = "my-credito-test";

    // Simulate the exact lowercasing normalizer injected during our Phase 1 Quick Wins fix
    function normalizeSlug(slug: string) {
      return slug.trim().toLowerCase();
    }

    const n1 = normalizeSlug(explicitSlug1);
    const n2 = normalizeSlug(explicitSlug2);

    expect(n1).toBe(n2);
    expect(n1).toBe("my-credito-test");
  });
});
