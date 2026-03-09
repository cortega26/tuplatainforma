# Remote Performance Closure Report

Date: February 27, 2026

## Scope

Measurement-only closure pass against deployed production URL:

- URL: `https://cortega26.github.io/tuplatainforma/`
- No performance/code changes made in this task.

## Step 1: Deploy verification

- Local HEAD SHA: `fd5309319c349a476c314c5fcf2569728a1d43f1`
- `origin/main` SHA: `fd5309319c349a476c314c5fcf2569728a1d43f1`
- Live HTML confirms latest perf assets are deployed:
  - CSS: `/_astro/index.DPFRhQ6K.css`
  - Font preload: `/fonts/source-sans-3-latin-400-600.7a19a702.woff2`
- Live response header `last-modified`: `Fri, 27 Feb 2026 23:20:48 GMT`
- First remote Lighthouse run `fetchTime`: `2026-02-27T23:24:23.118Z` (3m35s after deploy timestamp)

## Step 2: Remote Lighthouse runs (3 consecutive)

Configuration used in all 3 runs:

- Mobile emulation
- Slow 4G + CPU 4x (`--throttling-method=devtools`, RTT 150ms, throughput 1638.4 Kbps, CPU slowdown 4)
- Incognito Chrome context
- Categories: performance, accessibility, best-practices, SEO

Artifacts per run:

1. `artifacts/lighthouse-remote-mobile-run1.report.json`
2. `artifacts/lighthouse-remote-mobile-run1.report.html`
3. `artifacts/lighthouse-remote-mobile-run2.report.json`
4. `artifacts/lighthouse-remote-mobile-run2.report.html`
5. `artifacts/lighthouse-remote-mobile-run3.report.json`
6. `artifacts/lighthouse-remote-mobile-run3.report.html`

Filmstrip captures:

1. `artifacts/filmstrip-remote-run1/`
2. `artifacts/filmstrip-remote-run2/`
3. `artifacts/filmstrip-remote-run3/`

## Step 3: Median aggregation

| Metric | Run 1 | Run 2 | Run 3 | Median |
|--------|-------|-------|-------|--------|
| Performance | 100 | 100 | 100 | 100 |
| FCP | 1.49s | 1.47s | 1.47s | 1.47s |
| LCP | 1.49s | 1.47s | 1.47s | 1.47s |
| Speed Index | 1.51s | 1.49s | 1.49s | 1.49s |
| CLS | 0 | 0 | 0 | 0 |
| TBT | 0ms | 0ms | 0ms | 0ms |

Source: `artifacts/remote-lighthouse-summary.json`

## Step 4: PageSpeed Insights validation

- PSI API status: blocked by quota (`429 RESOURCE_EXHAUSTED`)
- Evidence: `artifacts/psi-mobile-final-closure.json`
- Manual PSI UI screenshot is still required from a browser session.

## Step 5: Regression verification

Checks across all 3 remote runs:

- CLS remains 0: PASS
- No new color-contrast issues (`color-contrast` score = 1): PASS
- Render-blocking resources: stable single CSS file (`/_astro/index.DPFRhQ6K.css`): PASS
- Critical chain: stable and unchanged pattern
  - Document -> CSS -> Fraunces font
  - `network-dependency-tree-insight` longest chain duration ~2339ms to ~2354ms
- LCP element stability: stable across all runs
  - `section.grid > article.lg:col-span-2 > a.group > h1.font-app`

## Acceptance criteria result

- Median Mobile Performance >= 99: PASS (100)
- Median LCP <= 1.7s: PASS (1.47s)
- Median Speed Index <= 3.0s: PASS (1.49s)
- CLS = 0: PASS
- No new accessibility regressions: PASS (100 in all runs)

## Final conclusion

Performance is stable and reproducible remotely under the defined test profile.
Variance across runs is minimal and within normal Lighthouse noise (<0.03s on FCP/LCP/SI).
