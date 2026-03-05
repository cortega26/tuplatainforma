import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { EnumChangefreq } from "sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { getUiCopyForLocale } from "./src/i18n/ui";
import { remarkPrefixInternalLinks } from "./src/remark-prefix-internal-links";

import mdx from "@astrojs/mdx";

const tocUi = getUiCopyForLocale(SITE.lang);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const tocHeadingPattern = tocUi.toc.title;
const tocHeadingRegex = new RegExp(`^${escapeRegExp(tocHeadingPattern)}$`, "i");
const SITE_BASE = new URL(SITE.website).pathname.replace(/\/$/, "") || "/";
const HOME_PATH = SITE_BASE === "/" ? "/" : `${SITE_BASE}/`;

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  base: SITE_BASE,
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives/"),
      serialize(item) {
        const url = item.url;
        const pathname = new URL(url).pathname;

        if (pathname === HOME_PATH) {
          return { ...item, changefreq: EnumChangefreq.DAILY, priority: 1.0 };
        }
        if (/\/posts\/[^/]+\/$/.test(url)) {
          return { ...item, changefreq: EnumChangefreq.MONTHLY, priority: 0.8 };
        }
        if (/\/leyes\/[^/]+\/$/.test(url)) {
          return { ...item, changefreq: EnumChangefreq.MONTHLY, priority: 0.8 };
        }
        if (/\/calculadoras\/[^/]+\/$/.test(url)) {
          return { ...item, changefreq: EnumChangefreq.WEEKLY, priority: 0.7 };
        }
        if (
          /\/(guias|leyes|calculadoras|tags)(\/[^/]+)?\/$/.test(url) ||
          /\/(about|autor|search|archives)\/$/.test(url)
        ) {
          return { ...item, changefreq: EnumChangefreq.MONTHLY, priority: 0.6 };
        }
        return { ...item, changefreq: EnumChangefreq.YEARLY, priority: 0.5 };
      },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      [remarkPrefixInternalLinks, SITE_BASE],
      [remarkToc, { heading: tocHeadingPattern }],
      [
        remarkCollapse,
        {
          test: tocHeadingRegex,
          summary: tocUi.toc.toggleShow,
        },
      ],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
