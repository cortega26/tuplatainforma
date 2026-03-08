# Structured Data Audit — Monedario.cl

## Audit Snapshot

- **Audit date:** 2026-03-08
- **Method:**
  - live HTML inspection of representative public URLs
  - source inspection of `src/layouts/Layout.astro`, `src/layouts/PostDetails.astro`, `src/components/ArticleJsonLd.astro`, `src/pages/glosario/[slug].astro`, `src/pages/leyes/[slug].astro`, and hub / calculator templates
- **Templates reviewed:**
  - homepage
  - article pages
  - calculator pages
  - glossary pages
  - legal explainers
  - hub / category pages
  - breadcrumb implementation

## Cross-Template Summary

- `WebSite` schema is present almost everywhere through the shared layout.
- Article pages have the most schema coverage, but they currently emit **duplicate `BlogPosting` markup** and use **relative URLs** inside JSON-LD.
- Legal explainer pages are the strongest non-article implementation: `Legislation` + `BreadcrumbList`.
- Calculator, glossary, and guide hub pages currently expose only `WebSite` schema.
- Breadcrumb structured data exists on article and law pages only; visible breadcrumb navigation is broader than schema coverage.

## Template Findings

### Homepage

- **Representative URL:** `https://monedario.cl/`
- **Schema currently present:** `WebSite`
- **Schema missing:**
  - `Organization` is not emitted as its own entity
- **Schema quality issues:**
  - none severe
- **Field completeness issues:**
  - no standalone organization logo / sameAs / publisher profile graph
- **Unsupported or risky markup:** none observed
- **Recommended actions:**
  - add a standalone `Organization` entity once final canonical brand fields are confirmed
  - keep homepage schema conservative; do not add unsupported SEO-only types

### Article Pages

- **Representative URL:** `https://monedario.cl/posts/como-calcular-sueldo-liquido/`
- **Schema currently present:**
  - `BlogPosting`
  - second `BlogPosting`
  - `BreadcrumbList`
  - `FAQPage` on `7` article pages with qualifying FAQ sections
- **Schema missing:** no major article-type gap
- **Schema quality issues:**
  - all `27` article pages emit **two** `BlogPosting` objects
  - both article schema implementations currently use **relative** `url` / `@id` values such as `/posts/como-calcular-sueldo-liquido/`
  - article breadcrumb final item also uses the same relative URL
- **Field completeness issues:**
  - publisher information exists, but article identity fields should be normalized to absolute URLs
- **Unsupported or risky markup:**
  - no inappropriate schema type was found
  - FAQ extraction is automatic from heading structure, so it should remain editorially reviewed for intent and answer quality
- **Recommended actions:**
  - keep one canonical article schema source only
  - convert article `url`, `@id`, and breadcrumb item URLs to absolute values
  - keep `FAQPage` only where the page truly contains a user-facing FAQ block

### Calculator Pages

- **Representative URL:** `https://monedario.cl/calculadoras/sueldo-liquido/`
- **Schema currently present:** `WebSite`
- **Schema missing:**
  - `BreadcrumbList`
  - no explicit calculator / tool page schema layer
- **Schema quality issues:**
  - shared layout schema is too generic for a tool page
- **Field completeness issues:**
  - no structured expression of tool name, purpose, or page position within the site
- **Unsupported or risky markup:**
  - do **not** invent unsupported "calculator rich result" markup
  - `FinancialService` is not justified for these individual calculator pages in their current form
- **Recommended actions:**
  - add `BreadcrumbList`
  - optionally add a restrained semantic page schema such as `WebPage` or `WebApplication` only if the implementation is maintained consistently and not presented as a rich-result shortcut

### Glossary Pages

- **Representative URL:** `https://monedario.cl/glosario/afp/`
- **Schema currently present:** `WebSite`
- **Schema missing:**
  - `DefinedTerm`
  - `BreadcrumbList`
- **Schema quality issues:**
  - visible breadcrumb navigation exists, but no breadcrumb schema is emitted
- **Field completeness issues:**
  - the term, short definition, and glossary-set relationship are not represented in structured data
- **Unsupported or risky markup:**
  - avoid `Article` or `FAQPage` unless the page content actually changes to match those intents
- **Recommended actions:**
  - add `DefinedTerm` with term name, description, URL, and glossary context
  - add `BreadcrumbList`

### Legal Explainers

- **Representative URL:** `https://monedario.cl/leyes/ley-19628-proteccion-datos/`
- **Schema currently present:**
  - `WebSite`
  - `Legislation`
  - `BreadcrumbList`
- **Schema missing:** no major gap for the current template intent
- **Schema quality issues:**
  - low risk; the implementation is materially stronger than other non-article templates
- **Field completeness issues:**
  - generally good coverage of identifier, effective date, modification date, country, source, and publisher
- **Unsupported or risky markup:** none material
- **Recommended actions:**
  - preserve this pattern
  - optionally align publisher identity with any future site-level `Organization` entity

### Hub / Category Pages

- **Representative URL:** `https://monedario.cl/guias/pensiones-afp/`
- **Schema currently present:** `WebSite`
- **Schema missing:**
  - `BreadcrumbList`
  - no structured representation of the hub as a collection page
- **Schema quality issues:**
  - guide hubs behave like collection pages, but schema does not reflect that role
- **Field completeness issues:**
  - no structured item list or hub identity for the cluster surface
- **Unsupported or risky markup:**
  - avoid `Article` unless these pages become article-like editorial pages
- **Recommended actions:**
  - add `BreadcrumbList`
  - consider `CollectionPage` or `ItemList` if the team wants the hub list structure represented semantically

## Breadcrumb Structure Audit

- **Breadcrumb schema currently present on:**
  - all `27` article pages
  - all `15` legal explainer pages
- **Breadcrumb schema currently missing from:**
  - glossary detail pages
  - calculator detail pages
  - guide hub pages
  - other pages that display breadcrumb-like navigation without structured markup
- **Quality issue on article breadcrumbs:**
  - the final breadcrumb item uses a relative URL because it inherits the same canonical bug affecting article pages

## Schema Type Coverage Snapshot

| Template group | URLs reviewed | Current types observed |
| --- | ---: | --- |
| Homepage | 1 | `WebSite` |
| Articles | 27 | `BlogPosting`, `BreadcrumbList`, `FAQPage` on 7 URLs |
| Calculators | 10 | `WebSite` |
| Glossary | 15 | `WebSite` |
| Legal explainers | 15 | `WebSite`, `Legislation`, `BreadcrumbList` |
| Guide hubs | 7 | `WebSite` |

## Priority Actions

### High priority

1. Remove duplicate `BlogPosting` output from article pages.
2. Fix article schema URLs so `url`, `@id`, and breadcrumb item values are absolute.
3. Extend breadcrumb schema to glossary, calculator, and guide hub templates.

### Medium priority

1. Add `DefinedTerm` to glossary detail pages.
2. Add a collection-oriented schema layer to guide hubs only if maintained consistently.
3. Keep calculator schema conservative; avoid unsupported SEO-only inventions.

## Follow-Up Backlog Recommendations

- Complete a dedicated structured-data remediation task covering:
  - article deduplication
  - absolute article schema URLs
  - `BreadcrumbList` rollout beyond articles and laws
  - `DefinedTerm` rollout for glossary detail pages
