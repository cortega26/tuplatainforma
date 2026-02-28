/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const BLOG_SOURCE_DIR = "src/data/blog";
const DIST_POSTS_DIR = "dist/posts";
const SOURCE_EXTENSIONS = new Set([".md", ".mdx"]);
const DIST_EXTENSIONS = new Set([".html"]);

const ENGLISH_TOC_HEADING_RE = /^##\s*table of contents\s*$/gim;
const ENGLISH_TOC_LITERAL_RE = /table of contents/gi;

function listFilesRecursively(dirPath, allowedExtensions) {
  const files = [];
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(absolutePath, allowedExtensions));
      continue;
    }

    if (allowedExtensions && !allowedExtensions.has(extname(entry.name))) {
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function scanFilesForPattern(filePaths, regex) {
  const findings = [];

  for (const filePath of filePaths) {
    const source = readFileSync(filePath, "utf8");
    const re = new RegExp(regex.source, regex.flags);
    let match;

    while ((match = re.exec(source)) !== null) {
      const line = source.slice(0, match.index).split("\n").length;
      findings.push({
        filePath,
        line,
        snippet: match[0].trim(),
      });
    }
  }

  return findings;
}

if (!existsSync(BLOG_SOURCE_DIR)) {
  console.error(`[check-toc-i18n] Missing source directory: ${BLOG_SOURCE_DIR}`);
  process.exit(1);
}

if (!existsSync(DIST_POSTS_DIR)) {
  console.error(
    `[check-toc-i18n] Missing build output: ${DIST_POSTS_DIR}. Run "astro build" first.`
  );
  process.exit(1);
}

const sourceFiles = listFilesRecursively(BLOG_SOURCE_DIR, SOURCE_EXTENSIONS);
const distFiles = listFilesRecursively(DIST_POSTS_DIR, DIST_EXTENSIONS);
const srcFiles = listFilesRecursively("src");

const issues = [
  ...scanFilesForPattern(sourceFiles, ENGLISH_TOC_HEADING_RE).map(item => ({
    ...item,
    reason: "English TOC heading in source content",
  })),
  ...scanFilesForPattern(srcFiles, ENGLISH_TOC_LITERAL_RE).map(item => ({
    ...item,
    reason: "English TOC literal in src/",
  })),
  ...scanFilesForPattern(distFiles, ENGLISH_TOC_LITERAL_RE).map(item => ({
    ...item,
    reason: "English TOC literal in dist/posts/",
  })),
];

if (issues.length > 0) {
  console.error(
    '[check-toc-i18n] Found forbidden English TOC text ("Table of contents").'
  );
  for (const issue of issues) {
    console.error(
      `- ${issue.filePath}:${issue.line} (${issue.reason}) -> ${issue.snippet}`
    );
  }
  process.exit(1);
}

console.log("[check-toc-i18n] OK: TOC i18n is consistent in source and build output.");
