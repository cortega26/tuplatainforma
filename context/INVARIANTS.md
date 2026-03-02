# Context Invariants Registry

Last updated: 2026-03-02
Status: Active

## 1. Introduction

An invariant is a non-negotiable condition that must hold after every change.

Authority order for this file:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. Source code/comments

This file centralizes enforceable invariants only. It references canonical definitions instead of duplicating full constitutional text.

Related context docs:
- `context/CONTRACTS.md`
- `context/MODULE_INDEX.md`
- `context/CURRENT_STATE.md`

Change proposal protocol:
1. Reference affected invariant ID(s).
2. Explain reason and expected behavioral impact.
3. Update enforcement and detection evidence.
4. If architectural semantics change, create ADR in `docs/adr/`.

Change log:
- 2026-03-01: initial minimum viable registry for routing/URL/RSS/frontmatter guards.
- 2026-03-01: added enforceable editorial invariants and gates (`check:editorial-structure`, `check:dialect`).
- 2026-03-01: editorial hardening v2 (`NO_EMPTY_SECTIONS` raised to 8 real words, substantive H2 filtering, dialect exceptions).
- 2026-03-01: added SEO meta description editorial invariants (required + length + duplicate detection).
- 2026-03-02: added warning-first internal linking invariant with explicit frontmatter escape hatch.

## 2. Invariant Index

| ID | Short name | Status | Gate/Enforcement |
|---|---|---|---|
| `URL.PUBLIC.NO_POST_ID` | Public URL identity without `post.id` | Active | `pnpm run check:no-postid-urls` |
| `ROUTES.NO_SILENT_CHANGES` | Public route deltas are detected | Active | `pnpm run check:routes` |
| `RSS.NO_REMOVALS` | RSS snapshot does not allow removals | Active | `pnpm run check:rss` |
| `FRONTMATTER.VALID` | Blog frontmatter meets required policy | Active | `pnpm run check:frontmatter` |
| `INVARIANT.EDITORIAL.STRUCTURE_MIN` | Articles meet minimum structural shape | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.DIALECT_ES_CL` | Editorial dialect guard for Chilean Spanish | Active | `pnpm run check:dialect` |
| `INVARIANT.EDITORIAL.NO_EMPTY_SECTIONS` | H2 sections cannot be empty | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_REQUIRED` | Description metadata is mandatory | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_LENGTH` | Description length stays in SEO range | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_NO_DUPLICATES` | Description text cannot be duplicated | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_REQUIRED` | Each article must define non-empty frontmatter title | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_MEANINGFUL` | Title must be non-empty, specific, and non-generic | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.NO_MARKDOWN_H1` | Markdown body must not contain H1 headings | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_SLUG_COHERENCE` | Title should overlap with significant slug terms | Active | `pnpm run check:editorial-structure` (warning) |
| `INVARIANT.EDITORIAL.INTERNAL_LINKS_MIN` | Articles should include minimum internal linking | Active | `pnpm run check:editorial` (warning) |
| `INVARIANT.EDITORIAL.NO_DUPLICATE_TITLES` | Duplicate frontmatter titles are forbidden | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.NO_DUPLICATE_SLUGS` | Duplicate filename-derived slugs are forbidden | Active | `pnpm run check:editorial-structure` |

## 3. Invariants

### `URL.PUBLIC.NO_POST_ID`

- Statement: Public URL identity is derived from `slug`, never from `post.id`.
- Canonical source: `docs/AI_ENGINEERING_CONSTITUTION.md` (`URL.PUBLIC.NO_POST_ID`, sections 2.3 and 4.3).
- Rationale:
  - Decouples public identity from technical content IDs.
  - Prevents runtime SEO regressions from implementation details.
  - Keeps route strategy stable across internal refactors.
- Enforcement: `pnpm run check:no-postid-urls` (primary), `pnpm run check:routes` (regression guard).
- Detection:
  - Compliant output includes: `[check-no-postid-urls] OK. Scanned <N> source files...`
  - Failure output includes: `[check-no-postid-urls] Found <N> forbidden pattern(s):` and exit code `1`.
- Examples:
  - Compliant: `getCanonicalPathFromSlug(article.slug)`
  - Violation: `` `/posts/${post.id}/` ``

### `ROUTES.NO_SILENT_CHANGES`

- Statement: Route removals are blocking; route additions or no-change states are always surfaced by the route comparison gate.
- Canonical source: `AGENTS.md` Rule 3.2 + scripts `snapshot-routes`/`compare-routes`.
- Rationale:
  - Prevents accidental disappearance of public URLs.
  - Makes route expansion explicit in CI/local checks.
  - Preserves deterministic route baseline management.
- Enforcement: `pnpm run check:routes`.
- Detection:
  - No delta: `[compare-routes] No route changes detected.`
  - Additions (non-blocking): `[compare-routes] Added routes: <N>`
  - Blocking condition: `[compare-routes] Removed routes detected:` with exit code `1`.
- Examples:
  - Compliant: Add one new post route; command reports `Added routes: 1`.
  - Violation: Existing route missing from snapshot; command fails on removed routes.

### `RSS.NO_REMOVALS`

- Statement: RSS link removals against baseline are forbidden; additions are allowed and reported.
- Canonical source: scripts `rss-to-json` and `compare-rss`; policy aligned with AGENTS route-impact verification.
- Rationale:
  - Protects feed continuity for subscribers and aggregators.
  - Allows growth without blocking new publication entries.
  - Makes feed diffs explicit and auditable.
- Enforcement: `pnpm run check:rss`.
- Detection:
  - Blocking condition: `[compare-rss] Removed items detected (<N>):` with exit code `1`.
  - Allowed addition: `[compare-rss] Added items (<N>) are allowed:`
  - Compliant summary: `[compare-rss] OK. baseline=<N> current=<N> removed=0 added=<N>`
- Examples:
  - Compliant: New item appears in RSS; command reports `added=1`.
  - Violation: Baseline link disappears; command fails with removed items.

### `FRONTMATTER.VALID`

- Statement: Every blog entry frontmatter must satisfy required fields/types and block deprecated fields.
- Canonical source: `scripts/check-frontmatter.mjs`; domain references in `docs/domain/CONTENT/INVARIANTS.md` (INV-001..INV-014).
- Rationale:
  - Keeps content contract machine-valid for build/runtime.
  - Prevents schema drift from deprecated editorial keys.
  - Enforces explicit publish metadata (`slug`, `category`, dates).
- Enforcement: `pnpm run check:frontmatter` (also included in `pnpm run check` and `pnpm run build`).
- Detection:
  - Blocking condition: `[check-frontmatter] Errors: <N>` with exit code `1`.
  - Non-blocking quality output: `[check-frontmatter] Warnings: <N>`
  - Compliant summary: `[check-frontmatter] OK (no blocking errors).`
- Examples:
  - Compliant: article defines `slug`, `category`, `pubDate` with timezone, valid types.
  - Violation: missing `slug` or use of deprecated `canonicalURL`.

### `INVARIANT.EDITORIAL.STRUCTURE_MIN`

- Statement: Every article must have at least two substantive non-TOC H2 sections, non-empty meta description, and valid publication date.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Enforces a minimum readable structure for long-form content.
  - Avoids publishing entries without basic SEO/document metadata.
  - Keeps editorial quality checks deterministic and fast.
- Enforcement: `pnpm run check:editorial-structure` (included in `pnpm run check` through `check:editorial`).
- Detection:
  - Blocking output starts with: `[check-editorial-structure] FAIL:`
  - Blocking condition includes: fewer than 2 substantive H2 sections after excluding trivial headings (`Introduccion`, `Resumen`, `Conclusion`, `Cierre` variants).
  - Passing output starts with: `[check-editorial-structure] OK.`
- Examples:
  - Compliant: article with frontmatter `title/description/pubDate`, and 2+ substantive non-TOC `##` sections.
  - Violation: article with only `## Introducción` and `## Conclusión`.

### `INVARIANT.EDITORIAL.TITLE_REQUIRED`

- Statement: Every article must define a non-empty `title` in frontmatter.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Frontmatter `title` is the source of truth for rendered public H1.
  - Prevents publishable entries without clear top-level intent.
  - Keeps H1 policy aligned with Astro Paper rendering model.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking condition: `title_missing>0`.
  - Passing output includes: `title_missing=0`.
- Examples:
  - Compliant: frontmatter includes `title: "..."`.
  - Violation: missing/blank `title`.

### `INVARIANT.EDITORIAL.TITLE_MEANINGFUL`

- Statement: `title` must be specific and non-generic (`Artículo`, `Post`, `Guía`, `Contenido`, case-insensitive), and contain at least `4` real words.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Blocks placeholder titles that degrade clarity and SEO.
  - Enforces a minimal semantic signal for article intent.
  - Keeps checks deterministic without NLP tooling.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking condition: `title_meaningless>0`.
  - Failure examples include: `title is not meaningful` with word count below threshold or blacklisted generic text.
- Examples:
  - Compliant: `title: "Cómo calcular tu sueldo líquido en Chile"`.
  - Violation: `title: "Guía"` or `title: "Post"`.

### `INVARIANT.EDITORIAL.NO_MARKDOWN_H1`

- Statement: Markdown body must not contain H1 headings (`# ...`), because public H1 is rendered from `frontmatter.title`.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Prevents accidental double-H1 output in rendered article HTML.
  - Keeps Markdown hierarchy clean (starts at H2 and below).
  - Aligns editorial source with runtime heading strategy.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking condition: `markdown_h1_present>0`.
  - Failure output includes: `contains <N> markdown H1 heading(s); markdown H1 is forbidden...`.
- Examples:
  - Compliant: body starts with prose and `## ...` sections, no `# ...`.
  - Violation: body contains one or more `# ...` headings outside code fences.

### `INVARIANT.EDITORIAL.TITLE_SLUG_COHERENCE`

- Statement: `title` must have basic coherence with article slug: at least one significant slug token (hyphen split, simple stopwords removed) should appear in `title`.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Preserves minimum topical alignment between URL identity and article title.
  - Flags drift where title and slug describe different intents.
  - Keeps validation lightweight and deterministic.
- Enforcement: `pnpm run check:editorial-structure` (warning-only).
- Detection:
  - Warning condition: no overlap between significant slug tokens and title tokens.
  - Warning counter: `title_slug_warning=<N>`; non-blocking (exit code unaffected by this invariant alone).
- Examples:
  - Compliant: slug `como-calcular-sueldo-liquido` and title containing `calcular` or `sueldo`.
  - Warning: slug tokens and title tokens have zero overlap.

### `INVARIANT.EDITORIAL.INTERNAL_LINKS_MIN`

- Statement: Cada artículo debe incluir al menos `1` link interno relevante.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Refuerza navegación interna entre contenidos relacionados.
  - Mejora señales de autoridad temática y descubrimiento SEO interno.
  - Mantiene una validación editorial liviana y determinista.
- Enforcement: `pnpm run check:editorial` (`check:editorial-structure` warning-only; no bloqueante).
- Detection:
  - Warning condition: `internal_links_warning=<N>` cuando el artículo tiene menos de `1` link interno.
  - Escape hatch explícito: frontmatter `internalLinks: ignore` o `internal_links: ignore`.
  - Skip counter: `skipped_internal_links=<N>`.
  - Diseño desacoplado de runtime: el gate no importa `src/**`; `SITE_HOSTNAME` (env) es opcional para contar absolutos del mismo host.
  - Si `SITE_HOSTNAME` no está definido, solo links relativos (`/`, `./`, `../`) cuentan como internos.
  - Exit code: este invariante no falla el comando por sí solo (warning-first).
- Notes:
  - Política warning-first, candidata a endurecerse a bloqueante en una fase futura.
- Examples:
  - Compliant: artículo con link markdown interno relativo (por ejemplo, `/ruta`, `./ruta`, `../ruta`).
  - Warning: artículo sin links internos y sin escape hatch.

### `INVARIANT.EDITORIAL.NO_DUPLICATE_TITLES`

- Statement: Duplicate `frontmatter.title` values are forbidden (exact match after normalization).
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Prevents internal SEO cannibalization between articles.
  - Reduces ambiguous intent clustering in listings/search.
  - Keeps editorial identity unique and deterministic.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Normalization: `trim` + whitespace collapse + `toLowerCase`.
  - Blocking condition: `duplicate_titles>0`.
  - Failure output includes: `duplicate title "<normalized>"` and affected files.
- Examples:
  - Compliant: all titles normalize to unique values.
  - Violation: two or more files share same normalized title.

### `INVARIANT.EDITORIAL.NO_DUPLICATE_SLUGS`

- Statement: Duplicate slugs are forbidden.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Prevents URL identity collisions in content modeling.
  - Avoids ambiguous route/canonical semantics across entries.
  - Keeps slug strategy deterministic and auditable.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Slug source: filename without extension.
  - Blocking condition: `duplicate_slugs>0`.
  - Failure output includes: `duplicate slug "<slug>"` and affected files.
- Examples:
  - Compliant: unique filename-derived slug per article.
  - Violation: two files derive the same slug.

### `INVARIANT.EDITORIAL.DIALECT_ES_CL`

- Statement: Editorial source must not contain blacklisted rioplatense voseo forms (for example: `calculá`, `invertí`, `podés`, `querés`) outside controlled exceptions.
- Canonical source: `scripts/check-dialect.mjs`.
- Rationale:
  - Preserves dialect consistency with target audience (`es-CL`).
  - Prevents style drift in iterative content updates.
  - Keeps tone checks explicit and machine-enforceable.
- Enforcement: `pnpm run check:dialect` (included in `pnpm run check` through `check:editorial`).
- Detection:
  - Blocking output starts with: `[check-dialect] FAIL:`
  - Allowed exceptions:
    - Blockquote lines (`> ...`) are ignored.
    - Whole-file opt-out is allowed with `<!-- dialect-ignore -->` in the first 10 lines.
  - Passing output starts with: `[check-dialect] OK.`
- Examples:
  - Compliant: `puedes comparar costos antes de invertir`.
  - Violation: `podés comparar costos antes de invertir`.

### `INVARIANT.EDITORIAL.NO_EMPTY_SECTIONS`

- Statement: Substantive non-TOC H2 sections cannot be empty; each must have at least `8` real words after removing whitespace, code blocks, and images.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Prevents placeholder headings shipped without body content.
  - Reduces regressions from partial/unfinished edits.
  - Allows deterministic enforcement without NLP/LLM tooling.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking output includes: `section "<title>" has only <N> words (min 8, excluding code/images)`
  - Passing output starts with: `[check-editorial-structure] OK.`
- Examples:
  - Compliant: `## Costos` followed by paragraph/list/table with substantive text.
  - Violation: `## Costos` immediately followed by another `##` heading.

### `INVARIANT.EDITORIAL.META_DESCRIPTION_REQUIRED`

- Statement: Every article must define a non-empty meta description.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Ensures every published entry has snippet-ready SEO metadata.
  - Avoids ambiguous or empty previews in search surfaces.
  - Keeps metadata enforcement deterministic in editorial pipelines.
- Enforcement: `pnpm run check:editorial-structure` (included by `pnpm run check:editorial`).
- Detection:
  - Blocking output includes: `missing or empty "description"`
  - Summary counter: `missing=<N>`
- Examples:
  - Compliant: frontmatter contains `description: "..."`.
  - Violation: frontmatter missing `description` or with blank value.

### `INVARIANT.EDITORIAL.META_DESCRIPTION_LENGTH`

- Statement: Meta description length (trimmed) must be at least `70` Unicode characters, with hard maximum `200`; the recommended band is `70..155`, while `156..200` is allowed with warning.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Keeps snippets concise while preserving enough context.
  - Reduces truncation risk on common search result layouts.
  - Provides objective and testable editorial boundary.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking output includes: `description too short` or `description too long (... hard max 200)`
  - Non-blocking warning output includes: `description length <N> exceeds recommended max 155`
  - Summary counters: `short=<N>`, `long_fail=<N>`, `long_warning=<N>`
- Examples:
  - Compliant: description length `136`.
  - Warning-only: description length `183`.
  - Violation: description length `52` or `221`.

### `INVARIANT.EDITORIAL.META_DESCRIPTION_NO_DUPLICATES`

- Statement: Meta descriptions must be unique by normalized exact match (`toLowerCase` + `trim` + internal whitespace collapse).
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Prevents template-like duplication across distinct articles.
  - Improves SEO differentiation and SERP clarity.
  - Keeps duplicate detection deterministic and fast.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking output includes: `duplicate description: "<normalized>" -> <file list>`
  - Summary counter: `duplicates=<N>`
- Examples:
  - Compliant: each article has unique normalized description.
  - Violation: two files share the same normalized description text.
