# Search Platform Status — Monedario.cl

## Snapshot

- **Review date:** 2026-03-08
- **Scope:** Google Search Console and Bing Webmaster Tools validation status
- **Evidence sources:**
  - Live homepage HTML at `https://monedario.cl/`
  - Live `https://monedario.cl/robots.txt`
  - Live `https://monedario.cl/sitemap-index.xml`
  - Public DNS TXT lookup for `monedario.cl`
  - Repository inspection for verification tags / files / environment variables

## Shared Public Facts

- **Public sitemap path:** `https://monedario.cl/sitemap-index.xml`
- **Nested sitemap observed:** `https://monedario.cl/sitemap-0.xml`
- **Public sitemap URL count:** `166`
- **Public sitemap availability:** reachable and returning HTTP `200`
- **Robots file references the sitemap:** yes

## Google Search Console

### Ownership status

- **Status:** `UNVERIFIED_FROM_AVAILABLE_ENVIRONMENT`
- **What was observed on 2026-03-08:**
  - No live `<meta name="google-site-verification">` tag on the homepage
  - No matching Search Console credentials or verification values in shell environment variables
  - No public apex TXT verification record was returned by DNS lookup during this sprint
- **What could not be verified:** whether an account owner has private Search Console access that is not publicly visible

### Sitemap status

- **Sitemap path intended for submission:** `https://monedario.cl/sitemap-index.xml`
- **Submission status:** `UNCONFIRMED`
- **Reason:** Search Console account access was not available, so actual submission history could not be inspected

### Coverage / indexation observations

- All `166` sitemap URLs returned HTTP `200` in the public crawl
- The sitemap includes `81` low-value surfaces:
  - `/search/`
  - `/tags/`
  - `79` tag detail pages
- `robots.txt` disallows `/tags/*/`, which creates a likely sitemap vs crawl-directive conflict for tag pagination / tag surfaces if they are submitted as-is
- No Search Console coverage report was accessible, so indexed/excluded counts remain unknown

### Warnings / anomalies

- No publicly visible Google ownership signal was found
- Submission could not be confirmed
- Low-value sitemap inclusion is likely to surface coverage noise once the property is connected

### Unresolved issues

- Authenticated Search Console access is required to confirm:
  - property ownership
  - sitemap submission state
  - indexed vs excluded URL counts
  - manual actions / enhancement reports / performance data

### Recommended follow-up actions

1. Obtain owner or delegated access to the Google Search Console property for `monedario.cl`.
2. If no property exists, verify ownership with a domain-level TXT record or explicit HTML verification method.
3. Submit `https://monedario.cl/sitemap-index.xml`.
4. Export coverage and performance baselines after submission.
5. Resolve sitemap hygiene issues before trusting coverage diagnostics at scale.

## Bing Webmaster Tools

### Ownership status

- **Status:** `UNVERIFIED_FROM_AVAILABLE_ENVIRONMENT`
- **What was observed on 2026-03-08:**
  - No live `msvalidate.01` verification meta tag on the homepage
  - `https://monedario.cl/BingSiteAuth.xml` returned HTTP `404`
  - No matching Bing / Webmaster credentials were present in shell environment variables

### Sitemap status

- **Sitemap path intended for submission:** `https://monedario.cl/sitemap-index.xml`
- **Submission status:** `UNCONFIRMED`
- **Reason:** Bing Webmaster account access was not available

### Coverage / indexation observations

- Publicly observable sitemap endpoint is healthy
- The same sitemap hygiene issues visible to Google will also affect Bing if the sitemap is submitted unchanged
- Actual indexed-page counts, crawl issues, and submission history were not accessible

### Warnings / anomalies

- No publicly visible Bing verification signal was found
- No Bing verification file is present at the standard public path

### Unresolved issues

- Authenticated Bing Webmaster Tools access is required to confirm:
  - ownership
  - sitemap submission
  - crawl / coverage warnings
  - indexation counts

### Recommended follow-up actions

1. Verify Bing Webmaster ownership if it is not already configured.
2. Submit `https://monedario.cl/sitemap-index.xml`.
3. Compare indexed-page counts against the `166` submitted URLs after submission.
4. Review crawl issues after sitemap hygiene is corrected.

## Task Outcome For MB-002

- **Recommended task status:** `BLOCKED`
- **Blocker:** platform ownership and submission state cannot be confirmed without authenticated Search Console / Bing Webmaster access
- **Why this is not marked done:** the sprint requirement explicitly forbids faking verification or sitemap submission when access is unavailable
