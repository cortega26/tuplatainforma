# Monedario Progress Log

Backlog completions recorded below.

## Logging Rules
- Add one entry per completed backlog task.
- Always reference the backlog task ID exactly as written in `docs/development/backlog.md`.
- If a task is partially advanced but not finished, update its status in `docs/development/backlog.md` instead of adding a completion entry here.
- Record measurable impact only when there is observable evidence.

## Entry Template

```md
YYYY-MM-DD
MB-###
Short description of result
Observed impact (if any)
```

## Entries

2026-03-08
MB-001
Baseline snapshot documented from the public sitemap, live crawl, and repository-visible configuration.
Observed impact: 166 submitted URLs inventoried; search KPI fields remain unavailable pending search-platform access.

2026-03-08
MB-025
Full technical SEO crawl completed with prioritized findings across sitemap hygiene, metadata, canonical rendering, and broken links.
Observed impact: 166 live sitemap URLs crawled; 81 low-value sitemap URLs, 88 duplicate descriptions, 11 broken external targets, and 1 broken internal-link pattern identified.

2026-03-08
MB-027
Structured data audit completed across homepage, articles, calculators, glossary, legal explainers, and guide hubs.
Observed impact: 27 article pages found with duplicate BlogPosting output; 32 key non-article URLs reviewed with only generic WebSite schema.

2026-03-08
MB-007
Canonical, Open Graph, Twitter, and template metadata outputs were normalized so article identity fields render as absolute URLs and archive/tag/search descriptions no longer default to the same generic snippet.
Observed impact: sample article build output now emits absolute canonical, `og:url`, and `twitter:url`; low-value listing templates now ship differentiated metadata.

2026-03-08
MB-008
Explicit noindex and sitemap-exclusion policy was implemented for `/search/`, `/tags/`, tag detail pages, and paginated post archives beyond page 1.
Observed impact: build sitemap excludes `/search/`, `/tags/`, `/tags/**`, and `/posts/2+/`; affected templates now emit `noindex,follow`.

2026-03-08
MB-029
Broken official-source links from Sprint 1A were replaced with live official equivalents, and the article share-widget mail link that triggered the `/cdn-cgi/l/email-protection` broken-link pattern was removed.
Observed impact: external audit no longer reports official-source 404s; remaining non-blocking external failures are host-side responses (`pdichile.cl` 403 and LinkedIn 999).

2026-03-08
MB-030
Duplicate article `BlogPosting` schema was removed, article/schema URL fields were normalized to absolute values, and breadcrumb/DefinedTerm schema coverage was extended across supported glossary, calculator, and hub templates.
Observed impact: sampled article build output now contains exactly one `BlogPosting` and one `BreadcrumbList`; glossary detail pages emit `DefinedTerm`.

2026-03-08
MB-004
Keyword universe and keyword-to-URL map completed for Monedario's priority Chile finance clusters, with current URL ownership, gaps, and cannibalization risks documented.
Observed impact: semantic coverage is now mapped across sueldo, AFP/APV, deuda, cesantia, UF/IPC, impuestos, and presupuesto using the cleaned post/calculator/guide inventory.

2026-03-08
MB-028
Live SERP intent analysis completed for priority clusters, including dominant page types, calculator viability, official-source pressure, and explicit architectural decisions per cluster.
Observed impact: the next sprint can now prioritize sueldo liquido/remuneraciones first and avoid broad cluster builds where official results dominate or intent is structurally split.

2026-03-08
MB-031
Founder-confirmed manual ownership verification for Google Search Console and Bing Webmaster was recorded as satisfying the prerequisite-validation step; remaining agent-side authenticated access needs were split into a separate follow-up.
Observed impact: stale blocker logic was removed from the backlog, allowing MB-002 to move out of prerequisite blockage without falsely claiming direct platform access in this environment.

2026-03-08
MB-033
Canonical cluster taxonomy and hub URL strategy were resolved by preserving the `/guias/<cluster>/` pattern, creating the dedicated `sueldo-remuneraciones` cluster, and separating it from `empleo-ingresos` and `pensiones-afp`.
Observed impact: new sueldo/remuneraciones hub shipped without changing the public guide URL strategy or violating the slug-based URL invariant.

2026-03-08
MB-009
The first production cluster was built around sueldo líquido/remuneraciones with a live hub, connected calculator path, supporting salary articles, and contextual glossary/legal support.
Observed impact: `/guias/sueldo-remuneraciones/` now provides a coherent navigation path from explanation to calculation to support assets.

2026-03-08
MB-016
Reusable article-to-calculator modules were implemented for sueldo/remuneraciones pages and connected to the live sueldo líquido calculator.
Observed impact: the sueldo article surfaces now expose structured calculator CTAs instead of relying only on inline links.

2026-03-08
MB-017
Reusable glossary/legal support blocks were implemented for sueldo/remuneraciones pages using glossary and legal explainer assets already published in the repository.
Observed impact: sueldo-cluster pages now route readers to AFP/AFC definitions and payroll-relevant legal explainers without adding noisy sitewide blocks.

2026-03-08
MB-034
Dedicated descuentos de sueldo satellite published and connected to the sueldo hub, calculator, pilar guide, liquidación explainer, and glossary/legal support assets.
Observed impact: the sueldo cluster now answers the broader `descuentos sueldo` intent without forcing readers through an AFP-only article.

2026-03-08
MB-035
Dedicated liquidación de sueldo explainer published with field-by-field reading guidance and wired into the sueldo hub, calculator, and related salary articles.
Observed impact: the sueldo cluster now covers the document-reading intent directly instead of treating liquidación only as a subsection inside the pilar guide.

2026-03-08
MB-032
Reusable authenticated automation was restored through the dedicated search-platform profile and a saved authenticated storage-state file that reopened both Google Search Console and Bing Webmaster in a fresh session.
Observed impact: a fresh browser session reached `sc-domain:monedario.cl` in Google Search Console and `https://monedario.cl/` in Bing Webmaster without manual re-login.

2026-03-08
MB-036
Google Search Console validation was executed for `sc-domain:monedario.cl` and `https://monedario.cl/sitemap-index.xml` was submitted from the authenticated Sitemaps screen.
Observed impact: Search Console now lists `https://monedario.cl/sitemap-index.xml` as submitted on `8 mar 2026`; indexation reports are still processing and the sitemap row currently shows `No se ha podido obtener`.

2026-03-08
MB-037
Bing Webmaster validation was executed for `https://monedario.cl/` and `https://monedario.cl/sitemap-index.xml` was submitted from the authenticated Sitemaps screen.
Observed impact: Bing Webmaster now lists `https://monedario.cl/sitemap-index.xml` as submitted on `3/8/2026` with status `Processing`.

2026-03-08
MB-002
The search-platform umbrella closed after the reusable authenticated automation path was restored and both Google Search Console and Bing Webmaster execution tasks were completed with real dashboard access.
Observed impact: both search platforms now have authenticated execution evidence and a submitted Monedario sitemap entry.

2026-03-09
MB-006
Homepage entry flow was restructured around problem-based paths and the final homepage-only performance recovery pass removed Astro view-transition runtime from `/`.
Observed impact: binding Lighthouse mobile rerun improved homepage metrics from Performance `99` / LCP `1.8s` / Speed Index `1.5s` to Performance `100` / LCP `1.2s` / Speed Index `0.8s`, while request count dropped from `5` to `4`.

2026-03-08
MB-005
Homepage metadata and hero positioning rewrite closed after a homepage-only font/LCP cleanup removed the remaining display-font dependency from the mobile render path.
Observed impact: binding local mobile Lighthouse now passes at Performance 100, LCP 1.5s, Speed Index 0.9s, CLS 0, and TBT 0ms.

2026-03-09
MB-003
Optional GA4-ready analytics instrumentation was added for article scroll depth, official-source outbound clicks, calculator starts/completions, and primary CTA clicks across homepage, article, and calculator journeys.
Observed impact: build now ships a dedicated analytics client bundle, 10 calculator detail pages emit start/completion hooks, and all required repo validation gates passed with no route removals or internal-link regressions.

2026-03-09
MB-026
Canonical internal-link architecture mapping was documented for the live and future Phase 2 clusters, including hub ownership, article/tool/support inventories, cross-cluster exits, and unresolved taxonomy splits that must constrain later hub work.
Observed impact: the repo now has one source-of-truth map for sueldo, pensiones/APV, deuda, cesantia, UF/costo de vida, impuestos, and presupuesto linking patterns, which narrows the next hub sprint to `MB-010` without widening runtime scope.
