# search_access_diagnostic

## Scope

- Reassessed tasks: `MB-032`, `MB-002`
- Date: `2026-03-08`
- Goal: determine what browser/session/auth path is actually available for authenticated Search Console and Bing work in this environment.

## What was attempted

### 1. Playwright default session for Google Search Console

- Command path: `playwright-cli open https://search.google.com/search-console --headed`
- Browser context: `ephemeral / in-memory`
- Observed user-data-dir: `<in-memory>`
- Result:
  - browser launched correctly
  - final URL landed on `https://search.google.com/search-console/about`
  - no property view, sitemap view, or authenticated state

### 2. Playwright persistent empty profile for Google Search Console

- Command path: `playwright-cli open ... --persistent --profile output/playwright/gsc-persistent-profile`
- Browser context: `persistent`, but brand-new empty profile
- Result:
  - browser launched correctly
  - Search Console still opened the public `/about` page
  - no inherited local sign-in state

### 3. Direct inheritance attempt against local Chrome user-data-dir

- Attempted profile path: `~/.config/google-chrome`
- Browser context: `persistent`, targeting the real local Chrome profile
- Result:
  - Playwright launch failed
  - Chrome output: `Abriendo en una sesión existente del navegador`
  - root cause: the live Chrome user-data-dir is already locked by the user’s running Chrome process, so Playwright cannot reuse it directly

### 4. Copied Chrome profile for Google Search Console

- Prepared a repo-local profile copy under `output/playwright/chrome-default-copy`
- Copied items included `Local State`, `Default/Cookies`, `Network Persistent State`, `Preferences`, `Local Storage`, `Session Storage`, and `IndexedDB`
- Browser context: `persistent` using the copied profile
- Result:
  - Playwright could open the copied profile
  - browser cookies became visible inside the Playwright context, including Google auth cookies (`SID`, `SAPISID`, `HSID`, `SSID`, `ACCOUNT_CHOOSER`)
  - Search Console initially opened `/about`, but a direct navigation to `https://search.google.com/search-console?resource_id=sc-domain:monedario.cl` succeeded
  - final page title: `Descripción general`
  - authenticated post-login state was therefore **achievable for Google Search Console** in this environment through the copied persistent profile path

### 5. Bing Webmaster with the copied profile

- Command path: navigate to `https://www.bing.com/webmasters/home`
- Browser context: same copied persistent profile
- Result:
  - Bing Webmaster redirected to `https://www.bing.com/webmasters/about?from=home`
  - no authenticated dashboard state
  - visible Bing cookies were generic browser/session cookies (`_EDGE_S`, `_EDGE_V`, `MUID`, `MUIDB`, `MSCC`), not proof of signed-in Webmaster access

### 6. Direct Microsoft login page reachability

- Command path: `playwright-cli open https://login.live.com/ --headed`
- Browser context: `ephemeral / in-memory`
- Result:
  - login page reachable
  - final page title: `Sign in`
  - authenticated post-login state was **not** available automatically

## What browser / session / auth path was actually available

- Default Playwright wrapper path: usable, but `ephemeral`
- Persistent Playwright path: usable
- Direct reuse of the live local Chrome user-data-dir: **not usable while Chrome is already running**
- Copied Chrome profile path: **usable**, and sufficient to reach authenticated Google Search Console
- Existing local Microsoft / Bing Webmaster authenticated session: **not available in a reusable form**

## Browser/session findings required by sprint

- Playwright used an ephemeral context by default: `yes`
- Playwright used a persistent context when explicitly requested: `yes`
- Local Chrome profile/session inheritance attempted: `yes`
- Cookies/session state visible: `yes`
  - Google auth cookies visible in copied profile context
  - Bing only exposed generic cookies, not an authenticated Webmaster session
- Login pages reachable: `yes`
  - Google services reachable
  - Microsoft login page reachable at `https://login.live.com/`
- Authenticated post-login state achievable: `partially`
  - Google Search Console for `sc-domain:monedario.cl`: `yes`
  - Bing Webmaster: `no`

## Blocker classification

- `missing persistent browser profile access`: **partially true**
  - fixed for Google by using a copied persistent profile instead of the in-memory default path
- `missing manual in-session login`: **true for Bing**
  - no reusable Bing Webmaster authenticated session was present
- `2FA / SSO / trust-device barrier`: **not proven as the current blocker**
  - no automated Bing login was attempted because no reusable signed-in Microsoft session existed to start from
- `inaccessible cookies/session state`: **partially true**
  - Google state became usable only after moving to a copied persistent profile
  - direct live-profile reuse remained blocked by Chrome session locking
- `wrong technical approach (browser auth vs API)`: **plausible for long-term repeatability**
  - browser auth is now workable for Google, but still brittle; API credentials would be cleaner for recurring Search Console operations

## Honest task reassessment

- `MB-032`: **not DONE**
  - Google side is now diagnosable and technically reachable through a copied persistent profile
  - Bing side is still missing authenticated agent-side access
- `MB-002`: **not DONE**
  - authenticated Google access exists, but this sprint did not complete the full validation/submission workflow and Bing access is still absent

## What the founder must provide next

1. **Stop using the default in-memory Playwright path for search-platform work.** Use a persistent profile instead.
2. **Do not point Playwright at `~/.config/google-chrome` while normal Chrome is open.** That path is locked by the live Chrome process and Playwright exits immediately.
3. **Create or approve a dedicated automation profile directory**, for example:
   - `output/playwright/search-platform-profile/`
4. **Inside that persistent Playwright browser, do one manual login with the exact Google and Microsoft accounts that own `monedario.cl`.**
5. **Keep using that same persistent profile for future runs**, or save storage state after manual login.

Recommended minimal command pattern:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"

"$PWCLI" --session search-platform open https://search.google.com/search-console --headed --persistent --profile output/playwright/search-platform-profile
```

Then, after the founder signs in manually inside that browser:

```bash
"$PWCLI" --session search-platform state-save output/playwright/search-platform-state.json
```

Practical interpretation:

- Google Search Console is now executable through a persistent copied/dedicated profile.
- Bing Webmaster still needs **one manual Microsoft/Bing login inside that persistent automation profile** before agent-side execution can continue.
