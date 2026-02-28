import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

export type ArticleView = {
  title: string;
  description: string;
  slug: string;
  pubDate: Date;
  updatedDate: Date | null;
  tags: string[];
  category: string;
  draft: boolean;
  featured: boolean;
  author: string;
  lang: string;
  canonical?: string;
  heroImage?: string;
  series?: string;
  cluster?: string;
  slugSource: "frontmatter" | "derived";
};

type BlogEntry = CollectionEntry<"blog">;

function normalizeSlug(entry: BlogEntry): {
  slug: string;
  slugSource: "frontmatter" | "derived";
} {
  const explicitSlug = entry.data.slug?.trim();
  if (explicitSlug) {
    return { slug: explicitSlug, slugSource: "frontmatter" };
  }

  // Legacy fallback: derive slug from content entry id.
  const derivedSlug = entry.id.split("/").at(-1) ?? entry.id;
  return { slug: derivedSlug, slugSource: "derived" };
}

function normalizeDate(input: unknown): Date | null {
  if (!input) return null;
  if (input instanceof Date && !Number.isNaN(input.getTime())) return input;

  const parsed = new Date(String(input));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function toArticleView(entry: BlogEntry): ArticleView {
  const { slug, slugSource } = normalizeSlug(entry);
  const pubDate = normalizeDate(entry.data.pubDate ?? entry.data.pubDatetime);

  if (!pubDate) {
    throw new Error(
      `[articleView] Missing/invalid publication date in entry "${entry.id}".`
    );
  }

  const updatedDate = normalizeDate(
    entry.data.updatedDate ?? entry.data.modDatetime
  );
  const canonical = entry.data.canonical ?? entry.data.canonicalURL;
  const heroImage = entry.data.heroImage ?? entry.data.ogImage;

  return {
    title: entry.data.title.trim(),
    description: entry.data.description.trim(),
    slug,
    pubDate,
    updatedDate,
    tags: (entry.data.tags ?? []).map(tag => tag.trim()).filter(Boolean),
    category: entry.data.category ?? "general",
    draft: entry.data.draft ?? false,
    featured: entry.data.featured ?? false,
    author: entry.data.author ?? SITE.author,
    lang: entry.data.lang ?? "es-CL",
    canonical,
    heroImage: typeof heroImage === "string" ? heroImage : heroImage?.src,
    series: entry.data.series,
    cluster: entry.data.cluster,
    slugSource,
  };
}

