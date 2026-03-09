# Technical SEO Audit — Monedario.cl

## Audit Snapshot

- **Audit date:** 2026-03-08
- **Crawl scope:** live public sitemap at `https://monedario.cl/sitemap-index.xml`
- **Pages crawled:** `166`
- **Method:** fetched every sitemap URL, extracted title / meta description / canonical / robots / JSON-LD / internal links / external links, then verified linked targets with bounded-time HTTP checks

## Executive Summary

- All `166` sitemap URLs returned HTTP `200`.
- The largest technical issue is sitemap hygiene:
  - `81` low-value URLs are present in the sitemap
  - tag URLs conflict with the current `robots.txt` policy
- All `27` article pages render relative canonical / `og:url` / `twitter:url` values.
- `88` URLs reuse the same meta description.
- `4` post archive URLs reuse the same page title.
- `11` externally linked official-source URLs returned real `404` responses.
- One broken internal URL pattern, `/cdn-cgi/l/email-protection`, appears across all `27` article pages.
- No internal redirect chains were found on sitemap URLs.
- No orphan pages were detected inside the crawled internal-link graph.

## Issue Inventory

### Critical

#### 1. Sitemap contains low-value URLs and conflicts with current crawl directives

- **Evidence:**
  - `81` sitemap URLs are low-value discovery surfaces:
    - `https://monedario.cl/search/`
    - `https://monedario.cl/tags/`
    - `79` tag detail URLs such as `https://monedario.cl/tags/afp/`
  - `robots.txt` explicitly disallows `/tags/*/`
  - Search page is indexable and included in the sitemap
- **Why this matters:** this is likely to create noisy coverage reports, dilute crawl budget, and blur the indexation target set before Search Console is even validated
- **Affected URL examples:**
  - `https://monedario.cl/search/`
  - `https://monedario.cl/tags/`
  - `https://monedario.cl/tags/afp/`
  - `https://monedario.cl/tags/impuestos/`
- **Recommended follow-up:**
  - Complete existing `MB-008` with an explicit keep / noindex / exclude decision for search and tag surfaces
  - Remove non-target URLs from the sitemap once policy is decided

### High

#### 2. Article pages emit relative canonical, Open Graph URL, and Twitter URL values

- **Evidence:** all `27` article pages rendered relative values such as `/posts/como-calcular-sueldo-liquido/` instead of absolute URLs
- **Affected URL examples:**
  - `https://monedario.cl/posts/como-calcular-sueldo-liquido/`
  - `https://monedario.cl/posts/cae-costo-real-credito-chile/`
  - `https://monedario.cl/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/`
- **Observed rendered values on article pages:**
  - canonical: `/posts/<slug>/`
  - `og:url`: `/posts/<slug>/`
  - `twitter:url`: `/posts/<slug>/`
- **Why this matters:** canonical identity and share metadata should be absolute and consistent across templates
- **Recommended follow-up:** complete existing `MB-007` and fix article URL generation at the template/helper level

#### 3. Meta description duplication is widespread across non-article surfaces

- **Evidence:** `88` URLs share the same description text:
  - `Finanzas personales para chilenos. Guías sobre AFP, APV, impuestos, inversiones y calculadoras prácticas.`
- **Main affected groups:**
  - homepage-adjacent utility pages
  - all paginated post archives
  - search page
  - tag index and tag detail pages
- **Affected URL examples:**
  - `https://monedario.cl/about/`
  - `https://monedario.cl/posts/`
  - `https://monedario.cl/search/`
  - `https://monedario.cl/tags/afp/`
- **Why this matters:** duplicate snippets reduce search differentiation and make coverage / quality signals noisier
- **Recommended follow-up:** complete existing `MB-007` with template-specific metadata rules, then use `MB-008` to remove low-value pages from the indexed set where appropriate

#### 4. Broken official-source links remain in live YMYL pages

- **Evidence:** `11` external URLs ended in real `404` responses during the crawl
- **Affected Monedario pages:** `11`
- **Examples of broken targets:**
  - `https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/`
  - `https://www.sii.cl/contribuyentes/atencion_contribuyentes/tribunal_tributario/`
  - `https://www.cmfchile.cl/portal/principal/613/w3-article-27329.html`
  - `https://www.chileatiende.gob.cl/fichas/134983-conoce-las-principales-fechas-clave-de-la-reforma-de-pensiones`
  - `https://www.spensiones.cl/apps/rentabilidad/genRentabilidad.php`
- **Affected page examples:**
  - `https://monedario.cl/leyes/dl-824-impuesto-renta/`
  - `https://monedario.cl/leyes/ley-21236-portabilidad-financiera/`
  - `https://monedario.cl/posts/cae-costo-real-credito-chile/`
  - `https://monedario.cl/posts/como-cambiarse-de-afp/`
- **Why this matters:** broken official citations are a quality and trust issue on regulated finance content
- **Recommended follow-up:** add and execute a targeted link-remediation task for these sources

### Medium

#### 5. Paginated post archives reuse the same title

- **Evidence:** `4` post archive URLs share the exact title `Artículos | Monedario`
- **Affected URLs:**
  - `https://monedario.cl/posts/`
  - `https://monedario.cl/posts/2/`
  - `https://monedario.cl/posts/3/`
  - `https://monedario.cl/posts/4/`
- **Why this matters:** page `2+` archives do not differentiate themselves in search results
- **Recommended follow-up:** update archive template metadata to include page number and differentiated descriptions

#### 6. One broken internal-link pattern appears across all article pages

- **Evidence:** `/cdn-cgi/l/email-protection` resolves to HTTP `404` and is linked from all `27` article pages
- **Affected URL examples:**
  - `https://monedario.cl/posts/como-calcular-sueldo-liquido/`
  - `https://monedario.cl/posts/finiquito-e-indemnizaciones-en-chile/`
  - `https://monedario.cl/posts/suplantacion-identidad-creditos-no-reconocidos/`
- **Important caveat:** this path was not found directly in repository source. The most likely explanation is runtime injection by Cloudflare email protection or a transformed email link. That is an inference from the crawled output, not a source-level fact.
- **Recommended follow-up:** inspect hosting/runtime email protection behavior and remove or repair the injected broken link

#### 7. Thin, low-intent pages remain indexable

- **Evidence:** the thinnest publicly crawlable pages are mostly utility / listing surfaces
- **Examples:**
  - `https://monedario.cl/search/` — `69` words
  - `https://monedario.cl/tags/comisiones/` — `115` words
  - `https://monedario.cl/tags/corredoras/` — `115` words
  - `https://monedario.cl/tags/etf/` — `115` words
- **Why this matters:** these pages are weak candidates for inclusion in a target sitemap
- **Recommended follow-up:** handle together with `MB-008`

### Low

#### 8. Redirect-chain risk was low on internal crawl targets

- **Finding:** no internal sitemap URL redirected and no internal redirect chains were detected
- **Impact:** positive; no remediation required from this audit

#### 9. No orphan pages were detectable inside the sitemap crawl graph

- **Finding:** every crawled sitemap URL received at least one internal inlink from the crawled set, or was a core root page
- **Limitation:** this does not prove there are no true orphans outside the sitemap, logs, or search index

## Severity Assessment

| Severity | Count | Primary patterns |
| --- | ---: | --- |
| Critical | 1 | Sitemap / indexation policy conflict |
| High | 4 | Canonical URL rendering, duplicate descriptions, broken official-source links |
| Medium | 3 | Pagination metadata, runtime broken internal link pattern, thin searchable surfaces |
| Low | 2 | Positive findings / low-risk observations |

## Follow-Up Backlog Recommendations

- **Existing backlog items to execute next:**
  - `MB-007` — normalize canonical, OG, and metadata consistency
  - `MB-008` — audit tag indexation and sitemap hygiene
- **New concrete follow-up tasks proposed from this audit:**
  - repair broken citation / source links and the broken internal email-protection pattern found in Sprint 1A

## Reproducibility Notes

- Crawl snapshot date: `2026-03-08`
- Root reviewed: `https://monedario.cl/`
- Public sitemap count at crawl time: `166`
- No authenticated search-platform data was used in this document
