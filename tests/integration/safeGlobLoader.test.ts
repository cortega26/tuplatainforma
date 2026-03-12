import { describe, expect, it } from "vitest";
import {
  parseDuplicateIdWarning,
  shouldSuppressSameFileDuplicateWarning,
} from "@/content/loaders/safeGlob";

describe("safeGlob", () => {
  it("parses Astro duplicate-id warnings", () => {
    const parsed = parseDuplicateIdWarning(
      'Duplicate id "fondos-afp-a-b-c-d-e" found in /repo/src/data/blog/fondos-afp-a-b-c-d-e.md. Later items with the same id will overwrite earlier ones.'
    );

    expect(parsed).toEqual({
      id: "fondos-afp-a-b-c-d-e",
      warnedFilePath: "/repo/src/data/blog/fondos-afp-a-b-c-d-e.md",
    });
  });

  it("suppresses warnings when the duplicate is the same file being refreshed", () => {
    expect(
      shouldSuppressSameFileDuplicateWarning({
        message:
          'Duplicate id "fondos-afp-a-b-c-d-e" found in /repo/src/data/blog/fondos-afp-a-b-c-d-e.md. Later items with the same id will overwrite earlier ones.',
        existingFilePath: "src/data/blog/fondos-afp-a-b-c-d-e.md",
        rootPath: "/repo",
      })
    ).toBe(true);
  });

  it("keeps warnings when the duplicate id comes from another file", () => {
    expect(
      shouldSuppressSameFileDuplicateWarning({
        message:
          'Duplicate id "fondos-afp-a-b-c-d-e" found in /repo/src/data/blog/fondos-afp-a-b-c-d-e.md. Later items with the same id will overwrite earlier ones.',
        existingFilePath: "src/data/blog/otra-pieza.md",
        rootPath: "/repo",
      })
    ).toBe(false);
  });
});
