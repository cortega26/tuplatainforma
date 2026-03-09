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

function findContextToDocsReferences(files) {
  const offenders = [];

  for (const filePath of files) {
    if (!filePath.startsWith("context/")) {
      continue;
    }

    const content = readFileSync(path.join(REPO_ROOT, filePath), "utf8");
    if (/(?:^|[^a-zA-Z0-9_])docs\//.test(content)) {
      offenders.push(filePath);
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

  const contextDocsRefs = findContextToDocsReferences(files);
  if (contextDocsRefs.length > 0) {
    console.warn(
      `[check-docs-structure] WARN: ${contextDocsRefs.length} context file(s) reference docs/. ` +
        "Option A target model expects context to be docs-independent."
    );
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
