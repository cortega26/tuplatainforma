/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const CANONICAL_ARTIFACTS_BASE = path.join(REPO_ROOT, "artifacts", "editorial");
const FALLBACK_ARTIFACTS_BASE = path.join(
  REPO_ROOT,
  "context",
  "editorial",
  "artifacts"
);
const YMYL_ALLOWLIST_PATH = path.join(
  REPO_ROOT,
  "context",
  "EDITORIAL_YMYL_ALLOWLIST.txt"
);

const STRICT_MODE = process.env.EDITORIAL_ENFORCE === "1";
const MODE_LABEL = STRICT_MODE ? "strict" : "warn-only";
const MIN_SOURCES = parsePositiveInt(process.env.EDITORIAL_MIN_SOURCES, 1);

const YMYL_CATEGORIES = new Set([
  "ahorro-inversion",
  "deuda-credito",
  "empleo-ingresos",
  "impuestos",
  "prevision",
  "seguridad-financiera",
]);

const YMYL_TAGS = new Set([
  "afc",
  "afp",
  "apv",
  "cae",
  "cesantia",
  "credito",
  "creditos",
  "deuda",
  "deudas",
  "despido",
  "empleo-ingresos",
  "finiquito",
  "impuestos",
  "indemnizacion",
  "licencia-medica",
  "operacion-renta",
  "pensiones",
  "portabilidad",
  "prevision",
  "proteccion-social",
  "reforma-pensiones",
  "retencion",
  "seguridad-financiera",
  "subsidio",
  "sueldo",
  "suseso",
  "trabajo",
]);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NUMERIC_CLAIM_PATTERN =
  /(?:\$?\d{1,3}(?:[.\s]\d{3})+(?:,\d+)?|\$?\d+(?:[.,]\d+)?\s*%|\$?\d+(?:[.,]\d+)?\s*(?:UF|UTM|CLP|USD)\b|\b\d{2,}(?:[.,]\d+)?\b)/gi;
const URL_PATTERN = /https?:\/\/[^\s)]+/gi;

function parsePositiveInt(rawValue, defaultValue) {
  const parsed = Number.parseInt(rawValue ?? "", 10);
  if (Number.isNaN(parsed) || parsed <= 0) return defaultValue;
  return parsed;
}

function listContentFiles(baseDir) {
  const files = [];
  const stack = [baseDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    for (const entry of entries) {
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

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: "", body: source };
  return {
    frontmatter: match[1] ?? "",
    body: source.slice(match[0].length),
  };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseInlineArray(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map(item => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  const inlineArray = parseInlineArray(value);
  if (inlineArray) return inlineArray;
  return stripQuotes(value);
}

function parseFrontmatterBlock(block) {
  if (!block) return {};
  const lines = block.split(/\r?\n/);
  const parsed = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^\s/.test(line)) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.length > 0) {
      parsed[key] = parseScalar(rawValue);
      continue;
    }

    const listValues = [];
    let cursor = i + 1;
    while (cursor < lines.length) {
      const child = lines[cursor];
      if (/^\s*-\s+/.test(child)) {
        listValues.push(stripQuotes(child.replace(/^\s*-\s+/, "").trim()));
        cursor += 1;
        continue;
      }
      if (/^\s*$/.test(child)) {
        cursor += 1;
        continue;
      }
      break;
    }

    if (listValues.length > 0) {
      parsed[key] = listValues;
      i = cursor - 1;
      continue;
    }

    parsed[key] = "";
  }

  return parsed;
}

function normalizeToken(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizePostId(frontmatter, filePath) {
  const idValue = frontmatter.id;
  if (typeof idValue === "string" && idValue.trim()) return idValue.trim();

  const slugValue = frontmatter.slug;
  if (typeof slugValue === "string" && slugValue.trim()) return slugValue.trim();

  return path.basename(filePath, path.extname(filePath));
}

function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  const normalized = normalizeToken(value);
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function loadAllowlist(filePath) {
  if (!existsSync(filePath)) return new Set();
  const content = readFileSync(filePath, "utf8");
  const ids = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));
  return new Set(ids);
}

function detectYmyStatus(frontmatter, postId, allowlist) {
  if (parseBooleanLike(frontmatter.ymyl)) {
    return { isYmy: true, reason: "frontmatter:ymyl=true" };
  }

  const category = normalizeToken(frontmatter.category);
  if (category && YMYL_CATEGORIES.has(category)) {
    return { isYmy: true, reason: `category:${category}` };
  }

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.map(tag => normalizeToken(tag)).filter(Boolean)
    : [];
  const matchingTag = tags.find(tag => YMYL_TAGS.has(tag));
  if (matchingTag) {
    return { isYmy: true, reason: `tag:${matchingTag}` };
  }

  if (allowlist.has(postId)) {
    return { isYmy: true, reason: "allowlist" };
  }

  return { isYmy: false, reason: "non-ymyl" };
}

function toRepoRelative(absolutePath) {
  return path.relative(REPO_ROOT, absolutePath).replace(/\\/g, "/");
}

function resolveArtifactDirectories(postId) {
  const canonicalRoot = path.join(CANONICAL_ARTIFACTS_BASE, postId);
  const fallbackRoot = path.join(FALLBACK_ARTIFACTS_BASE, postId);
  const canonicalExists = existsSync(canonicalRoot);
  const fallbackExists = existsSync(fallbackRoot);

  const resolvedRoot = canonicalExists
    ? canonicalRoot
    : fallbackExists
      ? fallbackRoot
      : canonicalRoot;

  let resolvedRunDir = resolvedRoot;
  if (existsSync(resolvedRoot)) {
    const runDirs = readdirSync(resolvedRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort((a, b) => b.localeCompare(a));
    if (runDirs.length > 0) {
      resolvedRunDir = path.join(resolvedRoot, runDirs[0]);
    }
  }

  return {
    canonicalRoot,
    resolvedRoot,
    resolvedRunDir,
    rootSource: canonicalExists ? "canonical" : fallbackExists ? "fallback" : "missing",
  };
}

function findExistingFile(directories, candidateNames) {
  for (const directory of directories) {
    for (const name of candidateNames) {
      const fullPath = path.join(directory, name);
      if (existsSync(fullPath)) return fullPath;
    }
  }
  return null;
}

function readTextIfExists(filePath) {
  if (!filePath || !existsSync(filePath)) return "";
  return readFileSync(filePath, "utf8");
}

function extractYamlScalar(text, keys) {
  for (const key of keys) {
    const pattern = new RegExp(`^${key}:\\s*(.+)$`, "mi");
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    return stripQuotes(match[1].trim());
  }
  return "";
}

function extractDateFromText(text) {
  const match = text.match(
    /(?:fecha[_\s-]*de[_\s-]*corte|fecha[_\s-]*corte|cut[_\s-]*off(?:[_\s-]*date)?|vigente\s+a)\s*[:\-]\s*(\d{4}-\d{2}-\d{2})/i
  );
  return match?.[1] ?? "";
}

function parseSourcesYaml(text) {
  const entries = [];
  const lines = text.split(/\r?\n/);
  let current = null;

  const flush = () => {
    if (!current) return;
    entries.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith("#")) continue;

    if (/^\s*-\s*/.test(line)) {
      flush();
      current = {};
      const rest = line.replace(/^\s*-\s*/, "").trim();
      if (rest.includes(":")) {
        const separator = rest.indexOf(":");
        const key = rest.slice(0, separator).trim();
        const value = stripQuotes(rest.slice(separator + 1).trim());
        if (key) current[key] = value;
      }
      continue;
    }

    if (!current || !/^\s+[A-Za-z0-9_.-]+\s*:\s*/.test(rawLine)) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = stripQuotes(line.slice(separator + 1).trim());
    if (key) current[key] = value;
  }

  flush();
  return entries;
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function parseSourcesMarkdown(text) {
  const entries = [];
  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    if (!/^\s*[-*]\s+/.test(rawLine)) continue;
    const line = rawLine.replace(/^\s*[-*]\s+/, "").trim();
    const urlMatch = line.match(/https?:\/\/[^\s)]+/i);
    if (!urlMatch?.[0]) continue;

    const url = urlMatch[0].replace(/[),.;]+$/, "");
    const dateMatch = line.match(/\b\d{4}-\d{2}-\d{2}\b/);
    const date = dateMatch?.[0] ?? "";
    const title = line
      .replace(urlMatch[0], "")
      .replace(date, "")
      .replace(/\s*[-|]\s*/g, " ")
      .trim();
    const publisher = safeHostname(url);

    entries.push({ title, publisher, date, url });
  }

  return entries;
}

function extractUrlsFromText(text) {
  return Array.from(new Set(text.match(URL_PATTERN) ?? []));
}

function isSourceEntryValid(entry) {
  const title = normalizeToken(entry.title);
  const publisher = normalizeToken(entry.publisher || entry.domain);
  const date = normalizeToken(entry.date);
  const url = normalizeToken(entry.url);
  return Boolean(title && publisher && DATE_PATTERN.test(date) && /^https?:\/\//.test(url));
}

function stripCodeAndLinks(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/<[^>]+>/g, " ");
}

function countNumericClaims(body) {
  const sanitized = stripCodeAndLinks(body);
  const matches = sanitized.match(NUMERIC_CLAIM_PATTERN) ?? [];
  const uniqueMatches = new Set(matches.map(value => value.trim()));
  return uniqueMatches.size;
}

function evaluatePost(filePath, allowlist) {
  const source = readFileSync(filePath, "utf8");
  const { frontmatter: frontmatterBlock, body } = extractFrontmatter(source);
  const frontmatter = parseFrontmatterBlock(frontmatterBlock);
  const postId = normalizePostId(frontmatter, filePath);
  const ymyStatus = detectYmyStatus(frontmatter, postId, allowlist);

  if (!ymyStatus.isYmy) {
    return {
      postId,
      isYmy: false,
      ymyReason: ymyStatus.reason,
    };
  }

  const artifactDirs = resolveArtifactDirectories(postId);
  const searchDirs =
    artifactDirs.resolvedRunDir === artifactDirs.resolvedRoot
      ? [artifactDirs.resolvedRunDir]
      : [artifactDirs.resolvedRunDir, artifactDirs.resolvedRoot];

  const briefFile = findExistingFile(searchDirs, [
    "01-brief.yaml",
    "brief.yaml",
    "brief.md",
  ]);
  const dossierFile = findExistingFile(searchDirs, ["02-dossier.md", "dossier.md"]);
  const sourcesFile = findExistingFile(searchDirs, ["sources.yaml", "sources.md"]);
  const metadataFile = findExistingFile(searchDirs, ["metadata.yaml"]);

  const missingArtifacts = [];
  if (!briefFile) missingArtifacts.push("brief");
  if (!dossierFile) missingArtifacts.push("dossier");

  const briefText = readTextIfExists(briefFile);
  const dossierText = readTextIfExists(dossierFile);
  const sourcesText = readTextIfExists(sourcesFile);
  const metadataText = readTextIfExists(metadataFile);

  const cutOffDate =
    extractYamlScalar(metadataText, [
      "fecha_corte",
      "cut_off_date",
      "cutoff_date",
      "cutOffDate",
    ]) ||
    extractYamlScalar(briefText, [
      "fecha_corte",
      "cut_off_date",
      "cutoff_date",
      "cutOffDate",
    ]) ||
    extractDateFromText(sourcesText) ||
    extractDateFromText(dossierText);

  const missingFields = [];
  const invalidFields = [];

  if (!cutOffDate) {
    missingFields.push("fecha_corte");
  } else if (!DATE_PATTERN.test(cutOffDate)) {
    invalidFields.push(`fecha_corte:${cutOffDate}`);
  }

  let sourceEntries = [];
  const sourceFieldIssues = [];

  if (sourcesFile?.endsWith(".yaml")) {
    sourceEntries = parseSourcesYaml(sourcesText);
  } else if (sourcesFile?.endsWith(".md")) {
    sourceEntries = parseSourcesMarkdown(sourcesText);
  } else {
    const dossierUrls = extractUrlsFromText(dossierText).map(url => ({
      title: "",
      publisher: safeHostname(url),
      date: "",
      url,
    }));
    sourceEntries = dossierUrls;
  }

  if (sourceEntries.length === 0) {
    missingFields.push("sources");
  } else {
    for (let index = 0; index < sourceEntries.length; index += 1) {
      const entry = sourceEntries[index];
      if (isSourceEntryValid(entry)) continue;
      sourceFieldIssues.push(`source[${index + 1}] missing {title,publisher/domain,date,url}`);
    }
  }

  if (sourceFieldIssues.length > 0) {
    invalidFields.push(...sourceFieldIssues);
  }

  const numericClaims = countNumericClaims(body);
  const numericWarnings = [];
  if (numericClaims > 0 && sourceEntries.length < MIN_SOURCES) {
    numericWarnings.push(
      `numeric claims detected (${numericClaims}); verify citations (min_sources=${MIN_SOURCES})`
    );
  }

  const violations = [];
  if (missingArtifacts.length > 0) violations.push(...missingArtifacts.map(v => `missing_artifact:${v}`));
  if (missingFields.length > 0) violations.push(...missingFields.map(v => `missing_field:${v}`));
  if (invalidFields.length > 0) violations.push(...invalidFields.map(v => `invalid_field:${v}`));

  const nonCompliant = violations.length > 0;
  const strictBlocking = nonCompliant;

  return {
    postId,
    isYmy: true,
    ymyReason: ymyStatus.reason,
    postPath: toRepoRelative(filePath),
    artifactRootExpected: toRepoRelative(artifactDirs.canonicalRoot),
    artifactRootResolved: toRepoRelative(artifactDirs.resolvedRoot),
    artifactRunDir: toRepoRelative(artifactDirs.resolvedRunDir),
    artifactSource: artifactDirs.rootSource,
    missingArtifacts,
    missingFields,
    invalidFields,
    numericWarnings,
    numericClaims,
    sourceEntriesCount: sourceEntries.length,
    nonCompliant,
    strictBlocking,
  };
}

function printPostReport(result) {
  const prefix = STRICT_MODE ? "FAIL" : "WARN";
  console.log(`[check-editorial-artifacts] ${prefix} post=${result.postId}`);
  console.log(`- post_path: ${result.postPath}`);
  console.log(`- ymy_detection: ${result.ymyReason}`);
  console.log(`- expected_artifact_root: ${result.artifactRootExpected}`);
  console.log(`- resolved_artifact_root: ${result.artifactRootResolved} (${result.artifactSource})`);
  console.log(`- resolved_run_dir: ${result.artifactRunDir}`);
  console.log(`- missing_artifacts: ${result.missingArtifacts.join(", ") || "none"}`);
  console.log(`- missing_fields: ${result.missingFields.join(", ") || "none"}`);
  console.log(`- invalid_fields: ${result.invalidFields.join(" | ") || "none"}`);
  console.log(`- numeric_claims_detected: ${result.numericClaims}`);
  if (result.numericWarnings.length > 0) {
    console.log(`- numeric_warning: ${result.numericWarnings.join(" | ")}`);
  }
  console.log(
    `- Create artifacts at: ${result.artifactRootExpected}/YYYYMMDD-HHMM-<run-id>/`
  );
}

function run() {
  if (!existsSync(BLOG_DIR)) {
    console.error(`[check-editorial-artifacts] FAIL: missing blog directory ${toRepoRelative(BLOG_DIR)}`);
    process.exit(1);
  }

  const allowlist = loadAllowlist(YMYL_ALLOWLIST_PATH);
  const files = listContentFiles(BLOG_DIR);
  const results = files.map(filePath => evaluatePost(filePath, allowlist));
  const ymyResults = results.filter(result => result.isYmy);
  const nonCompliant = ymyResults.filter(result => result.nonCompliant);
  const compliant = ymyResults.length - nonCompliant.length;

  console.log(
    `[check-editorial-artifacts] mode=${MODE_LABEL} enforce=${
      STRICT_MODE ? "1" : "0"
    } min_sources=${MIN_SOURCES} allowlist_entries=${allowlist.size}`
  );

  for (const result of nonCompliant) {
    printPostReport(result);
  }

  console.log(
    `[check-editorial-artifacts] SUMMARY total_posts=${results.length} ymyl_posts=${ymyResults.length} compliant=${compliant} non_compliant=${nonCompliant.length}`
  );

  if (!STRICT_MODE) {
    console.log(
      "[check-editorial-artifacts] WARN: Gate in warn-only mode. Set EDITORIAL_ENFORCE=1 to fail on violations."
    );
    process.exit(0);
  }

  const strictFailures = nonCompliant.filter(result => result.strictBlocking);
  if (strictFailures.length > 0) {
    console.error(
      `[check-editorial-artifacts] FAIL: strict mode blocking violations=${strictFailures.length}`
    );
    process.exit(1);
  }

  console.log("[check-editorial-artifacts] OK: strict mode passed.");
}

run();
