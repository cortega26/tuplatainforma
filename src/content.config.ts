import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      slug: z.string().trim().min(1).optional(),
      pubDate: z.date().optional(),
      updatedDate: z.date().optional().nullable(),
      tags: z.array(z.string().trim()).default([]),
      category: z.string().trim().min(1).default("general"),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      author: z.string().trim().min(1).default(SITE.author),
      lang: z.string().default("es-CL"),
      canonical: z.string().optional(),
      heroImage: image().or(z.string()).optional(),
      series: z.string().trim().min(1).optional(),
      cluster: z.string().trim().min(1).optional(),
      // Legacy compatibility (read-only deprecation window)
      pubDatetime: z.date().optional(),
      modDatetime: z.date().optional().nullable(),
      canonicalURL: z.string().optional(),
      ogImage: image().or(z.string()).optional(),
      timezone: z.string().optional(),
      hideEditPost: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.pubDate && !data.pubDatetime) {
        ctx.addIssue({
          code: "custom",
          message:
            'Missing publication date. Define "pubDatetime" (legacy) or "pubDate" (editorial schema).',
        });
      }

      const canonical = data.canonical ?? data.canonicalURL;
      if (canonical) {
        try {
          const parsedCanonical = new URL(canonical);
          if (parsedCanonical.protocol !== "https:") {
            ctx.addIssue({
              code: "custom",
              message: 'Field "canonical" must be an absolute HTTPS URL.',
            });
          }
        } catch {
          ctx.addIssue({
            code: "custom",
            message: 'Field "canonical" must be a valid absolute URL.',
          });
        }
      }

      const normalizedPubDate = data.pubDate ?? data.pubDatetime;
      const normalizedUpdatedDate = data.updatedDate ?? data.modDatetime ?? null;
      if (normalizedPubDate && normalizedUpdatedDate) {
        if (normalizedUpdatedDate.getTime() < normalizedPubDate.getTime()) {
          ctx.addIssue({
            code: "custom",
            message: '"updatedDate" must be greater than or equal to "pubDate".',
          });
        }
      }
    })
    .transform(data => ({
      ...data,
      pubDate: data.pubDate ?? data.pubDatetime!,
      updatedDate: data.updatedDate ?? data.modDatetime ?? null,
      canonical: data.canonical ?? data.canonicalURL,
      heroImage: data.heroImage ?? data.ogImage,
      // Runtime compatibility aliases (Phase 3 transition)
      pubDatetime: data.pubDate ?? data.pubDatetime!,
      modDatetime: data.updatedDate ?? data.modDatetime ?? null,
      canonicalURL: data.canonical ?? data.canonicalURL,
      ogImage: data.heroImage ?? data.ogImage,
    })),
});

export const collections = { blog };
