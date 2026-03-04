import { readFile } from "node:fs/promises";
import path from "node:path";

const ANCHOR_REGEX = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;

export async function enrichInternalBrokenContext(internalBroken, options) {
  const { contentRoot, siteBase } = options;
  const cache = new Map();

  return Promise.all(
    internalBroken.map(async (item) => {
      const brokenUrl = asString(item?.url);
      const referrerUrl = asString(item?.parent);
      if (!brokenUrl || !referrerUrl) return item;

      let html = cache.get(referrerUrl);
      if (html === undefined) {
        html = await readReferrerHtml(referrerUrl, { contentRoot, siteBase });
        cache.set(referrerUrl, html);
      }

      if (!html) return item;

      const context = findAnchorContext(html, referrerUrl, brokenUrl);
      return context ? { ...item, context } : item;
    })
  );
}

async function readReferrerHtml(referrerUrl, options) {
  const filePath = resolveReferrerFilePath(referrerUrl, options);
  if (!filePath) return null;
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function resolveReferrerFilePath(referrerUrl, { contentRoot, siteBase }) {
  const parsed = safeUrl(referrerUrl);
  if (!parsed) return null;

  const prefix = normalizeSiteBase(siteBase);
  let pathname = parsed.pathname;
  if (prefix) {
    if (!pathname.startsWith(prefix)) return null;
    pathname = pathname.slice(prefix.length) || "/";
  }

  const relativePath = toRelativeFilePath(pathname);
  if (!relativePath) return null;
  return path.join(contentRoot, relativePath);
}

function toRelativeFilePath(pathname) {
  const normalized = path.posix.normalize(pathname || "/");
  if (!normalized.startsWith("/")) return null;

  if (normalized === "/") return "index.html";
  if (normalized.endsWith("/")) {
    return path.posix.join(normalized.slice(1), "index.html");
  }

  const withoutLeadingSlash = normalized.slice(1);
  if (!withoutLeadingSlash) return "index.html";
  if (path.posix.extname(withoutLeadingSlash)) return withoutLeadingSlash;
  return path.posix.join(withoutLeadingSlash, "index.html");
}

function findAnchorContext(html, referrerUrl, brokenUrl) {
  const target = normalizeComparableUrl(brokenUrl);
  if (!target) return null;

  ANCHOR_REGEX.lastIndex = 0;
  let match = ANCHOR_REGEX.exec(html);
  while (match) {
    const href = decodeBasicEntities(match[1] || match[2] || "");
    if (!href) {
      match = ANCHOR_REGEX.exec(html);
      continue;
    }

    const absoluteHref = toAbsoluteHref(href, referrerUrl);
    if (normalizeComparableUrl(absoluteHref) === target) {
      const text = cleanAnchorText(match[3]);
      return text || href;
    }

    match = ANCHOR_REGEX.exec(html);
  }

  return null;
}

function toAbsoluteHref(href, referrerUrl) {
  try {
    return new URL(href, referrerUrl).href;
  } catch {
    return null;
  }
}

function normalizeComparableUrl(value) {
  const parsed = safeUrl(value);
  if (!parsed) return null;

  parsed.hash = "";
  if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.href;
}

function cleanAnchorText(value) {
  if (!value) return "";
  const withoutTags = value.replace(/<[^>]+>/g, " ");
  return decodeBasicEntities(withoutTags).replace(/\s+/g, " ").trim();
}

function decodeBasicEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function normalizeSiteBase(siteBase) {
  const raw = asString(siteBase);
  if (!raw) return "";
  const trimmed = raw.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function asString(value) {
  return typeof value === "string" && value.length > 0 ? value : "";
}
