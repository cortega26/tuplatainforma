import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
const CATEGORIES = [
  "ahorro-inversion",
  "impuestos",
  "prevision",
  "deuda-credito",
  "seguridad-financiera",
  "empleo-ingresos",
  "general",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      slug: z.string().trim().min(1),
      pubDate: z.date(),
      updatedDate: z.date().optional().nullable(),
      tags: z.array(z.string().trim()).default([]),
      category: z.enum(CATEGORIES),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      author: z.string().trim().min(1).default(SITE.author),
      lang: z.string().default("es-CL"),
      canonical: z
        .string()
        .url()
        .refine(url => new URL(url).protocol === "https:", {
          message: 'Field "canonical" must be an absolute HTTPS URL.',
        })
        .optional(),
      heroImage: image().or(z.string()).optional(),
      series: z.string().trim().min(1).optional(),
      cluster: z.string().trim().min(1).optional(),
      timezone: z.string().optional(),
      hideEditPost: z.boolean().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (data.updatedDate && data.updatedDate.getTime() < data.pubDate.getTime()) {
        ctx.addIssue({
          code: "custom",
          message: '"updatedDate" must be greater than or equal to "pubDate".',
        });
      }
      if (data.slug.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: 'Field "slug" must be a non-empty string.',
        });
      }
    })
    .transform(data => ({
      ...data,
      // Runtime compatibility aliases (Phase 3 transition)
      pubDatetime: data.pubDate,
      modDatetime: data.updatedDate ?? null,
      canonicalURL: data.canonical,
      ogImage: data.heroImage,
    })),
});

export const collections = { blog };
