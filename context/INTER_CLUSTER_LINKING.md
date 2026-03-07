# Inter-Cluster Linking Policy (Canonical)

Last updated: 2026-03-02  
Status: Active (review-enforced, non-gate)

Authority order:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. Source code/comments

## Objective

Increase topical discovery and semantic authority without link stuffing or artificial cluster inflation.

## Definitions

- Hub link: `/guias/<cluster>/`
- Intra-cluster link: `/posts/<slug>/` where target article has the same `frontmatter.cluster`
- Inter-cluster link: `/posts/<slug>/` where target article belongs to a different `frontmatter.cluster`

## Minimum rules per article

- Hub link expected.
- Intra-cluster links: minimum `>=1` (warning-first in current gate behavior).
- Inter-cluster links: recommended `0..2`; never mandatory.
- Canonical invariant ID for intra-cluster minimum: `INVARIANT.EDITORIAL.CLUSTER_INTERNAL_LINK_MIN`.
- Deprecated alias (do not use for new references): `INVARIANT.EDITORIAL.LINKING.INTRA_CLUSTER_MIN_1`.

## Allowed inter-cluster heuristics

Inter-cluster linking is allowed only when at least one condition applies:

- Prerequisite: reader needs the external concept first.
- Decision dependency: decision in current article affects another cluster.
- Risk mitigation: link prevents predictable user mistakes.

## Prohibitions

- Do not add inter-cluster links only for keyword density.
- Do not add more than 2 inter-cluster links per article in one edit.
- Do not link to non-existent hubs.
- Do not invent slugs.

## Quick examples

- AFP -> Impuestos Personas: when tax impact is part of pension decision.
- Deuda y Crédito -> UF: when real debt cost depends on UF dynamics.
- Ahorro e Inversión -> Impuestos Personas: when returns must be evaluated net of taxes.

## Validation workflow (existing commands only)

1. `pnpm run check:editorial`
2. `pnpm run check`
3. `pnpm run build`

`cluster_link_warning` remains warning-first in current rollout. PR review is required to enforce inter-cluster quality and max-per-edit limits.
