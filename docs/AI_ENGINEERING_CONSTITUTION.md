# AI-Optimized Engineering Constitution

## Deterministic Execution Framework for Autonomous and Assisted Agents

---

## 0. Purpose

This document defines hard constraints, behavioral rules, architectural invariants, and enforcement mechanisms for any AI or human agent operating on this codebase.

Its objective is to:

- Prevent architectural erosion.
- Minimize regressions.
- Guarantee deterministic behavior.
- Optimize long-term velocity.
- Reduce token waste and ambiguity in AI interactions.

If a rule cannot be enforced, it must not exist.

---

## 1. Execution Model for AI Agents

All agents must operate under the following execution contract:

1. Never modify files outside declared scope.
2. Never refactor unrelated modules.
3. Never introduce new dependencies without explicit justification.
4. Never weaken typing or remove tests to "fix" builds.
5. Always explain trade-offs before architectural changes.
6. Always preserve public contracts unless versioned.

Violations must fail CI.

---

## 2. Architectural Invariants (Non-Negotiable)

### 2.1 Dependency Direction

- Domain layer must not depend on infrastructure.
- Application layer may depend on domain.
- Infrastructure may depend on both.

Enforcement:

- Static import boundary checks in CI.
- Lint rule for forbidden imports.

### 2.2 Side-Effect Isolation

- Domain must be pure.
- IO, logging, HTTP, DB must exist only in infrastructure.
- No implicit state mutation.

Enforcement:

- Code review checklist.
- Domain test suite must run without mocks.

---

## 3. DDD Enforcement Rules

### 3.1 Entities

- Must encapsulate behavior.
- No anemic data containers.
- Must protect invariants internally.

### 3.2 Value Objects

- Immutable.
- Compared by value.
- No side-effects.

### 3.3 Aggregates

- Single entry point.
- External access only through root.

Enforcement:

- Naming conventions.
- Folder structure mapping to domain modules.
- Static boundary validation.

---

## 4. Contracts and Invariants

### 4.1 Public APIs

- Strict typing required.
- No implicit `any`.
- DTOs must be explicit.

### 4.2 Domain Invariants

Each invariant must define:

- Condition that must always hold.
- Enforcement location.
- Regression detection method.

Example:

Invariant: Account balance cannot be negative.

Enforced: Inside domain entity constructor.

Detected: Unit test asserting negative case throws error.

---

## 5. Testing Doctrine

### 5.1 Unit Tests

- Must test behavior, not implementation details.
- Must not mock domain logic.
- Must fail loudly on invariant violation.

### 5.2 Integration Tests

Required for:

- Database access.
- External services.
- API boundaries.

### 5.3 Coverage

- Minimum threshold defined in CI.
- Coverage drop blocks merge.

Forbidden:

- Snapshot overuse.
- Testing private methods directly.
- Flaky timing-based tests.

---

## 6. CI and Static Analysis Gates

Mandatory gates:

- Type checking (strict mode).
- Linting (no warnings allowed).
- Security scanning.
- Test suite.
- Dependency audit.
- Boundary checks.

All failures block merge.

---

## 7. Performance Guardrails

- No unbounded loops on hot paths.
- No synchronous blocking in async context.
- Caching strategy must be explicit.
- Observability hooks required for critical flows.

Performance regressions must fail CI when measurable.

---

## 8. Technical Debt Governance

Debt must:

- Be logged in `/docs/TECH_DEBT_BACKLOG.md`.
- Include severity score (1-5).
- Include impact description.
- Include resolution strategy.

Severity 4-5 cannot remain unresolved beyond one release cycle.

---

## 9. Documentation Rules

- Every module must define responsibility.
- Architectural changes require ADR.
- Commit messages must follow structured format:

`TYPE(scope): description`

Types:

- `feat`
- `fix`
- `refactor`
- `chore`
- `test`
- `perf`
- `docs`

---

## 10. Deterministic Agent Protocol

When modifying code, the agent must:

1. State scope of change.
2. Identify impacted modules.
3. Confirm no contract break.
4. Confirm invariant preservation.
5. Confirm tests updated or unaffected.
6. Confirm CI gates pass logically.

If uncertainty exists, halt and request clarification.

---

## 11. Forbidden Patterns

- God objects.
- Circular dependencies.
- Hidden side-effects.
- Implicit global state.
- Business logic in controllers.
- Silent error swallowing.

---

## 12. Optimization Goal

This constitution exists to:

- Increase clarity.
- Reduce entropy.
- Enforce structural integrity.
- Make AI collaboration predictable.
- Eliminate regression classes.

If a proposed change increases entropy, it must be rejected.

---

## End of Constitution
