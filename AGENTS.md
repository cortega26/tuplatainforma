# AGENTS.md

Operational protocol for AI/human agents in this repository.

Binding document: `/docs/AI_ENGINEERING_CONSTITUTION.md`.

Non-override clause: this file defines execution procedure only. It never overrides constitutional constraints, invariants, or prohibitions.

## 1. Authority Hierarchy

### Rule 1.1 - Precedence order is fixed
- Rationale: Prevents conflicting instructions and architectural drift.
- Enforcement: Before any change, the agent must include an "Authority Check" with this exact order: `1) docs/AI_ENGINEERING_CONSTITUTION.md`, `2) AGENTS.md`, `3) context/*.md`, `4) source code/comments`.
- Compliant behavior: "Authority Check: Constitution > AGENTS > context/*.md > code."
- Violation: Applying instructions from a source file that conflicts with constitutional invariants.

### Rule 1.2 - Constitution conflict handling is halt-only
- Rationale: Workarounds around constitutional constraints create hidden debt and regressions.
- Enforcement: If any requested change conflicts with constitution or domain invariants (`docs/domain/CONTENT/INVARIANTS.md`), stop implementation and return a conflict report.
- Compliant behavior: "Halt: requested domain-side fetch conflicts with side-effect isolation in Constitution §2.2."
- Violation: Moving `fetch` into `src/domain/**` to satisfy a feature request.

### Rule 1.3 - Invariants are non-interpretable by agents
- Rationale: Reinterpretation creates non-deterministic behavior across sessions.
- Enforcement: Architectural invariants must be quoted by ID/name from source docs before modification (`INVARIANTS.md`, `CONTRACTS.md`, `DOMAIN_CONTRACT_BOUNDARIES.md`).
- Compliant behavior: "Preserving INV-003: draft articles excluded from list/RSS/sitemap."
- Violation: Treating `draft=true` as "visible in preview lists" without documented invariant change.

## 2. Agent Execution Model

### Rule 2.1 - Scope declaration is mandatory before editing
- Rationale: Full repo visibility does not permit unconstrained changes.
- Enforcement: Every task starts with a scope block listing in-scope paths, out-of-scope paths, and allowed operation type.
- Compliant behavior: In-scope `src/data/blog/**`, `scripts/check-frontmatter.mjs`; out-of-scope `src/domain/**`.
- Violation: Editing `src/layouts/Layout.astro` during a frontmatter-only task.

### Rule 2.2 - Diff-first modification strategy
- Rationale: Minimizes regression surface and review complexity.
- Enforcement: Prefer minimal hunks; each changed file must map to one declared objective in change control template.
- Compliant behavior: Editing 8 lines in `check-frontmatter.mjs` to enforce one invariant.
- Violation: Reformatting entire files unrelated to the requested behavior.

### Rule 2.3 - Full-file rewrites are exceptional
- Rationale: Rewrites obscure intent and increase accidental breakage.
- Enforcement: Full rewrite allowed only if one condition is true: generated artifact refresh, file is <200 LOC and structurally replaced, or user explicitly requested rewrite. Condition must be declared in PR notes.
- Compliant behavior: Regenerating route snapshot JSON via script.
- Violation: Rewriting `src/pages/index.astro` for minor text change.

### Rule 2.4 - Prohibited execution behaviors
- Rationale: These patterns violate Constitution §1 and §11.
- Enforcement: Reject actions that: modify undeclared scope, refactor unrelated modules, add dependencies without justification, remove tests to pass CI, weaken types, or hide errors.
- Compliant behavior: Add targeted fix plus tests without altering unrelated modules.
- Violation: Deleting failing test cases to make `pnpm run test` pass.

### Rule 2.5 - Uncertainty handling is explicit
- Rationale: Silent assumptions cause contract violations.
- Enforcement: If requirement ambiguity affects contracts/invariants, stop and request clarification; if low-risk and local, proceed with labeled assumption.
- Compliant behavior: "Assumption A1: no URL slug migration requested; preserving current public routes."
- Violation: Renaming canonical fields without stating assumptions.

### Rule 2.6 - Mandatory halt conditions
- Rationale: Certain conditions make safe progress impossible.
- Enforcement: Halt immediately on any of: constitutional conflict, missing invariant source for required change, unresolved contract ambiguity, inability to verify critical gate, unexpected non-user edits in touched files.
- Compliant behavior: Stop when route comparison baseline file is missing.
- Violation: Shipping routing change without route diff verification.

### Execution checklist (required before code edits)
- [ ] Scope declared (in-scope/out-of-scope).
- [ ] Authority check recorded.
- [ ] Invariants/contracts referenced by document path.
- [ ] Risky assumptions listed or task halted.

## 3. Change Control Protocol

### Rule 3.1 - Eight-step change declaration is required
- Rationale: Standardized review data prevents omissions.
- Enforcement: Every change must include all eight items below; omission blocks merge.
- Compliant behavior: PR description includes all eight confirmations.
- Violation: Merging without rollback strategy or regression risk statement.

### Reusable template (mandatory)

```md
## Change Control Record

1. Scope declaration
- In scope:
- Out of scope:

2. Impacted modules
- Paths:
- Reason for each path:

3. Invariant preservation
- Referenced invariants:
- Preservation proof:

4. Contract preservation
- Referenced contracts:
- Breaking changes: yes/no

5. Boundary integrity
- Layer boundary check (`pnpm run check:boundaries`): pass/fail
- Unauthorized cross-layer imports introduced: yes/no

6. Test coverage impact
- Changed runtime layers:
- Related tests added/updated:
- Coverage threshold status (see Section 5): pass/fail

7. Rollback strategy
- Revert unit:
- Data/content rollback needed: yes/no

8. Regression risk
- Risk level: low/medium/high
- Primary regression vectors:
- Mitigations:
```

## 4. Constitution Binding Rules

### Rule 4.1 - Constitution reference before architectural edits
- Rationale: Architectural edits without constitutional mapping are non-deterministic.
- Enforcement: Any change in `src/domain/**`, `src/application/**`, `src/infrastructure/**`, routing model, or content contract must cite relevant constitutional sections in change record.
- Compliant behavior: "Constitution §2.1 dependency direction preserved; §2.2 side-effects remain in infrastructure."
- Violation: Altering layer dependencies without constitutional citation.

### Rule 4.2 - Conflict surfacing protocol
- Rationale: Conflicts must be auditable, not implicit.
- Enforcement: Conflict report must contain: requested action, conflicting rule, affected paths, reason change is blocked, accepted alternatives (if any).
- Compliant behavior: Structured conflict report posted instead of code workaround.
- Violation: Silent reinterpretation of invariant to satisfy task.

### Rule 4.3 - ADR trigger conditions
- Rationale: Architectural decisions need durable traceability.
- Enforcement: ADR required when any of these occur: layer dependency rule change, contract field lifecycle change (add/remove/deprecate), URL/canonical strategy change, CI gate semantics change, performance SLO threshold change.
- Compliant behavior: Add `docs/adr/ADR-YYYYMMDD-<topic>.md` in same PR as architectural change.
- Violation: Changing slug identity strategy without ADR.

### Rule 4.4 - Forbidden refactor windows
- Rationale: Opportunistic refactors increase risk during focused tasks.
- Enforcement: Refactors are forbidden during bugfix/content-only tasks unless directly required for invariant or contract preservation and declared in scope.
- Compliant behavior: Keep refactor out of an editorial typo fix PR.
- Violation: Restructuring use-case folders while fixing one article frontmatter issue.

## 5. Regression Prevention Framework

### Definition: what qualifies as regression
A regression is any change that degrades previously valid behavior in contracts, invariants, boundaries, routes, build integrity, editorial outputs, or measured performance guardrails.

### Rule 5.1 - CI gate set is mandatory
- Rationale: Constitutional gates must be executable, not advisory.
- Enforcement: All commands below must pass for merge:
  - `pnpm run lint`
  - `pnpm run check:boundaries`
  - `pnpm run format:check`
  - `pnpm run test`
  - `pnpm run check:frontmatter`
  - `pnpm run check:routes`
  - `pnpm run astro check`
  - `pnpm run build`
- Compliant behavior: PR includes successful run evidence (CI or local command log).
- Violation: Merging after skipping `check:routes` on routing-related change.

### Rule 5.2 - Coverage thresholds (change-impact)
- Rationale: Numeric coverage tooling is not fully wired; regression risk still requires measurable thresholds.
- Enforcement: Thresholds for touched runtime layers:
  - If `src/domain/**` changes, at least one file in `tests/domain/**` must be added or modified in same PR. Threshold: 100% of domain-changing PRs.
  - If `src/application/**` changes, at least one file in `tests/application/**` must be added or modified in same PR. Threshold: 100%.
  - If `src/infrastructure/**` changes, at least one file in `tests/infrastructure/**` must be added or modified in same PR. Threshold: 100%.
- Compliant behavior: Update `tests/domain/TaxEngine.test.ts` when changing `src/domain/taxation/TaxEngine.ts`.
- Violation: Changing calculator use-case formulas with no test updates.

### Rule 5.3 - Static analysis enforcement
- Rationale: Boundary/type drift appears before runtime failures.
- Enforcement: `eslint`, `astro check`, and `check-domain-boundaries` must pass with no waivers in the same change.
- Compliant behavior: Fix forbidden import in domain before merge.
- Violation: Suppressing lint/type errors to merge quickly.

### Rule 5.4 - Performance guardrails for hot paths
- Rationale: Home and article entry paths are user-critical and historically performance-sensitive.
- Enforcement: For changes touching `src/layouts/**`, `src/pages/index.astro`, `src/pages/posts/**`, `src/styles/global.css`, or `public/fonts/**`, attach Lighthouse evidence and meet all thresholds:
  - Mobile Performance >= 99
  - LCP <= 1.7s
  - Speed Index <= 3.0s
  - CLS = 0
  - TBT = 0ms
- Compliant behavior: Provide JSON report in `artifacts/` meeting thresholds.
- Violation: Merging font/layout change without performance evidence.

### Assumptions (explicit)
- A1: As of 2026-02-28, numeric line/function coverage gate is not configured in CI (`@vitest/coverage-v8` missing). This protocol therefore enforces change-impact coverage thresholds until a numeric coverage gate is added by ADR.

## 6. Context Engineering Discipline

### Rule 6.1 - Minimal relevant context extraction
- Rationale: Token and attention efficiency increase correctness.
- Enforcement: Load only files required for declared scope; cap initial discovery to directly relevant docs/modules; expand only on blocker.
- Compliant behavior: Read Constitution + affected contract docs before editing frontmatter checks.
- Violation: Dumping entire repository contents into analysis for a single script fix.

### Rule 6.2 - No raw file dumps unless requested
- Rationale: Large dumps obscure decisions and waste context budget.
- Enforcement: Summarize findings; quote only necessary lines/paths; full dumps allowed only if explicitly requested by reviewer.
- Compliant behavior: Provide invariant IDs and impacted paths instead of pasting full files.
- Violation: Posting full 300-line script when a 5-line diff summary is enough.

### Rule 6.3 - Structured prompt/request format required
- Rationale: Deterministic execution depends on stable input schema.
- Enforcement: Each execution request must include this block:

```md
## Task Brief
- Objective:
- In scope:
- Out of scope:
- Invariants/Contracts to preserve:
- Required gates:
- Deliverable:
```

- Compliant behavior: Request includes objective, scope, invariants, and gates before implementation.
- Violation: "Fix SEO quickly" with no scope or constraints.

### Rule 6.4 - Explicit scope boundary in every response
- Rationale: Prevents silent scope creep across turns.
- Enforcement: Agent response must include "Implemented" and "Not implemented" path-level lists.
- Compliant behavior: "Implemented: scripts/check-frontmatter.mjs; Not implemented: runtime routing files."
- Violation: Hidden edits outside declared scope.

## 7. Technical Debt Governance

### Rule 7.1 - Debt ledger location is fixed
- Rationale: Centralized debt tracking is required for prioritization and audits.
- Enforcement: All debt items must be logged in `/docs/TECH_DEBT_BACKLOG.md`.
- Compliant behavior: Add new debt item with ID, impact, severity, resolution strategy.
- Violation: Mentioning debt only in PR comments.

### Rule 7.2 - Severity scoring is mandatory (1-5)
- Rationale: Consistent severity enables deterministic triage.
- Enforcement: Every new debt item must include severity score:
  - 1: Cosmetic/no behavior risk
  - 2: Maintainability friction
  - 3: Medium regression risk
  - 4: High risk to correctness/performance/security
  - 5: Active production risk
- Compliant behavior: "Severity 4 - boundary checker bypass possibility."
- Violation: Logging debt without severity.

### Rule 7.3 - Debt that blocks feature work
- Rationale: High-severity debt must not compound.
- Enforcement: Severity 4-5 debt in touched area blocks feature delivery unless resolved in same release cycle or explicit waiver ADR is approved.
- Compliant behavior: Resolve severity-4 routing debt before adding new routing feature.
- Violation: Shipping new feature on top of unresolved severity-5 defect.

### Rule 7.4 - Agent obligations on debt discovery
- Rationale: Agents must surface systemic risks, not only task-local fixes.
- Enforcement: When debt is discovered, agent must either fix it in-scope or log it with severity and mitigation; silent ignore is forbidden.
- Compliant behavior: Log missing coverage tooling as debt with mitigation plan.
- Violation: Not reporting repeated fallback failures discovered during change.

## 8. Commit & PR Standards

### Rule 8.1 - Commit message format is mandatory
- Rationale: Structured history improves traceability and release automation.
- Enforcement: Use `type(scope): description` with allowed types from Constitution: `feat|fix|refactor|chore|test|perf|docs`.
- Compliant behavior: `fix(frontmatter): block deprecated canonicalURL field`.
- Violation: `misc updates`.

### Rule 8.2 - PR structure requirements
- Rationale: Review quality depends on predictable evidence structure.
- Enforcement: PR must include: summary, scope boundaries, change control record, test evidence, risk/rollback, related issue.
- Compliant behavior: PR body follows template and includes all mandatory sections.
- Violation: PR with only a one-line description and no verification evidence.

### Rule 8.3 - Verification checklist is blocking
- Rationale: Prevents partial validation merges.
- Enforcement: PR checkbox list must confirm completion of Section 5 gates and Section 3 change control.
- Compliant behavior: All checks marked with linked evidence.
- Violation: Unchecked validation items at merge time.

### Rule 8.4 - Breaking change protocol
- Rationale: Contract/routing breaks require explicit migration path.
- Enforcement: If breaking change exists, PR must include `BREAKING CHANGE:` block with impacted consumers, migration steps, rollback, and ADR reference.
- Compliant behavior: Breaking slug policy change with migration + redirects + ADR.
- Violation: Removing contract field used by runtime without migration plan.

## 9. Conversation Management Rules

### Rule 9.1 - Start a new conversation when architectural context changes
- Rationale: Separates decision domains and limits cross-contamination.
- Enforcement: New conversation required when scope crosses bounded contexts, introduces ADR-level decisions, or exceeds one primary objective.
- Compliant behavior: Separate conversation for "taxonomy contract redesign" after finishing "frontmatter lint fix".
- Violation: Mixing architecture redesign into a bugfix thread.

### Rule 9.2 - Continue conversation for same bounded objective
- Rationale: Maintains momentum and avoids repeated context loading.
- Enforcement: Continue existing thread when objective, scope boundaries, and invariants remain unchanged.
- Compliant behavior: Follow-up edits on same route-check script in same thread.
- Violation: Opening new thread for minor iteration of same fix.

### Rule 9.3 - Checkpoint architectural state explicitly
- Rationale: Durable checkpoints prevent loss of rationale between sessions.
- Enforcement: When architecture-affecting work completes, update checkpoint in `context/PROJECT_CONTEXT_MASTER.md` or add `context/PHASE*_CLOSURE_REPORT.md` entry referencing ADR/PR.
- Compliant behavior: Add decision note summarizing preserved invariants and changed contracts.
- Violation: Finishing architecture change with no persistent checkpoint.

### Rule 9.4 - Token bloat prevention
- Rationale: Excessive context inflates error rate and latency.
- Enforcement: Keep active context to relevant files only; replace repeated long content with path+summary references.
- Compliant behavior: "See docs/domain/CONTENT/INVARIANTS.md INV-001..INV-014" instead of repeated full text.
- Violation: Re-pasting unchanged docs in every turn.

### Rule 9.5 - Separate structural tasks from content tasks
- Rationale: Different risk profiles require different validation gates.
- Enforcement: Do not combine architecture/runtime refactors with bulk editorial content updates in one PR.
- Compliant behavior: PR A for runtime contract change, PR B for article updates.
- Violation: Single PR modifies routing architecture and 20 article bodies.

## Deterministic Closure Conditions

A change is complete only if all are true:
- Scope remained bounded to declared in-scope paths.
- Constitution and AGENTS checks are satisfied with no unresolved conflict.
- Required CI gates passed.
- Change control record is complete.
- Regression risk and rollback are explicitly documented.

If any condition fails, task status is `HALT` until resolved.
