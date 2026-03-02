# Context Contracts Registry

Last updated: 2026-03-02
Status: Active

## 1. Introduction

A contract is a stable semantic agreement (API, routing behavior, content shape, or guard policy) that consumers and tooling rely on.

Relationship with invariants:
- Invariants define what must always hold.
- Contracts define stable interfaces/behaviors and compatibility expectations.
- Every contract here maps to an existing gate or script output.

Related context docs:
- `context/INVARIANTS.md`
- `context/MODULE_INDEX.md`
- `context/CURRENT_STATE.md`

Authority order:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. Source code/comments

Change log:
- 2026-03-01: initial minimum viable contract registry for URLs/routes/RSS/frontmatter.
- 2026-03-01: added editorial structure/tone contracts with automated checks.
- 2026-03-01: editorial hardening v2 (substantive section rules and controlled dialect exceptions).
- 2026-03-01: added meta description contract (required, length range, duplicate guard).
- 2026-03-02: added editorial internal-linking contract (warning-first + explicit skip marker).
- 2026-03-02: added editorial cluster-awareness contract (mandatory cluster declaration + validity + intra-cluster linkage signal).
- 2026-03-02: added formal inter-cluster linking contract (hub/intra/inter types, causal heuristics, anti-stuffing limits).

## 2. Contracts

### `CONTRACT.PUBLIC_URLS`

- Scope: Public URL construction (routes, canonical links, RSS links, sitemap references).
- Source of truth: `slug` for public identity.
- Internal-only field: `post.id` is allowed for non-public technical use, never for public URL identity.
- Linked invariant: `URL.PUBLIC.NO_POST_ID`.
- Backward-compat expectations:
  - No public URL helpers may derive identity from `post.id`.
  - Existing public URLs must remain observable through route checks.
- Enforcement:
  - `pnpm run check:no-postid-urls`
  - `pnpm run check:routes`

### `CONTRACT.ROUTES_SNAPSHOT`

- Scope: Route inventory produced from content paths and compared against baseline.
- Source of truth:
  - Baseline: `docs/reports/routes_snapshot_before.json`
  - Current snapshot: `docs/reports/routes_snapshot_after.json`
  - Comparator logic: `scripts/compare-routes.mjs`
- What counts as route change:
  - Added route: present in current, absent in baseline (reported, non-blocking).
  - Removed route: present in baseline, absent in current (blocking).
- Backward-compat expectations:
  - Removals are breaking and must not pass gate.
  - Additions are accepted but must be visible in command output.
- Enforcement: `pnpm run check:routes`.
- Detection:
  - No changes: `[compare-routes] No route changes detected.`
  - Breaking: `[compare-routes] Removed routes detected:` and exit `1`.

### `CONTRACT.RSS_POLICY`

- Scope: RSS feed item continuity policy.
- Source of truth:
  - Baseline snapshot: `docs/reports/rss_snapshot.json`
  - Current snapshot: `docs/reports/rss_snapshot_after.json` (generated from `dist/rss.xml`)
  - Comparator logic: `scripts/compare-rss.mjs`
- Policy:
  - Removed links are forbidden (blocking).
  - Added links are allowed and reported.
- Backward-compat expectations:
  - Subscribers should not lose existing feed links.
  - New publications may expand feed entries without gate failure.
- Enforcement: `pnpm run check:rss`.
- Detection:
  - Breaking: `[compare-rss] Removed items detected (<N>):` and exit `1`.
  - Compliant summary: `[compare-rss] OK. baseline=<N> current=<N> removed=0 added=<N>`.

### `CONTRACT.FRONTMATTER_POLICY`

- Scope: Frontmatter schema/semantic checks for `src/data/blog/**/*.md` and `src/data/blog/**/*.mdx`.
- Source of truth:
  - Gate logic: `scripts/check-frontmatter.mjs`
  - Domain references: `docs/domain/CONTENT/INVARIANTS.md`, `docs/domain/CONTENT/CONTRACTS.md`
- Backward-compat expectations:
  - Required fields for publishable content remain enforced.
  - Deprecated keys remain blocked (`pubDatetime`, `modDatetime`, `canonicalURL`, `ogImage`).
  - Quality warnings do not block, but blocking errors fail the gate.
- Enforcement:
  - `pnpm run check:frontmatter`
  - Included transitively in `pnpm run check` and `pnpm run build`
- Detection:
  - Blocking: `[check-frontmatter] Errors: <N>` with exit `1`.
  - Passing: `[check-frontmatter] OK (no blocking errors).`

### `CONTRACT.ARTICLE_STRUCTURE`

- Scope: Long-form article layout in `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Structural checks: `scripts/check-editorial-structure.mjs`
  - Supporting metadata checks: `scripts/check-frontmatter.mjs`
- Baseline expectations:
  - Intro is concise (target <= 3 paragraphs before first H2; currently monitored as guidance).
  - Sections use descriptive subtitles (`## ...`), minimum two substantive non-TOC sections.
  - Trivial headings (`Introducción`, `Resumen`, `Conclusión`, `Cierre` variants) do not count toward the minimum section threshold.
  - Prefer explicit closure block (for example `Resumen`, `Conclusión`, or equivalent closing section).
  - Substantive sections require content floor (>= 8 words after removing code/images/markup noise).
- Backward-compat expectations:
  - Existing publishable articles remain compatible with the enforced minimum structure.
  - Structural regressions (missing metadata, missing sections, empty sections) must fail fast.
- Enforcement:
  - `pnpm run check:editorial-structure`
  - `pnpm run check:frontmatter`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.TITLE_H1_POLICY`

- Scope: Document-level H1 policy for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`
  - Editorial invariant references: `context/INVARIANTS.md` (`INVARIANT.EDITORIAL.TITLE_REQUIRED`, `INVARIANT.EDITORIAL.TITLE_MEANINGFUL`, `INVARIANT.EDITORIAL.NO_MARKDOWN_H1`, `INVARIANT.EDITORIAL.TITLE_SLUG_COHERENCE`)
- Baseline expectations:
  - `frontmatter.title` is the source of truth for rendered public H1.
  - Markdown body must not contain `# ...` headings to prevent double-H1 output.
  - `title` must be clear/specific (non-empty, non-generic, >=4 words).
  - `title` must represent the primary article intent.
  - Basic semantic coherence between slug and title is expected (warning when no significant token overlap).
- Backward-compat expectations:
  - Policy remains deterministic, regex/token-based, and fast (<1s class checks on current corpus).
  - Warning semantics for slug/title coherence are non-blocking unless escalated by future policy update.
- Enforcement:
  - `pnpm run check:editorial-structure`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.TITLE_UNIQUENESS`

- Scope: Editorial uniqueness policy for `frontmatter.title` (and filename-derived slug) in `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`
  - Editorial invariant references: `context/INVARIANTS.md` (`INVARIANT.EDITORIAL.NO_DUPLICATE_TITLES`, `INVARIANT.EDITORIAL.NO_DUPLICATE_SLUGS`)
- Baseline expectations:
  - Each article represents a unique intent.
  - Duplicate titles are forbidden because they create SEO cannibalization.
  - Duplicate slugs are forbidden.
  - If a theme is reused, title wording must clearly differentiate the intent/scope.
- Backward-compat expectations:
  - Uniqueness checks remain deterministic (exact normalized match) and dependency-free.
  - Future policy changes must preserve explicit detection and actionable fail output.
- Enforcement:
  - `pnpm run check:editorial-structure`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.TONE`

- Scope: Editorial tone consistency for audience `es-CL`.
- Source of truth:
  - Dialect guard: `scripts/check-dialect.mjs`
  - Canonical references: `docs/domain/CONTENT/UBIQUITOUS_LANGUAGE.md` and `context/INVARIANTS.md`
- Baseline expectations:
  - Chilean Spanish (`es-CL`) wording.
  - Direct, low-hype language (sin humo).
  - No exaggerated promises or absolute claims without source support.
  - Controlled exceptions for dialect checks:
    - quoted text in blockquotes (`> ...`)
    - explicit file marker `<!-- dialect-ignore -->` in first 10 lines
- Backward-compat expectations:
  - New edits must preserve existing tone baseline and avoid rioplatense voseo drift.
  - Mechanical dialect violations must fail gate.
- Enforcement:
  - `pnpm run check:dialect`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.META_DESCRIPTION`

- Scope: `description` frontmatter for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`
  - Editorial invariant references: `context/INVARIANTS.md`
- Purpose:
  - Improve snippet quality and CTR clarity in search results.
  - Keep one clear promise/value statement per article.
- Baseline expectations:
  - Required and non-empty.
  - Length policy:
    - `70..155` recommended
    - `156..200` tolerated with warning (non-blocking)
    - `>200` prohibited (blocking)
  - Normalized exact-match duplicates are forbidden (`toLowerCase` + trim + collapse whitespace).
  - Style: clear idea, no humo, no promesas absolutas no sustentadas.
- Backward-compat expectations:
  - Future changes may expand policy details (for example, normalization strategy) but must preserve deterministic checks and avoid breaking existing valid entries without explicit rationale.
- Enforcement:
  - `pnpm run check:editorial-structure`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.INTERNAL_LINKING`

- Scope: Internal linking policy for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`
  - Editorial invariant references: `context/INVARIANTS.md` (`INVARIANT.EDITORIAL.INTERNAL_LINKS_MIN`)
- Purpose:
  - Improve article-to-article navigation.
  - Strengthen topical authority through internal link graph.
  - Support internal SEO discoverability without forcing artificial linking.
- Baseline expectations:
  - Regla mínima: cada artículo debe tener `>=1` link interno relevante.
  - Recommendation (future-facing): `2..4` links internos útiles y contextuales, sin forzar.
  - Excepciones razonables: piezas `landing` o `standalone` pueden declarar opt-out explícito en frontmatter (`internalLinks: ignore` o `internal_links: ignore`).
  - Internal-link detection policy:
    - Gate execution is runtime-independent (no runtime import dependency).
    - Count markdown links targeting relative internal paths (`/`, `./`, `../`).
    - Ignore external domains, `mailto:`, anchors (`#...`), image links, and links inside fenced code blocks.
    - Absolute `http(s)` links count as internal only when `SITE_HOSTNAME` is defined via environment variable and the link hostname matches exactly.
    - If `SITE_HOSTNAME` is not defined, absolute links do not count as internal and do not produce additional errors.
- Backward-compat expectations:
  - Contract is warning-first and non-blocking in current phase.
  - Escalation to blocking requires explicit policy update (and ADR if gate semantics change).
- Enforcement:
  - `pnpm run check:editorial-structure` (warning-only counters)
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.CLUSTER_POLICY`

- Scope: Thematic cluster metadata and cohesion policy for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`
  - Registry references: `src/pages/guias/` directories and `context/MODULE_INDEX.md` explicit cluster listing
  - Editorial invariant references: `context/INVARIANTS.md` (`INVARIANT.EDITORIAL.CLUSTER_DECLARED`, `INVARIANT.EDITORIAL.CLUSTER_VALID`, `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN`)
  - Canonical invariant ID for intra-cluster minimum: `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN` (`INVARIANT.EDITORIAL.LINKING.INTRA_CLUSTER_MIN_1` is deprecated alias).
- Purpose:
  - Make `cluster` an explicit structural obligation in article frontmatter.
  - Anchor each article to declared thematic architecture (cluster registry).
  - Measure intra-cluster linking coherence as topical authority signal.
- Baseline expectations:
  - Rollout uses warning-first migration for missing cluster declaration.
  - `cluster` value must exist in allowed registry (guides folder or explicit context list) whenever declared.
  - Cluster names are registry-bound; ad-hoc/invented clusters are forbidden.
  - Article should include at least one internal link to another article sharing the same cluster.
  - Link counting follows existing internal-link rules and ignores fenced code blocks/images.
- Backward-compat expectations:
  - `cluster_missing` is warning-only during migration rollout.
  - `cluster_invalid` is blocking (exit code `1`) whenever cluster is declared with invalid value/type.
  - `cluster_link_warning` is warning-first and non-blocking (exit code remains `0` when only this counter is positive).
  - `cluster_missing` returns to blocking according to `INVARIANT.EDITORIAL.CLUSTER_DECLARED` rollout/sunset policy.
  - Policy remains runtime-agnostic and dependency-free.
- Enforcement:
  - `pnpm run check:editorial-structure`
  - `pnpm run check:editorial` (aggregated gate)

### `CONTRACT.EDITORIAL.INTER_CLUSTER_LINKING`

- Scope: Linking policy for `src/data/blog/**/*.md(x)` under cluster architecture.
- Source of truth:
  - `frontmatter.cluster` for article cluster identity.
  - `context/INTER_CLUSTER_LINKING.md` as canonical policy reference.
- Compatibility expectations:
  - No slug changes are required to comply with this contract.
  - No hub invention is allowed: hub links must target existing `/guias/<cluster>/`.
  - Existing route/public URL contracts remain unchanged (`CONTRACT.PUBLIC_URLS`).
- Rules (operational):
  - C1 link types:
    - Hub link: `/guias/<cluster>/`
    - Intra-cluster link: `/posts/<slug>/` to article with same `cluster`
    - Inter-cluster link: `/posts/<slug>/` to article with different `cluster`, only with causal justification
  - C2 minimum by article:
    - Hub link expected.
    - Intra-cluster `>=1` expected (warning-first in current gate).
    - Inter-cluster links are recommended `0..2`, never mandatory.
  - C3 allowed heuristics for inter-cluster links (at least one):
    - Prerequisite concept needed to understand current article.
    - Decision dependency across domains.
    - Risk mitigation to prevent common user errors.
  - C4 prohibitions:
    - No keyword-driven link stuffing.
    - No more than 2 inter-cluster links added per article in one edit.
    - No links to non-existent hubs or invented slugs.
- Enforcement:
  - PR review (human) for heuristic validity and max-per-edit limits.
  - Existing gates for structural/editorial integrity:
    - `pnpm run check:editorial-structure`
    - `pnpm run check:editorial`
- Rollout:
  - Gradual adoption.
  - Inter-cluster linking remains recommendation-first and non-blocking unless future ADR hardens gate semantics.
