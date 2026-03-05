import { describe, it, expect } from "vitest";

describe("Canonical URL Generation Verification", () => {
  function generateCanonicalTestURL(pathname: string, origin: string) {
    // Mimic the exact \`new URL(Astro.url.pathname, Astro.url).href\` behavior 
    // enforced inside src/layouts/Layout.astro against an Astro.url mocking class.
    return new URL(pathname, origin).href;
  }

  it("strips query parameters from the canonical origin", () => {
    const originUrl = "https://monedario.cl/posts/example?utm_source=twitter&foo=bar";
    const pathname = "/posts/example/";
    
    // Test mimicking `Astro.url` resolving its parameters dynamically.
    const result = generateCanonicalTestURL(pathname, originUrl);
    expect(result).toBe("https://monedario.cl/posts/example/");
    expect(result).not.toContain("utm_source");
  });

  it("forces a trailing slash when the pathname is explicitly standardized to it", () => {
    // Assuming Astro maps URL pathnames appropriately using trailingSlash: 'always'.
    const originUrl = "https://monedario.cl/posts/example-two";
    const pathnameAstroResolution = "/posts/example-two/";
    
    const result = generateCanonicalTestURL(pathnameAstroResolution, originUrl);
    expect(result).toBe("https://monedario.cl/posts/example-two/");
  });
});
