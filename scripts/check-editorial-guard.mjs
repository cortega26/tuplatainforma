/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const BLOG_SOURCE_DIR = "src/data/blog";
const CALCULATORS_SOURCE_DIR = "src/pages/calculadoras";
const DIST_POSTS_DIR = "dist/posts";

const BLOG_EXTENSIONS = new Set([".md", ".mdx"]);
const CALCULATOR_EXTENSIONS = new Set([".astro"]);
const DIST_EXTENSIONS = new Set([".html"]);

const ENGLISH_TOC_RE = /table of contents/gi;
const ENGLISH_VISIBLE_PATTERNS = [
  /\bread more\b/gi,
  /\brelated posts?\b/gi,
  /\bprevious post\b/gi,
  /\bnext post\b/gi,
  /\bshare this article\b/gi,
];

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

function scanFilesForPattern(filePaths, regex, reason) {
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
        reason,
        snippet: match[0].trim(),
      });
    }
  }

  return findings;
}

function countMatches(source, regex) {
  const re = new RegExp(regex.source, regex.flags);
  let count = 0;
  while (re.exec(source) !== null) count += 1;
  return count;
}

if (!existsSync(BLOG_SOURCE_DIR)) {
  console.error(
    `[check-editorial-guard] Missing source directory: ${BLOG_SOURCE_DIR}`
  );
  process.exit(1);
}

if (!existsSync(CALCULATORS_SOURCE_DIR)) {
  console.error(
    `[check-editorial-guard] Missing source directory: ${CALCULATORS_SOURCE_DIR}`
  );
  process.exit(1);
}

const blogFiles = listFilesRecursively(BLOG_SOURCE_DIR, BLOG_EXTENSIONS);
const calculatorFiles = listFilesRecursively(
  CALCULATORS_SOURCE_DIR,
  CALCULATOR_EXTENSIONS
);
const checksSourceFiles = [...blogFiles, ...calculatorFiles];

const issues = [];

issues.push(
  ...scanFilesForPattern(
    checksSourceFiles,
    ENGLISH_TOC_RE,
    'English TOC text found ("table of contents")'
  )
);

for (const pattern of ENGLISH_VISIBLE_PATTERNS) {
  issues.push(
    ...scanFilesForPattern(checksSourceFiles, pattern, "English visible string")
  );
}

for (const filePath of blogFiles) {
  const source = readFileSync(filePath, "utf8");
  const h1Count = countMatches(source, /^#\s+/gm);
  if (h1Count > 1) {
    issues.push({
      filePath,
      line: 1,
      reason: "More than one H1 heading in article source",
      snippet: `H1 count: ${h1Count}`,
    });
  }
}

for (const filePath of calculatorFiles) {
  const source = readFileSync(filePath, "utf8");
  const h1Count = countMatches(source, /<h1\b/gi);
  if (h1Count > 1) {
    issues.push({
      filePath,
      line: 1,
      reason: "More than one H1 heading in calculator page",
      snippet: `H1 count: ${h1Count}`,
    });
  }
}

if (existsSync(DIST_POSTS_DIR)) {
  const distFiles = listFilesRecursively(DIST_POSTS_DIR, DIST_EXTENSIONS);
  issues.push(
    ...scanFilesForPattern(
      distFiles,
      ENGLISH_TOC_RE,
      'English TOC text found in build output ("table of contents")'
    )
  );
}

if (issues.length > 0) {
  console.error("[check-editorial-guard] Editorial gate failed.");
  for (const issue of issues) {
    console.error(
      `- ${issue.filePath}:${issue.line} (${issue.reason}) -> ${issue.snippet}`
    );
  }
  process.exit(1);
}

console.log(
  `[check-editorial-guard] OK: ${blogFiles.length} blog files and ${calculatorFiles.length} calculator files validated.`
);
