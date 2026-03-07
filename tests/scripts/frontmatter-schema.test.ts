import { describe, it, expect } from "vitest";
import yaml from "js-yaml";

describe("YAML Parser", () => {
  it("parses multiline block scalars exactly as string blocks", () => {
    const yamlString = `
title: "Article Title"
description: >
  This is a multiline
  block scalar description.
`;
    const parsed = yaml.load(yamlString, { schema: yaml.JSON_SCHEMA }) as Record<string, any>;
    expect(parsed.description).toBe("This is a multiline block scalar description.\n");
  });

  it("parses arrays seamlessly", () => {
    const yamlString = `
tags:
  - first parameter
  - second parameter
`;
    const parsed = yaml.load(yamlString, { schema: yaml.JSON_SCHEMA }) as Record<string, any>;
    expect(parsed.tags).toEqual(["first parameter", "second parameter"]);
  });

  it("retains string dates accurately mapping through JSON schema without forcing Date evaluation", () => {
    const yamlString = `
pubDate: "2026-03-04T12:00:00Z"
`;
    const parsed = yaml.load(yamlString, { schema: yaml.JSON_SCHEMA }) as Record<string, any>;
    expect(parsed.pubDate).toBeTypeOf("string");
    expect(parsed.pubDate).toBe("2026-03-04T12:00:00Z");
  });
});
