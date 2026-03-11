 
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import {
  HARDENED_OWNERSHIP_CLUSTERS,
  TOPIC_ROLES,
  allowsGeneralCategoryInCluster,
  getAllowedCategoriesForCluster,
  getCanonicalTopicEntry,
  getTransitionalOwnershipEntry,
} from "../src/config/editorial-topic-policy.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

const TITLE_RANGE = { min: 20, max: 110 };
const DESCRIPTION_RANGE = { min: 120, max: 200 };

const DEPRECATED_FIELDS = [
  "pubDatetime",
  "modDatetime",
  "canonicalURL",
  "ogImage",
];

const ALLOWED_CATEGORIES = new Set([
  "ahorro-inversion",
  "impuestos",
  "prevision",
  "deuda-credito",
  "seguridad-financiera",
  "empleo-ingresos",
  "general",
]);
const TOPIC_ROLE_SET = new Set(TOPIC_ROLES);

const CLUSTERS_TS_PATH = path.join(REPO_ROOT, "src", "config", "clusters.ts");
const clustersSource = readFileSync(CLUSTERS_TS_PATH, "utf8");
const clustersMatch = clustersSource.match(/export const CLUSTERS = \[\s*([\s\S]*?)\s*\]/);
const ALLOWED_CLUSTERS = new Set(
  clustersMatch[1]
    .split(",")
    .map(s => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
);

const REQUIRED_LANG = "es-CL";
const INLINE_IMAGE_EXCEPTION_MIN_REASON_LENGTH = 12;
const CANONICAL_TOPIC_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function listContentFiles(dirPath) {
  const result = [];
  const entries = readdirSync(dirPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...listContentFiles(absolutePath));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    result.push(absolutePath);
  }

  return result;
}

function extractFrontmatter(filePath) {
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : null;
}



function parseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function hasExplicitTimezone(value) {
  if (typeof value !== "string") return false;
  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
}

function toHttpsUrlOrNull(value) {
  if (!value) return null;
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pushIssue(collection, filePath, message) {
  collection.push({ filePath, message });
}

const files = listContentFiles(BLOG_DIR);
const errors = [];
const warnings = [];
const deprecationCounters = new Map(
  DEPRECATED_FIELDS.map(field => [field, 0])
);
const defaultCounters = new Map([
  ["slug_missing", 0],
  ["category_missing", 0],
]);
const qualityCounters = new Map([
  ["title_range", 0],
  ["description_range", 0],
]);

const publishableSlugs = new Map();
const publishableOwnershipRecords = [];

for (const filePath of files) {
  const relativeFilePath = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const frontmatterBlock = extractFrontmatter(filePath);

  if (!frontmatterBlock) {
    pushIssue(errors, relativeFilePath, "Missing frontmatter block.");
    continue;
  }

  let frontmatter;
  try {
    const parsed = yaml.load(frontmatterBlock, { schema: yaml.JSON_SCHEMA }) || {};
    frontmatter = typeof parsed === "object" ? parsed : {};
  } catch (err) {
    pushIssue(errors, relativeFilePath, `Invalid YAML format: ${err.message}`);
    continue;
  }
  for (const deprecatedField of DEPRECATED_FIELDS) {
    if (deprecatedField in frontmatter) {
      deprecationCounters.set(
        deprecatedField,
        (deprecationCounters.get(deprecatedField) ?? 0) + 1
      );
      pushIssue(
        errors,
        relativeFilePath,
        `Deprecated field "${deprecatedField}" is not allowed.`
      );
    }
  }

  if (typeof frontmatter.title !== "string" || frontmatter.title.trim() === "") {
    pushIssue(errors, relativeFilePath, 'Field "title" is required and must be a non-empty string.');
  }

  if (
    typeof frontmatter.description !== "string" ||
    frontmatter.description.trim() === ""
  ) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "description" is required and must be a non-empty string.'
    );
  }

  const explicitSlug =
    typeof frontmatter.slug === "string" ? frontmatter.slug.trim().toLowerCase() : "";
  const slug = explicitSlug;
  if (!explicitSlug) {
    pushIssue(
      errors,
      relativeFilePath,
      'Missing required explicit field "slug".'
    );
  }

  const tagsValue = frontmatter.tags;
  const tags = tagsValue ?? [];
  if (!Array.isArray(tags)) {
    pushIssue(errors, relativeFilePath, 'Field "tags" must be an array of strings.');
  } else if (tags.some(tag => typeof tag !== "string")) {
    pushIssue(errors, relativeFilePath, 'Field "tags" must contain only strings.');
  }

  const draft = frontmatter.draft ?? false;
  if (typeof draft !== "boolean") {
    pushIssue(errors, relativeFilePath, 'Field "draft" must be boolean.');
  }

  const unlisted = frontmatter.unlisted ?? false;
  if (typeof unlisted !== "boolean") {
    pushIssue(errors, relativeFilePath, 'Field "unlisted" must be boolean.');
  }

  const featured = frontmatter.featured ?? false;
  if (typeof featured !== "boolean") {
    pushIssue(errors, relativeFilePath, 'Field "featured" must be boolean.');
  }

  const category = frontmatter.category;
  if (!Object.hasOwn(frontmatter, "category")) {
    defaultCounters.set(
      "category_missing",
      (defaultCounters.get("category_missing") ?? 0) + 1
    );
    pushIssue(
      errors,
      relativeFilePath,
      'Missing required explicit field "category".'
    );
  }
  if (category != null && (typeof category !== "string" || category.trim() === "")) {
    pushIssue(errors, relativeFilePath, 'Field "category" must be a non-empty string.');
  } else if (typeof category === "string" && !ALLOWED_CATEGORIES.has(category)) {
    pushIssue(
      errors,
      relativeFilePath,
      `Field "category" must be one of: ${Array.from(ALLOWED_CATEGORIES).join(", ")}.`
    );
  }

  // author — required non-empty string
  const author = frontmatter.author;
  if (!Object.hasOwn(frontmatter, "author") || typeof author !== "string" || author.trim() === "") {
    pushIssue(errors, relativeFilePath, 'Missing or empty required field "author".');
  }

  // lang — must be "es-CL"
  const lang = frontmatter.lang;
  if (!Object.hasOwn(frontmatter, "lang")) {
    pushIssue(errors, relativeFilePath, 'Missing required field "lang" (expected "es-CL").');
  } else if (lang !== REQUIRED_LANG) {
    pushIssue(errors, relativeFilePath, `Field "lang" must be "${REQUIRED_LANG}", got "${lang}".`);
  }

  // cluster — required, must be one of ALLOWED_CLUSTERS
  const cluster = frontmatter.cluster;
  if (!Object.hasOwn(frontmatter, "cluster")) {
    pushIssue(errors, relativeFilePath, 'Missing required field "cluster".');
  } else if (typeof cluster !== "string" || cluster.trim() === "") {
    pushIssue(errors, relativeFilePath, 'Field "cluster" must be a non-empty string.');
  } else if (!ALLOWED_CLUSTERS.has(cluster)) {
    pushIssue(
      errors,
      relativeFilePath,
      `Field "cluster" must be one of: ${Array.from(ALLOWED_CLUSTERS).join(", ")}.`
    );
  }

  const allowedCategoriesRaw =
    typeof cluster === "string" ? getAllowedCategoriesForCluster(cluster) : null;
  const allowedCategoriesForCluster = allowedCategoriesRaw
    ? new Set(allowedCategoriesRaw)
    : null;
  if (
    typeof category === "string" &&
    allowedCategoriesForCluster &&
    !allowedCategoriesForCluster.has(category)
  ) {
    if (category === "general") {
      if (
        !allowsGeneralCategoryInCluster({
          cluster,
          topicRole: typeof frontmatter.topicRole === "string" ? frontmatter.topicRole : "",
          unlisted,
        })
      ) {
        pushIssue(
          errors,
          relativeFilePath,
          `Category "general" is blocked in hardened cluster "${cluster}" unless the article is an unlisted reference.`
        );
      } else {
        const documentedTransition =
          typeof frontmatter.slug === "string"
            ? getTransitionalOwnershipEntry(frontmatter.slug)
            : null;
        pushIssue(
          warnings,
          relativeFilePath,
          documentedTransition
            ? `Category "general" inside cluster "${cluster}" is a documented transitional placement toward "${documentedTransition.canonicalOwnerCluster}"; do not normalize it as definitive taxonomy before "${documentedTransition.targetHubPath}" exists.`
            : `Category "general" inside cluster "${cluster}" is tolerated only for explicit reference/editorial debt; review taxonomy.`
        );
      }
    } else {
      pushIssue(
        errors,
        relativeFilePath,
        `Category "${category}" does not match cluster "${cluster}". Expected: ${Array.from(
          allowedCategoriesForCluster
        ).join(", ")}.`
      );
    }
  }

  const topicRole = frontmatter.topicRole;
  if (topicRole != null) {
    if (typeof topicRole !== "string" || !TOPIC_ROLE_SET.has(topicRole)) {
      pushIssue(
        errors,
        relativeFilePath,
        `Field "topicRole" must be one of: ${Array.from(TOPIC_ROLE_SET).join(", ")}.`
      );
    }
  }

  const canonicalTopic = frontmatter.canonicalTopic;
  if (canonicalTopic != null) {
    if (typeof canonicalTopic !== "string" || canonicalTopic.trim() === "") {
      pushIssue(
        errors,
        relativeFilePath,
        'Field "canonicalTopic" must be a non-empty string when present.'
      );
    } else if (!CANONICAL_TOPIC_PATTERN.test(canonicalTopic.trim())) {
      pushIssue(
        errors,
        relativeFilePath,
        'Field "canonicalTopic" must use lowercase kebab-case.'
      );
    }
  }

  if (topicRole && !canonicalTopic) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "canonicalTopic" is required when "topicRole" is present.'
    );
  }

  if (canonicalTopic && !topicRole) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "topicRole" is required when "canonicalTopic" is present.'
    );
  }

  const pubDateRaw = frontmatter.pubDate;
  const pubDate = parseDate(pubDateRaw);
  if (!pubDateRaw) {
    pushIssue(
      errors,
      relativeFilePath,
      'Missing publication date: define "pubDate".'
    );
  } else if (!pubDate) {
    pushIssue(errors, relativeFilePath, 'Publication date is not parseable.');
  } else if (typeof pubDateRaw === "string" && !hasExplicitTimezone(pubDateRaw)) {
    pushIssue(
      errors,
      relativeFilePath,
      'Publication date must include explicit timezone (e.g. "Z" or "+00:00").'
    );
  }

  const updatedDateRaw = frontmatter.updatedDate ?? null;
  const updatedDate = updatedDateRaw ? parseDate(updatedDateRaw) : null;
  if (updatedDateRaw && !updatedDate) {
    pushIssue(errors, relativeFilePath, 'Field "updatedDate" is not parseable.');
  }
  if (
    typeof updatedDateRaw === "string" &&
    updatedDateRaw &&
    !hasExplicitTimezone(updatedDateRaw)
  ) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "updatedDate" must include explicit timezone (e.g. "Z" or "+00:00").'
    );
  }
  if (pubDate && updatedDate && updatedDate.getTime() < pubDate.getTime()) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "updatedDate" must be greater than or equal to "pubDate".'
    );
  }

  const canonicalRaw = frontmatter.canonical;
  if (canonicalRaw) {
    const canonical = toHttpsUrlOrNull(canonicalRaw);
    if (!canonical) {
      pushIssue(
        errors,
        relativeFilePath,
        'Field "canonical" must be an absolute HTTPS URL.'
      );
    }
  }

  const inlineImageExceptions = frontmatter.inlineImageExceptions;
  if (inlineImageExceptions != null) {
    if (!Array.isArray(inlineImageExceptions)) {
      pushIssue(
        errors,
        relativeFilePath,
        'Field "inlineImageExceptions" must be an array of objects.'
      );
    } else {
      const seenInlineExceptionSrc = new Set();
      inlineImageExceptions.forEach((entry, index) => {
        const entryLabel = `inlineImageExceptions[${index}]`;
        if (!isPlainObject(entry)) {
          pushIssue(
            errors,
            relativeFilePath,
            `Field "${entryLabel}" must be an object with "src" and "reason".`
          );
          return;
        }

        const { src, reason } = entry;
        if (typeof src !== "string" || src.trim() === "") {
          pushIssue(
            errors,
            relativeFilePath,
            `Field "${entryLabel}.src" must be a non-empty string.`
          );
        } else {
          const normalizedSrc = src.trim();
          if (seenInlineExceptionSrc.has(normalizedSrc)) {
            pushIssue(
              errors,
              relativeFilePath,
              `Field "inlineImageExceptions" contains duplicate src "${normalizedSrc}".`
            );
          }
          seenInlineExceptionSrc.add(normalizedSrc);

          if (/\.avif(?:[?#].*)?$/i.test(normalizedSrc)) {
            pushIssue(
              errors,
              relativeFilePath,
              `Field "${entryLabel}.src" must not allowlist AVIF images; remove unnecessary exception "${normalizedSrc}".`
            );
          }
        }

        if (typeof reason !== "string" || reason.trim() === "") {
          pushIssue(
            errors,
            relativeFilePath,
            `Field "${entryLabel}.reason" must be a non-empty string.`
          );
        } else if (
          reason.trim().length < INLINE_IMAGE_EXCEPTION_MIN_REASON_LENGTH
        ) {
          pushIssue(
            errors,
            relativeFilePath,
            `Field "${entryLabel}.reason" must be at least ${INLINE_IMAGE_EXCEPTION_MIN_REASON_LENGTH} characters to justify the exception.`
          );
        }

        const extraKeys = Object.keys(entry).filter(
          key => key !== "src" && key !== "reason"
        );
        if (extraKeys.length > 0) {
          pushIssue(
            errors,
            relativeFilePath,
            `Field "${entryLabel}" contains unsupported keys: ${extraKeys.join(", ")}.`
          );
        }
      });
    }
  }

  if (typeof frontmatter.title === "string") {
    const titleLength = frontmatter.title.trim().length;
    if (titleLength < TITLE_RANGE.min || titleLength > TITLE_RANGE.max) {
      qualityCounters.set(
        "title_range",
        (qualityCounters.get("title_range") ?? 0) + 1
      );
      pushIssue(
        warnings,
        relativeFilePath,
        `Title length ${titleLength} outside recommended range (${TITLE_RANGE.min}-${TITLE_RANGE.max}).`
      );
    }
  }

  if (typeof frontmatter.description === "string") {
    const descriptionLength = frontmatter.description.trim().length;
    if (
      descriptionLength < DESCRIPTION_RANGE.min ||
      descriptionLength > DESCRIPTION_RANGE.max
    ) {
      qualityCounters.set(
        "description_range",
        (qualityCounters.get("description_range") ?? 0) + 1
      );
      pushIssue(
        warnings,
        relativeFilePath,
        `Description length ${descriptionLength} outside recommended range (${DESCRIPTION_RANGE.min}-${DESCRIPTION_RANGE.max}).`
      );
    }
  }

  if (draft === false) {
    publishableSlugs.set(slug, [
      ...(publishableSlugs.get(slug) ?? []),
      relativeFilePath,
    ]);
    publishableOwnershipRecords.push({
      filePath: relativeFilePath,
      slug,
      cluster: typeof cluster === "string" ? cluster : "",
      topicRole: typeof topicRole === "string" ? topicRole.trim() : "",
      canonicalTopic:
        typeof canonicalTopic === "string" ? canonicalTopic.trim() : "",
    });
  }
}

for (const [slug, relatedFiles] of publishableSlugs.entries()) {
  if (relatedFiles.length < 2) continue;
  pushIssue(
    errors,
    relatedFiles.join(", "),
    `Duplicate publishable slug "${slug}".`
  );
}

const ownerTopicMap = new Map();
const ownershipGroups = new Map();

for (const record of publishableOwnershipRecords) {
  if (
    HARDENED_OWNERSHIP_CLUSTERS.includes(record.cluster) &&
    (!record.topicRole || !record.canonicalTopic)
  ) {
    pushIssue(
      errors,
      record.filePath,
      `Published article in hardened cluster "${record.cluster}" must declare both "topicRole" and "canonicalTopic".`
    );
  }

  if (!record.topicRole || !record.canonicalTopic) continue;

  if (
    HARDENED_OWNERSHIP_CLUSTERS.includes(record.cluster) &&
    !getCanonicalTopicEntry(record.cluster, record.canonicalTopic)
  ) {
    pushIssue(
      errors,
      record.filePath,
      `Unregistered canonicalTopic "${record.canonicalTopic}" for hardened cluster "${record.cluster}". Add it to the central registry before publishing.`
    );
  }

  const groupKey = `${record.cluster}::${record.canonicalTopic}`;
  ownershipGroups.set(groupKey, [...(ownershipGroups.get(groupKey) ?? []), record]);

  if (record.topicRole === "owner") {
    ownerTopicMap.set(groupKey, [...(ownerTopicMap.get(groupKey) ?? []), record]);
  }
}

for (const [groupKey, owners] of ownerTopicMap.entries()) {
  if (owners.length < 2) continue;
  pushIssue(
    errors,
    owners.map(owner => owner.filePath).join(", "),
    `Duplicate topic owner for "${groupKey}". Only one publishable article may declare topicRole="owner" for the same cluster/canonicalTopic.`
  );
}

for (const [groupKey, records] of ownershipGroups.entries()) {
  const hasOwner = records.some(record => record.topicRole === "owner");
  if (hasOwner) continue;
  for (const record of records) {
    if (!["support", "reference"].includes(record.topicRole)) continue;
    const issueCollection = HARDENED_OWNERSHIP_CLUSTERS.includes(record.cluster)
      ? errors
      : warnings;
    pushIssue(
      issueCollection,
      record.filePath,
      `No topic owner declared for "${groupKey}" even though this article is marked "${record.topicRole}".`
    );
  }
}

console.log(`[check-frontmatter] Scanned ${files.length} articles.`);

if (errors.length > 0) {
  console.error(`[check-frontmatter] Errors: ${errors.length}`);
  for (const error of errors) {
    console.error(`- ${error.filePath}: ${error.message}`);
  }
}

if (warnings.length > 0) {
  console.warn(`[check-frontmatter] Warnings: ${warnings.length}`);
  for (const warning of warnings) {
    console.warn(`- ${warning.filePath}: ${warning.message}`);
  }
}

console.log("[check-frontmatter] Deprecation counters:");
for (const field of DEPRECATED_FIELDS) {
  console.log(`- ${field}: ${deprecationCounters.get(field) ?? 0}`);
}

console.log("[check-frontmatter] Transition defaults:");
for (const [key, value] of defaultCounters.entries()) {
  console.log(`- ${key}: ${value}`);
}

console.log("[check-frontmatter] Quality warnings (Level 2):");
for (const [key, value] of qualityCounters.entries()) {
  console.log(`- ${key}: ${value}`);
}

if (errors.length > 0) {
  process.exit(1);
}

console.log("[check-frontmatter] OK (no blocking errors).");
