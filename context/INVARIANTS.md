# Context Invariants Registry

Last updated: 2026-03-03
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
- 2026-03-02: added cluster-awareness invariants (declared cluster, valid cluster registry, intra-cluster linking warning).
- 2026-03-02: formalized inter-cluster linking policy invariants (hub required, intra-cluster min-1 alias, inter-cluster max-per-edit) with human-enforced review boundaries.
- 2026-03-03: added editorial AI pipeline invariants (cut-off date, source traceability, separation of duties, math/compliance mandatory triggers).
- 2026-03-05: added hero-image publication invariant (published article requires resolvable hero image + canonical public asset).
- 2026-03-05: added hero-image semantic selection invariant (image choice must derive from article reading, not metadata-only matching).
- 2026-03-07: added inline article image format invariant (AVIF by default with justified exception allowlist).

## 2. Invariant Index

| ID | Short name | Status | Gate/Enforcement |
|---|---|---|---|
| `URL.PUBLIC.NO_POST_ID` | Public URL identity without `post.id` | Active | `pnpm run check:no-postid-urls` |
| `ROUTES.NO_SILENT_CHANGES` | Public route deltas are detected | Active | `pnpm run check:routes` |
| `RSS.NO_REMOVALS` | RSS snapshot does not allow removals | Active | `pnpm run check:rss` |
| `FRONTMATTER.VALID` | Blog frontmatter meets required policy | Active | `pnpm run check:frontmatter` |
| `INVARIANT.EDITORIAL.STRUCTURE_MIN` | Articles meet minimum structural shape | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.DIALECT_ES_CL` | Editorial dialect guard for Chilean Spanish | Active | `pnpm run check:dialect` |
| `INVARIANT.EDITORIAL.CUT_OFF_DATE_REQUIRED` | YMYL content must display explicit cut-off date | Active | Manual review + `context/EDITORIAL_AI_PIPELINE.md` |
| `INVARIANT.EDITORIAL.NO_UNSOURCED_NUMBERS` | Critical numbers require source traceability or explicit TODO marker before publish | Active | Manual review + MathAuditReport |
| `INVARIANT.EDITORIAL.SEPARATION_OF_DUTIES` | Drafting cannot be audited/compliance-reviewed by the same agent role | Active | Manual review + publish packet role check |
| `INVARIANT.EDITORIAL.MATH_AUDIT_REQUIRED_WHEN_CALC` | Calculation-heavy content requires math audit before publish | Active | Manual review + `requires_calculation` gate in publish packet |
| `INVARIANT.EDITORIAL.COMPLIANCE_REVIEW_REQUIRED_WHEN_HIGH_RISK` | High regulatory sensitivity requires compliance report and human sign-off | Active | Manual review + `regulatory_sensitivity=alta` gate |
| `INVARIANT.EDITORIAL.NO_EMPTY_SECTIONS` | H2 sections cannot be empty | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_REQUIRED` | Description metadata is mandatory | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_LENGTH` | Description length stays in SEO range | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.META_DESCRIPTION_NO_DUPLICATES` | Description text cannot be duplicated | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_REQUIRED` | Each article must define non-empty frontmatter title | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_MEANINGFUL` | Title must be non-empty, specific, and non-generic | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.NO_MARKDOWN_H1` | Markdown body must not contain H1 headings | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TITLE_SLUG_COHERENCE` | Title should overlap with significant slug terms | Active | `pnpm run check:editorial-structure` (warning) |
| `INVARIANT.EDITORIAL.INTERNAL_LINKS_MIN` | Articles should include minimum internal linking | Active | `pnpm run check:editorial` (warning) |
| `INVARIANT.EDITORIAL.CLUSTER_DECLARED` | Every article declares non-empty string `cluster` in frontmatter | Active (rollout) | `pnpm run check:editorial-structure` (warning-first) |
| `INVARIANT.EDITORIAL.CLUSTER_VALID` | `cluster` belongs to registered cluster set | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.TOPIC_OWNER_UNIQUENESS` | A cluster/topic cannot have two publishable `owner` pages | Active | `pnpm run check:frontmatter` |
| `INVARIANT.EDITORIAL.TOPIC_OWNERSHIP_METADATA_HARDENED_CLUSTERS` | High-risk clusters should declare ownership metadata | Active (warning-first) | `pnpm run check:frontmatter`, `pnpm run audit:topic-overlap` |
| `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN` | Article should link to at least one same-cluster article | Active (Canonical) | `pnpm run check:editorial-structure` (warning) |
| `INVARIANT.EDITORIAL.LINKING.HUB_REQUIRED` | Clustered article should include a link to its hub `/guias/<cluster>/` | Active (manual) | PR review + `pnpm run check:editorial` |
| `INVARIANT.EDITORIAL.LINKING.INTRA_CLUSTER_MIN_1` | Alias for intra-cluster min rule | Deprecated (Alias) | Reference `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN` |
| `INVARIANT.EDITORIAL.LINKING.INTER_CLUSTER_MAX_2_PER_EDIT` | Inter-cluster links added in one edit should not exceed 2 per article | Active (manual) | PR review + `pnpm run check:editorial` |
| `INVARIANT.EDITORIAL.NO_DUPLICATE_TITLES` | Duplicate frontmatter titles are forbidden | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.NO_DUPLICATE_SLUGS` | Duplicate filename-derived slugs are forbidden | Active | `pnpm run check:editorial-structure` |
| `INVARIANT.EDITORIAL.HERO_IMAGE_PUBLISHED_REQUIRED` | Published article must have resolvable hero image and canonical public hero asset | Active | `node scripts/check-hero-images.mjs` |
| `INVARIANT.EDITORIAL.HERO_IMAGE_TEXT_MATCH_REQUIRED` | Hero image selection must derive from article text and preserve situation-level match | Active | `node scripts/check-hero-prompts.mjs` + artifact review |
| `INVARIANT.EDITORIAL.INLINE_IMAGE_AVIF_REQUIRED` | Inline article images must use AVIF unless explicitly justified | Active | `pnpm run check:images` |

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

### `INVARIANT.EDITORIAL.TOPIC_OWNER_UNIQUENESS`

- Statement: Dentro del mismo `cluster`, solo una URL publicable puede declarar `topicRole: owner` para un mismo `canonicalTopic`.
- Canonical source: `scripts/check-frontmatter.mjs`, `docs/editorial/NON_CANNIBALIZATION_PROCESS.md`.
- Rationale:
  - Evita double-owners que compiten por la misma necesidad primaria.
  - Convierte ownership editorial en una regla verificable, no solo documental.
  - Mantiene la detección con muy bajo falso positivo porque depende de metadata explícita.
- Enforcement: `pnpm run check:frontmatter`.
- Detection:
  - Blocking output includes: `Duplicate topic owner for "<cluster>::<canonicalTopic>"`.
  - Exit code: `1`.
- Examples:
  - Compliant: una sola pieza `owner` para `sueldo-remuneraciones::calcular-sueldo-liquido`.
  - Violation: dos artículos publicados con `topicRole: owner` y el mismo `canonicalTopic`.

### `INVARIANT.EDITORIAL.TOPIC_OWNERSHIP_METADATA_HARDENED_CLUSTERS`

- Statement: Los artículos publicados en clusters endurecidos (`sueldo-remuneraciones`, `pensiones-afp`, `ahorro-e-inversion`) deben declarar `topicRole` y `canonicalTopic`.
- Canonical source: `scripts/check-frontmatter.mjs`, `scripts/audit-topic-overlap.mjs`.
- Rationale:
  - Añade fricción real donde la canibalización ya fue observada o el cluster tiene más riesgo de deriva.
  - Limita el costo editorial al subconjunto donde el retorno es alto.
  - Permite una adopción gradual sin bloquear todo el corpus legacy.
- Enforcement:
  - `pnpm run check:frontmatter` (warning-first)
  - `pnpm run audit:topic-overlap`
- Detection:
  - Warning output includes: `missing "topicRole" and/or "canonicalTopic"`.
  - No bloquea por sí solo en esta fase.
- Examples:
  - Compliant: artículo publicado en `pensiones-afp` con `topicRole` y `canonicalTopic`.
  - Warning: artículo publicado en `ahorro-e-inversion` sin metadata de ownership.

### `INVARIANT.EDITORIAL.INLINE_IMAGE_AVIF_REQUIRED`

- Statement: Inline images embedded in article bodies must use `.avif` by default; non-AVIF formats are allowed only through an explicit justified exception declared in frontmatter.
- Canonical source: `scripts/check-images.mjs`, `src/content.config.ts`, `docs/adr/ADR-20260307-inline-article-image-avif-gate.md`.
- Rationale:
  - Prevents stale or ad-hoc image formats from bypassing editorial/media guardrails.
  - Keeps article-body media policy deterministic and reviewable.
  - Forces exceptions to be documented instead of silently tolerated.
- Enforcement: `pnpm run check:images`.
- Detection:
  - Blocking output includes: `inline image "<src>" must use .avif`.
  - Blocking output includes unresolved local paths and unused exception entries.
  - Passing output includes: `[check:images] ✅ All blog images pass format and size constraints.`
- Examples:
  - Compliant: `![Grafico](/images/posts/demo/chart.avif)`
  - Compliant exception: frontmatter `inlineImageExceptions` entry for `/images/posts/demo/legacy-chart.webp` with a concrete `reason`.
  - Violation: inline `.webp`, `.png`, remote image, or missing local image without matching justified exception.

### `INVARIANT.EDITORIAL.CLUSTER_DECLARED`

- Statement: Every article should declare frontmatter `cluster` as non-empty string scalar.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Makes thematic architecture explicit in machine-readable metadata.
  - Prevents silent editorial drift outside declared topical clusters.
  - Enables deterministic cluster-level CI verification.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Current phase (warning-first rollout): `cluster_missing>0` is reported as warning and does not block by itself.
  - Failure output includes: `missing required "cluster"` or `"cluster" must be a string scalar`.
  - Summary includes: `cluster_missing=<N>`, `cluster_with_value=<N>`, `cluster_coverage_pct=<N>`.
- Rollout / Sunset Policy:
  - This invariant becomes blocking when `cluster_coverage_pct >= 95` for 2 consecutive PRs, or when repository coverage reaches `100%`.
  - Coverage metric source is the `check:editorial-structure` summary counters.
- Examples:
  - Compliant: frontmatter contains `cluster: ahorro-inversion`.
  - Violation: missing, blank, list/object, boolean/number `cluster`.

### `INVARIANT.EDITORIAL.CLUSTER_VALID`

- Statement: When `cluster` is declared, its value must be registered either by folder under `src/pages/guias/` or explicit listing in `context/MODULE_INDEX.md`.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Aligns article-level metadata with canonical thematic architecture.
  - Prevents ad-hoc cluster names with no navigational/structural backing.
  - Keeps cluster vocabulary auditable and centralized.
- Enforcement: `pnpm run check:editorial-structure`.
- Detection:
  - Blocking condition: `cluster_invalid>0`.
  - Failure output includes: `"cluster" value "<value>" is not registered...`.
  - Summary includes: `cluster_invalid=<N>`.
- Examples:
  - Compliant: `cluster` matches a valid registry entry.
  - Violation: `cluster` value not present in folder/index registry.

### `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN`

- Status: Active (Canonical)
- Aliases:
  - `INVARIANT.EDITORIAL.LINKING.INTRA_CLUSTER_MIN_1` (deprecated alias)
- Statement: Each article with valid cluster assignment should include at least `1` internal markdown link to another article in the same cluster.
- Canonical source: `scripts/check-editorial-structure.mjs`.
- Rationale:
  - Reinforces topical authority through explicit intra-cluster linkage.
  - Supports discoverability and crawl depth within thematic groups.
  - Provides measurable cluster cohesion without runtime coupling.
- Enforcement: `pnpm run check:editorial-structure` (warning-first).
- Detection:
  - Warning condition: `cluster_link_warning=<N>` when intra-cluster links are below minimum.
  - Counting policy:
    - Uses existing internal-link rules (relative links + same-host absolutes when `SITE_HOSTNAME` is set).
    - Ignores fenced code blocks and images.
    - Counts links only when target article shares identical cluster and is not self-link.
  - Exit behavior: warning-only (non-blocking) while `cluster_missing=0` and `cluster_invalid=0`.
- Examples:
  - Compliant: article links to at least one `/posts/<slug>/` in same cluster.
  - Warning: article has zero same-cluster internal links.

### `INVARIANT.EDITORIAL.LINKING.HUB_REQUIRED`

- Statement: Todo artículo con `frontmatter.cluster` debe incluir al menos un link al hub canónico de su clúster (`/guias/<cluster>/`).
- Rationale:
  - Mantiene conexión explícita entre nivel artículo y nivel hub.
  - Mejora discovery temático sin depender de navegación incidental.
  - Evita islas de contenido dentro de clústeres.
- Enforcement (humano):
  - Revisión de PR obligatoria: validar presencia de link hub cuando se crea o edita artículo clusterizado.
  - Referencia canónica de política: `context/INTER_CLUSTER_LINKING.md`.
- Detection:
  - Señal de salud editorial general: `pnpm run check:editorial`.
  - Verificación puntual en diff del artículo editado (link `/guias/<cluster>/` visible en contenido).
- Examples:
  - Compliant: artículo `cluster: deuda-credito` contiene link a `/guias/deuda-credito/`.
  - Violation: artículo clusterizado sin ningún link al hub de su propio clúster.

### `INVARIANT.EDITORIAL.LINKING.INTRA_CLUSTER_MIN_1`

- Status: Deprecated (Alias)
- Canonical ID: `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN`
- Reason: Avoid duplication and semantic drift.
- Behavior: No operational difference; reference canonical ID moving forward.
- Notes:
  - Keep this alias only for backward-compatible reading of previous PR discussions.
  - New references must use the canonical ID.

### `INVARIANT.EDITORIAL.LINKING.INTER_CLUSTER_MAX_2_PER_EDIT`

- Statement: En una sola edición de artículo, los links inter-cluster agregados no deben exceder `2`.
- Rationale:
  - Previene link stuffing y desvío temático por optimización SEO mecánica.
  - Obliga a priorizar links inter-cluster por necesidad real de lectura.
  - Mantiene una relación señal/ruido estable para usuarios y buscadores.
- Enforcement (humano):
  - Regla de revisión de PR: contar links inter-cluster añadidos por artículo en el diff.
  - Requiere justificación causal (prerrequisito, dependencia de decisión o mitigación de riesgo).
- Detection:
  - `pnpm run check:editorial` para validar integridad editorial general.
  - Inspección manual del diff para confirmar que `inter-cluster added <= 2` por artículo.
- Examples:
  - Compliant: se agrega 1 link a otro clúster por dependencia de decisión.
  - Violation: en una sola edición se agregan 3+ links inter-cluster sin necesidad causal explícita.

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

### `INVARIANT.EDITORIAL.HERO_IMAGE_PUBLISHED_REQUIRED`

- Statement: Every published article (`draft !== true`) must define a resolvable `heroImage` and have a canonical public hero asset in `public/images/hero/<slug>.avif|.webp`.
- Canonical source: `scripts/check-hero-images.mjs`, `context/EDITORIAL_IMAGE_SYSTEM.md`.
- Rationale:
  - Avoids published entries without visual identity.
  - Guarantees deterministic social/card rendering availability.
  - Keeps image contract auditable and CI-enforced.
- Enforcement: `node scripts/check-hero-images.mjs`.
- Detection:
  - Blocking condition: missing/invalid `heroImage` in published article frontmatter.
  - Blocking condition: missing canonical public asset by slug.
  - Blocking condition: unsupported extension or file size budget violation.
- Examples:
  - Compliant: publishable article with valid `heroImage` and existing `public/images/hero/<slug>.avif`.
  - Violation: publishable article with missing hero image or missing canonical public asset.

### `INVARIANT.EDITORIAL.HERO_IMAGE_TEXT_MATCH_REQUIRED`

- Statement: Every new or refreshed hero image must be chosen from a reading of the article text and must match the reader situation described by the article, not only its metadata.
- Canonical source: `context/EDITORIAL_IMAGE_SYSTEM.md` (v3.3, Section 13.4).
- Rationale:
  - Improves editorial relevance beyond topic-level tagging.
  - Prevents generic or misleading finance imagery.
  - Preserves visual consistency through a controlled scene system instead of freeform image intuition.
- Enforcement: `node scripts/check-hero-prompts.mjs` (text-backed evidence presence) + human review for final scene quality.
- Detection:
  - Required evidence must identify `readerSituation`, `primaryIntent`, `templateChoice`, and chosen scene/icon.
  - Metadata-only selection (`slug`, `tags`, `category`, `cluster`) without article-text justification is non-compliant and blocking.
  - Review should reject image choices that do not reflect the main situation described in the body.
- Examples:
  - Compliant: fraud article mapped to alert posture + phone-based scene because the body centers on suspicious contact and immediate defensive action.
  - Violation: debt article assigned a generic bank icon only because the `category` is `deuda-credito`, without body-level match.

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

### `INVARIANT.EDITORIAL.CUT_OFF_DATE_REQUIRED`

- Statement: Every YMYL article must include a visible cut-off date (`Fecha de corte`) in public-facing content.
- Canonical source: `context/EDITORIAL_AI_PIPELINE.md`, `docs/editorial/NORMA_YMYL.md`.
- Rationale:
  - Prevents temporal ambiguity in sensitive financial/legal guidance.
  - Makes freshness limits explicit for readers and reviewers.
  - Reduces risk of stale-rule interpretation.
- Enforcement: Manual review (current phase), tied to YMYL editorial pipeline publish gate.
- Detection:
  - Required evidence in `07-publish-packet.md`: cut-off date value + location in final article.
  - Missing visible date blocks publication.
- Examples:
  - Compliant: visible block `Fecha de corte: 2026-03-03`.
  - Violation: YMYL article with no explicit cut-off date.

### `INVARIANT.EDITORIAL.NO_UNSOURCED_NUMBERS`

- Statement: Every critical numeric claim must include source traceability; draft-phase unresolved numbers must be marked `TODO:SOURCE`.
- Canonical source: `context/EDITORIAL_AI_PIPELINE.md`, `CONTRACT.EDITORIAL.MATH_AUDIT_REPORT`.
- Rationale:
  - Prevents unsupported numerical claims in YMYL content.
  - Creates deterministic reviewer workflow for citation closure.
  - Improves credibility and auditability of published numbers.
- Enforcement: Manual review via math audit and publish packet (current phase).
- Detection:
  - `05-math-audit.md` must map each critical number to source/recalculation status.
  - `07-publish-packet.md` must declare unresolved `TODO:SOURCE = 0` for publish-ready state.
- Examples:
  - Compliant: claim includes source link or citation ID tied to dossier.
  - Violation: critical number without source and without `TODO:SOURCE` marker.

### `INVARIANT.EDITORIAL.SEPARATION_OF_DUTIES`

- Statement: `DraftAgent` must not be the same role identity as `MathAuditAgent` or `ComplianceAgent` for the same run.
- Canonical source: `context/EDITORIAL_AI_PIPELINE.md`.
- Rationale:
  - Reduces self-verification bias in sensitive content.
  - Enforces independent control points before publication.
  - Makes review accountability explicit.
- Enforcement: Manual review-enforced (role declaration in artifact bundle).
- Detection:
  - `07-publish-packet.md` must include role identity map and explicit inequality check.
  - Any role collision blocks publication.
- Examples:
  - Compliant: `draft_agent=claude`, `math_audit_agent=gpt-5.2`, `compliance_agent=gemini`.
  - Violation: `draft_agent` and `math_audit_agent` set to same role identity.

### `INVARIANT.EDITORIAL.MATH_AUDIT_REQUIRED_WHEN_CALC`

- Statement: If brief declares `requires_calculation=true`, publication requires a completed math audit report.
- Canonical source: `context/EDITORIAL_AI_PIPELINE.md`, `CONTRACT.EDITORIAL.BRIEF`, `CONTRACT.EDITORIAL.MATH_AUDIT_REPORT`.
- Rationale:
  - Prevents publication of unverified calculations.
  - Forces explicit numerical validation on formula-driven content.
  - Aligns YMYL quality control with calculation risk.
- Enforcement: Manual gate in publish packet (current phase).
- Detection:
  - `01-brief.yaml` includes `requires_calculation`.
  - When value is `true`, `05-math-audit.md` must exist and include verdict.
  - Missing report blocks publication.
- Examples:
  - Compliant: tax/AFP calculation article with complete math audit.
  - Violation: `requires_calculation=true` and no math audit artifact.

### `INVARIANT.EDITORIAL.COMPLIANCE_REVIEW_REQUIRED_WHEN_HIGH_RISK`

- Statement: If brief declares `regulatory_sensitivity=alta`, publication requires compliance report and explicit human sign-off.
- Canonical source: `context/EDITORIAL_AI_PIPELINE.md`, `CONTRACT.EDITORIAL.COMPLIANCE_REPORT`.
- Rationale:
  - Adds legal/regulatory safety control for high-risk YMYL updates.
  - Prevents automated publication without policy/legal sanity check.
  - Makes accountability explicit for sensitive guidance.
- Enforcement: Manual gate in publish packet (current phase).
- Detection:
  - `01-brief.yaml` includes `regulatory_sensitivity`.
  - When value is `alta`, `06-compliance.md` plus `HumanEditor` approval must be present in `07-publish-packet.md`.
  - Missing evidence blocks publication.
- Examples:
  - Compliant: high-risk article with compliance findings and human approval.
  - Violation: high-risk article published without compliance artifact or sign-off.

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
