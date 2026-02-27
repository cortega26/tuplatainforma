import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

function parseCliArguments(argv) {
  const args = {
    debug: false,
    minFiles: undefined,
    rootDirOverride: undefined,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--debug") {
      args.debug = true;
      continue;
    }

    if (token === "--min-files") {
      const rawValue = argv[i + 1];
      if (!rawValue) {
        throw new Error("Missing value for --min-files.");
      }
      const parsedValue = Number(rawValue);
      if (!Number.isInteger(parsedValue) || parsedValue < 0) {
        throw new Error("--min-files must be a non-negative integer.");
      }
      args.minFiles = parsedValue;
      i += 1;
      continue;
    }

    if (token === "--root") {
      const rawValue = argv[i + 1];
      if (!rawValue) {
        throw new Error("Missing value for --root.");
      }
      args.rootDirOverride = rawValue;
      i += 1;
      continue;
    }
  }

  return args;
}

let cliArgs;
try {
  cliArgs = parseCliArguments(process.argv.slice(2));
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Invalid CLI arguments."}\n`
  );
  process.exit(1);
}

const MIN_DOMAIN_FILES_RAW =
  process.env.DOMAIN_BOUNDARY_MIN_FILES ?? cliArgs.minFiles ?? 2;
const MIN_DOMAIN_FILES = Number(MIN_DOMAIN_FILES_RAW);
if (!Number.isInteger(MIN_DOMAIN_FILES) || MIN_DOMAIN_FILES < 0) {
  process.stderr.write(
    `DOMAIN_BOUNDARY_MIN_FILES/--min-files must be a non-negative integer (received: ${String(
      MIN_DOMAIN_FILES_RAW
    )}).\n`
  );
  process.exit(1);
}

const ROOT_DIR = path.resolve(process.env.DOMAIN_BOUNDARY_ROOT ?? process.cwd());
const EFFECTIVE_ROOT_DIR = path.resolve(cliArgs.rootDirOverride ?? ROOT_DIR);
const DOMAIN_DIR = path.join(EFFECTIVE_ROOT_DIR, "src", "domain");
const RESOLVED_SCAN_PATTERN = `${DOMAIN_DIR}${path.sep}**${path.sep}*.*`;
const DOMAIN_FILE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const FORBIDDEN_ALIAS_PREFIXES = new Set([
  "@/infrastructure/",
  "@/components/",
  "@/layouts/",
  "@/pages/",
]);
const FORBIDDEN_SRC_PREFIXES = new Set([
  "src/infrastructure/",
  "src/components/",
  "src/layouts/",
  "src/pages/",
]);
const FORBIDDEN_PACKAGE_PREFIXES = new Set(["astro:", "@astrojs/"]);
const FORBIDDEN_RESOLVED_SEGMENTS = [
  `${path.sep}src${path.sep}infrastructure${path.sep}`,
  `${path.sep}src${path.sep}components${path.sep}`,
  `${path.sep}src${path.sep}layouts${path.sep}`,
  `${path.sep}src${path.sep}pages${path.sep}`,
];

const IMPORT_PATTERN =
  /\b(?:import|export)\b[\s\S]*?\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

function collectTypeScriptFiles(directoryPath) {
  if (!existsSync(directoryPath)) {
    return [];
  }

  const result = [];
  for (const entry of readdirSync(directoryPath).sort()) {
    const absolutePath = path.join(directoryPath, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      result.push(...collectTypeScriptFiles(absolutePath));
      continue;
    }

    if (DOMAIN_FILE_EXTENSIONS.has(path.extname(absolutePath))) {
      result.push(absolutePath);
    }
  }
  return result.sort();
}

function isForbiddenImport(filePath, importPath) {
  if (
    [...FORBIDDEN_ALIAS_PREFIXES].some(prefix => importPath.startsWith(prefix))
  ) {
    return true;
  }

  if (
    [...FORBIDDEN_SRC_PREFIXES].some(prefix => importPath.startsWith(prefix))
  ) {
    return true;
  }

  if (
    [...FORBIDDEN_PACKAGE_PREFIXES].some(prefix =>
      importPath.startsWith(prefix)
    )
  ) {
    return true;
  }

  if (importPath.startsWith(".")) {
    const resolvedImportPath = path.resolve(path.dirname(filePath), importPath);
    return FORBIDDEN_RESOLVED_SEGMENTS.some(segment =>
      `${resolvedImportPath}${path.sep}`.includes(segment)
    );
  }

  if (path.isAbsolute(importPath)) {
    return FORBIDDEN_RESOLVED_SEGMENTS.some(segment =>
      `${importPath}${path.sep}`.includes(segment)
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
      file: path.relative(EFFECTIVE_ROOT_DIR, file),
      importPath,
    });
  }
}

if (cliArgs.debug) {
  process.stdout.write(`Debug cwd: ${path.resolve(process.cwd())}\n`);
  process.stdout.write(`Debug root: ${EFFECTIVE_ROOT_DIR}\n`);
  process.stdout.write(`Debug scan pattern: ${RESOLVED_SCAN_PATTERN}\n`);
  process.stdout.write(`Debug extension filter: .ts,.tsx,.js,.jsx\n`);
  if (files.length > 0) {
    const preview = files
      .slice(0, 20)
      .map(file => path.relative(EFFECTIVE_ROOT_DIR, file))
      .join("\n");
    process.stdout.write(`Debug file list (first ${Math.min(20, files.length)}):\n`);
    process.stdout.write(`${preview}\n`);
  } else {
    process.stdout.write("Debug file list: <empty>\n");
  }
}

process.stdout.write(`Found ${files.length} matching domain source files.\n`);
process.stdout.write(
  `Scanned ${files.length} domain files from ${DOMAIN_DIR}\n`
);

if (files.length < MIN_DOMAIN_FILES) {
  process.stderr.write(
    `Boundary scan coverage suspiciously low (${files.length} files found).\n`
  );
  process.stderr.write(
    `Coverage threshold: ${MIN_DOMAIN_FILES} files.\n`
  );
  process.exit(1);
}

if (violations.length > 0) {
  process.stderr.write("Domain boundary violations found:\n");
  for (const violation of violations) {
    process.stderr.write(
      `- ${violation.file}: forbidden import "${violation.importPath}"\n`
    );
  }
  process.exit(1);
}

process.stdout.write("Domain boundary check passed.\n");
