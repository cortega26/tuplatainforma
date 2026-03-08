# Monedario Progress Log

Backlog completions recorded below.

## Logging Rules
- Add one entry per completed backlog task.
- Always reference the backlog task ID exactly as written in `backlog.md`.
- If a task is partially advanced but not finished, update its status in `backlog.md` instead of adding a completion entry here.
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
