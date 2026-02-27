# Mobile Performance Hardening Report (Astro / GitHub Pages)

Date: February 27, 2026

## Summary (what changed)

- Removed Google Fonts external stylesheet from the document head.
- Self-hosted required font files in `public/fonts/` (`woff2`, latin subset).
- Added local `@font-face` definitions with `font-display: swap`.
- Added a single selective preload for above-the-fold body font:
  - `/fonts/source-sans-3-latin-400-600.7a19a702.woff2`
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

---

## Update: Contrast-Token Recovery Pass (February 27, 2026)

### Root cause analysis (what changed vs prior ~100 state)

- Latest deployed mobile run (`artifacts/lighthouse-remote-mobile-before.report.json`) scored **99** with:
  - FCP 1.6s
  - LCP 1.7s
  - Speed Index 2.7s
  - CLS 0
  - TBT 0ms
- LCP element is now the homepage hero **H1**:
  - `section.grid > article.lg:col-span-2 > a.group > h1.mb-3`
- LCP subparts show high render delay on deployed:
  - TTFB: ~252ms
  - Element render delay: ~1165ms
- Critical chain remains CSS-led (`/_astro/index...css`) and then font fetches; this aligns with text-LCP sensitivity to above-the-fold typography.
- Compared to prior local artifact runs (where the hero paragraph was often LCP), the candidate shifted toward the H1 path, making heading paint stability more important.

### Implemented changes

1. Fingerprinted self-hosted fonts (cache-safe URLs):
   - `public/fonts/source-sans-3-latin-400-600.7a19a702.woff2`
   - `public/fonts/fraunces-latin-400-700.7234ed86.woff2`
2. Updated `@font-face` sources and added `unicode-range` in `src/styles/global.css`.
3. Kept a single font preload in `src/layouts/Layout.astro` (body font, now fingerprinted path).
4. Reduced above-the-fold paint work in `src/pages/index.astro`:
   - Removed `transition-colors` from hero H1 initial class list.
   - Forced hero H1 to `font-app` so first viewport text uses the same preloaded family.

### Rejected variant (reverted)

- Tested preloading Fraunces as the single preload.
- Result: CLS regressed to `0.0082` in throttled local run (`artifacts/lighthouse-local-devtools-after.report.json`).
- This variant was not kept to preserve the non-negotiable CLS gate.

### Before/After metrics

- Remote deployed baseline (before this patch):
  - `artifacts/lighthouse-remote-mobile-before.report.json`
  - Perf 99, FCP 1.6s, LCP 1.7s, SI 2.7s, CLS 0, TBT 0ms
- Local mobile after final patch:
  - `artifacts/lighthouse-local-mobile-after2.report.json`
  - Perf 100, FCP 1.2s, LCP 1.5s, SI 1.2s, CLS 0, TBT 0ms
- Local desktop after final patch:
  - `artifacts/lighthouse-local-desktop-after2.report.json`
  - Perf 100, FCP 0.3s, LCP 0.4s, SI 0.3s, TBT 0ms

Note: local and deployed environments are not directly comparable; deployed PSI must be rerun after publish to confirm score recovery on GitHub Pages.

### Verification protocol executed

- `pnpm build` passed.
- `pnpm test` passed (49/49).
- Lighthouse reports generated:
  - `artifacts/lighthouse-current-mobile.report.json` (local baseline, simulated mobile)
  - `artifacts/lighthouse-local-devtools-before.report.json` (local stricter baseline, devtools throttling)
  - `artifacts/lighthouse-local-devtools-after2.report.json` (final local stricter after)
  - `artifacts/lighthouse-local-mobile-after2.report.json` (final local mobile)
  - `artifacts/lighthouse-local-desktop-after2.report.json` (final local desktop)

### Risk / rollback plan

- Risk level: Low
- Main behavioral risk: subtle typography difference in hero H1 (now body-family for above-the-fold stability).
- Rollback:
  1. Revert hero H1 class change in `src/pages/index.astro`.
  2. Revert preload path in `src/layouts/Layout.astro`.
  3. Revert font filename changes in `src/styles/global.css` + `public/fonts/`.

### GitHub Pages cache TTL status

- GitHub Pages cache headers remain platform-managed and may still be flagged.
- Fingerprinted font URLs are now in place to reduce stale-asset risk despite limited TTL control.
