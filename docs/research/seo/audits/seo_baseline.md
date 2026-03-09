# SEO Baseline — Monedario.cl

## Snapshot

- **Snapshot date:** 2026-03-08
- **Site reviewed:** `https://monedario.cl/`
- **Data sources used:**
  - Live public crawl of `https://monedario.cl/sitemap-index.xml` and all URLs listed in `sitemap-0.xml`
  - Live `https://monedario.cl/robots.txt`
  - Repository inspection of `astro.config.ts`, `src/config.ts`, `src/layouts/Layout.astro`, `src/layouts/PostDetails.astro`, and related templates
  - Shell environment inspection for Search Console / Bing / analytics credentials

## KPI Snapshot

| Metric | Value | Evidence status | Notes |
| --- | --- | --- | --- |
| Impressions | Unavailable | Not accessible | No authenticated Google Search Console access was available on 2026-03-08. |
| Clicks | Unavailable | Not accessible | No authenticated Google Search Console access was available on 2026-03-08. |
| CTR | Unavailable | Not accessible | Requires authenticated search performance data. |
| Average position | Unavailable | Not accessible | Requires authenticated search performance data. |
| Top landing pages | Unavailable | Not accessible | No search-platform or analytics dataset was available in the environment. |
| Top query groups | Unavailable | Not accessible | No query-level search dataset was available in the environment. |
| Calculator entry points from organic search | Unavailable | Not accessible | Organic entrances cannot be measured from public crawl data alone. |
| Indexed vs submitted pages | Indexed count unavailable | Partially accessible | Submitted count was measured from the public sitemap. Indexed count requires Search Console / Bing Webmaster access. |

## Publicly Measurable Baseline

### Sitemap submission inventory

- **Submitted sitemap path:** `https://monedario.cl/sitemap-index.xml`
- **Nested sitemap(s):** `https://monedario.cl/sitemap-0.xml`
- **Submitted URL count observed in public sitemap:** `166`

### Submitted URL mix

| URL group | Count |
| --- | ---: |
| Homepage | 1 |
| About / author / archives / search | 4 |
| Posts index + paginated archives | 4 |
| Article detail pages | 27 |
| Calculator index + calculator detail pages | 11 |
| Glossary index + glossary detail pages | 16 |
| Guide hub index + guide detail pages | 7 |
| Law index + law detail pages | 16 |
| Tag index + tag detail pages | 80 |

### Calculator entry-point inventory

Organic entrances were **not measurable** from the available environment. The public crawl confirmed these calculator entry points exist and are indexable today:

- `/calculadoras/sueldo-liquido/`
- `/calculadoras/apv/`
- `/calculadoras/conversor-uf/`
- `/calculadoras/credito-consumo/`
- `/calculadoras/prepago-credito/`
- `/calculadoras/reajuste-arriendo/`
- `/calculadoras/seguro-cesantia/`
- `/calculadoras/simulador-jubilacion/`
- `/calculadoras/simulador-renegociacion/`
- `/calculadoras/tarjeta-credito/`

## Current Technical Baseline Signals

- All `166` sitemap URLs returned HTTP `200` during the public crawl.
- `81` sitemap URLs are low-value discovery surfaces:
  - `/search/`
  - `/tags/`
  - `79` individual tag URLs
- `27` article pages render relative canonical / `og:url` / `twitter:url` values instead of absolute URLs.
- `88` URLs share the same meta description text.

## Major Caveats And Data Gaps

- This is a **technical baseline**, not a full performance baseline.
- No Google Search Console, Bing Webmaster Tools, GA4, or server-log access was available in the environment.
- No matching search-platform or analytics credentials were present in shell environment variables.
- No public Google verification meta tag, Bing verification meta tag, Bing verification XML file, or apex TXT verification token was available to confirm platform ownership.
- Indexed-page counts, impressions, clicks, CTR, average position, query groups, and organic calculator entrances remain unverified until platform access is granted.

## Baseline Conclusion

The maximum defensible baseline available on 2026-03-08 is:

- `166` submitted URLs in the public sitemap
- `166/166` sitemap URLs publicly reachable
- a large concentration of low-value sitemap URLs (`81`)
- no authenticated search performance data currently accessible

That is sufficient to establish a Sprint 1A baseline artifact, but it does **not** replace a real Search Console performance baseline.
