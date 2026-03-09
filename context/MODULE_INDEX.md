# Module Index (Agent Quick Map)

Last updated: 2026-03-01

## 1. Repository map

| Path | What lives here | Agent note |
|---|---|---|
| `src/` | Runtime app (Astro pages/components/layouts/utils/content config) | Do not modify for context-only tasks. |
| `src/data/blog/` | Editorial content (`.md/.mdx`) | Out of scope unless explicit content task. |
| `scripts/` | Quality gates and snapshots (`check:*`, `compare-*`, `snapshot-*`) | Primary enforcement source for context invariants/contracts. |
| `docs/` | Constitution, domain docs, reports, issue docs | Constitutional/domain source of truth. |
| `docs/reports/` | Canonical route and RSS baselines only | Inputs tracked for `check:routes` and `check:rss`. |
| `output/validation/` | Generated route/RSS validation snapshots | Local current snapshots emitted by validation scripts. |
| `context/` | Agent context layer and project state docs | Keep concise and cross-referenced. |
| `tests/` | Vitest suites by layer | Required when runtime layers change per AGENTS rules. |

## 2. Where key behaviors are defined

- Public URL identity guard:
  - `docs/AI_ENGINEERING_CONSTITUTION.md` (`URL.PUBLIC.NO_POST_ID`)
  - `scripts/check-no-postid-urls.mjs`
- Route snapshot policy:
  - `scripts/snapshot-routes.mjs`
  - `scripts/compare-routes.mjs`
  - `docs/reports/routes_snapshot_before.json`
  - `output/validation/routes_snapshot_after.json`
- RSS snapshot policy:
  - `scripts/rss-to-json.mjs`
  - `scripts/compare-rss.mjs`
  - `docs/reports/rss_snapshot.json`
  - `output/validation/rss_snapshot_after.json`
- Frontmatter policy:
  - `scripts/check-frontmatter.mjs`
  - `docs/domain/CONTENT/INVARIANTS.md`

## 3. Context first-read sequence for agents

1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/INVARIANTS.md`
4. `context/CONTRACTS.md`
5. Relevant script(s) in `scripts/`
