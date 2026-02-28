/* eslint-disable no-console */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(REPO_ROOT, "src");

const RUNTIME_LAYERS = [
  path.join(SRC_DIR, "pages"),
  path.join(SRC_DIR, "components"),
  path.join(SRC_DIR, "layouts"),
];

const FILE_EXTENSIONS = new Set([".astro", ".ts", ".js", ".tsx", ".jsx"]);

const URL_PATTERN_RULES = [
  {
    id: "template-post-id-url",
    message: "Public URL from post.id template literal is forbidden.",
    regex: /\/posts\/\$\{[^}]*\bpost\.id\b[^}]*\}/g,
  },
  {
    id: "concat-post-id-url",
    message: "Public URL string concatenation from post.id is forbidden.",
    regex: /["'`]\/posts\/["'`]\s*\+\s*post\.id\b/g,
  },
  {
    id: "getpostpath-post-id",
    message: "Legacy getPostPath(post.id, ...) usage is forbidden.",
    regex: /\bgetPostPath\s*\(\s*post\.id\b/g,
  },
  {
    id: "slug-from-post-id",
    message: "Route params.slug cannot be sourced from post.id.",
    regex: /params\s*:\s*\{[\s\S]{0,220}?\bslug\s*:\s*post\.id\b/gm,
  },
];

function listSourceFiles(baseDir) {
  const files = [];
  const stack = [baseDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }

      if (!FILE_EXTENSIONS.has(path.extname(entry.name))) continue;
      files.push(absolutePath);
    }
  }

  return files.sort();
}

function getLineNumber(source, index) {
  const upToMatch = source.slice(0, index);
  return upToMatch.split("\n").length;
}

function isInRuntimeLayer(filePath) {
  return RUNTIME_LAYERS.some(layer => filePath.startsWith(layer));
}

const files = listSourceFiles(SRC_DIR);
const violations = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const relativePath = path.relative(REPO_ROOT, file).replace(/\\/g, "/");

  for (const rule of URL_PATTERN_RULES) {
    const matches = source.matchAll(rule.regex);
    for (const match of matches) {
      const index = match.index ?? 0;
      violations.push({
        file: relativePath,
        line: getLineNumber(source, index),
        rule: rule.id,
        message: rule.message,
      });
    }
  }

  if (isInRuntimeLayer(file)) {
    const postIdMatches = source.matchAll(/\bpost\.id\b/g);
    for (const match of postIdMatches) {
      const index = match.index ?? 0;
      violations.push({
        file: relativePath,
        line: getLineNumber(source, index),
        rule: "runtime-post-id",
        message:
          "post.id is not allowed in pages/components/layouts runtime layer. Use ArticleView.slug.",
      });
    }
  }
}

if (violations.length > 0) {
  console.error(
    `[check-no-postid-urls] Found ${violations.length} forbidden pattern(s):`
  );
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} [${violation.rule}] ${violation.message}`
    );
  }
  process.exit(1);
}

console.log(
  `[check-no-postid-urls] OK. Scanned ${files.length} source files, no forbidden post.id URL patterns found.`
);
