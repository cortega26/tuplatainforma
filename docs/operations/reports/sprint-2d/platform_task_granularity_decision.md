# Platform Task Granularity Decision

## Decision

- The old backlog structure for `MB-002` was too coarse.
- `MB-002` previously bundled two different execution surfaces:
  - Google Search Console operational work
  - Bing Webmaster operational work
- Sprint 2D confirmed that these surfaces do not move together operationally, so the bundled task was no longer truthful.

## What changed

- `MB-002` was converted into an explicit umbrella task.
- New concrete execution tasks were created:
  - `MB-036` — Execute Google Search Console validation and sitemap submission
  - `MB-037` — Execute Bing Webmaster validation and sitemap submission
- `MB-002` now depends on `MB-036` and `MB-037` instead of pretending both platforms are one atomic action.

## Why this is better

- Google and Bing can now advance independently without falsifying completion state.
- A successful Google execution no longer forces Bing to be implied as complete.
- A Bing auth blocker no longer hides Google-specific execution progress or failure.
- Operational reports can now map one-to-one to backlog tasks.

## MB-032 reassessment

- `MB-032` remains necessary.
- `MB-032` remains `IN_PROGRESS`.
- Reason:
  - Sprint 2D did not confirm a reusable authenticated Google dashboard session.
  - Sprint 2D did not confirm a reusable authenticated Bing dashboard session.
  - Sprint 2C's copied-profile Google success signal was not reproducible during this sprint.
- Therefore `MB-032` cannot honestly be marked `DONE` under Sprint 2D evidence.

## Current backlog model after Sprint 2D

- `MB-032`
  - access prerequisite task
  - still about reusable authenticated agent-side platform access
- `MB-036`
  - Google-only execution task
  - remains blocked by authenticated-session restoration
- `MB-037`
  - Bing-only execution task
  - remains blocked by authenticated-session restoration
- `MB-002`
  - umbrella tracking task
  - closes only when both `MB-036` and `MB-037` are complete

## Truth model

- Access is modeled separately from execution.
- Google and Bing execution are modeled separately from each other.
- Backlog status now matches the real operational state observed in Sprint 2D instead of preserving a simplified all-or-nothing task.
