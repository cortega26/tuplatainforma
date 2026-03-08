# Auth Restoration Runbook

## Scope

- Date: `2026-03-08`
- Sprint: `Sprint 2E - Auth Restoration and One-Shot Platform Execution`
- Objective: restore one reusable authenticated automation path without reusing the failed copied-profile approach as the primary method

## Strategy attempted

- Primary path used: `Path A - Dedicated persistent automation profile`
- Secondary support check: `Path B - Saved storage state`
- Copied-profile path used as primary method: `no`

## Exact automation assets used

- Dedicated persistent automation profile: `output/playwright/search-platform-profile-2e`
- Saved storage state files created during this sprint:
  - unauthenticated trial state: `output/playwright/search-platform-state-2e.json`
  - authenticated founder-approved state: `output/playwright/search-platform-state-2e-authenticated.json`
- Playwright wrapper used: `~/.codex/skills/playwright/scripts/playwright_cli.sh`

## Operational sequence executed

1. Opened a brand-new persistent Chrome automation profile:
   - `playwright-cli -s=sprint2e-auth open "https://search.google.com/search-console?resource_id=sc-domain:monedario.cl" --headed --persistent --profile output/playwright/search-platform-profile-2e`
2. Verified that the fresh unauthenticated profile initially landed on the public Google Search Console `/about` page and the Google sign-in form.
3. Verified that the same fresh profile initially landed on the public Bing Webmaster `/about` page and the Microsoft sign-in form.
4. Saved the initial unauthenticated state to `output/playwright/search-platform-state-2e.json`.
5. Closed the browser and relaunched the same persistent profile:
   - `playwright-cli -s=sprint2e-relaunch open "https://search.google.com/search-console?resource_id=sc-domain:monedario.cl" --headed --persistent --profile output/playwright/search-platform-profile-2e`
6. Confirmed that the pre-login relaunch still had no authenticated Google or Bing state.
7. The founder manually signed in inside that exact persistent profile for:
   - Google Search Console account with access to `sc-domain:monedario.cl`
   - Microsoft account with access to Bing Webmaster for `https://monedario.cl/`
8. Saved the authenticated state from the live founder session:
   - `playwright-cli -s=founder-auth state-save output/playwright/search-platform-state-2e-authenticated.json`
9. Opened a fresh in-memory browser session and loaded the authenticated state file.
10. Verified that the fresh session reopened:
   - Google Search Console overview for `sc-domain:monedario.cl`
   - Bing Webmaster site for `https://monedario.cl/`
11. Executed live platform work from the restored authenticated state.

## Auth-restoration checklist

- Persistent context used: `yes`
- Dedicated automation profile used: `yes`
- Founder manual login performed inside that exact profile: `yes`
- Storage state persistence tested: `yes`
- Authenticated dashboard access persisted across relaunch/state reuse: `yes`, via `output/playwright/search-platform-state-2e-authenticated.json` loaded into a fresh session

## Google exact end state

- Initial fresh-profile landing before founder login:
  - `https://search.google.com/search-console/about`
  - page title: `Google Search Console`
- Initial explicit sign-in endpoint:
  - `https://accounts.google.com/v3/signin/identifier?...service=sitemaps...`
- Authenticated state after founder login and state reuse:
  - fresh session reopened `https://search.google.com/search-console?resource_id=sc-domain:monedario.cl`
  - page title: `Descripción general`
  - authenticated account visible: `Carlos Ortega (carlosortega77@gmail.com)`
- Operational end state reached:
  - authenticated property overview for `sc-domain:monedario.cl`
  - authenticated `Sitemaps` page
  - authenticated `Indexación de páginas` page

## Bing exact end state

- Initial fresh-profile landing before founder login:
  - `https://www.bing.com/webmasters/about?from=home`
  - page title: `Bing Webmaster Tools`
- Initial explicit sign-in endpoint:
  - `https://login.live.com/`
  - page title: `Sign in`
  - visible `Email or phone number` textbox
- Authenticated state after founder login and state reuse:
  - fresh session reopened `https://www.bing.com/webmasters/home`
  - selected authenticated site: `monedario.cl/`
- Operational end state reached:
  - authenticated Bing Webmaster site dashboard for `https://monedario.cl/`
  - authenticated `Sitemaps` page for `https://monedario.cl/`

## Session evidence observed

- Verified authenticated Google evidence:
  - overview page title `Descripción general`
  - property navigation for `monedario.cl`
  - signed-in Google account menu visible
- Verified authenticated Bing evidence:
  - selected site `monedario.cl/`
  - Bing Webmaster authenticated navigation visible
  - authenticated `Sitemaps` page loaded for `siteUrl=https://monedario.cl/`

## What succeeded

- A new dedicated persistent automation profile was created and used for founder-side login.
- The authenticated state was exported successfully to `output/playwright/search-platform-state-2e-authenticated.json`.
- That authenticated state reopened Google Search Console and Bing Webmaster in a fresh browser session without manual re-login.
- Google Search Console execution was completed from the restored session.
- Bing Webmaster execution was completed from the restored session.

## What failed

- The initial fresh profile still had no inherited auth before founder login.
- Google Search Console does not yet show processed indexation totals; it reports that processing is still underway.
- The submitted Google sitemap currently shows status `No se ha podido obtener`.
- Bing Webmaster sitemap processing has started, but the post-submit row is still `Processing` with no discovered-URL totals yet.

## What remains uncertain

- Whether the persistent profile alone, without the exported state file, will survive a full close/reopen after login; this was not re-tested after founder login to avoid disturbing the live signed-in session.
- When Google will finish processing the newly submitted sitemap and page-indexation data.
- When Bing will finish processing the newly submitted sitemap and populate discovered-URL totals.

## Stop-loss conclusion

- Sprint 2E achieved the best-case outcome.
- The reusable authenticated automation path is now real through the dedicated profile plus the exported authenticated storage-state file.
- Further blind auth retries are no longer needed for this cycle.
