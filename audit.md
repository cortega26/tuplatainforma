# Repo audit export

- Generated: `2026-02-23T22:21:18`
- Repo: `/home/carlos/VS_Code_Projects/tuplatainforma`
- Branch: `main`
- HEAD: `c521d8847dc7b6025137104af45a99a6ba19f77c`
- Path filters: `astro.config.* src/config.ts src/pages src/components src/layouts src/utils package.json`

## Context snapshot

**git status (short):**

```text
?? git_audit_export.py
```
**Recent history (top 30):**

```text
c521d88 fix(pagination): avoid double base prefix
5ff16c5 FIx Pagination
a35f82d added .mdx support online
154e636 Nuevos artículos y soporte a .mdx
2e1357c feat: artículo Cuenta 2 AFP
90104f4 Update README.md
047670a Tag corregido
20d26e3 remoción de texto involuntario
e8e04da Fix #5
e59431a Correción de URL
24131b6 Traducción a Español
d555b77 Corregidos errores de paginación
1a56b4c Correción path
8a8e04f Corrección en ruta
21ceaff Rutas corregidas
caf9247 feat: calculadora sueldo líquido + sección calculadoras en menú
c35dd54 First 2 articles
71da976 feat: personalizar homepage, about y limpiar contenido demo
c466441 Fixed path
144f862 config: personalizar SITE para TuPlataInforma
7da316f Updates tailwind dependency path
c1e4efb Moved deploy to correct folder
c7e270c Update astro.config.mjs
bfbc80f Setup inicial con Astro + Tailwind + GitHub Actions
87275d7 Initial commit from Astro
```

## Per-commit details


## Commit 144f862

**Resumen:**

```text
144f862 config: personalizar SITE para TuPlataInforma
```
**Archivos tocados:**

```text
astro.config.mjs
astro.config.ts
package.json
src/components/BackButton.astro
src/components/BackToTopButton.astro
src/components/Breadcrumb.astro
src/components/Card.astro
src/components/Datetime.astro
src/components/EditPost.astro
src/components/Footer.astro
src/components/Header.astro
src/components/LinkButton.astro
src/components/Pagination.astro
src/components/ShareLinks.astro
src/components/Socials.astro
src/components/Tag.astro
src/config.ts
src/layouts/AboutLayout.astro
src/layouts/Layout.astro
src/layouts/Main.astro
src/layouts/PostDetails.astro
src/pages/404.astro
src/pages/about.md
src/pages/archives/index.astro
src/pages/index.astro
src/pages/og.png.ts
src/pages/posts/[...page].astro
src/pages/posts/[...slug]/index.astro
src/pages/posts/[...slug]/index.png.ts
src/pages/robots.txt.ts
src/pages/rss.xml.ts
src/pages/search.astro
src/pages/tags/[tag]/[...page].astro
src/pages/tags/index.astro
src/utils/generateOgImages.ts
src/utils/getPath.ts
src/utils/getPostsByGroupCondition.ts
src/utils/getPostsByTag.ts
src/utils/getSortedPosts.ts
src/utils/getUniqueTags.ts
src/utils/loadGoogleFont.ts
src/utils/og-templates/post.js
src/utils/og-templates/site.js
src/utils/postFilter.ts
src/utils/slugify.ts
src/utils/transformers/fileName.js
```
**Diff stat:**

```text
 astro.config.mjs                       |  10 --
 astro.config.ts                        |  73 +++++++++
 package.json                           |  47 +++++-
 src/components/BackButton.astro        |  37 +++++
 src/components/BackToTopButton.astro   |  88 ++++++++++
 src/components/Breadcrumb.astro        |  57 +++++++
 src/components/Card.astro              |  33 ++++
 src/components/Datetime.astro          |  55 +++++++
 src/components/EditPost.astro          |  34 ++++
 src/components/Footer.astro            |  32 ++++
 src/components/Header.astro            | 169 +++++++++++++++++++
 src/components/LinkButton.astro        |  21 +++
 src/components/Pagination.astro        |  43 +++++
 src/components/ShareLinks.astro        |  26 +++
 src/components/Socials.astro           |  19 +++
 src/components/Tag.astro               |  35 ++++
 src/config.ts                          |  23 +++
 src/layouts/AboutLayout.astro          |  24 +++
 src/layouts/Layout.astro               | 176 ++++++++++++++++++++
 src/layouts/Main.astro                 |  42 +++++
 src/layouts/PostDetails.astro          | 285 +++++++++++++++++++++++++++++++++
 src/pages/404.astro                    |  30 ++++
 src/pages/about.md                     |  37 +++++
 src/pages/archives/index.astro         |  83 ++++++++++
 src/pages/index.astro                  | 130 +++++++++++++--
 src/pages/og.png.ts                    |   9 ++
 src/pages/posts/[...page].astro        |  32 ++++
 src/pages/posts/[...slug]/index.astro  |  27 ++++
 src/pages/posts/[...slug]/index.png.ts |  34 ++++
 src/pages/robots.txt.ts                |  13 ++
 src/pages/rss.xml.ts                   |  21 +++
 src/pages/search.astro                 | 141 ++++++++++++++++
 src/pages/tags/[tag]/[...page].astro   |  50 ++++++
 src/pages/tags/index.astro             |  24 +++
 src/utils/generateOgImages.ts          |  20 +++
 src/utils/getPath.ts                   |  36 +++++
 src/utils/getPostsByGroupCondition.ts  |  25 +++
 src/utils/getPostsByTag.ts             |  10 ++
 src/utils/getSortedPosts.ts            |  18 +++
 src/utils/getUniqueTags.ts             |  23 +++
 src/utils/loadGoogleFont.ts            |  62 +++++++
 src/utils/og-templates/post.js         | 229 ++++++++++++++++++++++++++
 src/utils/og-templates/site.js         | 128 +++++++++++++++
 src/utils/postFilter.ts                |  11 ++
 src/utils/slugify.ts                   |  23 +++
 src/utils/transformers/fileName.js     |  69 ++++++++
 46 files changed, 2583 insertions(+), 31 deletions(-)
```
**Patch:**

```diff
commit 144f8625783ba39b493b1202d8f21264ca84f7ac
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 12:02:25 2026 -0300

    config: personalizar SITE para TuPlataInforma

diff --git a/astro.config.mjs b/astro.config.mjs
deleted file mode 100644
index afe7b10..0000000
--- a/astro.config.mjs
+++ /dev/null
@@ -1,10 +0,0 @@
-import { defineConfig } from 'astro/config';
-import tailwindcss from '@tailwindcss/vite';
-
-export default defineConfig({
-  site: 'https://cortega26.github.io',
-  base: '/tuplatainforma',
-  vite: {
-    plugins: [tailwindcss()],
-  },
-});
\ No newline at end of file
diff --git a/astro.config.ts b/astro.config.ts
new file mode 100644
index 0000000..1fb760e
--- /dev/null
+++ b/astro.config.ts
@@ -0,0 +1,73 @@
+import { defineConfig, envField, fontProviders } from "astro/config";
+import tailwindcss from "@tailwindcss/vite";
+import sitemap from "@astrojs/sitemap";
+import remarkToc from "remark-toc";
+import remarkCollapse from "remark-collapse";
+import {
+  transformerNotationDiff,
+  transformerNotationHighlight,
+  transformerNotationWordHighlight,
+} from "@shikijs/transformers";
+import { transformerFileName } from "./src/utils/transformers/fileName";
+import { SITE } from "./src/config";
+
+// https://astro.build/config
+export default defineConfig({
+  site: SITE.website,
+  integrations: [
+    sitemap({
+      filter: page => SITE.showArchives || !page.endsWith("/archives"),
+    }),
+  ],
+  markdown: {
+    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
+    shikiConfig: {
+      // For more themes, visit https://shiki.style/themes
+      themes: { light: "min-light", dark: "night-owl" },
+      defaultColor: false,
+      wrap: false,
+      transformers: [
+        transformerFileName({ style: "v2", hideDot: false }),
+        transformerNotationHighlight(),
+        transformerNotationWordHighlight(),
+        transformerNotationDiff({ matchAlgorithm: "v3" }),
+      ],
+    },
+  },
+  vite: {
+    // eslint-disable-next-line
+    // @ts-ignore
+    // This will be fixed in Astro 6 with Vite 7 support
+    // See: https://github.com/withastro/astro/issues/14030
+    plugins: [tailwindcss()],
+    optimizeDeps: {
+      exclude: ["@resvg/resvg-js"],
+    },
+  },
+  image: {
+    responsiveStyles: true,
+    layout: "constrained",
+  },
+  env: {
+    schema: {
+      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
+        access: "public",
+        context: "client",
+        optional: true,
+      }),
+    },
+  },
+  experimental: {
+    preserveScriptOrder: true,
+    fonts: [
+      {
+        name: "Google Sans Code",
+        cssVariable: "--font-google-sans-code",
+        provider: fontProviders.google(),
+        fallbacks: ["monospace"],
+        weights: [300, 400, 500, 600, 700],
+        styles: ["normal", "italic"],
+      },
+    ],
+  },
+});
diff --git a/package.json b/package.json
index 7679052..25b1d7c 100644
--- a/package.json
+++ b/package.json
@@ -1,16 +1,47 @@
 {
-  "name": "tuplatainforma",
+  "name": "tuplatainforma-temp",
   "type": "module",
-  "version": "0.0.1",
+  "version": "5.5.1",
   "scripts": {
     "dev": "astro dev",
-    "build": "astro build",
+    "build": "astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/",
     "preview": "astro preview",
-    "astro": "astro"
+    "sync": "astro sync",
+    "astro": "astro",
+    "format:check": "prettier --check .",
+    "format": "prettier --write .",
+    "lint": "eslint ."
   },
   "dependencies": {
-    "@tailwindcss/vite": "^4.2.1",
-    "astro": "^5.17.1",
-    "tailwindcss": "^4.2.1"
+    "@astrojs/rss": "^4.0.14",
+    "@astrojs/sitemap": "^3.6.0",
+    "@resvg/resvg-js": "^2.6.2",
+    "@tailwindcss/vite": "^4.1.18",
+    "astro": "^5.16.6",
+    "dayjs": "^1.11.19",
+    "lodash.kebabcase": "^4.1.1",
+    "remark-collapse": "^0.1.2",
+    "remark-toc": "^9.0.0",
+    "satori": "^0.18.3",
+    "sharp": "^0.34.5",
+    "slugify": "^1.6.6",
+    "tailwindcss": "^4.1.18"
+  },
+  "devDependencies": {
+    "@astrojs/check": "^0.9.6",
+    "@pagefind/default-ui": "^1.4.0",
+    "@shikijs/transformers": "^3.20.0",
+    "@tailwindcss/typography": "^0.5.19",
+    "@types/lodash.kebabcase": "^4.1.9",
+    "@typescript-eslint/parser": "^8.51.0",
+    "eslint": "^9.39.2",
+    "eslint-plugin-astro": "^1.5.0",
+    "globals": "^16.5.0",
+    "pagefind": "^1.4.0",
+    "prettier": "^3.7.4",
+    "prettier-plugin-astro": "^0.14.1",
+    "prettier-plugin-tailwindcss": "^0.7.2",
+    "typescript": "^5.9.3",
+    "typescript-eslint": "^8.51.0"
   }
-}
+}
\ No newline at end of file
diff --git a/src/components/BackButton.astro b/src/components/BackButton.astro
new file mode 100644
index 0000000..0d981d1
--- /dev/null
+++ b/src/components/BackButton.astro
@@ -0,0 +1,37 @@
+---
+import IconChevronLeft from "@/assets/icons/IconChevronLeft.svg";
+import LinkButton from "./LinkButton.astro";
+import { SITE } from "@/config";
+---
+
+{
+  SITE.showBackButton && (
+    <div class="app-layout flex items-center justify-start">
+      <LinkButton
+        id="back-button"
+        href="/"
+        class="focus-outline -ms-2 mt-8 mb-2 hover:text-foreground/75"
+      >
+        <IconChevronLeft class="inline-block size-6 rtl:rotate-180" />
+        <span>Go back</span>
+      </LinkButton>
+    </div>
+  )
+}
+
+<script>
+  /* Update Search Praam */
+  function updateGoBackUrl() {
+    const backButton: HTMLAnchorElement | null =
+      document.querySelector("#back-button");
+
+    const backUrl = sessionStorage.getItem("backUrl");
+
+    if (backUrl && backButton) {
+      backButton.href = backUrl;
+    }
+  }
+
+  document.addEventListener("astro:page-load", updateGoBackUrl);
+  updateGoBackUrl();
+</script>
diff --git a/src/components/BackToTopButton.astro b/src/components/BackToTopButton.astro
new file mode 100644
index 0000000..88e733e
--- /dev/null
+++ b/src/components/BackToTopButton.astro
@@ -0,0 +1,88 @@
+---
+import IconChevronLeft from "@/assets/icons/IconChevronLeft.svg";
+import IconArrowNarrowUp from "@/assets/icons/IconArrowNarrowUp.svg";
+---
+
+<div
+  id="btt-btn-container"
+  class:list={[
+    "fixed end-4 bottom-8 z-50",
+    "md:sticky md:end-auto md:float-end md:me-1",
+    "translate-y-14 opacity-0 transition duration-500",
+  ]}
+>
+  <button
+    data-button="back-to-top"
+    class:list={[
+      "group relative bg-background px-2 py-1",
+      "size-14 rounded-full shadow-xl",
+      "md:h-8 md:w-fit md:rounded-md md:shadow-none md:focus-visible:rounded-none",
+      "md:bg-background/35 md:bg-clip-padding md:backdrop-blur-lg",
+    ]}
+  >
+    <span
+      id="progress-indicator"
+      class="absolute inset-0 -z-10 block size-14 scale-110 rounded-full bg-transparent md:hidden md:h-8 md:rounded-md"
+    ></span>
+    <IconChevronLeft class="inline-block rotate-90 md:hidden" />
+    <span class="sr-only text-sm group-hover:text-accent md:not-sr-only">
+      <IconArrowNarrowUp class="inline-block size-4" />
+      Back To Top
+    </span>
+  </button>
+</div>
+
+<script is:inline data-astro-rerun>
+  /** Scrolls the document to the top when
+   * the "Back to Top" button is clicked. */
+  function backToTop() {
+    const rootElement = document.documentElement;
+    const btnContainer = document.querySelector("#btt-btn-container");
+    const backToTopBtn = document.querySelector("[data-button='back-to-top']");
+    const progressIndicator = document.querySelector("#progress-indicator");
+
+    if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator)
+      return;
+
+    // Attach click event handler for back-to-top button
+    backToTopBtn.addEventListener("click", () => {
+      document.body.scrollTop = 0; // For Safari
+      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
+    });
+
+    // Handle button visibility according to scroll position
+    let lastVisible = null;
+    function handleScroll() {
+      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
+      const scrollTop = rootElement.scrollTop;
+      const scrollPercent = Math.floor((scrollTop / scrollTotal) * 100);
+
+      progressIndicator.style.setProperty(
+        "background-image",
+        `conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`
+      );
+
+      const isVisible = scrollTop / scrollTotal > 0.3;
+
+      if (isVisible !== lastVisible) {
+        btnContainer.classList.toggle("opacity-100", isVisible);
+        btnContainer.classList.toggle("translate-y-0", isVisible);
+        btnContainer.classList.toggle("opacity-0", !isVisible);
+        btnContainer.classList.toggle("translate-y-14", !isVisible);
+        lastVisible = isVisible;
+      }
+    }
+
+    let ticking = false;
+    document.addEventListener("scroll", () => {
+      if (!ticking) {
+        window.requestAnimationFrame(() => {
+          handleScroll();
+          ticking = false;
+        });
+        ticking = true;
+      }
+    });
+  }
+  backToTop();
+</script>
diff --git a/src/components/Breadcrumb.astro b/src/components/Breadcrumb.astro
new file mode 100644
index 0000000..b49fe3d
--- /dev/null
+++ b/src/components/Breadcrumb.astro
@@ -0,0 +1,57 @@
+---
+// Remove current url path and remove trailing slash if exists
+const currentUrlPath = Astro.url.pathname.replace(/\/+$/, "");
+
+// Get url array from path
+// eg: /tags/tailwindcss => ['tags', 'tailwindcss']
+const breadcrumbList = currentUrlPath.split("/").slice(1);
+
+// if breadcrumb is Home > Posts > 1 <etc>
+// replace Posts with Posts (page number)
+if (breadcrumbList[0] === "posts") {
+  breadcrumbList.splice(0, 2, `Posts (page ${breadcrumbList[1] || 1})`);
+}
+
+// if breadcrumb is Home > Tags > [tag] > [page] <etc>
+// replace [tag] > [page] with [tag] (page number)
+if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
+  breadcrumbList.splice(
+    1,
+    3,
+    `${breadcrumbList[1]} ${Number(breadcrumbList[2]) === 1 ? "" : "(page " + breadcrumbList[2] + ")"}`
+  );
+}
+---
+
+<nav class="app-layout mt-8 mb-1" aria-label="breadcrumb">
+  <ul
+    class="font-light [&>li]:inline [&>li:not(:last-child)>a]:hover:opacity-100"
+  >
+    <li>
+      <a href="/" class="opacity-80">Home</a>
+      <span aria-hidden="true" class="opacity-80">&raquo;</span>
+    </li>
+    {
+      breadcrumbList.map((breadcrumb, index) =>
+        index + 1 === breadcrumbList.length ? (
+          <li>
+            <span
+              class:list={["capitalize opacity-75", { lowercase: index > 0 }]}
+              aria-current="page"
+            >
+              {/* make the last part lowercase in Home > Tags > some-tag */}
+              {decodeURIComponent(breadcrumb)}
+            </span>
+          </li>
+        ) : (
+          <li>
+            <a href={`/${breadcrumb}/`} class="capitalize opacity-70">
+              {breadcrumb}
+            </a>
+            <span aria-hidden="true">&raquo;</span>
+          </li>
+        )
+      )
+    }
+  </ul>
+</nav>
diff --git a/src/components/Card.astro b/src/components/Card.astro
new file mode 100644
index 0000000..c627603
--- /dev/null
+++ b/src/components/Card.astro
@@ -0,0 +1,33 @@
+---
+import type { CollectionEntry } from "astro:content";
+import { slugifyStr } from "@/utils/slugify";
+import { getPath } from "@/utils/getPath";
+import Datetime from "./Datetime.astro";
+
+type Props = {
+  variant?: "h2" | "h3";
+} & CollectionEntry<"blog">;
+
+const { variant: Heading = "h2", id, data, filePath } = Astro.props;
+
+const { title, description, ...props } = data;
+---
+
+<li class="my-6">
+  <a
+    href={getPath(id, filePath)}
+    class:list={[
+      "inline-block text-lg font-medium text-accent",
+      "decoration-dashed underline-offset-4 hover:underline",
+      "focus-visible:no-underline focus-visible:underline-offset-0",
+    ]}
+  >
+    <Heading
+      style={{ viewTransitionName: slugifyStr(title.replaceAll(".", "-")) }}
+    >
+      {title}
+    </Heading>
+  </a>
+  <Datetime {...props} />
+  <p>{description}</p>
+</li>
diff --git a/src/components/Datetime.astro b/src/components/Datetime.astro
new file mode 100644
index 0000000..e16834f
--- /dev/null
+++ b/src/components/Datetime.astro
@@ -0,0 +1,55 @@
+---
+import dayjs from "dayjs";
+import utc from "dayjs/plugin/utc";
+import timezone from "dayjs/plugin/timezone";
+import IconCalendar from "@/assets/icons/IconCalendar.svg";
+import { SITE } from "@/config";
+
+dayjs.extend(utc);
+dayjs.extend(timezone);
+
+type Props = {
+  class?: string;
+  size?: "sm" | "lg";
+  pubDatetime: string | Date;
+  timezone?: string;
+  modDatetime?: string | Date | null;
+};
+
+const {
+  pubDatetime,
+  modDatetime,
+  size = "sm",
+  class: className = "",
+  timezone: postTimezone,
+} = Astro.props;
+
+/* ========== Formatted Datetime ========== */
+const isModified = modDatetime && modDatetime > pubDatetime;
+
+const datetime = dayjs(isModified ? modDatetime : pubDatetime).tz(
+  postTimezone || SITE.timezone
+);
+
+const date = datetime.format("D MMM, YYYY"); // e.g., '22 Mar, 2025'
+---
+
+<div class:list={["flex items-center gap-x-2 opacity-80", className]}>
+  <IconCalendar
+    class:list={[
+      "inline-block size-6 min-w-5.5",
+      { "scale-90": size === "sm" },
+    ]}
+  />
+  {
+    isModified && (
+      <span class:list={["text-sm", { "sm:text-base": size === "lg" }]}>
+        Updated:
+      </span>
+    )
+  }
+  <time
+    class:list={["text-sm", { "sm:text-base": size === "lg" }]}
+    datetime={datetime.toISOString()}>{date}</time
+  >
+</div>
diff --git a/src/components/EditPost.astro b/src/components/EditPost.astro
new file mode 100644
index 0000000..fe3726b
--- /dev/null
+++ b/src/components/EditPost.astro
@@ -0,0 +1,34 @@
+---
+import type { CollectionEntry } from "astro:content";
+import IconEdit from "@/assets/icons/IconEdit.svg";
+import { SITE } from "@/config";
+
+type Props = {
+  hideEditPost?: CollectionEntry<"blog">["data"]["hideEditPost"];
+  class?: string;
+  post: CollectionEntry<"blog">;
+};
+
+const { hideEditPost, post, class: className = "" } = Astro.props;
+
+const href = `${SITE.editPost.url}${post.filePath}`;
+const showEditPost =
+  SITE.editPost.enabled && !hideEditPost && href.trim() !== "";
+---
+
+{
+  showEditPost && (
+    <a
+      href={href}
+      target="_blank"
+      rel="noopener noreferrer"
+      class:list={[
+        "flex justify-baseline gap-1.5 opacity-80 hover:text-accent",
+        className,
+      ]}
+    >
+      <IconEdit class="inline-block" />
+      <span>{SITE.editPost.text}</span>
+    </a>
+  )
+}
diff --git a/src/components/Footer.astro b/src/components/Footer.astro
new file mode 100644
index 0000000..2283c7f
--- /dev/null
+++ b/src/components/Footer.astro
@@ -0,0 +1,32 @@
+---
+import type { HTMLAttributes } from "astro/types";
+import Socials from "./Socials.astro";
+
+const currentYear = new Date().getFullYear();
+
+type Props = {
+  noMarginTop?: boolean;
+} & HTMLAttributes<"footer">;
+
+const { noMarginTop = false, class: className, ...attrs } = Astro.props;
+---
+
+<footer
+  class:list={["app-layout", { "mt-auto": !noMarginTop }, className]}
+  {...attrs}
+>
+  <div
+    class:list={[
+      "py-6 sm:py-4",
+      "border-t border-border",
+      "flex flex-col items-center justify-between sm:flex-row-reverse",
+    ]}
+  >
+    <Socials />
+    <div class="my-2 flex flex-col items-center whitespace-nowrap sm:flex-row">
+      <span>Copyright &#169; {currentYear}</span>
+      <span class="hidden sm:inline">&nbsp;|&nbsp;</span>
+      <span>All rights reserved.</span>
+    </div>
+  </div>
+</footer>
diff --git a/src/components/Header.astro b/src/components/Header.astro
new file mode 100644
index 0000000..5120467
--- /dev/null
+++ b/src/components/Header.astro
@@ -0,0 +1,169 @@
+---
+import IconX from "@/assets/icons/IconX.svg";
+import IconMoon from "@/assets/icons/IconMoon.svg";
+import IconSearch from "@/assets/icons/IconSearch.svg";
+import IconArchive from "@/assets/icons/IconArchive.svg";
+import IconSunHigh from "@/assets/icons/IconSunHigh.svg";
+import IconMenuDeep from "@/assets/icons/IconMenuDeep.svg";
+import LinkButton from "./LinkButton.astro";
+import { SITE } from "@/config";
+
+const { pathname } = Astro.url;
+
+// Remove trailing slash from current pathname if exists
+const currentPath =
+  pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
+
+const isActive = (path: string) => {
+  const currentPathArray = currentPath.split("/").filter(p => p.trim());
+  const pathArray = path.split("/").filter(p => p.trim());
+
+  return currentPath === path || currentPathArray[0] === pathArray[0];
+};
+---
+
+<a
+  id="skip-to-content"
+  href="#main-content"
+  class="absolute start-16 -top-full z-50 bg-background px-3 py-2 text-accent backdrop-blur-lg transition-all focus:top-4"
+>
+  Skip to content
+</a>
+
+<header
+  class="app-layout flex flex-col items-center justify-between sm:flex-row"
+>
+  <div
+    id="top-nav-wrap"
+    class:list={[
+      "py-4 sm:py-6",
+      "border-b border-border",
+      "relative w-full bg-background",
+      "flex items-baseline justify-between sm:items-center",
+    ]}
+  >
+    <a
+      href="/"
+      class="absolute py-1 text-xl leading-8 font-semibold whitespace-nowrap sm:static sm:my-auto sm:text-2xl sm:leading-none"
+    >
+      {SITE.title}
+    </a>
+    <nav
+      id="nav-menu"
+      class="flex w-full flex-col items-center sm:ms-2 sm:flex-row sm:justify-end sm:space-x-4 sm:py-0"
+    >
+      <button
+        id="menu-btn"
+        class="focus-outline self-end p-2 sm:hidden"
+        aria-label="Open Menu"
+        aria-expanded="false"
+        aria-controls="menu-items"
+      >
+        <IconX id="close-icon" class="hidden" />
+        <IconMenuDeep id="menu-icon" />
+      </button>
+      <ul
+        id="menu-items"
+        class:list={[
+          "mt-4 grid w-44 grid-cols-2 place-content-center gap-2",
+          "[&>li>a]:block [&>li>a]:px-4 [&>li>a]:py-3 [&>li>a]:text-center [&>li>a]:font-medium [&>li>a]:hover:text-accent sm:[&>li>a]:px-2 sm:[&>li>a]:py-1",
+          "hidden",
+          "sm:mt-0 sm:flex sm:w-auto sm:gap-x-5 sm:gap-y-0",
+        ]}
+      >
+        <li class="col-span-2">
+          <a href="/posts" class:list={{ "active-nav": isActive("/posts") }}>
+            Posts
+          </a>
+        </li>
+        <li class="col-span-2">
+          <a href="/tags" class:list={{ "active-nav": isActive("/tags") }}>
+            Tags
+          </a>
+        </li>
+        <li class="col-span-2">
+          <a href="/about" class:list={{ "active-nav": isActive("/about") }}>
+            About
+          </a>
+        </li>
+        {
+          SITE.showArchives && (
+            <li class="col-span-2">
+              <LinkButton
+                href="/archives"
+                class:list={[
+                  "focus-outline flex justify-center p-3 sm:p-1",
+                  {
+                    "active-nav [&>svg]:stroke-accent": isActive("/archives"),
+                  },
+                ]}
+                title="Archives"
+                aria-label="archives"
+              >
+                <IconArchive class="hidden sm:inline-block" />
+                <span class="sm:sr-only">Archives</span>
+              </LinkButton>
+            </li>
+          )
+        }
+        <li class="col-span-1 flex items-center justify-center">
+          <LinkButton
+            href="/search"
+            class:list={[
+              "focus-outline flex p-3 sm:p-1",
+              { "[&>svg]:stroke-accent": isActive("/search") },
+            ]}
+            title="Search"
+            aria-label="search"
+          >
+            <IconSearch />
+            <span class="sr-only">Search</span>
+          </LinkButton>
+        </li>
+        {
+          SITE.lightAndDarkMode && (
+            <li class="col-span-1 flex items-center justify-center">
+              <button
+                id="theme-btn"
+                class="focus-outline relative size-12 p-4 sm:size-8 hover:[&>svg]:stroke-accent"
+                title="Toggles light & dark"
+                aria-label="auto"
+                aria-live="polite"
+              >
+                <IconMoon class="absolute top-[50%] left-[50%] -translate-[50%] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
+                <IconSunHigh class="absolute top-[50%] left-[50%] -translate-[50%] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
+              </button>
+            </li>
+          )
+        }
+      </ul>
+    </nav>
+  </div>
+</header>
+
+<script>
+  function toggleNav() {
+    const menuBtn = document.querySelector("#menu-btn");
+    const menuItems = document.querySelector("#menu-items");
+    const menuIcon = document.querySelector("#menu-icon");
+    const closeIcon = document.querySelector("#close-icon");
+
+    if (!menuBtn || !menuItems || !menuIcon || !closeIcon) return;
+
+    menuBtn.addEventListener("click", () => {
+      const openMenu = menuBtn.getAttribute("aria-expanded") === "true";
+
+      menuBtn.setAttribute("aria-expanded", openMenu ? "false" : "true");
+      menuBtn.setAttribute("aria-label", openMenu ? "Open Menu" : "Close Menu");
+
+      menuItems.classList.toggle("hidden");
+      menuIcon.classList.toggle("hidden");
+      closeIcon.classList.toggle("hidden");
+    });
+  }
+
+  toggleNav();
+
+  // Runs on view transitions navigation
+  document.addEventListener("astro:after-swap", toggleNav);
+</script>
diff --git a/src/components/LinkButton.astro b/src/components/LinkButton.astro
new file mode 100644
index 0000000..cfcc113
--- /dev/null
+++ b/src/components/LinkButton.astro
@@ -0,0 +1,21 @@
+---
+import type { HTMLAttributes } from "astro/types";
+
+type Props = { disabled?: boolean } & HTMLAttributes<"a">;
+
+const { disabled, class: className, ...attrs } = Astro.props;
+
+const Button = disabled ? "span" : "a";
+---
+
+<Button
+  aria-disabled={disabled}
+  class:list={[
+    "group inline-flex items-center gap-1",
+    { "hover:text-accent": !disabled },
+    className,
+  ]}
+  {...attrs}
+>
+  <slot />
+</Button>
diff --git a/src/components/Pagination.astro b/src/components/Pagination.astro
new file mode 100644
index 0000000..1f6f367
--- /dev/null
+++ b/src/components/Pagination.astro
@@ -0,0 +1,43 @@
+---
+import type { Page } from "astro";
+import type { CollectionEntry } from "astro:content";
+import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg";
+import IconArrowRight from "@/assets/icons/IconArrowRight.svg";
+import LinkButton from "./LinkButton.astro";
+
+type Props = {
+  page: Page<CollectionEntry<"blog">>;
+};
+
+const { page } = Astro.props;
+---
+
+{
+  page.lastPage > 1 && (
+    <nav
+      class="mt-auto mb-8 flex justify-center"
+      role="navigation"
+      aria-label="Pagination Navigation"
+    >
+      <LinkButton
+        disabled={!page.url.prev}
+        href={page.url.prev as string}
+        class:list={["me-4 select-none", { "opacity-50": !page.url.prev }]}
+        aria-label="Goto Previous Page"
+      >
+        <IconArrowLeft class="inline-block rtl:rotate-180" />
+        Prev
+      </LinkButton>
+      {page.currentPage} / {page.lastPage}
+      <LinkButton
+        disabled={!page.url.next}
+        href={page.url.next as string}
+        class:list={["ms-4 select-none", { "opacity-50": !page.url.next }]}
+        aria-label="Goto Next Page"
+      >
+        Next
+        <IconArrowRight class="inline-block rtl:rotate-180" />
+      </LinkButton>
+    </nav>
+  )
+}
diff --git a/src/components/ShareLinks.astro b/src/components/ShareLinks.astro
new file mode 100644
index 0000000..d65a0de
--- /dev/null
+++ b/src/components/ShareLinks.astro
@@ -0,0 +1,26 @@
+---
+import { SHARE_LINKS } from "@/constants";
+import LinkButton from "./LinkButton.astro";
+
+const URL = Astro.url;
+---
+
+{
+  SHARE_LINKS.length > 0 && (
+    <div class="flex flex-none flex-col items-center justify-center gap-1 md:items-start">
+      <span class="italic">Share this post on:</span>
+      <div class="text-center">
+        {SHARE_LINKS.map(social => (
+          <LinkButton
+            href={`${social.href + URL}`}
+            class="scale-90 p-2 hover:rotate-6 sm:p-1"
+            title={social.linkTitle}
+          >
+            <social.icon class="inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110" />
+            <span class="sr-only">{social.linkTitle}</span>
+          </LinkButton>
+        ))}
+      </div>
+    </div>
+  )
+}
diff --git a/src/components/Socials.astro b/src/components/Socials.astro
new file mode 100644
index 0000000..e05f698
--- /dev/null
+++ b/src/components/Socials.astro
@@ -0,0 +1,19 @@
+---
+import { SOCIALS } from "@/constants";
+import LinkButton from "./LinkButton.astro";
+---
+
+<div class="flex flex-wrap items-center gap-1">
+  {
+    SOCIALS.map(social => (
+      <LinkButton
+        href={social.href}
+        class="p-2 hover:rotate-6 sm:p-1"
+        title={social.linkTitle}
+      >
+        <social.icon class="inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110" />
+        <span class="sr-only">{social.linkTitle}</span>
+      </LinkButton>
+    ))
+  }
+</div>
diff --git a/src/components/Tag.astro b/src/components/Tag.astro
new file mode 100644
index 0000000..aac1816
--- /dev/null
+++ b/src/components/Tag.astro
@@ -0,0 +1,35 @@
+---
+import IconHash from "@/assets/icons/IconHash.svg";
+
+type Props = {
+  tag: string;
+  tagName: string;
+  size?: "sm" | "lg";
+};
+
+const { tag, tagName, size = "lg" } = Astro.props;
+---
+
+<li>
+  <a
+    href={`/tags/${tag}/`}
+    transition:name={tag}
+    class:list={[
+      "flex items-center gap-0.5",
+      "border-b-2 border-dashed border-foreground",
+      "hover:-mt-0.5 hover:border-accent hover:text-accent",
+      "focus-visible:border-none focus-visible:text-accent",
+      { "text-sm": size === "sm" },
+      { "text-lg": size === "lg" },
+    ]}
+  >
+    <IconHash
+      class:list={[
+        "opacity-80",
+        { "size-5": size === "lg" },
+        { "size-4": size === "sm" },
+      ]}
+    />
+    {tagName}
+  </a>
+</li>
diff --git a/src/config.ts b/src/config.ts
new file mode 100644
index 0000000..5e1395e
--- /dev/null
+++ b/src/config.ts
@@ -0,0 +1,23 @@
+export const SITE = {
+  website: "https://cortega26.github.io/tuplatainforma/",
+  author: "Carlos Ortega",
+  profile: "https://github.com/cortega26",
+  desc: "Finanzas personales para chilenos. Guías sobre AFP, APV, impuestos, inversiones y calculadoras prácticas.",
+  title: "Tu Plata Informa",
+  ogImage: "tuplatainforma-og.jpg",
+  lightAndDarkMode: true,
+  postPerIndex: 4,
+  postPerPage: 4,
+  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
+  showArchives: true,
+  showBackButton: true, // show back button in post detail
+  editPost: {
+    enabled: true,
+    text: "Editar página",
+    url: "https://github.com/cortega26/tuplatainforma/edit/main/",
+  },
+  dynamicOgImage: true,
+  dir: "ltr", // "rtl" | "auto"
+  lang: "es", // html lang code. Set this empty and default will be "en"
+  timezone: "America/Santiago", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
+} as const;
diff --git a/src/layouts/AboutLayout.astro b/src/layouts/AboutLayout.astro
new file mode 100644
index 0000000..f9e3665
--- /dev/null
+++ b/src/layouts/AboutLayout.astro
@@ -0,0 +1,24 @@
+---
+import type { MarkdownLayoutProps } from "astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Breadcrumb from "@/components/Breadcrumb.astro";
+import Layout from "./Layout.astro";
+import { SITE } from "@/config";
+
+type Props = MarkdownLayoutProps<{ title: string }>;
+
+const { frontmatter } = Astro.props;
+---
+
+<Layout title={`${frontmatter.title} | ${SITE.title}`}>
+  <Header />
+  <Breadcrumb />
+  <main id="main-content" class="app-layout">
+    <section id="about" class="app-prose mb-28 max-w-app prose-img:border-0">
+      <h1 class="text-2xl tracking-wider sm:text-3xl">{frontmatter.title}</h1>
+      <slot />
+    </section>
+  </main>
+  <Footer />
+</Layout>
diff --git a/src/layouts/Layout.astro b/src/layouts/Layout.astro
new file mode 100644
index 0000000..d0063b5
--- /dev/null
+++ b/src/layouts/Layout.astro
@@ -0,0 +1,176 @@
+---
+import { Font } from "astro:assets";
+import { ClientRouter } from "astro:transitions";
+import { PUBLIC_GOOGLE_SITE_VERIFICATION } from "astro:env/client";
+import { SITE } from "@/config";
+import "@/styles/global.css";
+
+type Props = {
+  title?: string;
+  author?: string;
+  profile?: string;
+  description?: string;
+  ogImage?: string;
+  canonicalURL?: string;
+  pubDatetime?: Date;
+  modDatetime?: Date | null;
+  scrollSmooth?: boolean;
+};
+
+const {
+  title = SITE.title,
+  author = SITE.author,
+  profile = SITE.profile,
+  description = SITE.desc,
+  ogImage = SITE.ogImage ? `/${SITE.ogImage}` : "/og.png",
+  canonicalURL = new URL(Astro.url.pathname, Astro.url),
+  pubDatetime,
+  modDatetime,
+  scrollSmooth = false,
+} = Astro.props;
+
+const socialImageURL = new URL(ogImage, Astro.url);
+
+const structuredData = {
+  "@context": "https://schema.org",
+  "@type": "BlogPosting",
+  headline: `${title}`,
+  image: `${socialImageURL}`,
+  datePublished: `${pubDatetime?.toISOString()}`,
+  ...(modDatetime && { dateModified: modDatetime.toISOString() }),
+  author: [
+    {
+      "@type": "Person",
+      name: `${author}`,
+      ...(profile && { url: profile }),
+    },
+  ],
+};
+---
+
+<!doctype html>
+<html
+  dir={SITE.dir}
+  lang=`${SITE.lang ?? "en"}`
+  class={`${scrollSmooth && "scroll-smooth"}`}
+>
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width" />
+    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
+    <link rel="canonical" href={canonicalURL} />
+    <meta name="generator" content={Astro.generator} />
+
+    <!-- Load Font -->
+    <Font
+      cssVariable="--font-google-sans-code"
+      preload={[{ subset: "latin", weight: 400, style: "normal" }]}
+    />
+
+    <!-- General Meta Tags -->
+    <title>{title}</title>
+    <meta name="title" content={title} />
+    <meta name="description" content={description} />
+    <meta name="author" content={author} />
+    <link rel="sitemap" href="/sitemap-index.xml" />
+
+    <!-- Open Graph / Facebook -->
+    <meta property="og:title" content={title} />
+    <meta property="og:description" content={description} />
+    <meta property="og:url" content={canonicalURL} />
+    <meta property="og:image" content={socialImageURL} />
+
+    <!-- Article Published/Modified time -->
+    {
+      pubDatetime && (
+        <meta
+          property="article:published_time"
+          content={pubDatetime.toISOString()}
+        />
+      )
+    }
+    {
+      modDatetime && (
+        <meta
+          property="article:modified_time"
+          content={modDatetime.toISOString()}
+        />
+      )
+    }
+
+    <!-- Twitter -->
+    <meta property="twitter:card" content="summary_large_image" />
+    <meta property="twitter:url" content={canonicalURL} />
+    <meta property="twitter:title" content={title} />
+    <meta property="twitter:description" content={description} />
+    <meta property="twitter:image" content={socialImageURL} />
+
+    <!-- Google JSON-LD Structured data -->
+    <script
+      type="application/ld+json"
+      is:inline
+      set:html={JSON.stringify(structuredData)}
+    />
+
+    <!-- Enable RSS feed auto-discovery  -->
+    <!-- https://docs.astro.build/en/recipes/rss/#enabling-rss-feed-auto-discovery -->
+    <link
+      rel="alternate"
+      type="application/rss+xml"
+      title={SITE.title}
+      href={new URL("rss.xml", Astro.site)}
+    />
+
+    <meta name="theme-color" content="" />
+
+    {
+      // If PUBLIC_GOOGLE_SITE_VERIFICATION is set in the environment variable,
+      // include google-site-verification tag in the heading
+      // Learn more: https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag
+      PUBLIC_GOOGLE_SITE_VERIFICATION && (
+        <meta
+          name="google-site-verification"
+          content={PUBLIC_GOOGLE_SITE_VERIFICATION}
+        />
+      )
+    }
+
+    <ClientRouter />
+
+    <!-- Minimal inline script to prevent FOUC - sets theme immediately -->
+    <script is:inline>
+      (function () {
+        const initialColorScheme = ""; // "light" | "dark"
+        const currentTheme = localStorage.getItem("theme");
+
+        function getPreferTheme() {
+          if (currentTheme) return currentTheme;
+          if (initialColorScheme) return initialColorScheme;
+          return window.matchMedia("(prefers-color-scheme: dark)").matches
+            ? "dark"
+            : "light";
+        }
+
+        const themeValue = getPreferTheme();
+
+        // Set theme immediately to prevent flash
+        document.firstElementChild?.setAttribute("data-theme", themeValue);
+
+        // Export minimal API for external script
+        window.theme = {
+          themeValue: themeValue,
+          getTheme: () => window.theme.themeValue,
+          setTheme: val => {
+            window.theme.themeValue = val;
+          },
+        };
+      })();
+    </script>
+  </head>
+  <body>
+    <slot />
+
+    <!-- Load full theme logic -->
+    <script src="../scripts/theme.ts"></script>
+  </body>
+</html>
diff --git a/src/layouts/Main.astro b/src/layouts/Main.astro
new file mode 100644
index 0000000..18cdb30
--- /dev/null
+++ b/src/layouts/Main.astro
@@ -0,0 +1,42 @@
+---
+import Breadcrumb from "@/components/Breadcrumb.astro";
+import { SITE } from "@/config";
+
+type StringTitle = { pageTitle: string };
+type ArrayTitle = { pageTitle: [string, string]; titleTransition: string };
+
+type Props = (StringTitle | ArrayTitle) & { pageDesc?: string };
+
+const { props } = Astro;
+
+const backUrl = SITE.showBackButton ? Astro.url.pathname : "/";
+---
+
+<Breadcrumb />
+<main data-backUrl={backUrl} id="main-content" class="app-layout pb-4">
+  {
+    "titleTransition" in props ? (
+      <h1 class="text-2xl font-semibold sm:text-3xl">
+        {props.pageTitle[0]}
+        <span transition:name={props.titleTransition}>
+          {props.pageTitle[1]}
+        </span>
+      </h1>
+    ) : (
+      <h1 class="text-2xl font-semibold sm:text-3xl">{props.pageTitle}</h1>
+    )
+  }
+  <p class="mt-2 mb-6 italic">{props.pageDesc}</p>
+  <slot />
+</main>
+
+<script>
+  document.addEventListener("astro:page-load", () => {
+    const mainContent: HTMLElement | null =
+      document.querySelector("#main-content");
+    const backUrl = mainContent?.dataset?.backurl;
+    if (backUrl) {
+      sessionStorage.setItem("backUrl", backUrl);
+    }
+  });
+</script>
diff --git a/src/layouts/PostDetails.astro b/src/layouts/PostDetails.astro
new file mode 100644
index 0000000..cb21908
--- /dev/null
+++ b/src/layouts/PostDetails.astro
@@ -0,0 +1,285 @@
+---
+import { render, type CollectionEntry } from "astro:content";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Tag from "@/components/Tag.astro";
+import Datetime from "@/components/Datetime.astro";
+import EditPost from "@/components/EditPost.astro";
+import ShareLinks from "@/components/ShareLinks.astro";
+import BackButton from "@/components/BackButton.astro";
+import BackToTopButton from "@/components/BackToTopButton.astro";
+import { getPath } from "@/utils/getPath";
+import { slugifyStr } from "@/utils/slugify";
+import IconChevronLeft from "@/assets/icons/IconChevronLeft.svg";
+import IconChevronRight from "@/assets/icons/IconChevronRight.svg";
+import { SITE } from "@/config";
+
+type Props = {
+  post: CollectionEntry<"blog">;
+  posts: CollectionEntry<"blog">[];
+};
+
+const { post, posts } = Astro.props;
+
+const {
+  title,
+  author,
+  description,
+  ogImage: initOgImage,
+  canonicalURL,
+  pubDatetime,
+  modDatetime,
+  timezone,
+  tags,
+  hideEditPost,
+} = post.data;
+
+const { Content } = await render(post);
+
+let ogImageUrl: string | undefined;
+
+// Determine OG image source
+if (typeof initOgImage === "string") {
+  ogImageUrl = initOgImage; // Remote OG image (absolute URL)
+} else if (initOgImage?.src) {
+  ogImageUrl = initOgImage.src; // Local asset
+}
+
+// Use dynamic OG image if enabled and no remote|local ogImage
+if (!ogImageUrl && SITE.dynamicOgImage) {
+  ogImageUrl = `${getPath(post.id, post.filePath)}/index.png`;
+}
+
+// Resolve OG image URL (or fallback to SITE.ogImage / default `og.png`)
+const ogImage = ogImageUrl
+  ? new URL(ogImageUrl, Astro.url.origin).href
+  : undefined;
+
+const layoutProps = {
+  title: `${title} | ${SITE.title}`,
+  author,
+  description,
+  pubDatetime,
+  modDatetime,
+  canonicalURL,
+  ogImage,
+  scrollSmooth: true,
+};
+
+/* ========== Prev/Next Posts ========== */
+
+const allPosts = posts.map(({ data: { title }, id, filePath }) => ({
+  id,
+  title,
+  filePath,
+}));
+
+const currentPostIndex = allPosts.findIndex(a => a.id === post.id);
+
+const prevPost = currentPostIndex !== 0 ? allPosts[currentPostIndex - 1] : null;
+const nextPost =
+  currentPostIndex !== allPosts.length ? allPosts[currentPostIndex + 1] : null;
+---
+
+<Layout {...layoutProps}>
+  <Header />
+  <BackButton />
+  <main
+    id="main-content"
+    class:list={["app-layout pb-12", { "mt-8": !SITE.showBackButton }]}
+    data-pagefind-body
+  >
+    <h1
+      transition:name={slugifyStr(title.replaceAll(".", "-"))}
+      class="inline-block text-2xl font-bold text-accent sm:text-3xl"
+    >
+      {title}
+    </h1>
+    <div class="my-2 flex items-center gap-2">
+      <Datetime {pubDatetime} {modDatetime} {timezone} size="lg" />
+      <span
+        aria-hidden="true"
+        class:list={[
+          "max-sm:hidden",
+          { hidden: !SITE.editPost.enabled || hideEditPost },
+        ]}>|</span
+      >
+      <EditPost {hideEditPost} {post} class="max-sm:hidden" />
+    </div>
+    <article
+      id="article"
+      class="app-prose mt-8 w-full max-w-app prose-pre:bg-(--shiki-light-bg) dark:prose-pre:bg-(--shiki-dark-bg)"
+    >
+      <Content />
+    </article>
+
+    <hr class="my-8 border-dashed" />
+
+    <EditPost class="sm:hidden" {hideEditPost} {post} />
+
+    <ul class="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">
+      {tags.map(tag => <Tag tag={slugifyStr(tag)} tagName={tag} size="sm" />)}
+    </ul>
+
+    <BackToTopButton />
+
+    <ShareLinks />
+
+    <hr class="my-6 border-dashed" />
+
+    <!-- Previous/Next Post Buttons -->
+    <div data-pagefind-ignore class="grid grid-cols-1 gap-6 sm:grid-cols-2">
+      {
+        prevPost && (
+          <a
+            href={getPath(prevPost.id, prevPost.filePath)}
+            class="flex w-full gap-1 hover:opacity-75"
+          >
+            <IconChevronLeft class="inline-block flex-none rtl:rotate-180" />
+            <div>
+              <span>Previous Post</span>
+              <div class="text-sm text-accent/85">{prevPost.title}</div>
+            </div>
+          </a>
+        )
+      }
+      {
+        nextPost && (
+          <a
+            href={getPath(nextPost.id, nextPost.filePath)}
+            class="flex w-full justify-end gap-1 text-end hover:opacity-75 sm:col-start-2"
+          >
+            <div>
+              <span>Next Post</span>
+              <div class="text-sm text-accent/85">{nextPost.title}</div>
+            </div>
+            <IconChevronRight class="inline-block flex-none rtl:rotate-180" />
+          </a>
+        )
+      }
+    </div>
+  </main>
+  <Footer />
+</Layout>
+
+<script is:inline data-astro-rerun>
+  /** Create a progress indicator
+   *  at the top */
+  function createProgressBar() {
+    // Create the main container div
+    const progressContainer = document.createElement("div");
+    progressContainer.className =
+      "progress-container fixed top-0 z-10 h-1 w-full bg-background";
+
+    // Create the progress bar div
+    const progressBar = document.createElement("div");
+    progressBar.className = "progress-bar h-1 w-0 bg-accent";
+    progressBar.id = "myBar";
+
+    // Append the progress bar to the progress container
+    progressContainer.appendChild(progressBar);
+
+    // Append the progress container to the document body or any other desired parent element
+    document.body.appendChild(progressContainer);
+  }
+  createProgressBar();
+
+  /** Update the progress bar
+   *  when user scrolls */
+  function updateScrollProgress() {
+    document.addEventListener("scroll", () => {
+      const winScroll =
+        document.body.scrollTop || document.documentElement.scrollTop;
+      const height =
+        document.documentElement.scrollHeight -
+        document.documentElement.clientHeight;
+      const scrolled = (winScroll / height) * 100;
+      if (document) {
+        const myBar = document.getElementById("myBar");
+        if (myBar) {
+          myBar.style.width = scrolled + "%";
+        }
+      }
+    });
+  }
+  updateScrollProgress();
+
+  /** Attaches links to headings in the document,
+   *  allowing sharing of sections easily */
+  function addHeadingLinks() {
+    const headings = Array.from(
+      document.querySelectorAll("h2, h3, h4, h5, h6")
+    );
+    for (const heading of headings) {
+      heading.classList.add("group");
+      const link = document.createElement("a");
+      link.className =
+        "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
+      link.href = "#" + heading.id;
+
+      const span = document.createElement("span");
+      span.ariaHidden = "true";
+      span.innerText = "#";
+      link.appendChild(span);
+      heading.appendChild(link);
+    }
+  }
+  addHeadingLinks();
+
+  /** Attaches copy buttons to code blocks in the document,
+   * allowing users to copy code easily. */
+  function attachCopyButtons() {
+    const copyButtonLabel = "Copy";
+    const codeBlocks = Array.from(document.querySelectorAll("pre"));
+
+    for (const codeBlock of codeBlocks) {
+      const wrapper = document.createElement("div");
+      wrapper.style.position = "relative";
+
+      // Check if --file-name-offset custom property exists
+      const computedStyle = getComputedStyle(codeBlock);
+      const hasFileNameOffset =
+        computedStyle.getPropertyValue("--file-name-offset").trim() !== "";
+
+      // Determine the top positioning class
+      const topClass = hasFileNameOffset
+        ? "top-(--file-name-offset)"
+        : "-top-3";
+
+      const copyButton = document.createElement("button");
+      copyButton.className = `copy-code absolute end-3 ${topClass} rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium`;
+      copyButton.innerHTML = copyButtonLabel;
+      codeBlock.setAttribute("tabindex", "0");
+      codeBlock.appendChild(copyButton);
+
+      // wrap codebock with relative parent element
+      codeBlock?.parentNode?.insertBefore(wrapper, codeBlock);
+      wrapper.appendChild(codeBlock);
+
+      copyButton.addEventListener("click", async () => {
+        await copyCode(codeBlock, copyButton);
+      });
+    }
+
+    async function copyCode(block, button) {
+      const code = block.querySelector("code");
+      const text = code?.innerText;
+
+      await navigator.clipboard.writeText(text ?? "");
+
+      // visual feedback that task is completed
+      button.innerText = "Copied";
+
+      setTimeout(() => {
+        button.innerText = copyButtonLabel;
+      }, 700);
+    }
+  }
+  attachCopyButtons();
+
+  /* Go to page start after page swap */
+  document.addEventListener("astro:after-swap", () =>
+    window.scrollTo({ left: 0, top: 0, behavior: "instant" })
+  );
+</script>
diff --git a/src/pages/404.astro b/src/pages/404.astro
new file mode 100644
index 0000000..b1ee585
--- /dev/null
+++ b/src/pages/404.astro
@@ -0,0 +1,30 @@
+---
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import LinkButton from "@/components/LinkButton.astro";
+import { SITE } from "@/config";
+---
+
+<Layout title={`404 Not Found | ${SITE.title}`}>
+  <Header />
+
+  <main
+    id="main-content"
+    class="app-layout flex flex-1 items-center justify-center"
+  >
+    <div class="mb-14 flex flex-col items-center justify-center">
+      <h1 class="text-9xl font-bold text-accent">404</h1>
+      <span aria-hidden="true">¯\_(ツ)_/¯</span>
+      <p class="mt-4 text-2xl sm:text-3xl">Page Not Found</p>
+      <LinkButton
+        href="/"
+        class="my-6 text-lg underline decoration-dashed underline-offset-8"
+      >
+        Go back home
+      </LinkButton>
+    </div>
+  </main>
+
+  <Footer />
+</Layout>
diff --git a/src/pages/about.md b/src/pages/about.md
new file mode 100644
index 0000000..fb3f03c
--- /dev/null
+++ b/src/pages/about.md
@@ -0,0 +1,37 @@
+---
+layout: ../layouts/AboutLayout.astro
+title: "About"
+---
+
+AstroPaper is a minimal, accessible and SEO-friendly blog theme built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).
+
+![Astro Paper](public/astropaper-og.jpg)
+
+AstroPaper provides a solid foundation for blogs, or even portfolios\_ with full markdown support, built-in dark mode, and a clean layout that works out-of-the-box.
+
+The blog posts in this theme also serve as guides, docs or example articles\_ making AstroPaper a flexible starting point for your next content-driven site.
+
+## Features
+
+AstroPaper comes with a set of useful features that make content publishing easy and effective:
+
+- SEO-friendly
+- Fast performance
+- Light & dark mode
+- Highly customizable
+- Organizable blog posts
+- Responsive & accessible
+- Static search with [PageFind](https://pagefind.app/)
+- Automatic social image generation
+
+and so much more.
+
+## Show your support
+
+If you like [AstroPaper](https://github.com/satnaing/astro-paper), consider giving it a star ⭐️.
+
+Found a bug 🐛 or have an improvement ✨ in mind? Feel free to open an [issue](https://github.com/satnaing/astro-paper/issues), submit a [pull request](https://github.com/satnaing/astro-paper/pulls) or start a [discussion](https://github.com/satnaing/astro-paper/discussions).
+
+If you find this theme helpful, you can also [sponsor me on GitHub](https://github.com/sponsors/satnaing) or [buy me a coffee](https://buymeacoffee.com/satnaing) to show your support — every penny counts.
+
+Kyay zuu! 🙏🏼
diff --git a/src/pages/archives/index.astro b/src/pages/archives/index.astro
new file mode 100644
index 0000000..030d671
--- /dev/null
+++ b/src/pages/archives/index.astro
@@ -0,0 +1,83 @@
+---
+import { getCollection } from "astro:content";
+import Main from "@/layouts/Main.astro";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Card from "@/components/Card.astro";
+import getPostsByGroupCondition from "@/utils/getPostsByGroupCondition";
+import { SITE } from "@/config";
+
+// Redirect to 404 page if `showArchives` config is false
+if (!SITE.showArchives) {
+  return Astro.redirect("/404");
+}
+
+const posts = await getCollection("blog", ({ data }) => !data.draft);
+
+const months = [
+  "January",
+  "February",
+  "March",
+  "April",
+  "May",
+  "June",
+  "July",
+  "August",
+  "September",
+  "October",
+  "November",
+  "December",
+];
+---
+
+<Layout title={`Archives | ${SITE.title}`}>
+  <Header />
+  <Main pageTitle="Archives" pageDesc="All the articles I've archived.">
+    {
+      Object.entries(
+        getPostsByGroupCondition(posts, post =>
+          post.data.pubDatetime.getFullYear()
+        )
+      )
+        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
+        .map(([year, yearGroup]) => (
+          <div>
+            <span class="text-2xl font-bold">{year}</span>
+            <sup class="text-sm">{yearGroup.length}</sup>
+            {Object.entries(
+              getPostsByGroupCondition(
+                yearGroup,
+                post => post.data.pubDatetime.getMonth() + 1
+              )
+            )
+              .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA))
+              .map(([month, monthGroup]) => (
+                <div class="flex flex-col sm:flex-row">
+                  <div class="mt-6 min-w-36 text-lg sm:my-6">
+                    <span class="font-bold">{months[Number(month) - 1]}</span>
+                    <sup class="text-xs">{monthGroup.length}</sup>
+                  </div>
+                  <ul>
+                    {monthGroup
+                      .sort(
+                        (a, b) =>
+                          Math.floor(
+                            new Date(b.data.pubDatetime).getTime() / 1000
+                          ) -
+                          Math.floor(
+                            new Date(a.data.pubDatetime).getTime() / 1000
+                          )
+                      )
+                      .map(data => (
+                        <Card {...data} />
+                      ))}
+                  </ul>
+                </div>
+              ))}
+          </div>
+        ))
+    }
+  </Main>
+  <Footer />
+</Layout>
diff --git a/src/pages/index.astro b/src/pages/index.astro
index 561196b..e709158 100644
--- a/src/pages/index.astro
+++ b/src/pages/index.astro
@@ -1,17 +1,121 @@
 ---
+import { getCollection } from "astro:content";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Socials from "@/components/Socials.astro";
+import LinkButton from "@/components/LinkButton.astro";
+import Card from "@/components/Card.astro";
+import getSortedPosts from "@/utils/getSortedPosts";
+import IconRss from "@/assets/icons/IconRss.svg";
+import IconArrowRight from "@/assets/icons/IconArrowRight.svg";
+import { SITE } from "@/config";
+import { SOCIALS } from "@/constants";
 
+const posts = await getCollection("blog");
+
+const sortedPosts = getSortedPosts(posts);
+const featuredPosts = sortedPosts.filter(({ data }) => data.featured);
+const recentPosts = sortedPosts.filter(({ data }) => !data.featured);
 ---
 
-<html lang="en">
-	<head>
-		<meta charset="utf-8" />
-		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-		<link rel="icon" href="/favicon.ico" />
-		<meta name="viewport" content="width=device-width" />
-		<meta name="generator" content={Astro.generator} />
-		<title>Astro</title>
-	</head>
-	<body>
-		<h1>Astro</h1>
-	</body>
-</html>
+<Layout>
+  <Header />
+  <main id="main-content" data-layout="index" class="app-layout">
+    <section id="hero" class:list={["pt-8 pb-6", "border-b border-border"]}>
+      <h1 class="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
+        Tu Plata Informa
+      </h1>
+      <a
+        target="_blank"
+        href="/rss.xml"
+        class="inline-block"
+        aria-label="rss feed"
+        title="RSS Feed"
+      >
+        <IconRss
+          width={20}
+          height={20}
+          class="scale-125 stroke-accent stroke-3 rtl:-rotate-90"
+        />
+        <span class="sr-only">RSS Feed</span>
+      </a>
+
+      <p>
+        AstroPaper is a minimal, responsive, accessible and SEO-friendly Astro
+        blog theme. This theme follows best practices and provides accessibility
+        out of the box. Light and dark mode are supported by default. Moreover,
+        additional color schemes can also be configured.
+      </p>
+      <p class="mt-2">
+        Read the blog posts or check
+        <LinkButton
+          class="underline decoration-dashed underline-offset-4 hover:text-accent"
+          href="https://github.com/satnaing/astro-paper#readme"
+        >
+          README
+        </LinkButton> for more info.
+      </p>
+      {
+        // only display if at least one social link is enabled
+        SOCIALS.length > 0 && (
+          <div class="mt-4 flex max-sm:flex-col sm:items-center">
+            <div class="me-2 mb-1 whitespace-nowrap sm:mb-0">Social Links:</div>
+            <Socials />
+          </div>
+        )
+      }
+    </section>
+
+    {
+      featuredPosts.length > 0 && (
+        <section
+          id="featured"
+          class:list={[
+            "pt-12 pb-6",
+            { "border-b border-border": recentPosts.length > 0 },
+          ]}
+        >
+          <h2 class="text-2xl font-semibold tracking-wide">Featured</h2>
+          <ul>
+            {featuredPosts.map(data => (
+              <Card variant="h3" {...data} />
+            ))}
+          </ul>
+        </section>
+      )
+    }
+
+    {
+      recentPosts.length > 0 && (
+        <section id="recent-posts" class="pt-12 pb-6">
+          <h2 class="text-2xl font-semibold tracking-wide">Recent Posts</h2>
+          <ul>
+            {recentPosts.map(
+              (data, index) =>
+                index < SITE.postPerIndex && <Card variant="h3" {...data} />
+            )}
+          </ul>
+        </section>
+      )
+    }
+
+    <div class="my-8 text-center">
+      <LinkButton href="/posts/">
+        All Posts
+        <IconArrowRight class="inline-block rtl:-rotate-180" />
+      </LinkButton>
+    </div>
+  </main>
+  <Footer />
+</Layout>
+
+<script>
+  document.addEventListener("astro:page-load", () => {
+    const indexLayout = (document.querySelector("#main-content") as HTMLElement)
+      ?.dataset?.layout;
+    if (indexLayout) {
+      sessionStorage.setItem("backUrl", "/");
+    }
+  });
+</script>
diff --git a/src/pages/og.png.ts b/src/pages/og.png.ts
new file mode 100644
index 0000000..f5e1c2c
--- /dev/null
+++ b/src/pages/og.png.ts
@@ -0,0 +1,9 @@
+import type { APIRoute } from "astro";
+import { generateOgImageForSite } from "@/utils/generateOgImages";
+
+export const GET: APIRoute = async () => {
+  const buffer = await generateOgImageForSite();
+  return new Response(new Uint8Array(buffer), {
+    headers: { "Content-Type": "image/png" },
+  });
+};
diff --git a/src/pages/posts/[...page].astro b/src/pages/posts/[...page].astro
new file mode 100644
index 0000000..2c554aa
--- /dev/null
+++ b/src/pages/posts/[...page].astro
@@ -0,0 +1,32 @@
+---
+import type { GetStaticPaths } from "astro";
+import { getCollection } from "astro:content";
+import Main from "@/layouts/Main.astro";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Card from "@/components/Card.astro";
+import Pagination from "@/components/Pagination.astro";
+import getSortedPosts from "@/utils/getSortedPosts";
+import { SITE } from "@/config";
+
+export const getStaticPaths = (async ({ paginate }) => {
+  const posts = await getCollection("blog", ({ data }) => !data.draft);
+  return paginate(getSortedPosts(posts), { pageSize: SITE.postPerPage });
+}) satisfies GetStaticPaths;
+
+const { page } = Astro.props;
+---
+
+<Layout title={`Posts | ${SITE.title}`}>
+  <Header />
+  <Main pageTitle="Posts" pageDesc="All the articles I've posted.">
+    <ul>
+      {page.data.map(data => <Card {...data} />)}
+    </ul>
+  </Main>
+
+  <Pagination {page} />
+
+  <Footer noMarginTop={page.lastPage > 1} />
+</Layout>
diff --git a/src/pages/posts/[...slug]/index.astro b/src/pages/posts/[...slug]/index.astro
new file mode 100644
index 0000000..cb3b666
--- /dev/null
+++ b/src/pages/posts/[...slug]/index.astro
@@ -0,0 +1,27 @@
+---
+import { type CollectionEntry, getCollection } from "astro:content";
+import PostDetails from "@/layouts/PostDetails.astro";
+import getSortedPosts from "@/utils/getSortedPosts";
+import { getPath } from "@/utils/getPath";
+
+type Props = {
+  post: CollectionEntry<"blog">;
+};
+
+export async function getStaticPaths() {
+  const posts = await getCollection("blog", ({ data }) => !data.draft);
+  const postResult = posts.map(post => ({
+    params: { slug: getPath(post.id, post.filePath, false) },
+    props: { post },
+  }));
+
+  return postResult;
+}
+
+const { post } = Astro.props;
+
+const posts = await getCollection("blog");
+const sortedPosts = getSortedPosts(posts);
+---
+
+<PostDetails post={post} posts={sortedPosts} />
diff --git a/src/pages/posts/[...slug]/index.png.ts b/src/pages/posts/[...slug]/index.png.ts
new file mode 100644
index 0000000..48fab2f
--- /dev/null
+++ b/src/pages/posts/[...slug]/index.png.ts
@@ -0,0 +1,34 @@
+import type { APIRoute } from "astro";
+import { getCollection, type CollectionEntry } from "astro:content";
+import { getPath } from "@/utils/getPath";
+import { generateOgImageForPost } from "@/utils/generateOgImages";
+import { SITE } from "@/config";
+
+export async function getStaticPaths() {
+  if (!SITE.dynamicOgImage) {
+    return [];
+  }
+
+  const posts = await getCollection("blog").then(p =>
+    p.filter(({ data }) => !data.draft && !data.ogImage)
+  );
+
+  return posts.map(post => ({
+    params: { slug: getPath(post.id, post.filePath, false) },
+    props: post,
+  }));
+}
+
+export const GET: APIRoute = async ({ props }) => {
+  if (!SITE.dynamicOgImage) {
+    return new Response(null, {
+      status: 404,
+      statusText: "Not found",
+    });
+  }
+
+  const buffer = await generateOgImageForPost(props as CollectionEntry<"blog">);
+  return new Response(new Uint8Array(buffer), {
+    headers: { "Content-Type": "image/png" },
+  });
+};
diff --git a/src/pages/robots.txt.ts b/src/pages/robots.txt.ts
new file mode 100644
index 0000000..4edef8b
--- /dev/null
+++ b/src/pages/robots.txt.ts
@@ -0,0 +1,13 @@
+import type { APIRoute } from "astro";
+
+const getRobotsTxt = (sitemapURL: URL) => `
+User-agent: *
+Allow: /
+
+Sitemap: ${sitemapURL.href}
+`;
+
+export const GET: APIRoute = ({ site }) => {
+  const sitemapURL = new URL("sitemap-index.xml", site);
+  return new Response(getRobotsTxt(sitemapURL));
+};
diff --git a/src/pages/rss.xml.ts b/src/pages/rss.xml.ts
new file mode 100644
index 0000000..642e4f2
--- /dev/null
+++ b/src/pages/rss.xml.ts
@@ -0,0 +1,21 @@
+import rss from "@astrojs/rss";
+import { getCollection } from "astro:content";
+import { getPath } from "@/utils/getPath";
+import getSortedPosts from "@/utils/getSortedPosts";
+import { SITE } from "@/config";
+
+export async function GET() {
+  const posts = await getCollection("blog");
+  const sortedPosts = getSortedPosts(posts);
+  return rss({
+    title: SITE.title,
+    description: SITE.desc,
+    site: SITE.website,
+    items: sortedPosts.map(({ data, id, filePath }) => ({
+      link: getPath(id, filePath),
+      title: data.title,
+      description: data.description,
+      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
+    })),
+  });
+}
diff --git a/src/pages/search.astro b/src/pages/search.astro
new file mode 100644
index 0000000..2b9b468
--- /dev/null
+++ b/src/pages/search.astro
@@ -0,0 +1,141 @@
+---
+import "@pagefind/default-ui/css/ui.css";
+import Main from "@/layouts/Main.astro";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import { SITE } from "@/config";
+
+const backUrl = SITE.showBackButton ? `${Astro.url.pathname}` : "/";
+---
+
+<Layout title={`Search | ${SITE.title}`}>
+  <Header />
+  <Main pageTitle="Search" pageDesc="Search any article ...">
+    <div id="pagefind-search" transition:persist data-backurl={backUrl}></div>
+  </Main>
+  <Footer />
+</Layout>
+
+<script>
+  function initSearch() {
+    const pageFindSearch: HTMLElement | null =
+      document.querySelector("#pagefind-search");
+
+    if (!pageFindSearch) return;
+
+    const params = new URLSearchParams(window.location.search);
+
+    const onIdle = window.requestIdleCallback || (cb => setTimeout(cb, 1));
+
+    onIdle(async () => {
+      // @ts-expect-error — Missing types for @pagefind/default-ui package.
+      const { PagefindUI } = await import("@pagefind/default-ui");
+
+      // Display warning inn dev mode
+      if (import.meta.env.DEV) {
+        pageFindSearch.innerHTML = `
+            <div class="bg-muted/75 rounded p-4 space-y-4 mb-4">
+              <p><strong>DEV mode Warning! </strong>You need to build the project at least once to see the search results during development.</p>
+              <code class="block bg-black text-white px-2 py-1 rounded">pnpm run build</code>
+            </div>
+          `;
+      }
+
+      // Init pagefind ui
+      const search = new PagefindUI({
+        element: "#pagefind-search",
+        showImages: false,
+        showSubResults: true,
+        processTerm: function (term: string) {
+          params.set("q", term); // Update the `q` parameter in the URL
+          history.replaceState(history.state, "", "?" + params.toString()); // Push the new URL without reloading
+
+          const backUrl = pageFindSearch?.dataset?.backurl;
+          sessionStorage.setItem("backUrl", backUrl + "?" + params.toString());
+
+          return term;
+        },
+      });
+
+      // If search param exists (eg: search?q=astro), trigger search
+      const query = params.get("q");
+      if (query) {
+        search.triggerSearch(query);
+      }
+
+      // Reset search param if search input is cleared
+      const searchInput = document.querySelector(".pagefind-ui__search-input");
+      const clearButton = document.querySelector(".pagefind-ui__search-clear");
+      searchInput?.addEventListener("input", resetSearchParam);
+      clearButton?.addEventListener("click", resetSearchParam);
+
+      function resetSearchParam(e: Event) {
+        if ((e.target as HTMLInputElement)?.value.trim() === "") {
+          history.replaceState(history.state, "", window.location.pathname);
+        }
+      }
+    });
+  }
+
+  document.addEventListener("astro:after-swap", () => {
+    const pagefindSearch = document.querySelector("#pagefind-search");
+
+    // if pagefind search form already exists, don't initialize search component
+    if (pagefindSearch && pagefindSearch.querySelector("form")) return;
+
+    initSearch();
+  });
+  initSearch();
+</script>
+
+<style is:global>
+  #pagefind-search {
+    --pagefind-ui-font: var(--font-app);
+    --pagefind-ui-text: var(--foreground);
+    --pagefind-ui-background: var(--background);
+    --pagefind-ui-border: var(--border);
+    --pagefind-ui-primary: var(--accent);
+    --pagefind-ui-tag: var(--background);
+    --pagefind-ui-border-radius: 0.375rem;
+    --pagefind-ui-border-width: 1px;
+    --pagefind-ui-image-border-radius: 8px;
+    --pagefind-ui-image-box-ratio: 3 / 2;
+
+    form::before {
+      background-color: var(--foreground);
+    }
+
+    input {
+      font-weight: 400;
+      border: 1px solid var(--border);
+    }
+
+    input:focus-visible {
+      outline: 1px solid var(--accent);
+    }
+
+    .pagefind-ui__result-title a {
+      color: var(--accent);
+      outline-offset: 1px;
+      outline-color: var(--accent);
+      text-decoration-style: dashed;
+      text-underline-offset: 4px;
+    }
+
+    .pagefind-ui__result-title a:focus-visible,
+    .pagefind-ui__search-clear:focus-visible {
+      text-decoration-line: none;
+      outline-width: 2px;
+      outline-style: dashed;
+    }
+
+    .pagefind-ui__result:last-of-type {
+      border-bottom: 0;
+    }
+
+    .pagefind-ui__result-nested .pagefind-ui__result-link:before {
+      font-family: system-ui;
+    }
+  }
+</style>
diff --git a/src/pages/tags/[tag]/[...page].astro b/src/pages/tags/[tag]/[...page].astro
new file mode 100644
index 0000000..cb9dec2
--- /dev/null
+++ b/src/pages/tags/[tag]/[...page].astro
@@ -0,0 +1,50 @@
+---
+import { getCollection } from "astro:content";
+import type { GetStaticPathsOptions } from "astro";
+import Main from "@/layouts/Main.astro";
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import Card from "@/components/Card.astro";
+import Pagination from "@/components/Pagination.astro";
+import getUniqueTags from "@/utils/getUniqueTags";
+import getPostsByTag from "@/utils/getPostsByTag";
+import { SITE } from "@/config";
+
+export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
+  const posts = await getCollection("blog");
+  const tags = getUniqueTags(posts);
+
+  return tags.flatMap(({ tag, tagName }) => {
+    const tagPosts = getPostsByTag(posts, tag);
+
+    return paginate(tagPosts, {
+      params: { tag },
+      props: { tagName },
+      pageSize: SITE.postPerPage,
+    });
+  });
+}
+
+const params = Astro.params;
+const { tag } = params;
+const { page, tagName } = Astro.props;
+---
+
+<Layout title={`Tag: ${tagName} | ${SITE.title}`}>
+  <Header />
+  <Main
+    pageTitle={[`Tag:`, `${tagName}`]}
+    titleTransition={tag}
+    pageDesc={`All the articles with the tag "${tagName}".`}
+  >
+    <h1 slot="title" transition:name={tag}>{`Tag:${tag}`}</h1>
+    <ul>
+      {page.data.map(data => <Card {...data} />)}
+    </ul>
+  </Main>
+
+  <Pagination {page} />
+
+  <Footer noMarginTop={page.lastPage > 1} />
+</Layout>
diff --git a/src/pages/tags/index.astro b/src/pages/tags/index.astro
new file mode 100644
index 0000000..2b0968e
--- /dev/null
+++ b/src/pages/tags/index.astro
@@ -0,0 +1,24 @@
+---
+import { getCollection } from "astro:content";
+import Main from "@/layouts/Main.astro";
+import Layout from "@/layouts/Layout.astro";
+import Tag from "@/components/Tag.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+import getUniqueTags from "@/utils/getUniqueTags";
+import { SITE } from "@/config";
+
+const posts = await getCollection("blog");
+
+let tags = getUniqueTags(posts);
+---
+
+<Layout title={`Tags | ${SITE.title}`}>
+  <Header />
+  <Main pageTitle="Tags" pageDesc="All the tags used in posts.">
+    <ul class="flex flex-wrap gap-6">
+      {tags.map(({ tag, tagName }) => <Tag {tag} {tagName} />)}
+    </ul>
+  </Main>
+  <Footer />
+</Layout>
diff --git a/src/utils/generateOgImages.ts b/src/utils/generateOgImages.ts
new file mode 100644
index 0000000..7694718
--- /dev/null
+++ b/src/utils/generateOgImages.ts
@@ -0,0 +1,20 @@
+import { Resvg } from "@resvg/resvg-js";
+import { type CollectionEntry } from "astro:content";
+import postOgImage from "./og-templates/post";
+import siteOgImage from "./og-templates/site";
+
+function svgBufferToPngBuffer(svg: string) {
+  const resvg = new Resvg(svg);
+  const pngData = resvg.render();
+  return pngData.asPng();
+}
+
+export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
+  const svg = await postOgImage(post);
+  return svgBufferToPngBuffer(svg);
+}
+
+export async function generateOgImageForSite() {
+  const svg = await siteOgImage();
+  return svgBufferToPngBuffer(svg);
+}
diff --git a/src/utils/getPath.ts b/src/utils/getPath.ts
new file mode 100644
index 0000000..057b612
--- /dev/null
+++ b/src/utils/getPath.ts
@@ -0,0 +1,36 @@
+import { BLOG_PATH } from "@/content.config";
+import { slugifyStr } from "./slugify";
+
+/**
+ * Get full path of a blog post
+ * @param id - id of the blog post (aka slug)
+ * @param filePath - the blog post full file location
+ * @param includeBase - whether to include `/posts` in return value
+ * @returns blog post path
+ */
+export function getPath(
+  id: string,
+  filePath: string | undefined,
+  includeBase = true
+) {
+  const pathSegments = filePath
+    ?.replace(BLOG_PATH, "")
+    .split("/")
+    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
+    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
+    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
+    .map(segment => slugifyStr(segment)); // slugify each segment path
+
+  const basePath = includeBase ? "/posts" : "";
+
+  // Making sure `id` does not contain the directory
+  const blogId = id.split("/");
+  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;
+
+  // If not inside the sub-dir, simply return the file path
+  if (!pathSegments || pathSegments.length < 1) {
+    return [basePath, slug].join("/");
+  }
+
+  return [basePath, ...pathSegments, slug].join("/");
+}
diff --git a/src/utils/getPostsByGroupCondition.ts b/src/utils/getPostsByGroupCondition.ts
new file mode 100644
index 0000000..92e89f5
--- /dev/null
+++ b/src/utils/getPostsByGroupCondition.ts
@@ -0,0 +1,25 @@
+import type { CollectionEntry } from "astro:content";
+
+type GroupKey = string | number | symbol;
+
+interface GroupFunction<T> {
+  (item: T, index?: number): GroupKey;
+}
+
+const getPostsByGroupCondition = (
+  posts: CollectionEntry<"blog">[],
+  groupFunction: GroupFunction<CollectionEntry<"blog">>
+) => {
+  const result: Record<GroupKey, CollectionEntry<"blog">[]> = {};
+  for (let i = 0; i < posts.length; i++) {
+    const item = posts[i];
+    const groupKey = groupFunction(item, i);
+    if (!result[groupKey]) {
+      result[groupKey] = [];
+    }
+    result[groupKey].push(item);
+  }
+  return result;
+};
+
+export default getPostsByGroupCondition;
diff --git a/src/utils/getPostsByTag.ts b/src/utils/getPostsByTag.ts
new file mode 100644
index 0000000..8616170
--- /dev/null
+++ b/src/utils/getPostsByTag.ts
@@ -0,0 +1,10 @@
+import type { CollectionEntry } from "astro:content";
+import getSortedPosts from "./getSortedPosts";
+import { slugifyAll } from "./slugify";
+
+const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
+  getSortedPosts(
+    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
+  );
+
+export default getPostsByTag;
diff --git a/src/utils/getSortedPosts.ts b/src/utils/getSortedPosts.ts
new file mode 100644
index 0000000..8fa5266
--- /dev/null
+++ b/src/utils/getSortedPosts.ts
@@ -0,0 +1,18 @@
+import type { CollectionEntry } from "astro:content";
+import postFilter from "./postFilter";
+
+const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
+  return posts
+    .filter(postFilter)
+    .sort(
+      (a, b) =>
+        Math.floor(
+          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
+        ) -
+        Math.floor(
+          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
+        )
+    );
+};
+
+export default getSortedPosts;
diff --git a/src/utils/getUniqueTags.ts b/src/utils/getUniqueTags.ts
new file mode 100644
index 0000000..548c973
--- /dev/null
+++ b/src/utils/getUniqueTags.ts
@@ -0,0 +1,23 @@
+import type { CollectionEntry } from "astro:content";
+import { slugifyStr } from "./slugify";
+import postFilter from "./postFilter";
+
+interface Tag {
+  tag: string;
+  tagName: string;
+}
+
+const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
+  const tags: Tag[] = posts
+    .filter(postFilter)
+    .flatMap(post => post.data.tags)
+    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
+    .filter(
+      (value, index, self) =>
+        self.findIndex(tag => tag.tag === value.tag) === index
+    )
+    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
+  return tags;
+};
+
+export default getUniqueTags;
diff --git a/src/utils/loadGoogleFont.ts b/src/utils/loadGoogleFont.ts
new file mode 100644
index 0000000..f32ac2e
--- /dev/null
+++ b/src/utils/loadGoogleFont.ts
@@ -0,0 +1,62 @@
+async function loadGoogleFont(
+  font: string,
+  text: string,
+  weight: number
+): Promise<ArrayBuffer> {
+  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;
+
+  const css = await (
+    await fetch(API, {
+      headers: {
+        "User-Agent":
+          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
+      },
+    })
+  ).text();
+
+  const resource = css.match(
+    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
+  );
+
+  if (!resource) throw new Error("Failed to download dynamic font");
+
+  const res = await fetch(resource[1]);
+
+  if (!res.ok) {
+    throw new Error("Failed to download dynamic font. Status: " + res.status);
+  }
+
+  return res.arrayBuffer();
+}
+
+async function loadGoogleFonts(
+  text: string
+): Promise<
+  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
+> {
+  const fontsConfig = [
+    {
+      name: "IBM Plex Mono",
+      font: "IBM+Plex+Mono",
+      weight: 400,
+      style: "normal",
+    },
+    {
+      name: "IBM Plex Mono",
+      font: "IBM+Plex+Mono",
+      weight: 700,
+      style: "bold",
+    },
+  ];
+
+  const fonts = await Promise.all(
+    fontsConfig.map(async ({ name, font, weight, style }) => {
+      const data = await loadGoogleFont(font, text, weight);
+      return { name, data, weight, style };
+    })
+  );
+
+  return fonts;
+}
+
+export default loadGoogleFonts;
diff --git a/src/utils/og-templates/post.js b/src/utils/og-templates/post.js
new file mode 100644
index 0000000..3062308
--- /dev/null
+++ b/src/utils/og-templates/post.js
@@ -0,0 +1,229 @@
+import satori from "satori";
+// import { html } from "satori-html";
+import { SITE } from "@/config";
+import loadGoogleFonts from "../loadGoogleFont";
+
+// const markup = html`<div
+//       style={{
+//         background: "#fefbfb",
+//         width: "100%",
+//         height: "100%",
+//         display: "flex",
+//         alignItems: "center",
+//         justifyContent: "center",
+//       }}
+//     >
+//       <div
+//         style={{
+//           position: "absolute",
+//           top: "-1px",
+//           right: "-1px",
+//           border: "4px solid #000",
+//           background: "#ecebeb",
+//           opacity: "0.9",
+//           borderRadius: "4px",
+//           display: "flex",
+//           justifyContent: "center",
+//           margin: "2.5rem",
+//           width: "88%",
+//           height: "80%",
+//         }}
+//       />
+
+//       <div
+//         style={{
+//           border: "4px solid #000",
+//           background: "#fefbfb",
+//           borderRadius: "4px",
+//           display: "flex",
+//           justifyContent: "center",
+//           margin: "2rem",
+//           width: "88%",
+//           height: "80%",
+//         }}
+//       >
+//         <div
+//           style={{
+//             display: "flex",
+//             flexDirection: "column",
+//             justifyContent: "space-between",
+//             margin: "20px",
+//             width: "90%",
+//             height: "90%",
+//           }}
+//         >
+//           <p
+//             style={{
+//               fontSize: 72,
+//               fontWeight: "bold",
+//               maxHeight: "84%",
+//               overflow: "hidden",
+//             }}
+//           >
+//             {post.data.title}
+//           </p>
+//           <div
+//             style={{
+//               display: "flex",
+//               justifyContent: "space-between",
+//               width: "100%",
+//               marginBottom: "8px",
+//               fontSize: 28,
+//             }}
+//           >
+//             <span>
+//               by{" "}
+//               <span
+//                 style={{
+//                   color: "transparent",
+//                 }}
+//               >
+//                 "
+//               </span>
+//               <span style={{ overflow: "hidden", fontWeight: "bold" }}>
+//                 {post.data.author}
+//               </span>
+//             </span>
+
+//             <span style={{ overflow: "hidden", fontWeight: "bold" }}>
+//               {SITE.title}
+//             </span>
+//           </div>
+//         </div>
+//       </div>
+//     </div>`;
+
+export default async post => {
+  return satori(
+    {
+      type: "div",
+      props: {
+        style: {
+          background: "#fefbfb",
+          width: "100%",
+          height: "100%",
+          display: "flex",
+          alignItems: "center",
+          justifyContent: "center",
+        },
+        children: [
+          {
+            type: "div",
+            props: {
+              style: {
+                position: "absolute",
+                top: "-1px",
+                right: "-1px",
+                border: "4px solid #000",
+                background: "#ecebeb",
+                opacity: "0.9",
+                borderRadius: "4px",
+                display: "flex",
+                justifyContent: "center",
+                margin: "2.5rem",
+                width: "88%",
+                height: "80%",
+              },
+            },
+          },
+          {
+            type: "div",
+            props: {
+              style: {
+                border: "4px solid #000",
+                background: "#fefbfb",
+                borderRadius: "4px",
+                display: "flex",
+                justifyContent: "center",
+                margin: "2rem",
+                width: "88%",
+                height: "80%",
+              },
+              children: {
+                type: "div",
+                props: {
+                  style: {
+                    display: "flex",
+                    flexDirection: "column",
+                    justifyContent: "space-between",
+                    margin: "20px",
+                    width: "90%",
+                    height: "90%",
+                  },
+                  children: [
+                    {
+                      type: "p",
+                      props: {
+                        style: {
+                          fontSize: 72,
+                          fontWeight: "bold",
+                          maxHeight: "84%",
+                          overflow: "hidden",
+                        },
+                        children: post.data.title,
+                      },
+                    },
+                    {
+                      type: "div",
+                      props: {
+                        style: {
+                          display: "flex",
+                          justifyContent: "space-between",
+                          width: "100%",
+                          marginBottom: "8px",
+                          fontSize: 28,
+                        },
+                        children: [
+                          {
+                            type: "span",
+                            props: {
+                              children: [
+                                "by ",
+                                {
+                                  type: "span",
+                                  props: {
+                                    style: { color: "transparent" },
+                                    children: '"',
+                                  },
+                                },
+                                {
+                                  type: "span",
+                                  props: {
+                                    style: {
+                                      overflow: "hidden",
+                                      fontWeight: "bold",
+                                    },
+                                    children: post.data.author,
+                                  },
+                                },
+                              ],
+                            },
+                          },
+                          {
+                            type: "span",
+                            props: {
+                              style: { overflow: "hidden", fontWeight: "bold" },
+                              children: SITE.title,
+                            },
+                          },
+                        ],
+                      },
+                    },
+                  ],
+                },
+              },
+            },
+          },
+        ],
+      },
+    },
+    {
+      width: 1200,
+      height: 630,
+      embedFont: true,
+      fonts: await loadGoogleFonts(
+        post.data.title + post.data.author + SITE.title + "by"
+      ),
+    }
+  );
+};
diff --git a/src/utils/og-templates/site.js b/src/utils/og-templates/site.js
new file mode 100644
index 0000000..69a5218
--- /dev/null
+++ b/src/utils/og-templates/site.js
@@ -0,0 +1,128 @@
+import satori from "satori";
+import { SITE } from "@/config";
+import loadGoogleFonts from "../loadGoogleFont";
+
+export default async () => {
+  return satori(
+    {
+      type: "div",
+      props: {
+        style: {
+          background: "#fefbfb",
+          width: "100%",
+          height: "100%",
+          display: "flex",
+          alignItems: "center",
+          justifyContent: "center",
+        },
+        children: [
+          {
+            type: "div",
+            props: {
+              style: {
+                position: "absolute",
+                top: "-1px",
+                right: "-1px",
+                border: "4px solid #000",
+                background: "#ecebeb",
+                opacity: "0.9",
+                borderRadius: "4px",
+                display: "flex",
+                justifyContent: "center",
+                margin: "2.5rem",
+                width: "88%",
+                height: "80%",
+              },
+            },
+          },
+          {
+            type: "div",
+            props: {
+              style: {
+                border: "4px solid #000",
+                background: "#fefbfb",
+                borderRadius: "4px",
+                display: "flex",
+                justifyContent: "center",
+                margin: "2rem",
+                width: "88%",
+                height: "80%",
+              },
+              children: {
+                type: "div",
+                props: {
+                  style: {
+                    display: "flex",
+                    flexDirection: "column",
+                    justifyContent: "space-between",
+                    margin: "20px",
+                    width: "90%",
+                    height: "90%",
+                  },
+                  children: [
+                    {
+                      type: "div",
+                      props: {
+                        style: {
+                          display: "flex",
+                          flexDirection: "column",
+                          justifyContent: "center",
+                          alignItems: "center",
+                          height: "90%",
+                          maxHeight: "90%",
+                          overflow: "hidden",
+                          textAlign: "center",
+                        },
+                        children: [
+                          {
+                            type: "p",
+                            props: {
+                              style: { fontSize: 72, fontWeight: "bold" },
+                              children: SITE.title,
+                            },
+                          },
+                          {
+                            type: "p",
+                            props: {
+                              style: { fontSize: 28 },
+                              children: SITE.desc,
+                            },
+                          },
+                        ],
+                      },
+                    },
+                    {
+                      type: "div",
+                      props: {
+                        style: {
+                          display: "flex",
+                          justifyContent: "flex-end",
+                          width: "100%",
+                          marginBottom: "8px",
+                          fontSize: 28,
+                        },
+                        children: {
+                          type: "span",
+                          props: {
+                            style: { overflow: "hidden", fontWeight: "bold" },
+                            children: new URL(SITE.website).hostname,
+                          },
+                        },
+                      },
+                    },
+                  ],
+                },
+              },
+            },
+          },
+        ],
+      },
+    },
+    {
+      width: 1200,
+      height: 630,
+      embedFont: true,
+      fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.website),
+    }
+  );
+};
diff --git a/src/utils/postFilter.ts b/src/utils/postFilter.ts
new file mode 100644
index 0000000..cb185e1
--- /dev/null
+++ b/src/utils/postFilter.ts
@@ -0,0 +1,11 @@
+import type { CollectionEntry } from "astro:content";
+import { SITE } from "@/config";
+
+const postFilter = ({ data }: CollectionEntry<"blog">) => {
+  const isPublishTimePassed =
+    Date.now() >
+    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
+  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
+};
+
+export default postFilter;
diff --git a/src/utils/slugify.ts b/src/utils/slugify.ts
new file mode 100644
index 0000000..4fee6be
--- /dev/null
+++ b/src/utils/slugify.ts
@@ -0,0 +1,23 @@
+import kebabcase from "lodash.kebabcase";
+import slugify from "slugify";
+
+/**
+ * Check if string contains non-Latin characters
+ */
+const hasNonLatin = (str: string): boolean => /[^\x00-\x7F]/.test(str);
+
+/**
+ * Slugify a string using a hybrid approach:
+ * - For Latin-only strings: use slugify (eg: "E2E Testing" -> "e2e-testing", "TypeScript 5.0" -> "typescript-5.0")
+ * - For strings with non-Latin characters: use lodash.kebabcase (preserves non-Latin chars)
+ */
+export const slugifyStr = (str: string): string => {
+  if (hasNonLatin(str)) {
+    // Preserve non-Latin characters (e.g., Burmese, Chinese, etc.)
+    return kebabcase(str);
+  }
+  // Handle Latin strings with better number/acronym handling
+  return slugify(str, { lower: true });
+};
+
+export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
diff --git a/src/utils/transformers/fileName.js b/src/utils/transformers/fileName.js
new file mode 100644
index 0000000..0860982
--- /dev/null
+++ b/src/utils/transformers/fileName.js
@@ -0,0 +1,69 @@
+/**
+ * CustomShiki transformer that adds file name labels to code blocks.
+ *
+ * This transformer looks for the `file="filename"` meta attribute in code blocks
+ * and creates a styled label showing the filename. It supports two different
+ * styling options and can optionally hide the green dot indicator.
+ *
+ * @param {Object} options - Configuration options for the transformer
+ * @param {string} [options.style="v2"] - The styling variant to use
+ *   - `"v1"`: Tab-style with rounded top corners, positioned at top-left
+ *   - `"v2"`: Badge-style with border, positioned at top-left with offset
+ * @param {boolean} [options.hideDot=false] - Whether to hide the green dot indicator
+ */
+export const transformerFileName = ({
+  style = "v2",
+  hideDot = false,
+} = {}) => ({
+  pre(node) {
+    // Add CSS custom property to the node
+    const fileNameOffset = style === "v1" ? "0.75rem" : "-0.75rem";
+    node.properties.style =
+      (node.properties.style || "") + `--file-name-offset: ${fileNameOffset};`;
+
+    const raw = this.options.meta?.__raw?.split(" ");
+
+    if (!raw) return;
+
+    const metaMap = new Map();
+
+    for (const item of raw) {
+      const [key, value] = item.split("=");
+      if (!key || !value) continue;
+      metaMap.set(key, value.replace(/["'`]/g, ""));
+    }
+
+    const file = metaMap.get("file");
+
+    if (!file) return;
+
+    // Add additional margin to code block
+    this.addClassToHast(
+      node,
+      `mt-8 ${style === "v1" ? "rounded-tl-none" : ""}`
+    );
+
+    // Add file name to code block
+    node.children.push({
+      type: "element",
+      tagName: "span",
+      properties: {
+        class: [
+          "absolute py-1 text-foreground text-xs font-medium leading-4",
+          hideDot
+            ? "px-2"
+            : "pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2",
+          style === "v1"
+            ? "left-0 -top-6 rounded-t-md border border-b-0 bg-muted/50"
+            : "left-2 top-(--file-name-offset) border rounded-md bg-background",
+        ],
+      },
+      children: [
+        {
+          type: "text",
+          value: file,
+        },
+      ],
+    });
+  },
+});
```
**Red flags detectadas (heurística):**

- base config
- Astro.site usage
- SITE.website usage
- hardcoded tuplatainforma
- double-slash normalize

## Commit c466441

**Resumen:**

```text
c466441 Fixed path
```
**Archivos tocados:**

```text
astro.config.ts
```
**Diff stat:**

```text
 astro.config.ts | 1 +
 1 file changed, 1 insertion(+)
```
**Patch:**

```diff
commit c466441de30890e76a6bb7b75ebf56eed0d5bdd7
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 12:06:58 2026 -0300

    Fixed path

diff --git a/astro.config.ts b/astro.config.ts
index 1fb760e..8e00b82 100644
--- a/astro.config.ts
+++ b/astro.config.ts
@@ -14,6 +14,7 @@ import { SITE } from "./src/config";
 // https://astro.build/config
 export default defineConfig({
   site: SITE.website,
+  base: "/tuplatainforma",
   integrations: [
     sitemap({
       filter: page => SITE.showArchives || !page.endsWith("/archives"),
```
**Red flags detectadas (heurística):**

- base config
- SITE.website usage
- hardcoded tuplatainforma

## Commit 21ceaff

**Resumen:**

```text
21ceaff Rutas corregidas
```
**Archivos tocados:**

```text
src/components/Header.astro
src/pages/calculadoras/index.astro
```
**Diff stat:**

```text
 src/components/Header.astro        | 25 ++++++----
 src/pages/calculadoras/index.astro | 98 ++++++++++++++++++++++++++++++++++++++
 2 files changed, 114 insertions(+), 9 deletions(-)
```
**Patch:**

```diff
commit 21ceaff680f047fa647ea0db1dea1baf448060d8
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 13:46:50 2026 -0300

    Rutas corregidas

diff --git a/src/components/Header.astro b/src/components/Header.astro
index bed20ee..902bed1 100644
--- a/src/components/Header.astro
+++ b/src/components/Header.astro
@@ -9,10 +9,17 @@ import LinkButton from "./LinkButton.astro";
 import { SITE } from "@/config";
 
 const { pathname } = Astro.url;
+const BASE = import.meta.env.BASE_URL || "/";
+// Normalize pathname by stripping BASE for accurate active-state checks
+const basePrefixLen = BASE.endsWith("/") ? BASE.length - 1 : BASE.length;
+const normalizedPathname =
+  pathname.startsWith(BASE) ? pathname.slice(basePrefixLen) : pathname;
 
-// Remove trailing slash from current pathname if exists
+// Remove trailing slash from normalized pathname if exists
 const currentPath =
-  pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
+  normalizedPathname.endsWith("/") && normalizedPathname !== "/"
+    ? normalizedPathname.slice(0, -1)
+    : normalizedPathname;
 
 const isActive = (path: string) => {
   const currentPathArray = currentPath.split("/").filter(p => p.trim());
@@ -43,7 +50,7 @@ const isActive = (path: string) => {
     ]}
   >
     <a
-      href="/"
+      href={import.meta.env.BASE_URL}
       class="absolute py-1 text-xl leading-8 font-semibold whitespace-nowrap sm:static sm:my-auto sm:text-2xl sm:leading-none"
     >
       {SITE.title}
@@ -72,22 +79,22 @@ const isActive = (path: string) => {
         ]}
       >
         <li class="col-span-2">
-          <a href="/posts" class:list={{ "active-nav": isActive("/posts") }}>
+          <a href={`${import.meta.env.BASE_URL}posts`} class:list={{ "active-nav": isActive("/posts") }}>
             Artículos
           </a>
         </li>
         <li class="col-span-2">
-          <a href="/calculadoras" class:list={{ "active-nav": isActive("/calculadoras") }}>
+          <a href={`${import.meta.env.BASE_URL}calculadoras`} class:list={{ "active-nav": isActive("/calculadoras") }}>
             Calculadoras
           </a>
         </li>
         <li class="col-span-2">
-          <a href="/tags" class:list={{ "active-nav": isActive("/tags") }}>
+          <a href={`${import.meta.env.BASE_URL}tags`} class:list={{ "active-nav": isActive("/tags") }}>
             Tags
           </a>
         </li>
         <li class="col-span-2">
-          <a href="/about" class:list={{ "active-nav": isActive("/about") }}>
+          <a href={`${import.meta.env.BASE_URL}about`} class:list={{ "active-nav": isActive("/about") }}>
             Nosotros
           </a>
         </li>
@@ -95,7 +102,7 @@ const isActive = (path: string) => {
           SITE.showArchives && (
             <li class="col-span-2">
               <LinkButton
-                href="/archives"
+                href={`${import.meta.env.BASE_URL}archives`}
                 class:list={[
                   "focus-outline flex justify-center p-3 sm:p-1",
                   {
@@ -113,7 +120,7 @@ const isActive = (path: string) => {
         }
         <li class="col-span-1 flex items-center justify-center">
           <LinkButton
-            href="/search"
+            href={`${import.meta.env.BASE_URL}search`}
             class:list={[
               "focus-outline flex p-3 sm:p-1",
               { "[&>svg]:stroke-accent": isActive("/search") },
diff --git a/src/pages/calculadoras/index.astro b/src/pages/calculadoras/index.astro
new file mode 100644
index 0000000..4ecc731
--- /dev/null
+++ b/src/pages/calculadoras/index.astro
@@ -0,0 +1,98 @@
+---
+import Layout from "@/layouts/Layout.astro";
+import Header from "@/components/Header.astro";
+import Footer from "@/components/Footer.astro";
+
+const calculadoras = [
+  {
+    titulo: "Calculadora de Sueldo Líquido",
+    descripcion:
+      "¿Cuánto recibirás después de AFP, salud e impuestos? Obtén el desglose completo de tus descuentos.",
+    href: `${import.meta.env.BASE_URL}calculadoras/sueldo-liquido/`,
+    icono: "💰",
+    tag: "Más usada",
+  },
+  {
+    titulo: "Simulador APV",
+    descripcion:
+      "Calcula cuánto ahorras en impuestos con el APV Régimen A o B según tu sueldo.",
+    href: "#",
+    icono: "📈",
+    tag: "Próximamente",
+  },
+  {
+    titulo: "Costo Real Tarjeta de Crédito",
+    descripcion:
+      "Descubre cuánto pagas realmente si solo abonas el mínimo de tu tarjeta.",
+    href: "#",
+    icono: "💳",
+    tag: "Próximamente",
+  },
+  {
+    titulo: "Simulador de Jubilación",
+    descripcion:
+      "Estima cuánto acumularás al jubilar según tu ahorro mensual y años restantes.",
+    href: "#",
+    icono: "🏖️",
+    tag: "Próximamente",
+  },
+  {
+    titulo: "Calculadora de Crédito de Consumo",
+    descripcion:
+      "Calcula el costo total, CAE y cuotas de cualquier crédito de consumo.",
+    href: "#",
+    icono: "🏦",
+    tag: "Próximamente",
+  },
+];
+---
+
+<Layout>
+  <Header />
+  <main id="main-content" class="app-layout">
+    <section class="pt-8 pb-6 border-b border-border">
+      <h1 class="text-3xl font-bold sm:text-4xl my-4">
+        🧮 Calculadoras Financieras
+      </h1>
+      <p class="text-foreground/70 max-w-xl">
+        Herramientas gratuitas para hacer tus propios números. Sin registro, sin datos personales.
+      </p>
+    </section>
+
+    <section class="py-8">
+      <ul class="grid gap-4 sm:grid-cols-2">
+        {calculadoras.map((calc) => (
+          <li>
+            <a
+              href={calc.tag === "Próximamente" ? "#" : calc.href}
+              class:list={[
+                "block p-5 rounded-xl border border-border",
+                "transition-all duration-200",
+                calc.tag === "Próximamente"
+                  ? "opacity-60 cursor-not-allowed"
+                  : "hover:border-accent hover:bg-accent/5",
+              ]}
+            >
+              <div class="flex items-start justify-between gap-2 mb-2">
+                <span class="text-2xl">{calc.icono}</span>
+                <span
+                  class:list={[
+                    "text-xs font-bold px-2 py-0.5 rounded-full",
+                    calc.tag === "Más usada"
+                      ? "bg-accent/20 text-accent"
+                      : "bg-foreground/10 text-foreground/50",
+                  ]}
+                >
+                  {calc.tag}
+                </span>
+              </div>
+              <h2 class="font-semibold text-lg mb-1">{calc.titulo}</h2>
+              <p class="text-sm text-foreground/60">{calc.descripcion}</p>
+            </a>
+          </li>
+        ))}
+      </ul>
+    </section>
+  </main>
+  <Footer />
+</Layout>
```
**Red flags detectadas (heurística):**

- BASE_URL usage
- href concatenation

## Commit 8a8e04f

**Resumen:**

```text
8a8e04f Corrección en ruta
```
**Archivos tocados:**

```text
src/components/Header.astro
```
**Diff stat:**

```text
 src/components/Header.astro | 12 ++++++------
 1 file changed, 6 insertions(+), 6 deletions(-)
```
**Patch:**

```diff
commit 8a8e04f7fda3739a327aabd66e9439cf947d075b
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 13:57:30 2026 -0300

    Corrección en ruta

diff --git a/src/components/Header.astro b/src/components/Header.astro
index 902bed1..6e71cf6 100644
--- a/src/components/Header.astro
+++ b/src/components/Header.astro
@@ -79,22 +79,22 @@ const isActive = (path: string) => {
         ]}
       >
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}posts`} class:list={{ "active-nav": isActive("/posts") }}>
+          <a href={`${import.meta.env.BASE_URL}posts/`} class:list={{ "active-nav": isActive("/posts") }}>
             Artículos
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}calculadoras`} class:list={{ "active-nav": isActive("/calculadoras") }}>
+          <a href={`${import.meta.env.BASE_URL}calculadoras/`} class:list={{ "active-nav": isActive("/calculadoras") }}>
             Calculadoras
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}tags`} class:list={{ "active-nav": isActive("/tags") }}>
+          <a href={`${import.meta.env.BASE_URL}tags/`} class:list={{ "active-nav": isActive("/tags") }}>
             Tags
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}about`} class:list={{ "active-nav": isActive("/about") }}>
+          <a href={`${import.meta.env.BASE_URL}about/`} class:list={{ "active-nav": isActive("/about") }}>
             Nosotros
           </a>
         </li>
@@ -102,7 +102,7 @@ const isActive = (path: string) => {
           SITE.showArchives && (
             <li class="col-span-2">
               <LinkButton
-                href={`${import.meta.env.BASE_URL}archives`}
+                href={`${import.meta.env.BASE_URL}archives/`}
                 class:list={[
                   "focus-outline flex justify-center p-3 sm:p-1",
                   {
@@ -120,7 +120,7 @@ const isActive = (path: string) => {
         }
         <li class="col-span-1 flex items-center justify-center">
           <LinkButton
-            href={`${import.meta.env.BASE_URL}search`}
+            href={`${import.meta.env.BASE_URL}search/`}
             class:list={[
               "focus-outline flex p-3 sm:p-1",
               { "[&>svg]:stroke-accent": isActive("/search") },
```
**Red flags detectadas (heurística):**

- BASE_URL usage
- href concatenation

## Commit 1a56b4c

**Resumen:**

```text
1a56b4c Correción path
```
**Archivos tocados:**

```text
src/components/Header.astro
```
**Diff stat:**

```text
 src/components/Header.astro | 25 +++++++++++++++----------
 1 file changed, 15 insertions(+), 10 deletions(-)
```
**Patch:**

```diff
commit 1a56b4cb99c914632c8dd0a82a280f489ad64a0f
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 14:04:26 2026 -0300

    Correción path

diff --git a/src/components/Header.astro b/src/components/Header.astro
index 6e71cf6..0afc96b 100644
--- a/src/components/Header.astro
+++ b/src/components/Header.astro
@@ -9,11 +9,16 @@ import LinkButton from "./LinkButton.astro";
 import { SITE } from "@/config";
 
 const { pathname } = Astro.url;
-const BASE = import.meta.env.BASE_URL || "/";
+const RAW_BASE = import.meta.env.BASE_URL || "/";
+// Ensure BASE always ends with a trailing slash to avoid bad concatenation
+const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
 // Normalize pathname by stripping BASE for accurate active-state checks
 const basePrefixLen = BASE.endsWith("/") ? BASE.length - 1 : BASE.length;
-const normalizedPathname =
-  pathname.startsWith(BASE) ? pathname.slice(basePrefixLen) : pathname;
+const normalizedPathname = pathname.startsWith(BASE)
+  ? pathname.slice(basePrefixLen)
+  : pathname.startsWith(RAW_BASE)
+    ? pathname.slice(RAW_BASE.length)
+    : pathname;
 
 // Remove trailing slash from normalized pathname if exists
 const currentPath =
@@ -50,7 +55,7 @@ const isActive = (path: string) => {
     ]}
   >
     <a
-      href={import.meta.env.BASE_URL}
+      href={BASE}
       class="absolute py-1 text-xl leading-8 font-semibold whitespace-nowrap sm:static sm:my-auto sm:text-2xl sm:leading-none"
     >
       {SITE.title}
@@ -79,22 +84,22 @@ const isActive = (path: string) => {
         ]}
       >
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}posts/`} class:list={{ "active-nav": isActive("/posts") }}>
+          <a href={`${BASE}posts/`} class:list={{ "active-nav": isActive("/posts") }}>
             Artículos
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}calculadoras/`} class:list={{ "active-nav": isActive("/calculadoras") }}>
+          <a href={`${BASE}calculadoras/`} class:list={{ "active-nav": isActive("/calculadoras") }}>
             Calculadoras
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}tags/`} class:list={{ "active-nav": isActive("/tags") }}>
+          <a href={`${BASE}tags/`} class:list={{ "active-nav": isActive("/tags") }}>
             Tags
           </a>
         </li>
         <li class="col-span-2">
-          <a href={`${import.meta.env.BASE_URL}about/`} class:list={{ "active-nav": isActive("/about") }}>
+          <a href={`${BASE}about/`} class:list={{ "active-nav": isActive("/about") }}>
             Nosotros
           </a>
         </li>
@@ -102,7 +107,7 @@ const isActive = (path: string) => {
           SITE.showArchives && (
             <li class="col-span-2">
               <LinkButton
-                href={`${import.meta.env.BASE_URL}archives/`}
+                href={`${BASE}archives/`}
                 class:list={[
                   "focus-outline flex justify-center p-3 sm:p-1",
                   {
@@ -120,7 +125,7 @@ const isActive = (path: string) => {
         }
         <li class="col-span-1 flex items-center justify-center">
           <LinkButton
-            href={`${import.meta.env.BASE_URL}search/`}
+            href={`${BASE}search/`}
             class:list={[
               "focus-outline flex p-3 sm:p-1",
               { "[&>svg]:stroke-accent": isActive("/search") },
```
**Red flags detectadas (heurística):**

- BASE_URL usage
- href concatenation

## Commit d555b77

**Resumen:**

```text
d555b77 Corregidos errores de paginación
```
**Archivos tocados:**

```text
src/components/Breadcrumb.astro
src/components/Card.astro
src/components/Pagination.astro
src/components/Tag.astro
src/utils/getPath.ts
```
**Diff stat:**

```text
 src/components/Breadcrumb.astro | 7 +++++--
 src/components/Card.astro       | 5 ++++-
 src/components/Pagination.astro | 7 +++++--
 src/components/Tag.astro        | 5 ++++-
 src/utils/getPath.ts            | 7 ++++---
 5 files changed, 22 insertions(+), 9 deletions(-)
```
**Patch:**

```diff
commit d555b7795c8587b95f355ef947f7ec356a1fa506
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 14:24:43 2026 -0300

    Corregidos errores de paginación

diff --git a/src/components/Breadcrumb.astro b/src/components/Breadcrumb.astro
index b49fe3d..62b2851 100644
--- a/src/components/Breadcrumb.astro
+++ b/src/components/Breadcrumb.astro
@@ -23,12 +23,15 @@ if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
 }
 ---
 
+const RAW_BASE = import.meta.env.BASE_URL || "/";
+const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
+
 <nav class="app-layout mt-8 mb-1" aria-label="breadcrumb">
   <ul
     class="font-light [&>li]:inline [&>li:not(:last-child)>a]:hover:opacity-100"
   >
     <li>
-      <a href="/" class="opacity-80">Home</a>
+      <a href={BASE} class="opacity-80">Home</a>
       <span aria-hidden="true" class="opacity-80">&raquo;</span>
     </li>
     {
@@ -45,7 +48,7 @@ if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
           </li>
         ) : (
           <li>
-            <a href={`/${breadcrumb}/`} class="capitalize opacity-70">
+            <a href={`${BASE}${breadcrumb}/`} class="capitalize opacity-70">
               {breadcrumb}
             </a>
             <span aria-hidden="true">&raquo;</span>
diff --git a/src/components/Card.astro b/src/components/Card.astro
index c627603..d2ec4f9 100644
--- a/src/components/Card.astro
+++ b/src/components/Card.astro
@@ -11,11 +11,14 @@ type Props = {
 const { variant: Heading = "h2", id, data, filePath } = Astro.props;
 
 const { title, description, ...props } = data;
+
+const RAW_BASE = import.meta.env.BASE_URL || "/";
+const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
 ---
 
 <li class="my-6">
   <a
-    href={getPath(id, filePath)}
+    href={`${BASE}${getPath(id, filePath)}/`}
     class:list={[
       "inline-block text-lg font-medium text-accent",
       "decoration-dashed underline-offset-4 hover:underline",
diff --git a/src/components/Pagination.astro b/src/components/Pagination.astro
index 1f6f367..12aefbd 100644
--- a/src/components/Pagination.astro
+++ b/src/components/Pagination.astro
@@ -10,6 +10,9 @@ type Props = {
 };
 
 const { page } = Astro.props;
+
+const RAW_BASE = import.meta.env.BASE_URL || "/";
+const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
 ---
 
 {
@@ -21,7 +24,7 @@ const { page } = Astro.props;
     >
       <LinkButton
         disabled={!page.url.prev}
-        href={page.url.prev as string}
+        href={page.url.prev ? `${BASE}${(page.url.prev as string).replace(/^\//, "")}` : undefined}
         class:list={["me-4 select-none", { "opacity-50": !page.url.prev }]}
         aria-label="Goto Previous Page"
       >
@@ -31,7 +34,7 @@ const { page } = Astro.props;
       {page.currentPage} / {page.lastPage}
       <LinkButton
         disabled={!page.url.next}
-        href={page.url.next as string}
+        href={page.url.next ? `${BASE}${(page.url.next as string).replace(/^\//, "")}` : undefined}
         class:list={["ms-4 select-none", { "opacity-50": !page.url.next }]}
         aria-label="Goto Next Page"
       >
diff --git a/src/components/Tag.astro b/src/components/Tag.astro
index aac1816..d6b02ad 100644
--- a/src/components/Tag.astro
+++ b/src/components/Tag.astro
@@ -8,11 +8,14 @@ type Props = {
 };
 
 const { tag, tagName, size = "lg" } = Astro.props;
+
+const RAW_BASE = import.meta.env.BASE_URL || "/";
+const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
 ---
 
 <li>
   <a
-    href={`/tags/${tag}/`}
+    href={`${BASE}tags/${tag}/`}
     transition:name={tag}
     class:list={[
       "flex items-center gap-0.5",
diff --git a/src/utils/getPath.ts b/src/utils/getPath.ts
index 057b612..04ffda1 100644
--- a/src/utils/getPath.ts
+++ b/src/utils/getPath.ts
@@ -21,7 +21,8 @@ export function getPath(
     .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
     .map(segment => slugifyStr(segment)); // slugify each segment path
 
-  const basePath = includeBase ? "/posts" : "";
+  // Use relative path segments (no leading slash). Consumers should prefix BASE_URL.
+  const basePath = includeBase ? "posts" : "";
 
   // Making sure `id` does not contain the directory
   const blogId = id.split("/");
@@ -29,8 +30,8 @@ export function getPath(
 
   // If not inside the sub-dir, simply return the file path
   if (!pathSegments || pathSegments.length < 1) {
-    return [basePath, slug].join("/");
+    return [basePath, slug].filter(Boolean).join("/");
   }
 
-  return [basePath, ...pathSegments, slug].join("/");
+  return [basePath, ...pathSegments, slug].filter(Boolean).join("/");
 }
```
**Red flags detectadas (heurística):**

- BASE_URL usage
- href concatenation

## Commit e59431a

**Resumen:**

```text
e59431a Correción de URL
```
**Archivos tocados:**

```text
src/components/Breadcrumb.astro
```
**Diff stat:**

```text
 src/components/Breadcrumb.astro | 9 ++++-----
 1 file changed, 4 insertions(+), 5 deletions(-)
```
**Patch:**

```diff
commit e59431a7b7b7966357cb4ed7f9acf0cee6f633b5
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 14:34:24 2026 -0300

    Correción de URL

diff --git a/src/components/Breadcrumb.astro b/src/components/Breadcrumb.astro
index 62b2851..1db7858 100644
--- a/src/components/Breadcrumb.astro
+++ b/src/components/Breadcrumb.astro
@@ -9,7 +9,7 @@ const breadcrumbList = currentUrlPath.split("/").slice(1);
 // if breadcrumb is Home > Posts > 1 <etc>
 // replace Posts with Posts (page number)
 if (breadcrumbList[0] === "posts") {
-  breadcrumbList.splice(0, 2, `Posts (page ${breadcrumbList[1] || 1})`);
+  breadcrumbList.splice(0, 2, `Artículos (página ${breadcrumbList[1] || 1})`);
 }
 
 // if breadcrumb is Home > Tags > [tag] > [page] <etc>
@@ -18,20 +18,19 @@ if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
   breadcrumbList.splice(
     1,
     3,
-    `${breadcrumbList[1]} ${Number(breadcrumbList[2]) === 1 ? "" : "(page " + breadcrumbList[2] + ")"}`
+    `${breadcrumbList[1]} ${Number(breadcrumbList[2]) === 1 ? "" : "(página " + breadcrumbList[2] + ")"}`
   );
 }
----
-
 const RAW_BASE = import.meta.env.BASE_URL || "/";
 const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
+---
 
 <nav class="app-layout mt-8 mb-1" aria-label="breadcrumb">
   <ul
     class="font-light [&>li]:inline [&>li:not(:last-child)>a]:hover:opacity-100"
   >
     <li>
-      <a href={BASE} class="opacity-80">Home</a>
+      <a href={BASE} class="opacity-80">Inicio</a>
       <span aria-hidden="true" class="opacity-80">&raquo;</span>
     </li>
     {
```
**Red flags detectadas (heurística):**

- BASE_URL usage

## Commit c7e270c

**Resumen:**

```text
c7e270c Update astro.config.mjs
```
**Archivos tocados:**

```text
astro.config.mjs
```
**Diff stat:**

```text
 astro.config.mjs | 11 ++++-------
 1 file changed, 4 insertions(+), 7 deletions(-)
```
**Patch:**

```diff
commit c7e270c505b1466a85fa80aa9e5db61b65f587f6
Author: Carlos Ortega <carlosortega77@gmail.com>
Date:   Mon Feb 23 10:56:21 2026 -0300

    Update astro.config.mjs

diff --git a/astro.config.mjs b/astro.config.mjs
index 508cbec..a665832 100644
--- a/astro.config.mjs
+++ b/astro.config.mjs
@@ -1,11 +1,8 @@
-// @ts-check
 import { defineConfig } from 'astro/config';
+import tailwind from '@astrojs/tailwind';
 
-import tailwindcss from '@tailwindcss/vite';
-
-// https://astro.build/config
 export default defineConfig({
-  vite: {
-    plugins: [tailwindcss()]
-  }
+  site: 'https://cortega26.github.io',
+  base: '/tuplatainforma',
+  integrations: [tailwind()],
 });
\ No newline at end of file
```
**Red flags detectadas (heurística):**

- base config
- hardcoded tuplatainforma

## Commit c1e4efb

**Resumen:**

```text
c1e4efb Moved deploy to correct folder
```
**Archivos tocados:**

```text

```
**Diff stat:**

```text

```
**Patch:**

```diff

```
**Red flags detectadas (heurística):**

_Ninguna detectada por patrones simples._
