/* eslint-disable no-console */
/**
 * check-internal-links.mjs
 *
 * Validates internal markdown links within the blog corpus.
 *
 * Checks:
 *   1. All /posts/<slug>/ links resolve to a published article (slug exists).
 *   2. All /guias/<slug>/ links resolve to a directory in src/pages/guias/.
 *   3. All /leyes/<slug>/ links resolve to a file in src/data/laws/.
 *   4. Detects orphan articles (articles with zero inbound internal links).
 *   5. Reports broken links with file + line number for easy fixing.
 *
 * Usage:
 *   node scripts/check-internal-links.mjs
 *   node scripts/check-internal-links.mjs --verbose   (show all links found)
 *   node scripts/check-internal-links.mjs --orphans   (only show orphan report)
 *
 * Exit codes:
 *   0 — no broken links found
 *   1 — broken links detected (CI blocker)
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const GUIAS_DIR = path.join(REPO_ROOT, "src", "pages", "guias");
const LAWS_DIR = path.join(REPO_ROOT, "src", "data", "laws");

const args = new Set(process.argv.slice(2));
const VERBOSE = args.has("--verbose");
const ORPHANS_ONLY = args.has("--orphans");

// ─── Helpers ────────────────────────────────────────────────────────────────

function listContentFiles(dirPath) {
  const result = [];
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const abs = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...listContentFiles(abs));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      result.push(abs);
    }
  }
  return result.sort();
}

function extractFrontmatterSlug(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const slugLine = match[1].match(/^slug:\s*["']?([^\s"']+)["']?/m);
  return slugLine ? slugLine[1].trim() : null;
}

function isDraft(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return false;
  return /^draft:\s*true/m.test(match[1]);
}

/**
 * Extract all internal links from markdown/mdx content.
 * Returns: Array of { href, lineNumber }
 */
function extractInternalLinks(source) {
  const links = [];
  const lines = source.split("\n");
  // Matches: [text](/posts/slug/) or [text](/guias/slug/) or [text](/leyes/slug/) with optional trailing /
  const RE = /\[([^\]]*)\]\((\/(posts|guias|leyes)\/([^)\s#?"]+))\)/g;
  for (let i = 0; i < lines.length; i++) {
    let match;
    RE.lastIndex = 0;
    while ((match = RE.exec(lines[i])) !== null) {
      links.push({
        href: match[2].replace(/\/$/, ""), // normalize trailing slash
        type: match[3],                    // "posts" or "guias"
        target: match[4].replace(/\/$/, ""),
        lineNumber: i + 1,
      });
    }
  }
  return links;
}

// ─── Build corpus index ──────────────────────────────────────────────────────

const files = listContentFiles(BLOG_DIR);

/** slug → { filePath, source } for all published articles */
const publishedSlugs = new Map();

for (const filePath of files) {
  const source = readFileSync(filePath, "utf8");
  if (isDraft(source)) continue;
  const slug = extractFrontmatterSlug(source);
  if (!slug) continue;
  publishedSlugs.set(slug, { filePath, source });
}

/** Valid guia slugs: directories directly under src/pages/guias/ */
const validGuias = new Set(
  existsSync(GUIAS_DIR)
    ? readdirSync(GUIAS_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
    : []
);

/** Valid law slugs: .md files in src/data/laws/ (filename without extension) */
const validLaws = new Set(
  existsSync(LAWS_DIR)
    ? readdirSync(LAWS_DIR, { withFileTypes: true })
        .filter(e => e.isFile() && /\.(md|mdx)$/i.test(e.name))
        .map(e => e.name.replace(/\.(md|mdx)$/i, ""))
    : []
);

// ─── Validate links ──────────────────────────────────────────────────────────

/** slug → count of inbound links from other articles */
const inboundLinkCount = new Map(
  [...publishedSlugs.keys()].map(slug => [slug, 0])
);

const errors = [];
const allLinksFound = [];

for (const [slug, { filePath, source }] of publishedSlugs.entries()) {
  const relPath = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const links = extractInternalLinks(source);

  for (const link of links) {
    if (VERBOSE) {
      allLinksFound.push({ from: relPath, ...link });
    }

    if (link.type === "posts") {
      // Track inbound link count (self-links don't count)
      if (link.target !== slug && inboundLinkCount.has(link.target)) {
        inboundLinkCount.set(link.target, (inboundLinkCount.get(link.target) ?? 0) + 1);
      }
      // Validate target slug exists
      if (!publishedSlugs.has(link.target)) {
        errors.push({
          filePath: relPath,
          lineNumber: link.lineNumber,
          message: `Broken /posts/ link: target slug "${link.target}" does not exist.`,
        });
      }
    } else if (link.type === "guias") {
      if (!validGuias.has(link.target)) {
        errors.push({
          filePath: relPath,
          lineNumber: link.lineNumber,
          message: `Broken /guias/ link: directory "${link.target}" not found in src/pages/guias/.`,
        });
      }
    } else if (link.type === "leyes") {
      if (!validLaws.has(link.target)) {
        errors.push({
          filePath: relPath,
          lineNumber: link.lineNumber,
          message: `Broken /leyes/ link: law file "${link.target}" not found in src/data/laws/.`,
        });
      }
    }
  }
}

// ─── Orphan detection ────────────────────────────────────────────────────────

const orphans = [...inboundLinkCount.entries()]
  .filter(([, count]) => count === 0)
  .map(([slug]) => slug)
  .sort();

// ─── Output ──────────────────────────────────────────────────────────────────

const totalArticles = publishedSlugs.size;
const totalLinks = [...publishedSlugs.values()]
  .flatMap(({ source }) => extractInternalLinks(source)).length;

if (!ORPHANS_ONLY) {
  console.log(`[check-internal-links] Scanned ${totalArticles} published articles, ${totalLinks} internal links.`);

  if (VERBOSE && allLinksFound.length > 0) {
    console.log("\n[check-internal-links] All internal links found:");
    for (const l of allLinksFound) {
      console.log(`  ${l.from}:${l.lineNumber} → ${l.href}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n[check-internal-links] BROKEN LINKS (${errors.length}):`);
    for (const err of errors) {
      console.error(`  ${err.filePath}:${err.lineNumber} — ${err.message}`);
    }
  } else {
    console.log("[check-internal-links] No broken links found. ✓");
  }
}

if (orphans.length > 0) {
  console.warn(`\n[check-internal-links] Orphan articles (no inbound links, ${orphans.length}):`);
  for (const slug of orphans) {
    const info = publishedSlugs.get(slug);
    const rel = info ? path.relative(REPO_ROOT, info.filePath).replace(/\\/g, "/") : slug;
    console.warn(`  ${rel}`);
  }
  console.warn("  Tip: orphans are warnings, not errors. Add internal links or hub references.");
}

if (errors.length > 0) {
  process.exit(1);
}
