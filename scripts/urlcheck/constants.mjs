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
};

export const INTERNAL_HARD_STATUS = new Set([404, 410, 500, 502, 503]);
export const EXTERNAL_SOFT_STATUS = new Set([401, 403, 429]);

export const ALLOWLIST_HOSTS = [];
export const DENYLIST_HOSTS = [];

export const BASELINE_PATH = "scripts/urlcheck/baseline.json";
export const LINKINATOR_CONFIG_PATH = ".linkinatorrc";
