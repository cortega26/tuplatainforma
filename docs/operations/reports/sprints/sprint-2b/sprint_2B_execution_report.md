# Sprint 2B Execution Report

## Sprint

Sprint 2B - Taxonomy Realignment and First Cluster Build

## Outcome

- Se resolvió la taxonomía semántica y la estrategia de hub sin cambiar la convención pública `/guias/<cluster>/`.
- Se construyó el primer cluster productivo de `sueldo-remuneraciones`.
- Se implementó un patrón reusable de linking estructurado para calculadora, glosario y soporte legal.
- Se intentó el track de plataformas de búsqueda, pero el acceso autenticado no fue posible con el perfil Playwright disponible.

## Change Control Record

1. Scope declaration
- In scope: `src/pages/guias/**`, `src/layouts/PostDetails.astro`, `src/pages/calculadoras/sueldo-liquido.astro`, sueldo-related blog entries, backlog/progress/context/docs sprint artifacts.
- Out of scope: homepage redesign, otros clusters productivos, rollout sitewide de módulos, cambios en dominio/canonical strategy, cualquier fake de acceso autenticado.

2. Impacted modules
- Paths:
  - `src/config/clusters.ts`
  - `src/components/Header.astro`
  - `src/components/ContextLinkSection.astro`
  - `src/config/sueldoClusterLinks.ts`
  - `src/pages/guias/index.astro`
  - `src/pages/guias/empleo-ingresos/index.astro`
  - `src/pages/guias/pensiones-afp/index.astro`
  - `src/pages/guias/sueldo-remuneraciones/index.astro`
  - `src/layouts/PostDetails.astro`
  - `src/pages/calculadoras/sueldo-liquido.astro`
  - `src/data/blog/como-calcular-sueldo-liquido.md`
  - `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`
  - `tests/integration/cluster-source-of-truth.test.ts`
  - `docs/development/backlog.md`
  - `docs/operations/logs/progress_log.md`
  - `docs/editorial/FRONTMATTER_SCHEMA.md`
  - `context/PROJECT_CONTEXT_MASTER.md`
- Reason for each path:
  - cluster registry/navigation
  - sueldo hub implementation
  - sueldo article/calculator linking
  - taxonomy documentation and sprint reporting

3. Invariant preservation
- Referenced invariants:
  - `URL.PUBLIC.NO_POST_ID`
  - `ROUTES.NO_SILENT_CHANGES`
  - `RSS.NO_REMOVALS`
  - `INVARIANT.EDITORIAL.CLUSTER_VALID`
  - `INVARIANT.EDITORIAL.LINKING.HUB_REQUIRED`
- Preservation proof:
  - all new public URLs are slug/prefix based; none derive from `post.id`
  - the hub follows `/guias/<cluster>/`
  - article body links now point to the new cluster hub and same-cluster article

4. Contract preservation
- Referenced contracts:
  - `CONTRACT.PUBLIC_URLS`
  - `CONTRACT.ROUTES_SNAPSHOT`
  - `CONTRACT.RSS_POLICY`
  - `CONTRACT.EDITORIAL.CLUSTERING`
  - `CONTRACT.EDITORIAL.INTER_CLUSTER_LINKING`
- Breaking changes: no

5. Boundary integrity
- Layer boundary check (`pnpm run check:boundaries`): pass
- Unauthorized cross-layer imports introduced: no

6. Test coverage impact
- Changed runtime layers: UI/page/layout layer only
- Related tests added/updated: `tests/integration/cluster-source-of-truth.test.ts`
- Coverage threshold status (see Section 5): pass

7. Rollback strategy
- Revert unit: revert the sueldo cluster patchset and remove `/guias/sueldo-remuneraciones/`
- Data/content rollback needed: no external data rollback

8. Regression risk
- Risk level: medium
- Primary regression vectors:
  - route additions and guide navigation changes
  - cluster registry mismatch
  - formatting/lint issues in Astro pages
- Mitigations:
  - cluster source-of-truth test updated
  - full editorial/build gates to be run after implementation

## Backlog result

- Done: `MB-033`, `MB-009`, `MB-016`, `MB-017`
- Still open: `MB-032`, `MB-002`
- New tasks: `MB-034`, `MB-035`

## Files changed

- Runtime/content:
  - `src/config/clusters.ts`
  - `src/components/Header.astro`
  - `src/components/ContextLinkSection.astro`
  - `src/config/sueldoClusterLinks.ts`
  - `src/pages/guias/index.astro`
  - `src/pages/guias/empleo-ingresos/index.astro`
  - `src/pages/guias/pensiones-afp/index.astro`
  - `src/pages/guias/sueldo-remuneraciones/index.astro`
  - `src/layouts/PostDetails.astro`
  - `src/pages/calculadoras/sueldo-liquido.astro`
  - `src/data/blog/como-calcular-sueldo-liquido.md`
  - `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`
  - `tests/integration/cluster-source-of-truth.test.ts`
- Operational/docs:
  - `docs/development/backlog.md`
  - `docs/operations/logs/progress_log.md`
  - `docs/editorial/FRONTMATTER_SCHEMA.md`
  - `context/PROJECT_CONTEXT_MASTER.md`
  - `docs/operations/reports/sprints/sprint-2b/*`

## Verification

- Passed:
  - `pnpm run format:check`
  - `pnpm run lint`
  - `pnpm run check:boundaries`
  - `pnpm run test`
  - `pnpm run check:frontmatter`
  - `pnpm run check:no-postid-urls`
  - `pnpm run astro check`
  - `pnpm run check:links`
  - `pnpm run build`
  - `pnpm run check:routes`
  - `pnpm run check:rss`
- Not clean:
  - `pnpm run check`
  - Failure reason: pre-existing `check:docs` repository policy violations for root Markdown files and legacy editorial artifacts outside the allowed docs directories; not introduced by Sprint 2B.

## Next sprint recommendation

Expand the next production cluster only after filling the two sueldo content gaps still visible from this sprint: `descuentos sueldo` and `liquidación de sueldo`. Once those are live, reuse the same module pattern in the next selected cluster rather than redesigning the architecture again.
