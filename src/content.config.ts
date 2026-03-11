import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
import { CLUSTERS } from "./config/clusters";
import {
  HARDENED_OWNERSHIP_CLUSTERS,
  allowsGeneralCategoryInCluster,
  getCanonicalTopicEntry,
  getAllowedCategoriesForCluster,
} from "./config/editorial-topic-policy.mjs";

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

const TOPIC_ROLES = ["owner", "support", "reference"] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        pubDate: z.date(),
        updatedDate: z.date().optional().nullable(),
        tags: z.array(z.string().trim()).default([]),
        category: z.enum(CATEGORIES),
        cluster: z.enum(CLUSTERS),
        topicRole: z.enum(TOPIC_ROLES).optional(),
        canonicalTopic: z
          .string()
          .trim()
          .min(3)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Field "canonicalTopic" must use lowercase kebab-case.',
          })
          .optional(),
        lang: z.literal("es-CL").default("es-CL"),
        draft: z.boolean().default(false),
        unlisted: z.boolean().default(false),
        featured: z.boolean().default(false),
        homepagePriority: z.number().int().min(0).default(0),
        author: z.string().trim().min(1).default(SITE.author),
        canonical: z
          .string()
          .url()
          .refine(url => new URL(url).protocol === "https:", {
            message: 'Field "canonical" must be an absolute HTTPS URL.',
          })
          .optional(),
        heroImage: z.string().or(image()).optional(),
        inlineImageExceptions: z
          .array(
            z
              .object({
                src: z.string().trim().min(1),
                reason: z.string().trim().min(12),
              })
              .strict()
          )
          .optional()
          .default([]),
        series: z.string().trim().min(1).optional(),
        timezone: z.string().optional(),
        hideEditPost: z.boolean().optional(),
      })
      .strict()
      .superRefine((data, ctx) => {
        if (
          data.updatedDate &&
          data.updatedDate.getTime() < data.pubDate.getTime()
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              '"updatedDate" must be greater than or equal to "pubDate".',
          });
        }
        if (data.slug.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: 'Field "slug" must be a non-empty string.',
          });
        }
        if (data.topicRole && !data.canonicalTopic) {
          ctx.addIssue({
            code: "custom",
            message:
              'Field "canonicalTopic" is required when "topicRole" is present.',
          });
        }
        if (data.canonicalTopic && !data.topicRole) {
          ctx.addIssue({
            code: "custom",
            message:
              'Field "topicRole" is required when "canonicalTopic" is present.',
          });
        }
        if (
          HARDENED_OWNERSHIP_CLUSTERS.includes(data.cluster) &&
          data.draft !== true &&
          (!data.topicRole || !data.canonicalTopic)
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              'Published articles in hardened clusters must declare both "topicRole" and "canonicalTopic".',
          });
        }
        const allowedCategories = getAllowedCategoriesForCluster(data.cluster);
        if (
          data.category === "general" &&
          allowedCategories &&
          !allowsGeneralCategoryInCluster({
            cluster: data.cluster,
            topicRole: data.topicRole,
            unlisted: data.unlisted,
          })
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              'Category "general" is blocked in hardened clusters unless the article is an unlisted reference.',
          });
        }
        if (
          HARDENED_OWNERSHIP_CLUSTERS.includes(data.cluster) &&
          data.canonicalTopic &&
          !getCanonicalTopicEntry(data.cluster, data.canonicalTopic)
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              'Field "canonicalTopic" must match the central registry for hardened clusters.',
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

export const LAWS_PATH = "src/data/laws";

const LEGAL_AREAS = [
  "credito-y-deuda",
  "prevision-y-trabajo",
  "tributaria",
  "bancaria-y-financiera",
  "proteccion-al-consumidor",
  "privacidad-y-datos",
] as const;

const laws = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${LAWS_PATH}` }),
  schema: z.object({
    numero: z.string().trim().min(1), // "20.009" | "DL 824"
    title: z.string().trim().min(1), // título oficial
    shortName: z.string().trim().min(1), // nombre corto para cards
    area: z.enum(LEGAL_AREAS),
    effective: z.date(), // fecha de entrada en vigor
    lastAmended: z.date().optional(), // última modificación oficial
    bcnUrl: z.string().url(), // texto oficial en BCN
    description: z.string().trim().min(1), // para meta
    lastVerified: z.date(), // cuándo verificamos el contenido
    updateTrigger: z.string().trim().min(1), // qué gatilla actualización
    relatedArticles: z.array(z.string()).default([]), // slugs de blog relacionados
    draft: z.boolean().default(false),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/glossary" }),
  schema: z.object({
    term: z.string().trim().min(1), // Término oficial completo
    shortDefinition: z.string().trim().min(10).max(160), // Definición concisa (SEO/Tooltip)
    relatedTerms: z.array(z.string()).default([]), // Slugs de glosario relacionados
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, laws, glossary };
