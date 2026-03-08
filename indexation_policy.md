# Indexation Policy — Sprint 1R

## Objective

Align sitemap output, robots directives, and page-level indexation behavior so Monedario submits only target SEO surfaces while keeping low-value discovery pages crawlable enough for bots to see `noindex`.

## Policy Table

| Surface | Current state before Sprint 1R | Desired state | Implementation decision | Rationale | Expected SEO effect |
| --- | --- | --- | --- | --- | --- |
| `/search/` | Indexable, included in sitemap, generic default description | Not indexable, not in sitemap, still crawlable | Added page-level `noindex,follow`; excluded from sitemap; left crawlable in `robots.txt` | Internal search results are thin and query-driven; disallowing crawl would hide the `noindex` signal | Reduces low-value indexed URLs and coverage noise without creating blocked-but-indexable risk |
| `/tags/` | Indexable, included in sitemap, generic default description | Not indexable, not in sitemap, still crawlable | Added page-level `noindex,follow`; excluded from sitemap; removed tag disallow from `robots.txt` | Tag root is a navigation aid, not a target landing page | Prevents tag index bloat and removes sitemap/robots inconsistency |
| `/tags/<tag>/` | Indexable, included in sitemap, generic default description | Not indexable, not in sitemap, still crawlable | Added page-level `noindex,follow`; excluded all tag detail pages from sitemap; left crawlable in `robots.txt` | Tag detail pages are thin archive surfaces with low unique intent | Shrinks low-value submitted set and reduces duplicate/thin archive signals |
| `/posts/2+/` | Indexable, included in sitemap, repeated archive title pattern | Not indexable, not in sitemap, page 1 remains indexable | Added page-level `noindex,follow` on paginated archives after page 1; excluded numeric archive pages from sitemap | Page 2+ archives add crawlable navigation but weak standalone search value | Keeps archive navigation usable while consolidating indexation on page 1 and detail URLs |
| `/posts/` | Indexable and in sitemap | Keep indexable and in sitemap | No change to indexation; improved metadata differentiation for pagination handling | Primary article archive remains a legitimate discovery surface | Preserves one canonical archive entry point |
| `/archives/` | Indexable and in sitemap | Keep indexable and in sitemap | No change | Archive page offers unique chronological navigation and was not part of the Sprint 1A low-value cluster | Maintains discoverability of a useful browse surface |

## Implementation Notes

- `astro.config.ts` excludes `/search/`, `/tags/`, `/tags/**`, and `/posts/2+/` from sitemap serialization.
- `src/pages/search.astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag]/[...page].astro`, and paginated `src/pages/posts/[...page].astro` now emit `noindex,follow` where applicable.
- `src/pages/robots.txt.ts` no longer blocks tag crawling, which avoids conflicting with page-level `noindex`.

## Verified Output

- `dist/sitemap-0.xml` does not contain:
  - `https://monedario.cl/search/`
  - `https://monedario.cl/tags/`
  - `https://monedario.cl/tags/afp/`
  - `https://monedario.cl/posts/2/`
- Generated HTML for sampled low-value pages emits `noindex,follow`.

## Strategic Constraint

This policy does not depend on Search Console or Bing access. Platform data can refine prioritization later, but the current implementation is already internally consistent and executable.
