# Mobile Performance Hardening Report (Astro / GitHub Pages)

Date: February 27, 2026

## Summary (what changed)

- Removed Google Fonts external stylesheet from the document head.
- Self-hosted required font files in `public/fonts/` (`woff2`, latin subset).
- Added local `@font-face` definitions with `font-display: swap`.
- Added a single selective preload for above-the-fold body font:
  - `/fonts/source-sans-3-latin-400-600.woff2`
- Added explicit `width`/`height` on card/related/homepage images and `fetchpriority="high"` on the hero image path.

## Why (critical chain findings)

Baseline Lighthouse showed Google Fonts on the render-blocking critical path:

- `https://fonts.googleapis.com/...` (render-blocking, ~781ms)
- main stylesheet `/_astro/index...css` (render-blocking, ~303ms)

After changes:

- Google Fonts is removed from the dependency tree.
- Render-blocking list is reduced to site CSS only (~153ms).
- Longest dependency chain reduced from ~130ms to ~52ms in local test conditions.

## Baseline findings (Step 0)

- LCP element (baseline): hero description paragraph text (`section.grid ... > p.mb-4`).
- LCP was text-based, not image-based, in local Lighthouse runs.
- Homepage generated HTML currently has no `<img>` tags (placeholders are used for posts without `ogImage`), so image optimization impact on current homepage is limited.

## Before / After (Lighthouse local, Mobile, Slow 4G, CPU 4x)

- Before (local): Performance 100, FCP 1384.75ms, LCP 1384.75ms, CLS 0.000042, TBT 0ms, Speed Index 1384.75ms
- After (local): Performance 100, FCP 1209.18ms, LCP 1509.18ms, CLS 0, TBT 0ms, Speed Index 1209.18ms

Notes:

- In this environment both runs score 100; metric-level differences are within normal Lighthouse variance.
- The structural bottleneck (external render-blocking font chain) is removed, which is the intended hardening for slower real-world mobile conditions.

## Filmstrip / No-Flicker Evidence

- Baseline filmstrip frames: `artifacts/filmstrip-baseline/`
- After filmstrip frames: `artifacts/filmstrip-after/`
- Lighthouse HTML reports:
  - `artifacts/lighthouse-baseline.report.html`
  - `artifacts/lighthouse-after.report.html`

## Verification notes

- Build passed: `pnpm build`
- Tests passed: `pnpm test` (49 tests)
- Additional post-change Lighthouse categories:
  - Performance 100
  - Accessibility 100
  - Best Practices 100
  - SEO 100

## PageSpeed Insights (Mobile)

- PSI API call from CLI was blocked by quota (`429 RESOURCE_EXHAUSTED`) without a project API key in this environment.
- After deployment of this branch, run PSI against the deployed URL and attach screenshot + summary to PR.

## Risk & Rollback

Risk level: Low

- Main risk: font metric differences across platforms can cause minor typography differences.
- Mitigation: kept same font families, limited weights/subsets, and used `font-display: swap`.
- Image changes are non-invasive (`width`/`height` attributes + priority hint only).

Rollback plan:

1. Revert `Layout.astro` font preload and restore previous Google Fonts links.
2. Revert `@font-face` additions in `global.css`.
3. Remove `public/fonts/*`.
4. Revert image attribute additions (`width`/`height` + `fetchpriority`).

## GitHub Pages caching limitation

- This change does not alter cache headers/TTL (GitHub Pages controlled).
- Cache behavior improvements rely on static asset hashing and browser behavior, not server header customization.
