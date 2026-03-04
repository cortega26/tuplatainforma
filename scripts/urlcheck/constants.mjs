export const HOST = "127.0.0.1";
export const SITE_BASE = "tuplatainforma";

export const MODES = {
  ci: {
    concurrency: 6,
    timeoutMs: 12000,
    verbosity: "error",
    retryMax: 2,
    retryBackoffMs: 350,
  },
  local: {
    concurrency: 10,
    timeoutMs: 15000,
    verbosity: "none",
    retryMax: 2,
    retryBackoffMs: 300,
  },
  canary: {
    concurrency: 2,
    timeoutMs: 5000,
    verbosity: "error",
    retryMax: 1,
    retryBackoffMs: 150,
  },
  external_audit: {
    concurrency: 6,
    timeoutMs: 12000,
    verbosity: "error",
    retryMax: 2,
    retryBackoffMs: 350,
  },
};

export const INTERNAL_HARD_STATUS = new Set([404, 410, 500, 502, 503]);
export const EXTERNAL_SOFT_STATUS = new Set([401, 403, 429]);

// External hosts that are business-critical and should always be surfaced
// in external audit reporting even when globally noisy.
export const ALLOWLIST_HOSTS_CRITICAL = [];

// External hosts that are persistently noisy and should remain soft-fail.
// This list is for observability classification only; it must not affect
// internal broken-link hard-fail behavior.
export const DENYLIST_HOSTS_ALWAYS_SOFT = [];

export const BASELINE_PATH = "scripts/urlcheck/baseline.json";
export const LINKINATOR_CONFIG_PATH = ".linkinatorrc";
export const URLCHECK_ARTIFACT_DIR = "scripts/urlcheck/artifacts";
