import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const DOMAIN_DIR = path.join(ROOT_DIR, "src", "domain");
const FORBIDDEN_ALIAS_PREFIXES = [
  "@/infrastructure/",
  "@/components/",
  "@/layouts/",
  "@/pages/",
];
const FORBIDDEN_RESOLVED_SEGMENTS = [
  `${path.sep}src${path.sep}infrastructure${path.sep}`,
  `${path.sep}src${path.sep}components${path.sep}`,
  `${path.sep}src${path.sep}layouts${path.sep}`,
  `${path.sep}src${path.sep}pages${path.sep}`,
];

const IMPORT_PATTERN =
  /\b(?:import|export)\b[\s\S]*?\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

function collectTypeScriptFiles(directoryPath) {
  const result = [];
  for (const entry of readdirSync(directoryPath)) {
    const absolutePath = path.join(directoryPath, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      result.push(...collectTypeScriptFiles(absolutePath));
      continue;
    }

    if (absolutePath.endsWith(".ts")) {
      result.push(absolutePath);
    }
  }
  return result;
}

function isForbiddenImport(filePath, importPath) {
  if (FORBIDDEN_ALIAS_PREFIXES.some(prefix => importPath.startsWith(prefix))) {
    return true;
  }

  if (importPath.startsWith(".")) {
    const resolvedImportPath = path.resolve(path.dirname(filePath), importPath);
    return FORBIDDEN_RESOLVED_SEGMENTS.some(segment =>
      `${resolvedImportPath}${path.sep}`.includes(segment)
    );
  }

  return false;
}

function findViolations(filePath) {
  const content = readFileSync(filePath, "utf8");
  const violations = [];

  for (const match of content.matchAll(IMPORT_PATTERN)) {
    const importPath = match[1] ?? match[2];
    if (!importPath) continue;
    if (isForbiddenImport(filePath, importPath)) {
      violations.push(importPath);
    }
  }

  return violations;
}

const files = collectTypeScriptFiles(DOMAIN_DIR);
const violations = [];

for (const file of files) {
  const fileViolations = findViolations(file);
  for (const importPath of fileViolations) {
    violations.push({
      file: path.relative(ROOT_DIR, file),
      importPath,
    });
  }
}

if (violations.length > 0) {
  process.stderr.write("Domain boundary violations found:\n");
  for (const violation of violations) {
    process.stderr.write(
      `- ${violation.file} imports "${violation.importPath}"\n`
    );
  }
  process.exit(1);
}

process.stdout.write(
  `Domain boundary check passed (${files.length} domain files scanned).\n`
);
