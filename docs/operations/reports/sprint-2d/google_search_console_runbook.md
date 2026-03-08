# Google Search Console Runbook

## Scope

- Date: `2026-03-08`
- Property attempted: `sc-domain:monedario.cl`
- Sitemap intended for inspection/submission: `https://monedario.cl/sitemap-index.xml`
- Execution path: Playwright persistent Chrome profile copied into `output/playwright/chrome-default-copy-sprint2d`

## What was attempted

1. Open `https://search.google.com/search-console?resource_id=sc-domain:monedario.cl` with the copied persistent profile.
2. Retry the direct property URL after the initial load.
3. Inspect the resulting page state and cookies exposed inside the Playwright session.
4. Follow the Google sign-in path to determine whether the session was already authenticated.

## What was actually observed

- Authenticated access was attempted: `yes`
- Authenticated property view reached: `no`
- First landing URL: `https://search.google.com/search-console/about`
- First landing title: `Google Search Console`
- Direct property access reproduced from Sprint 2C: `no`
- Google sign-in page reachable: `yes`
- Post-click/login-path URL observed: `https://accounts.google.com/v3/signin/identifier?...service=sitemaps...`
- Sign-in form state observed: `yes`
  - visible field: `Correo electrónico o teléfono`
- Cookies visible in the automation session were generic/product cookies, not proof of an authenticated Search Console dashboard session.
  - observed examples: `NID`, `__Host-GAPS`, `_ga`, `_gid`

## Property and sitemap state

- Property `sc-domain:monedario.cl` was not reached in an authenticated dashboard state.
- Sitemap submission history was not visible.
- Sitemap inspection state was not visible.
- Submit/resubmit action was not possible.

## Coverage and indexing observations

- Coverage/indexing observations captured from Google Search Console: `none`
- Reason: the sprint did not reach an authenticated property dashboard or any coverage/reporting view.

## Warnings and issues found

- Sprint 2C's previously reported copied-profile path did not reproduce in Sprint 2D.
- The copied persistent profile no longer yields reusable authenticated Search Console access.
- Because the property view was not reached, no claim can be made about whether `https://monedario.cl/sitemap-index.xml` is already submitted, stale, or unknown to Google.

## Remaining blocker

- Current blocker: missing reusable authenticated Google session inside the automation profile.
- Practical interpretation: the environment can reach Search Console and the Google sign-in page, but it cannot currently perform real Search Console operations for Monedario.

## Verified vs assumed

### Verified

- The automation environment can open Search Console.
- The direct property URL for `sc-domain:monedario.cl` currently falls back to the public `/about` page in this environment.
- The Google sign-in form is reachable and requires account entry.
- No authenticated property dashboard was reached during Sprint 2D.

### Assumed but not verified

- Whether `https://monedario.cl/sitemap-index.xml` is already submitted in Google Search Console.
- Any current submitted/excluded/indexed counts.
- Any current coverage, indexing, enhancement, or manual-action status for Monedario in Search Console.

## Founder next action

1. Open a dedicated persistent automation profile for search-platform work.
2. Sign in manually with the Google account that owns `sc-domain:monedario.cl`.
3. Complete any account chooser or secondary verification inside that same automation profile.
4. Keep using that profile for future runs, or save storage state immediately after successful login.
