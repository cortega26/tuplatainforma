# Context Contracts Registry

Last updated: 2026-03-03
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
- 2026-03-02: added CONTRACT.YMYL_RESPONSE_STRUCTURE (respuesta rápida, vigencia temporal y separación de reforma/aplicación).
- 2026-03-03: added editorial AI artifact contracts (`CONTRACT.EDITORIAL.*`) for quality-first YMYL pipeline enforcement.
- 2026-03-05: added hero image pipeline contract for deterministic prompt generation and published-asset enforcement.
- 2026-03-05: hardened hero image pipeline contract to require article-reading-based semantic selection.
- 2026-03-06: scoped strict editorial artifact enforcement in PR CI to changed YMYL posts/artifact roots; legacy corpus debt remains explicit in backlog.
- 2026-03-07: added inline article image format contract and justified exception allowlist semantics.

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
  - Current snapshot: `output/validation/routes_snapshot_after.json`
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
  - Current snapshot: `output/validation/rss_snapshot_after.json` (generated from `dist/rss.xml`)
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

### `CONTRACT.EDITORIAL.HERO_IMAGE_PIPELINE`

- Scope: Deterministic hero-image prompt derivation, optional generation, and publication-time asset validation for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Pipeline scripts: `scripts/hero-images/*`
  - Guard gate: `scripts/check-hero-images.mjs`
  - Policy/spec: `context/EDITORIAL_IMAGE_SYSTEM.md`
- Baseline expectations:
  - Publishable criterion: `draft !== true`.
  - Every publishable article must expose a resolvable `heroImage` value.
  - Canonical public hero asset must exist by slug at `public/images/hero/<slug>.avif|.webp`.
  - Prompt derivation is deterministic from manifest input (stable sort + stable heuristics + `promptHash`).
  - Image selection is mandatory from article reading, not metadata-only matching.
  - Each prompt entry must preserve a situation-level mapping between article text and selected template/scene/icon.
  - The final visual choice must remain inside the controlled scene system defined by `context/EDITORIAL_IMAGE_SYSTEM.md`.
  - Generation is optional and key-gated; CI standard mode must not require API secrets.
- Backward-compat expectations:
  - Legacy `heroImage` path styles may coexist during migration, provided canonical public assets exist.
  - Hardening to public-only path mode requires explicit policy update.
  - Semantic selection may start from metadata heuristics, but publication requires text-backed confirmation.
- Enforcement:
  - `node scripts/hero-images/scan-articles.mjs`
  - `node scripts/hero-images/build-prompts.mjs`
  - `node scripts/check-hero-prompts.mjs`
  - `node scripts/check-hero-images.mjs`
  - Artifact/manual review for final text-to-scene quality until deeper semantic checks are automated

### `CONTRACT.EDITORIAL.INLINE_IMAGE_FORMAT`

- Scope: Inline images referenced from article bodies in `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-images.mjs`
  - Frontmatter schema: `src/content.config.ts`
  - Governance decision: `docs/adr/ADR-20260307-inline-article-image-avif-gate.md`
- Baseline expectations:
  - Inline article images use `.avif` by default.
  - Non-AVIF inline images require frontmatter `inlineImageExceptions`.
  - Each exception entry is an object with exact-match `src` and non-empty explanatory `reason`.
  - Unused or unnecessary exceptions are invalid.
  - Local inline image paths must resolve to an existing file.
- Backward-compat expectations:
  - Existing AVIF inline images remain valid with no frontmatter changes.
  - Legacy non-AVIF inline images must be converted or explicitly allowlisted before merge.
  - Future expansion of allowed inline formats requires an ADR because it changes gate semantics.
- Enforcement:
  - `pnpm run check:images`

### `CONTRACT.EDITORIAL.INTERNAL_LINKING`

- Scope: Internal linking policy for `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Gate logic: `scripts/check-editorial-structure.mjs`

### `CONTRACT.EDITORIAL.TOPIC_OWNERSHIP`

- Scope: metadata editorial mínima para ownership/no-canibalización en `src/data/blog/**/*.md(x)`.
- Source of truth:
  - Schema/runtime compatibility: `src/content.config.ts`
  - Contract enforcement: `scripts/check-frontmatter.mjs`
  - Observability/audit: `scripts/audit-topic-overlap.mjs`
- Baseline expectations:
  - `topicRole` is one of `owner | support | reference`.
  - `canonicalTopic` is a stable lowercase kebab-case identifier for the primary need addressed.
  - `topicRole` and `canonicalTopic` travel together: neither should appear alone.
  - In hardened clusters (`sueldo-remuneraciones`, `pensiones-afp`, `ahorro-e-inversion`), published articles must declare both fields.
  - In hardened clusters, `canonicalTopic` must come from the central registry in `src/config/editorial-topic-policy.mjs`.
  - Only one publishable `owner` may exist per `cluster + canonicalTopic`.
  - In hardened clusters, `support` and `reference` metadata cannot point to an ownerless topic.
  - `category: general` is not valid for hardened-cluster owner/support content; it is reserved for explicit unlisted reference material.
- Backward-compat expectations:
  - Rollout remains progressive outside hardened clusters.
  - Hardened clusters are no longer rollout territory for ownership metadata.
  - Existing lightweight `META` comments remain transitional audit input, not the canonical contract.
- Enforcement:
  - `pnpm run check:frontmatter`
  - `pnpm run audit:topic-overlap`
  - Decision record: `docs/adr/ADR-20260310-hardened-topic-ownership-gate.md`
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

### `CONTRACT.EDITORIAL.BRIEF`

- Scope: Structured execution input for one editorial run.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/01-brief.yaml`
  - Canonical pipeline spec: `context/EDITORIAL_AI_PIPELINE.md`
- Backward-compat expectations:
  - Required keys remain stable: `slug`, `query_anchor`, `ymyl`, `requires_calculation`, `regulatory_sensitivity`, `target_audience`, `cut_off_date`.
  - Optional keys may be added without breaking existing consumers.
- Enforcement: Manual-enforced (current phase), reviewed in PR/editorial workflow.
- Detection:
  - File exists and parses as YAML.
  - Required keys are present with valid scalar values.

### `CONTRACT.EDITORIAL.DOSSIER`

- Scope: Research dossier with source traceability and retrieval context.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/02-dossier.md`
  - Source list aligned to brief cut-off date.
- Backward-compat expectations:
  - Must include source references, retrieval date, and confidence/context notes.
  - Section names may evolve if required fields remain present.
- Enforcement: Manual-enforced (current phase).
- Detection:
  - Dossier contains explicit `Fecha de corte`.
  - Every critical claim candidate has citation mapping or explicit unresolved marker.

### `CONTRACT.EDITORIAL.OUTLINE`

- Scope: Publish-intent structure before drafting.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/03-outline.md`
  - Must align with YMYL response structure requirements.
- Backward-compat expectations:
  - Must keep explicit anchor answer section and section-level intent mapping.
  - Heading style may vary without changing semantic fields.
- Enforcement: Manual-enforced (current phase).
- Detection:
  - Outline includes `Respuesta rapida` (or equivalent), exceptions, and vigencia blocks.
  - Outline references at least one source-backed section from dossier.

### `CONTRACT.EDITORIAL.DRAFT`

- Scope: Main draft text produced before audits.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/04-draft.md`
  - Canonical policy references: `docs/editorial/NORMA_YMYL.md`, `CONTRACT.YMYL_RESPONSE_STRUCTURE`.
- Backward-compat expectations:
  - Draft must preserve answer-first YMYL structure and visible cut-off date.
  - Temporary unresolved figures are allowed only with explicit `TODO:SOURCE`.
- Enforcement:
  - Manual-enforced for artifact checks.
  - Script-enforced for repository-level editorial quality via `pnpm run check:editorial`.
- Detection:
  - Draft includes visible cut-off date marker.
  - Critical numbers are source-cited or marked `TODO:SOURCE`.

### `CONTRACT.EDITORIAL.MATH_AUDIT_REPORT`

- Scope: Independent numerical verification artifact.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/05-math-audit.md`
  - Trigger field: `requires_calculation` in brief.
- Backward-compat expectations:
  - Report must include table with: claim/number, source, recalculation method, result, discrepancy flag.
  - Verdict field (`pass`/`fail`) is mandatory.
- Enforcement: Manual-enforced; mandatory when `requires_calculation=true`.
- Detection:
  - For calculation-required runs, report existence is blocking.
  - Report must provide per-number traceability and final verdict.

### `CONTRACT.EDITORIAL.COMPLIANCE_REPORT`

- Scope: Chile regulatory/compliance review for editorial runs.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/06-compliance.md`
  - Trigger field: `regulatory_sensitivity` in brief.
- Backward-compat expectations:
  - Report must contain risk flags, severity, and corrective actions.
  - Human escalation section must remain explicit for high-risk cases.
- Enforcement: Manual-enforced; mandatory when `regulatory_sensitivity=alta`.
- Detection:
  - High-risk runs must include report plus explicit human review decision.
  - Missing report or missing resolution state blocks publication.

### `CONTRACT.EDITORIAL.PUBLISH_PACKET`

- Scope: Final publication bundle decision artifact.
- Source of truth:
  - `artifacts/editorial/<slug>/<run-id>/07-publish-packet.md`
  - Aggregates references to all previous artifacts.
- Backward-compat expectations:
  - Must preserve decision-critical fields: gate checklist, role separation evidence, unresolved TODO count, final decision (`publish`/`hold`).
  - New optional metadata can be added without breaking compatibility.
- Enforcement: Manual-enforced with existing script evidence attached.
- Detection:
  - Packet references all mandatory artifacts.
  - Confirms `DraftAgent != MathAuditAgent != ComplianceAgent`.
  - Confirms unresolved `TODO:SOURCE=0` for publish-ready state.
  - Includes command evidence for `check:frontmatter` and `check:editorial`.

### `CONTRACT.EDITORIAL.ARTIFACT_GATE`

- Scope: Automated artifact completeness validation for YMYL publication workflow.
- Source of truth:
  - `scripts/check-editorial-artifacts.mjs`
  - `.github/workflows/ci.yml`
  - `docs/adr/ADR-20260303-editorial-artifacts-gate-phase1.md`
  - `docs/adr/ADR-20260306-editorial-artifacts-pr-diff-scope.md`
- Baseline expectations:
  - Default repository-wide mode stays warn-only unless `EDITORIAL_ENFORCE=1`.
  - Strict mode is allowed for CI, but in `pull_request` context it scopes blocking evaluation to changed YMYL blog entries or their artifact roots.
  - Unchanged legacy YMYL debt remains visible through warn-only/full-corpus runs and must be tracked in `docs/TECH_DEBT_BACKLOG.md`.
- Backward-compat expectations:
  - Artifact contracts remain unchanged for any YMYL post that is added or substantively refreshed.
  - Unrelated PRs must not fail on pre-existing artifact debt outside the diff.
- Enforcement:
  - `pnpm run check:editorial-artifacts`
  - `pnpm run check:editorial`
- Detection:
  - Passing output includes `scope=changed` or `scope=all`.
  - Strict PR failures report only changed YMYL targets with missing artifact requirements.

## CONTRACT.YMYL_RESPONSE_STRUCTURE

**Scope:** Todo artículo clasificado como YMYL (finanzas personales, impuestos, previsión, subsidios, deudas, contratos laborales, seguridad financiera).

### Requisitos obligatorios

1. Debe existir un bloque explícito "Respuesta rápida" o equivalente, que contenga una regla concreta (número/criterio) alineada a la query ancla.
2. Debe declararse la vigencia o marco temporal de la regla.
3. Si el artículo menciona reformas o cambios normativos futuros, debe incluir separación explícita entre:
   - Qué está aprobado
   - Desde cuándo rige (vigencia legal)
   - Desde cuándo se implementa (aplicación operativa)
   - Comparación "hoy vs después"
4. Si el artículo contiene síntesis jurídica en tablas o resúmenes, debe incluir etiqueta visible de "resumen orientativo" con limitador de alcance.

### Violaciones consideradas críticas

- Respuestas abstractas que no entregan regla concreta.
- Confusión entre aprobación y aplicación.
- Ausencia de vigencia cuando la norma es temporal o sujeta a reforma.
- Extrapolaciones jurídicas sin respaldo o sin limitador.

### Severidad

Violación de este contrato se considera severidad ALTA en contexto YMYL y bloquea publicación hasta corrección.
