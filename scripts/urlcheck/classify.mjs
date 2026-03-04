import { DENYLIST_HOSTS, EXTERNAL_SOFT_STATUS, INTERNAL_HARD_STATUS } from "./constants.mjs";

export function classifyLinks(links, { internalOrigins, allowlistHosts = [] }) {
  const internalBroken = [];
  const externalFailures = [];

  for (const link of links) {
    const url = safeUrl(link?.url);
    if (!url) continue;

    const isInternal = isInternalUrl(url, internalOrigins);
    const status = typeof link?.status === "number" ? link.status : null;
    const failureDetails = normalizeFailureDetails(link?.failureDetails);
    const state = link?.state || "UNKNOWN";

    const failed = state === "BROKEN" || (typeof status === "number" && status >= 400) || failureDetails.length > 0;
    if (!failed) continue;

    const classification = {
      url: url.href,
      parent: link?.parent || null,
      context: null,
      host: url.host,
      status,
      state,
      category: classifyFailureCategory(status, failureDetails),
      failureDetails,
      allowlisted: allowlistHosts.includes(url.host),
      denylisted: DENYLIST_HOSTS.includes(url.host),
    };

    if (isInternal) {
      if (status === null || INTERNAL_HARD_STATUS.has(status) || classification.category === "network") {
        internalBroken.push(classification);
      }
      continue;
    }

    if (classification.denylisted || classification.allowlisted || status === null || EXTERNAL_SOFT_STATUS.has(status) || (status >= 400 && status < 600) || classification.category !== "ok") {
      externalFailures.push(classification);
    }
  }

  return { internalBroken, externalFailures };
}

export function isRetryCandidate(link) {
  return link && (link.status === 429 || link.status === 503);
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isInternalUrl(url, internalOrigins) {
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
  return internalOrigins.has(url.origin);
}

function classifyFailureCategory(status, failureDetails) {
  const details = (failureDetails || []).join(" ").toLowerCase();
  if (status === 429) return "429";
  if (status === 401) return "401";
  if (status === 403) return "403";
  if (status === 404) return "404";
  if (status === 410) return "410";
  if (status === 500) return "500";
  if (status === 502) return "502";
  if (status === 503) return "503";
  if (details.includes("etimedout") || details.includes("timeout")) return "timeout";
  if (details.includes("enotfound") || details.includes("dns")) return "dns";
  if (details.includes("econnreset") || details.includes("tls") || details.includes("certificate")) return "network";
  if (details.includes("socket") || details.includes("connect")) return "network";
  if (typeof status === "number" && status >= 400) return String(status);
  return "ok";
}

function normalizeFailureDetails(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      if (typeof item.code === "string") return item.code;
      if (typeof item.message === "string") return item.message;
      if (typeof item.status === "number") return `HTTP_${item.status}`;
    }
    return String(item);
  });
}
