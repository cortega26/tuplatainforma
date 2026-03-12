# ADR-20260312: uf-costo-de-vida Ownership Hardening

Date: 2026-03-12
Status: Accepted

## Context

The repository had already opened `/guias/uf-costo-de-vida/` as the productive hub for UF, IPC, inflation, and rent-adjustment content, but the three core articles still lived as documented transitional placements in `deuda-credito` or `empleo-ingresos`.

That left an avoidable mismatch between:

- the productive hub and linking model;
- the ownership policy and matrix;
- the actual frontmatter used by runtime and editorial checks.

Under `AGENTS.md` Rule 4.3, extending hardened ownership enforcement to a new cluster changes CI/editorial gate semantics and requires an ADR.

## Decision

Adopt Route A for `uf-costo-de-vida`:

- `uf-costo-de-vida` joins the hardened ownership cluster set.
- Published articles in that cluster must declare both `topicRole` and `canonicalTopic`.
- Canonical topics in that cluster must come from the central registry in `src/config/editorial-topic-policy.mjs`.
- `que-es-la-uf`, `que-es-el-ipc-chile-como-se-calcula`, and `reajuste-arriendo-uf-ipc-chile` move to `cluster: uf-costo-de-vida` and become explicit `owner` pages for distinct canonical topics.
- `category: general` is allowed as the operational category for `uf-costo-de-vida` because the current category taxonomy has no dedicated value for this front and introducing one would widen runtime/UI scope beyond this hardening pass.

## Consequences

Positive:

- Hub, frontmatter, policy, and audit output now describe the same operational truth.
- UF/IPC/rent-adjustment content no longer depends on transitional exceptions.
- `deuda-credito` keeps only the semantic bridge it actually needs.

Trade-offs:

- `uf-costo-de-vida` becomes a documented exception to the normal hardened-cluster `category: general` rule.
- A future dedicated category for this front remains possible, but is not required to keep ownership unambiguous today.

## Maintenance rules

1. New published content in `uf-costo-de-vida` must declare `topicRole` and `canonicalTopic`.
2. New canonical topics for this cluster must be added to the central registry before use.
3. `deuda-credito` and `empleo-ingresos` may link into this front only as related context, not as ownership fallback.
4. If the repository later needs a dedicated category value for this front, that taxonomy change should happen in a separate scoped task.
