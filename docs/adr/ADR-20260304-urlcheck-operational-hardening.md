# ADR-20260304: URL Check Operational Hardening

Date: 2026-03-04
Status: Accepted

## Context

The URL validation subsystem already enforced deterministic internal-link checks with a baseline policy and canary validation. Operational gaps remained:

- CI did not guarantee artifact upload on failures.
- External-link volatility and internal-link hard-gate behavior were not explicitly separated in CI operations.
- Baseline updates could be triggered without explicit authorization.
- No dedicated operational runbook documented incident handling and baseline governance.

This change alters CI execution semantics and operational workflow, which requires an ADR under AGENTS Rule 4.3 (CI gate semantics change).

## Decision

1. Keep internal broken-link checks as hard-fail for standard runs (`check:urls`, `check:urls:ci`).
2. Add a non-blocking external-audit mode and command:
   - `pnpm run check:urls:external:audit`
3. Require explicit authorization for baseline updates:
   - env `URLCHECK_ALLOW_BASELINE_UPDATE=1` or flag `--allow-baseline-update`
   - baseline updates forbidden when `CI=true`.
4. Generate and publish URL check artifacts consistently:
   - `internal-broken.json`
   - `internal-broken.csv`
   - `urlcheck-report.json`
5. Add CI workflow hardening:
   - always upload URL artifacts (with placeholders if needed)
   - nightly non-blocking external audit job.
6. Document operational procedures in `docs/operations/urlcheck-runbook.md`.

## Consequences

Positive:
- Better incident diagnosability through durable artifacts.
- Reduced CI flakiness risk by isolating external volatility from blocking semantics.
- Lower risk of accidental baseline masking.
- Clearer operational process for triage and remediation.

Trade-offs:
- Additional CI workflow complexity (extra steps/job).
- External audit still consumes CI resources on scheduled runs.

## Guardrails

- Internal-link gate must remain strict (`internal_broken > 0` fails standard URL checks).
- External audit must stay non-blocking and observability-focused.
- Baseline updates remain explicitly authorized and never allowed in CI.
