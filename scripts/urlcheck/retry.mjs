import { isRetryCandidate } from "./classify.mjs";

export async function applyRetries(links, options) {
  const {
    modeConfig,
    maxConcurrency,
  } = options;

  const retryable = links.filter(isRetryCandidate);
  const retryStats = {
    totalRetries: 0,
    byHost: {},
  };

  if (retryable.length === 0) return { links, retryStats };

  const linkMap = new Map(links.map((item) => [item.url, item]));
  await runPool(retryable, maxConcurrency, async (item) => {
    const updated = await retryLink(item, modeConfig, retryStats);
    if (updated) linkMap.set(updated.url, updated);
  });

  return { links: Array.from(linkMap.values()), retryStats };
}

async function retryLink(link, modeConfig, retryStats) {
  let current = { ...link };
  for (let attempt = 1; attempt <= modeConfig.retryMax; attempt += 1) {
    retryStats.totalRetries += 1;
    const host = safeHost(link.url);
    retryStats.byHost[host] = (retryStats.byHost[host] || 0) + 1;

    await sleep(backoffMs(modeConfig.retryBackoffMs, attempt));

    const probed = await probeUrl(link.url, modeConfig.timeoutMs);
    current = {
      ...current,
      status: probed.status,
      state: probed.ok ? "OK" : "BROKEN",
      failureDetails: probed.failureDetails,
    };

    if (current.status !== 429 && current.status !== 503) {
      break;
    }
  }
  return current;
}

async function probeUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    return {
      status: response.status,
      ok: response.status < 400,
      failureDetails: response.status >= 400 ? [`HTTP_${response.status}`] : [],
    };
  } catch (error) {
    return {
      status: null,
      ok: false,
      failureDetails: [error?.code || error?.name || "network_error"],
    };
  } finally {
    clearTimeout(timer);
  }
}

function backoffMs(baseMs, attempt) {
  const jitter = Math.floor(Math.random() * 120);
  return baseMs * 2 ** (attempt - 1) + jitter;
}

function safeHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return "unknown";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPool(items, concurrency, worker) {
  if (items.length === 0) return;
  let nextIndex = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index]);
    }
  });
  await Promise.all(workers);
}
