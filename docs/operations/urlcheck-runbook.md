# URL Validation Runbook

## Overview

The URL validation subsystem protects public-site link integrity with a strict internal-link gate and separate external-link observability.

Operational goals:
- Block regressions when internal URLs return hard failures.
- Keep external volatility visible without making CI flaky.
- Preserve auditable evidence through JSON/CSV artifacts.

Core artifacts written on each run:
- `scripts/urlcheck/artifacts/internal-broken.json`
- `scripts/urlcheck/artifacts/internal-broken.csv`
- `scripts/urlcheck/artifacts/urlcheck-report.json`

## Commands

- `pnpm run check:urls`
  - Local/default run with strict internal gate and baseline policy.
- `pnpm run check:urls:ci`
  - CI-tuned mode (same internal gate semantics, lower concurrency).
- `pnpm run check:urls:canary`
  - Synthetic validation that must detect a known internal 404 fixture.
- `pnpm run check:urls:external:audit`
  - Non-blocking external-host audit mode for external volatility analysis.
- `pnpm run check:urls:baseline:update`
  - Baseline refresh command (explicitly authorized and forbidden in CI).

## Failure Modes

### internal_broken > 0
- Meaning: internal URLs are returning hard-fail status/network errors.
- Response:
  1. Open `internal-broken.json` and cluster failures by pattern.
  2. Prioritize systemic fix (central URL builder or redirects) over one-off edits.
  3. Re-run `pnpm run check:urls:ci` until `internal_broken=0`.

### no_scan_detected
- Implementation error names: `zero_links_scanned` or `zero_links_scanned_post_processing`.
- Meaning: checker did not crawl expected site links.
- Response:
  1. Confirm `dist/` exists and contains built output.
  2. Re-run build and then `pnpm run check:urls:ci`.
  3. If persistent, inspect local HTTP serving path and `.linkinatorrc` skip rules.

### canary_failure
- Implementation error name: `canary_expected_internal_broken_not_detected`.
- Meaning: canary fixture is no longer validating failure detection.
- Response:
  1. Inspect `scripts/urlcheck/fixtures/site/monedario/index.html`.
  2. Ensure fixture still includes one known broken internal target.
  3. Fix fixture/checker and require canary pass before merging.

### spikes in 429
- Meaning: upstream throttling from external hosts.
- Response:
  1. Review `urlcheck-report.json` (`retryStats`, host distribution).
  2. Keep CI focused on internal-gate outcome; use external audit trend for ops.
  3. If persistent on critical hosts, evaluate host-specific soft policy.

### DNS failures
- Category usually `dns` or `network` in external failures.
- Response:
  1. Validate if host is transiently unavailable.
  2. Confirm issue is external-only and internal gate remains green.
  3. Track recurrence in nightly external-audit artifacts.

## Baseline Policy

Baseline exists to track internal-gate policy, not to hide regressions.

Rules:
- Baseline update is forbidden in CI (`baseline_update_forbidden_in_ci`).
- Baseline update requires explicit authorization:
  - env: `URLCHECK_ALLOW_BASELINE_UPDATE=1`, or
  - flag: `--allow-baseline-update`.
- Baseline update requires non-empty reason:
  - env: `URLCHECK_BASELINE_REASON="<why this update is needed>"`.
- Default policy target remains `maxInternalBrokenTotal: 0`.
- Baseline metadata written on update:
  - `updated_at` (ISO timestamp)
  - `updated_by` (best-effort actor identity)
  - `reason` (required)

Safe update procedure:
1. Run `pnpm run check:urls:ci` and confirm `internal_broken=0`.
2. Run `URLCHECK_ALLOW_BASELINE_UPDATE=1 URLCHECK_BASELINE_REASON="<reason>" pnpm run check:urls:baseline:update`.
3. Verify `scripts/urlcheck/baseline.json` reflects current scan.
4. Commit baseline update separately when possible.

## CI Notes

- Main CI uploads URL artifacts with `if: always()`.
- Placeholders are created only when URL check steps are skipped (not when they ran).
- If URL check ran and artifacts are missing, upload is configured to fail (`if-no-files-found: error`).
- External audit runs nightly and is configured non-blocking.
