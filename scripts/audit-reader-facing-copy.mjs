import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import {
  INTERNAL_EDITORIAL_VISIBLE_RULES,
  shouldSkipRuleForPath,
} from "./editorial-copy-rules.mjs";

const BLOG_SOURCE_DIR = "src/data/blog";
const PAGES_SOURCE_DIR = "src/pages";
const CALCULATORS_SOURCE_DIR = "src/pages/calculadoras";

const BLOG_EXTENSIONS = new Set([".md", ".mdx"]);
const ASTRO_EXTENSIONS = new Set([".astro"]);

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

function scanFilesForRule(filePaths, rule) {
  const findings = [];

  for (const filePath of filePaths) {
    if (shouldSkipRuleForPath(rule, filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");
    const re = new RegExp(rule.regex.source, rule.regex.flags);
    let match;

    while ((match = re.exec(source)) !== null) {
      const line = source.slice(0, match.index).split("\n").length;
      findings.push({
        id: rule.id,
        severity: rule.severity,
        reason: rule.reason,
        filePath,
        line,
        snippet: match[0].trim(),
      });
    }
  }

  return findings;
}

const blogFiles = listFilesRecursively(BLOG_SOURCE_DIR, BLOG_EXTENSIONS);
const pageFiles = listFilesRecursively(PAGES_SOURCE_DIR, ASTRO_EXTENSIONS);
const visibleAstroFiles = pageFiles.filter(
  filePath => !filePath.startsWith(`${CALCULATORS_SOURCE_DIR}/`)
);
const readerFacingFiles = [...blogFiles, ...visibleAstroFiles];

const findings = INTERNAL_EDITORIAL_VISIBLE_RULES.flatMap(rule =>
  scanFilesForRule(readerFacingFiles, rule)
);

const errors = findings.filter(finding => finding.severity === "error");
const warnings = findings.filter(finding => finding.severity === "warn");

console.log(
  `[audit-reader-facing-copy] scanned=${readerFacingFiles.length} errors=${errors.length} warnings=${warnings.length}`
);

if (errors.length > 0) {
  console.log("[audit-reader-facing-copy] Blocking-pattern findings:");
  for (const finding of errors) {
    console.log(
      `- ${finding.filePath}:${finding.line} [${finding.id}] ${finding.reason} -> ${finding.snippet}`
    );
  }
}

if (warnings.length > 0) {
  console.log("[audit-reader-facing-copy] Review-pattern findings:");
  for (const finding of warnings) {
    console.log(
      `- ${finding.filePath}:${finding.line} [${finding.id}] ${finding.reason} -> ${finding.snippet}`
    );
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("[audit-reader-facing-copy] No suspicious reader-facing copy found.");
}
