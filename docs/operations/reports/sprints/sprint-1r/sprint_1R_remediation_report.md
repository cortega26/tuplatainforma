# Sprint 1R Remediation Report — Monedario.cl

## Sprint Definition

- Sprint: `Sprint 1R — Remediation and Indexation Hygiene`
- Duration target: `3–5 days`
- Goal: fix the highest-value technical SEO, schema, citation, and indexation defects identified in Sprint 1A.

## Outcome Summary

### Completed

- `MB-007` — canonical, OG, Twitter, and template metadata normalization
- `MB-008` — indexation and sitemap hygiene policy implementation
- `MB-029` — broken citation remediation and removal of the Cloudflare-triggering mail-share pattern
- `MB-030` — article/glossary/calculator/hub structured-data remediation

### Blocked outside Sprint 1R code scope

- `MB-002` remains `BLOCKED`
- `MB-031` created to isolate platform-access prerequisites from executable technical work

### No Phase 2 drift introduced

- No content-cluster build
- No homepage rewrite
- No branding or broad UX redesign

## What Was Fixed

### MB-007

- Absolute canonical, `og:url`, and `twitter:url` on article pages
- Shared layout now normalizes URL identity defensively
- Archive/tag/search/about pages no longer rely on the same generic meta description
- Paginated article archives now differentiate metadata by page number

### MB-008

- Implemented explicit policy for:
  - `/search/`
  - `/tags/`
  - `/tags/<tag>/`
  - `/posts/2+/`
- Added `noindex,follow` to low-value discovery surfaces
- Removed those surfaces from sitemap generation
- Aligned `robots.txt` so tags remain crawlable enough for bots to read the `noindex` directive

### MB-029

- Replaced every confirmed official-source `404` found in repository content with a live official equivalent
- Removed the article mail-share link that Cloudflare was rewriting into `/cdn-cgi/l/email-protection`
- Rebuilt and rechecked generated HTML; the email-protection pattern is no longer present locally

### MB-030

- Removed duplicate article `BlogPosting` output
- Normalized article schema identity fields to absolute URLs
- Extended breadcrumb schema through the shared breadcrumb component
- Added visible breadcrumbs to calculator and guide templates so breadcrumb schema is backed by visible navigation
- Added `DefinedTerm` schema to glossary detail pages

## Partially Fixed / Intentionally Deferred

- Calculator pages still use conservative schema; no speculative `WebApplication` markup was introduced.
- Guide hubs do not yet emit `CollectionPage` / `ItemList`.
- Search-platform validation remains blocked until `MB-031` is resolved.

## Remaining Unresolved Items

- Non-blocking external audit still shows:
  - `www.pdichile.cl` returning `403` to automated fetches
  - LinkedIn returning `999` to automated share-link checks
- These are host-response constraints, not Sprint 1A official-source `404`s.

## Repository Files Changed

### Shared metadata/schema/indexation

- [`astro.config.ts`](/home/carlos/VS_Code_Projects/tuplatainforma/astro.config.ts)
- [`src/layouts/Layout.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/Layout.astro)
- [`src/layouts/PostDetails.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/layouts/PostDetails.astro)
- [`src/components/ArticleJsonLd.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/ArticleJsonLd.astro)
- [`src/components/Breadcrumb.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/components/Breadcrumb.astro)
- [`src/constants.ts`](/home/carlos/VS_Code_Projects/tuplatainforma/src/constants.ts)

### Indexation and metadata templates

- [`src/pages/search.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/search.astro)
- [`src/pages/tags/index.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/tags/index.astro)
- [`src/pages/tags/[tag]/[...page].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/tags/[tag]/[...page].astro)
- [`src/pages/posts/[...page].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/posts/[...page].astro)
- [`src/pages/robots.txt.ts`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/robots.txt.ts)
- [`src/pages/about.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/about.astro)
- [`src/pages/archives/index.astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/archives/index.astro)

### Glossary / law / calculator / hub schema coverage

- [`src/pages/glosario/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/glosario/[slug].astro)
- [`src/pages/leyes/[slug].astro`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/leyes/[slug].astro)
- Calculator templates under [`src/pages/calculadoras/`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/calculadoras/index.astro)
- Guide templates under [`src/pages/guias/`](/home/carlos/VS_Code_Projects/tuplatainforma/src/pages/guias/index.astro)

### Citation fixes

- [`src/data/blog/cae-costo-real-credito-chile.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/cae-costo-real-credito-chile.md)
- [`src/data/blog/como-cambiarse-de-afp.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/como-cambiarse-de-afp.md)
- [`src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md)
- [`src/data/blog/fondos-afp-a-b-c-d-e.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/fondos-afp-a-b-c-d-e.md)
- [`src/data/blog/que-es-la-cuenta-2-afp.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/que-es-la-cuenta-2-afp.md)
- [`src/data/laws/dl-824-impuesto-renta.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/dl-824-impuesto-renta.md)
- [`src/data/laws/dl-830-codigo-tributario.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/dl-830-codigo-tributario.md)
- [`src/data/laws/ley-18010-credito-dinero.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-18010-credito-dinero.md)
- [`src/data/laws/ley-20555-sernac-financiero.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-20555-sernac-financiero.md)
- [`src/data/laws/ley-21133-honorarios-retencion.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21133-honorarios-retencion.md)
- [`src/data/laws/ley-21236-portabilidad-financiera.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21236-portabilidad-financiera.md)
- [`src/data/laws/ley-21680-registro-deuda-consolidada.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21680-registro-deuda-consolidada.md)

### Operational records

- [`backlog.md`](/home/carlos/VS_Code_Projects/tuplatainforma/docs/development/backlog.md)
- [`progress_log.md`](/home/carlos/VS_Code_Projects/tuplatainforma/docs/operations/logs/progress_log.md)
- [`indexation_policy.md`](/home/carlos/VS_Code_Projects/tuplatainforma/docs/operations/reports/sprints/sprint-1r/indexation_policy.md)
- [`schema_remediation_notes.md`](/home/carlos/VS_Code_Projects/tuplatainforma/docs/operations/reports/sprints/sprint-1r/schema_remediation_notes.md)
- [`link_remediation_log.md`](/home/carlos/VS_Code_Projects/tuplatainforma/docs/operations/reports/sprints/sprint-1r/link_remediation_log.md)

## New Backlog Tasks Created

- `MB-031` — Obtain Search Console and Bing access prerequisites

## Validation Evidence

- `git diff --check`: pass
- `pnpm run lint`: pass
- `pnpm run check:boundaries`: pass
- `pnpm run format:check`: pass
- `pnpm run test`: pass
- `pnpm run check:frontmatter`: pass
- `pnpm run check:no-postid-urls`: pass
- `pnpm run astro check`: pass
- `pnpm run check:routes`: pass
  - No removals; existing baseline still reports 10 added article routes outside Sprint 1R scope
- `pnpm run build`: pass
- `pnpm run check:rss`: pass
  - `0` removals, `13` additions allowed by policy
- `pnpm run check:urls:external:audit`: pass (non-blocking mode)
  - `0` internal broken links
  - no official-source `404`s remain

## Change Control Record

1. Scope declaration
- In scope: shared metadata/schema/layout files, sitemap/indexation files, Sprint 1R operational artifacts, backlog/progress records, and the content files containing confirmed Sprint 1A broken official-source links.
- Out of scope: Search Console/Bing ownership itself, Phase 2 content expansion, homepage redesign, and unrelated refactors.

2. Impacted modules
- Paths:
  - shared SEO/layout: `astro.config.ts`, `src/layouts/**`, `src/components/**`
  - routing/indexation: `src/pages/search.astro`, `src/pages/tags/**`, `src/pages/posts/[...page].astro`, `src/pages/robots.txt.ts`
  - structured data rollout: `src/pages/glosario/[slug].astro`, `src/pages/leyes/[slug].astro`, `src/pages/calculadoras/**`, `src/pages/guias/**`
  - citations: targeted `src/data/blog/**` and `src/data/laws/**`
  - ops records: `docs/development/backlog.md`, `docs/operations/logs/progress_log.md`, Sprint 1R markdown artifacts
- Reason for each path:
  - metadata/schema defects
  - sitemap/indexation hygiene
  - broken official-source link remediation
  - required operational evidence

3. Invariant preservation
- Referenced invariants:
  - `URL.PUBLIC.NO_POST_ID`
  - `ROUTES.NO_SILENT_CHANGES`
  - `RSS.NO_REMOVALS`
  - `FRONTMATTER.VALID`
- Preservation proof:
  - `pnpm run check:no-postid-urls` passed
  - `pnpm run check:routes` passed with no removals
  - `pnpm run check:rss` passed with no removals
  - `pnpm run check:frontmatter` passed

4. Contract preservation
- Referenced contracts:
  - `CONTRACT.PUBLIC_URLS`
  - `CONTRACT.ROUTES_SNAPSHOT`
  - `CONTRACT.RSS_POLICY`
  - `CONTRACT.FRONTMATTER_POLICY`
- Breaking changes: no

5. Boundary integrity
- Layer boundary check (`pnpm run check:boundaries`): pass
- Unauthorized cross-layer imports introduced: no

6. Test coverage impact
- Changed runtime layers:
  - presentation/layout/content/indexation surfaces only
- Related tests added/updated:
  - none required by Section 5.2 change-impact thresholds
- Coverage threshold status (see Section 5): pass

7. Rollback strategy
- Revert unit:
  - revert Sprint 1R file set as one change unit
- Data/content rollback needed: no

8. Regression risk
- Risk level: low
- Primary regression vectors:
  - metadata serialization on page templates
  - sitemap exclusions unintentionally hiding target URLs
  - breadcrumb duplication on templates with existing schema
- Mitigations:
  - build validation
  - route/RSS guards
  - generated HTML spot checks
  - external audit rerun after content fixes
