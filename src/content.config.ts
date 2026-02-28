import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date().optional(),
      modDatetime: z.date().optional().nullable(),
      pubDate: z.date().optional(),
      updatedDate: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      lang: z.string().default("es-CL"),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      canonical: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.pubDatetime && !data.pubDate) {
        ctx.addIssue({
          code: "custom",
          message:
            'Missing publication date. Define "pubDatetime" (legacy) or "pubDate" (editorial schema).',
        });
      }
    })
    .transform(data => ({
      ...data,
      pubDatetime: data.pubDatetime ?? data.pubDate!,
      modDatetime: data.modDatetime ?? data.updatedDate ?? null,
      canonicalURL: data.canonicalURL ?? data.canonical,
    })),
});

export const collections = { blog };
