# Founder Next Steps For Auth

The founder-side auth step is complete. These are the minimum actions to preserve and reuse it.

## Exact profile to use

- Persistent automation profile: `output/playwright/search-platform-profile-2e`
- Canonical reusable auth file: `output/playwright/search-platform-state-2e-authenticated.json`
- Older unauthenticated trial state: `output/playwright/search-platform-state-2e.json`

## Immediate founder action

- No immediate action is required if the authenticated state is still valid.
- Keep `output/playwright/search-platform-profile-2e` available for future runs.
- Do not delete `output/playwright/search-platform-state-2e-authenticated.json`.

## Exact commands for the next agent run

Run these commands from the repository root:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"

"$PWCLI" -s=search-platform open about:blank --headed
"$PWCLI" -s=search-platform state-load output/playwright/search-platform-state-2e-authenticated.json
"$PWCLI" -s=search-platform goto "https://search.google.com/search-console?resource_id=sc-domain:monedario.cl"
```

## If auth expires later

1. Reopen the persistent profile:

```bash
"$PWCLI" -s=founder-auth open "https://search.google.com/search-console?resource_id=sc-domain:monedario.cl" --headed --persistent --profile output/playwright/search-platform-profile-2e
```

2. Sign in again inside that exact browser if Google or Microsoft asks for login.
3. Save a fresh state file:

```bash
"$PWCLI" -s=founder-auth state-save output/playwright/search-platform-state-2e-authenticated.json
```

## What not to do

- Do not switch back to copied Chrome profiles for this workflow.
- Do not use `~/.config/google-chrome` as the automation profile path.
- Do not overwrite the authenticated state file with an unauthenticated session.
- Do not delete the dedicated profile unless you intend to re-do manual login.

## Whether Bing needs a separate profile

- Not yet.
- Use the same persistent profile `output/playwright/search-platform-profile-2e` first.
- Create a separate Bing-only profile only if a future run shows that the Microsoft login breaks or displaces the Google session.

## How the next agent run should start

Preferred path:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"

"$PWCLI" -s=search-platform open about:blank --headed
"$PWCLI" -s=search-platform state-load output/playwright/search-platform-state-2e-authenticated.json
```

Fallback path:

```bash
"$PWCLI" -s=search-platform open "https://search.google.com/search-console?resource_id=sc-domain:monedario.cl" --headed --persistent --profile output/playwright/search-platform-profile-2e
```
