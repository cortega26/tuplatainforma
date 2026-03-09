import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const ROOT_ALLOWED_MARKDOWN = new Set([
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "LICENSE.md",
]);

const ALLOWED_PREFIXES = [
  "docs/",
  "context/",
  "archive/",
  "artifacts/editorial/",
  "src/data/",
  ".github/",
];

const CONTEXT_LEGACY_DOC_PATTERNS = [
  { label: "legacy audits path", regex: /(?:^|[^a-zA-Z0-9_])docs\/audits\// },
  { label: "legacy issues path", regex: /(?:^|[^a-zA-Z0-9_])docs\/issues\// },
  {
    label: "legacy root report path",
    regex:
      /(?:^|[^a-zA-Z0-9_])docs\/(?:FEATURED_IMAGE_MIGRATION_REPORT|PERFORMANCE_HARDENING_MOBILE_REPORT|PERFORMANCE_REMOTE_CLOSURE_REPORT|PHASE1_CLOSURE_REPORT)\.md/,
  },
  {
    label: "legacy root architecture path",
    regex: /(?:^|[^a-zA-Z0-9_])docs\/DOMAIN_CONTRACT_BOUNDARIES\.md/,
  },
  {
    label: "legacy root research path",
    regex: /(?:^|[^a-zA-Z0-9_])docs\/deep-research-report\.md/,
  },
  {
    label: "legacy root backlog path",
    regex: /(?:^|[^a-zA-Z0-9_])BACKLOG_EDITORIAL\.md/,
  },
  {
    label: "legacy root audit path",
    regex: /(?:^|[\s`(])audit\.md(?:$|[\s`),.:])/,
  },
  {
    label: "legacy root project structure path",
    regex: /(?:^|[^a-zA-Z0-9_])project_structure\.md/,
  },
  {
    label: "legacy internal-docs root path",
    regex: /(?:^|[^a-zA-Z0-9_])internal-docs\//,
  },
];

function getTrackedMarkdownFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "*.md"],
    { cwd: REPO_ROOT }
  );

  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .sort();
}

function isRootMarkdown(filePath) {
  return !filePath.includes("/");
}

function isAdrFile(filePath) {
  const fileName = path.basename(filePath);
  return /^ADR-.*\.md$/i.test(fileName);
}

function isAllowedLocation(filePath) {
  if (ROOT_ALLOWED_MARKDOWN.has(filePath)) {
    return true;
  }

  if (filePath === "scripts/hero-images/pool/WORKFLOW.md") {
    return true;
  }

  return ALLOWED_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function findContextLegacyDocReferences(files) {
  const offenders = [];

  for (const filePath of files) {
    if (!filePath.startsWith("context/")) {
      continue;
    }

    const content = readFileSync(path.join(REPO_ROOT, filePath), "utf8");

    for (const pattern of CONTEXT_LEGACY_DOC_PATTERNS) {
      if (pattern.regex.test(content)) {
        offenders.push({ filePath, label: pattern.label });
      }
    }
  }

  return offenders;
}

function run() {
  const files = getTrackedMarkdownFiles();

  const rootMarkdown = files.filter(isRootMarkdown);
  const disallowedRootMarkdown = rootMarkdown.filter(
    (filePath) => !ROOT_ALLOWED_MARKDOWN.has(filePath)
  );

  const markdownOutsideAllowedLocations = files.filter(
    (filePath) => !isAllowedLocation(filePath)
  );

  const adrFiles = files.filter(isAdrFile);
  const adrOutsideCanonical = adrFiles.filter(
    (filePath) => !filePath.startsWith("docs/adr/")
  );

  const failures = [];

  if (disallowedRootMarkdown.length > 0) {
    failures.push({
      title: "Root Markdown policy violation",
      details: disallowedRootMarkdown.map((filePath) => `- ${filePath}`),
    });
  }

  if (markdownOutsideAllowedLocations.length > 0) {
    failures.push({
      title: "Markdown outside allowed directories",
      details: markdownOutsideAllowedLocations.map((filePath) => `- ${filePath}`),
    });
  }

  if (adrOutsideCanonical.length > 0) {
    failures.push({
      title: "ADR location violation (must be under docs/adr/)",
      details: adrOutsideCanonical.map((filePath) => `- ${filePath}`),
    });
  }

  if (failures.length > 0) {
    console.error("[check-docs-structure] FAIL");

    for (const failure of failures) {
      console.error(`\n${failure.title}`);
      for (const detail of failure.details) {
        console.error(detail);
      }
    }

    process.exit(1);
  }

  const contextLegacyRefs = findContextLegacyDocReferences(files);
  if (contextLegacyRefs.length > 0) {
    console.warn(
      `[check-docs-structure] WARN: ${contextLegacyRefs.length} legacy context->docs reference(s) found.`
    );
    for (const offender of contextLegacyRefs) {
      console.warn(`- ${offender.filePath}: ${offender.label}`);
    }
  }

  console.log(
    `[check-docs-structure] OK. trackedMarkdown=${files.length} rootMarkdown=${rootMarkdown.length} adrFiles=${adrFiles.length}`
  );
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[check-docs-structure] FAIL: ${message}`);
  process.exit(1);
}
