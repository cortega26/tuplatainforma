# Schema Remediation Notes — Sprint 1R

## Defects Confirmed In Sprint 1A

- Article pages emitted duplicate `BlogPosting` schema.
- Article `url` / `@id` values were relative instead of absolute.
- Article breadcrumb final item inherited the same relative URL bug.
- Glossary, calculator, and guide hub templates lacked structured breadcrumb coverage.
- Glossary detail pages exposed only generic `WebSite` schema despite clear term-definition intent.

## Remediation Implemented

### 1. Article schema deduplication

- Removed the article-level `BlogPosting` JSON-LD emitted from [`src/layouts/Layout.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/Layout.astro).
- Kept [`src/components/ArticleJsonLd.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/ArticleJsonLd.astro) as the single article schema source.

### 2. Absolute article identity fields

- Normalized article canonical URLs to absolute form in [`src/layouts/PostDetails.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/PostDetails.astro).
- Added defensive absolute normalization in [`src/layouts/Layout.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/Layout.astro) so canonical, `og:url`, and `twitter:url` stay absolute even if a caller passes a relative path.
- Article JSON-LD now receives the absolute canonical URL, so `url`, `@id`, and `mainEntityOfPage.@id` align.

### 3. Breadcrumb structured data rollout

- [`src/components/Breadcrumb.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/Breadcrumb.astro) now emits `BreadcrumbList` JSON-LD with absolute item URLs for pages that already render visible breadcrumbs.
- Added visible breadcrumb navigation to calculator and guide hub templates so breadcrumb schema is supported by visible navigation on:
  - [`src/pages/calculadoras/*.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/calculadoras/index.astro)
  - [`src/pages/guias/index.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/guias/index.astro)
  - [`src/pages/guias/*/index.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/guias/pensiones-afp/index.astro)
- Removed the redundant breadcrumb JSON-LD block from [`src/pages/leyes/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/leyes/[slug].astro) to avoid duplicate `BreadcrumbList` output.

### 4. Glossary term schema

- Added `DefinedTerm` JSON-LD to [`src/pages/glosario/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/glosario/[slug].astro) with:
  - absolute canonical URL
  - term name
  - short definition
  - `inDefinedTermSet` pointing to `/glosario/`

## Templates Changed

- [`src/layouts/Layout.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/Layout.astro)
- [`src/layouts/PostDetails.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/PostDetails.astro)
- [`src/components/ArticleJsonLd.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/ArticleJsonLd.astro)
- [`src/components/Breadcrumb.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/Breadcrumb.astro)
- [`src/pages/glosario/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/glosario/[slug].astro)
- [`src/pages/leyes/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/leyes/[slug].astro)
- Calculator templates under [`src/pages/calculadoras/`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/calculadoras/index.astro)
- Guide templates under [`src/pages/guias/`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/guias/index.astro)

## Intentionally Deferred

- No `CollectionPage` / `ItemList` schema was added to guide hubs in this sprint.
  - Reason: breadcrumb coverage was supportable immediately, but collection semantics need a stricter item contract to avoid speculative markup.
- No calculator-specific `WebApplication` schema was added.
  - Reason: the current calculators are better represented conservatively than with unsupported rich-result assumptions.

## Validation Caveats

- Local build verification confirmed on `dist/posts/como-calcular-sueldo-liquido/index.html`:
  - exactly `1` `BlogPosting`
  - exactly `1` `BreadcrumbList`
  - absolute canonical / `og:url` / `twitter:url`
- Rich Results Test / Search Console enhancement reports were not available because authenticated platform access is still blocked under `MB-031`.
