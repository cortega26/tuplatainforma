 
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const FILE_IGNORE_SCAN_LINES = 10;
const FILE_IGNORE_TOKEN = "dialect-ignore";

const DIALECT_PATTERNS = [
  /\bcalculá\b/iu,
  /\binvertí\b/iu,
  /\bpodés\b/iu,
  /\bquerés\b/iu,
  /\btenés\b/iu,
  /\bsabés\b/iu,
  /\bhacé\b/iu,
  /\belegí\b/iu,
  /\bpensá\b/iu,
  /\bmirá\b/iu,
  /\bempezá\b/iu,
  /\bfijate\b/iu,
];

function listContentFiles(baseDir) {
  const files = [];
  const stack = [baseDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (!/\.(md|mdx)$/i.test(entry.name)) continue;
      files.push(absolutePath);
    }
  }

  return files.sort();
}

function fail(filePath, line, snippet) {
  console.error(
    `[check-dialect] FAIL: ${filePath}:${line} -> rioplatense form detected ("${snippet}").`
  );
  process.exit(1);
}

const files = listContentFiles(BLOG_DIR);
let skippedByMarker = 0;

for (const filePath of files) {
  const relative = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const source = readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const head = lines.slice(0, FILE_IGNORE_SCAN_LINES).join("\n").toLowerCase();
  if (head.includes(FILE_IGNORE_TOKEN)) {
    skippedByMarker += 1;
    continue;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (/^\s*>/.test(line)) continue;
    for (const pattern of DIALECT_PATTERNS) {
      const match = line.match(pattern);
      if (!match?.[0]) continue;
      fail(relative, index + 1, match[0]);
    }
  }
}

console.log(
  `[check-dialect] OK. validated=${files.length} files skipped_by_marker=${skippedByMarker}`
);
