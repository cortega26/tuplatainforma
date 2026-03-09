import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  getBalancedHomepagePosts,
  getHomepageHubRail,
  getHomepageLeadPost,
} from "../../src/utils/homepage";

type BlogEntry = CollectionEntry<"blog">;

function makePost(
  slug: string,
  cluster: string,
  overrides: Partial<BlogEntry["data"]> = {}
): BlogEntry {
  return {
    id: `${slug}.md`,
    collection: "blog",
    body: "",
    data: {
      title: `Post ${slug}`,
      description: `Description ${slug}`,
      slug,
      pubDate: new Date("2026-03-01T12:00:00Z"),
      updatedDate: new Date("2026-03-01T12:00:00Z"),
      tags: [],
      category: "empleo-ingresos",
      cluster,
      lang: "es-CL",
      draft: false,
      unlisted: false,
      featured: false,
      homepagePriority: 0,
      author: "Equipo Monedario",
      inlineImageExceptions: [],
      ...overrides,
    },
    rendered: undefined,
    filePath: `/tmp/${slug}.md`,
    digest: slug,
  } as BlogEntry;
}

describe("homepage content helpers", () => {
  it("prefers explicit homepage priority over featured recency", () => {
    const featured = makePost("featured-post", "deuda-credito", {
      featured: true,
      updatedDate: new Date("2026-03-08T12:00:00Z"),
    });
    const lead = makePost("lead-post", "sueldo-remuneraciones", {
      homepagePriority: 100,
      updatedDate: new Date("2026-03-02T12:00:00Z"),
    });

    expect(getHomepageLeadPost([featured, lead])?.data.slug).toBe("lead-post");
  });

  it("falls back to a featured post when no homepage priority is present", () => {
    const regular = makePost("regular-post", "deuda-credito", {
      updatedDate: new Date("2026-03-09T12:00:00Z"),
    });
    const featured = makePost("featured-post", "sueldo-remuneraciones", {
      featured: true,
      updatedDate: new Date("2026-03-01T12:00:00Z"),
    });

    expect(getHomepageLeadPost([regular, featured])?.data.slug).toBe(
      "featured-post"
    );
  });

  it("falls back to the provided post order when neither priority nor featured exists", () => {
    const firstInFeed = makePost("first-in-feed", "deuda-credito", {
      updatedDate: new Date("2026-03-01T12:00:00Z"),
    });
    const newerButSecond = makePost("newer-but-second", "sueldo-remuneraciones", {
      updatedDate: new Date("2026-03-09T12:00:00Z"),
    });

    expect(getHomepageLeadPost([firstInFeed, newerButSecond])?.data.slug).toBe(
      "first-in-feed"
    );
  });

  it("balances the rich recent rail away from the hero cluster when variety exists", () => {
    const hero = makePost("hero-post", "sueldo-remuneraciones", {
      homepagePriority: 100,
      updatedDate: new Date("2026-03-09T12:00:00Z"),
    });
    const posts = [
      hero,
      makePost("salary-2", "sueldo-remuneraciones", {
        updatedDate: new Date("2026-03-08T12:00:00Z"),
      }),
      makePost("salary-3", "sueldo-remuneraciones", {
        updatedDate: new Date("2026-03-07T12:00:00Z"),
      }),
      makePost("investing-1", "ahorro-e-inversion", {
        updatedDate: new Date("2026-03-06T12:00:00Z"),
      }),
      makePost("debt-1", "deuda-credito", {
        updatedDate: new Date("2026-03-05T12:00:00Z"),
      }),
      makePost("security-1", "seguridad-financiera", {
        updatedDate: new Date("2026-03-04T12:00:00Z"),
      }),
    ];

    const balanced = getBalancedHomepagePosts(posts, {
      heroSlug: "hero-post",
      heroCluster: "sueldo-remuneraciones",
      richCount: 3,
      totalCount: 6,
    });

    expect(balanced.richPosts.map(post => post.data.cluster)).toEqual([
      "ahorro-e-inversion",
      "deuda-credito",
      "seguridad-financiera",
    ]);
    expect(balanced.compactPosts.map(post => post.data.slug)).toContain("salary-2");
  });

  it("excludes the hero from recent slots using normalized slug identity", () => {
    const hero = makePost("hero-entry", "sueldo-remuneraciones", {
      slug: " Hero-Post ",
      homepagePriority: 100,
      updatedDate: new Date("2026-03-09T12:00:00Z"),
    });
    const posts = [
      hero,
      makePost("recent-1", "deuda-credito", {
        updatedDate: new Date("2026-03-08T12:00:00Z"),
      }),
      makePost("recent-2", "ahorro-e-inversion", {
        updatedDate: new Date("2026-03-07T12:00:00Z"),
      }),
      makePost("recent-3", "seguridad-financiera", {
        updatedDate: new Date("2026-03-06T12:00:00Z"),
      }),
    ];

    const balanced = getBalancedHomepagePosts(posts, {
      heroSlug: "hero-post",
      heroCluster: "sueldo-remuneraciones",
      richCount: 2,
      totalCount: 4,
    });

    const selectedSlugs = [...balanced.richPosts, ...balanced.compactPosts].map(
      post => post.data.slug.trim().toLowerCase()
    );

    expect(selectedSlugs).not.toContain("hero-post");
    expect(selectedSlugs).toEqual(
      expect.arrayContaining(["recent-1", "recent-2", "recent-3"])
    );
  });

  it("builds the thematic rail from the hero and recent clusters before falling back", () => {
    const recentPosts = [
      makePost("investing-1", "ahorro-e-inversion"),
      makePost("debt-1", "deuda-credito"),
      makePost("security-1", "seguridad-financiera"),
    ];

    const rail = getHomepageHubRail("sueldo-remuneraciones", recentPosts, 4);

    expect(rail.map(entry => entry.slug)).toEqual([
      "sueldo-remuneraciones",
      "ahorro-e-inversion",
      "deuda-credito",
      "seguridad-financiera",
    ]);
  });
});
