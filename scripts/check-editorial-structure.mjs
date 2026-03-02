/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const GUIDES_DIR = path.join(REPO_ROOT, "src", "pages", "guias");
const MODULE_INDEX_PATH = path.join(REPO_ROOT, "context", "MODULE_INDEX.md");

const MIN_H2_SECTIONS = 2;
const MIN_SECTION_WORDS = 8;
const MIN_TITLE_WORDS = 4;
const MIN_INTERNAL_LINKS = 1;
const MIN_CLUSTER_INTERNAL_LINKS = 1;
const MAX_CLUSTER_MISSING_WARNING_ITEMS = 10;
const META_DESCRIPTION_MIN_LENGTH = 70;
const META_DESCRIPTION_WARN_MAX_LENGTH = 155;
const META_DESCRIPTION_HARD_MAX_LENGTH = 200;
const INTERNAL_LINK_SKIP_VALUE = "ignore";
const CLUSTER_FIELD = "cluster";
const SITE_HOSTNAME = process.env.SITE_HOSTNAME?.trim().toLowerCase() || null;
const IMAGE_LINK_EXTENSION_PATTERN =
  /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i;
const MARKDOWN_LINK_PATTERN =
  /\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g;
const KEBAB_TOKEN_PATTERN = /[a-z0-9]+(?:-[a-z0-9]+)+/g;
const YAML_NON_STRING_SCALARS = new Set([
  "null",
  "~",
  "true",
  "false",
  ".nan",
  ".inf",
  "-.inf",
  "+.inf",
]);
const TOC_TITLES = new Set(["tabla de contenidos", "table of contents"]);
const TITLE_GENERIC_BLACKLIST = new Set(["articulo", "post", "guia", "contenido"]);
const TITLE_COHERENCE_STOPWORDS = new Set([
  "a",
  "al",
  "con",
  "como",
  "de",
  "del",
  "el",
  "en",
  "es",
  "la",
  "las",
  "lo",
  "los",
  "o",
  "para",
  "por",
  "que",
  "se",
  "sin",
  "su",
  "sus",
  "u",
  "un",
  "una",
  "uno",
  "y",
]);
const NON_SUBSTANTIVE_HEADING_PATTERNS = [
  /^introducci[oó]n(?:\b|:)/i,
  /^intro(?:\b|:)/i,
  /^resumen(?:\b|:)/i,
  /^conclusi[oó]n(?:es)?(?:\b|:)/i,
  /^cierre(?:\b|:)/i,
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

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: "", body: source };
  return {
    frontmatter: match[1] ?? "",
    body: source.slice(match[0].length),
  };
}

function extractField(frontmatter, field) {
  const pattern = new RegExp(`^${field}:\\s*(.+)$`, "m");
  const match = frontmatter.match(pattern);
  if (!match?.[1]) return "";
  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

function extractFieldDetails(frontmatter, field) {
  const pattern = new RegExp(`^${field}:\\s*(.*)$`, "m");
  const match = frontmatter.match(pattern);
  if (!match) {
    return {
      exists: false,
      raw: "",
      value: "",
      isString: false,
    };
  }

  const raw = (match[1] ?? "").trim();
  const value = raw.trim().replace(/^['"]|['"]$/g, "");

  return {
    exists: true,
    raw,
    value,
    isString: isYamlStringScalar(raw),
  };
}

function hasExplicitTimezone(value) {
  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
}

function isYamlStringScalar(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) return false;
  if (/^[|>]/.test(trimmed)) return false;
  if (/^[\[{]/.test(trimmed)) return false;
  if (/^['"][\s\S]*['"]$/.test(trimmed)) return true;

  const normalized = trimmed.toLowerCase();
  if (YAML_NON_STRING_SCALARS.has(normalized)) return false;
  if (/^[+-]?\d+(?:\.\d+)?$/.test(trimmed)) return false;
  if (/^[+-]?\d+(?:\.\d+)?e[+-]?\d+$/i.test(trimmed)) return false;

  return true;
}

function isNonSubstantiveHeading(title) {
  return NON_SUBSTANTIVE_HEADING_PATTERNS.some(pattern => pattern.test(title));
}

function normalizeSectionContent(rawBlock) {
  return rawBlock
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(value) {
  return (value.match(/[\p{L}\p{N}]+/gu) ?? []).length;
}

function normalizeForComparison(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toSignificantTokens(value) {
  return normalizeForComparison(value)
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => !TITLE_COHERENCE_STOPWORDS.has(token));
}

function toAllWordTokens(value) {
  return normalizeForComparison(value)
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function extractMarkdownH1Headings(body) {
  const lines = body.split(/\r?\n/);
  const headings = [];
  let inFencedCodeBlock = false;
  let activeFence = "";

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch?.[1]) {
      const fence = fenceMatch[1];
      if (!inFencedCodeBlock) {
        inFencedCodeBlock = true;
        activeFence = fence[0];
      } else if (fence[0] === activeFence) {
        inFencedCodeBlock = false;
        activeFence = "";
      }
      continue;
    }

    if (inFencedCodeBlock) continue;

    const headingMatch = line.match(/^#(?!#)\s+(.+?)\s*$/);
    if (headingMatch?.[1]) {
      headings.push(headingMatch[1].trim());
    }
  }

  return headings;
}

function getSlugTokens(filePath) {
  const filename = path.basename(filePath, path.extname(filePath));
  return filename
    .split("-")
    .map(token => normalizeForComparison(token).replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .filter(token => !TITLE_COHERENCE_STOPWORDS.has(token));
}

function normalizeMetaDescription(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeTitleKey(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeSlugKey(filePath) {
  return path
    .basename(filePath, path.extname(filePath))
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeClusterName(value) {
  return normalizeForComparison(value).trim();
}

function removeFencedCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/~~~[\s\S]*?~~~/g, " ");
}

function removeMarkdownImages(markdown) {
  return markdown.replace(/!\[[^\]]*]\([^)]*\)/g, " ");
}

function normalizeLinkTarget(target) {
  const trimmed = target.trim();
  if (trimmed.startsWith("<") && trimmed.endsWith(">") && trimmed.length > 2) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function toPathWithoutQueryOrHash(target) {
  if (/^https?:\/\//i.test(target)) {
    try {
      return new URL(target).pathname;
    } catch {
      return target.split(/[?#]/)[0] ?? target;
    }
  }
  return target.split(/[?#]/)[0] ?? target;
}

function isImageLinkTarget(target) {
  return IMAGE_LINK_EXTENSION_PATTERN.test(toPathWithoutQueryOrHash(target));
}

function isInternalLinkTarget(target, siteHostname) {
  if (!target) return false;
  if (/^(?:#|mailto:|tel:|javascript:)/i.test(target)) return false;

  if (/^https?:\/\//i.test(target)) {
    if (!siteHostname) return false;
    try {
      const hostname = new URL(target).hostname.toLowerCase();
      return hostname === siteHostname;
    } catch {
      return false;
    }
  }

  return /^(?:\/|\.\/|\.\.\/)/.test(target);
}

function extractInternalMarkdownLinkTargets(body, siteHostname) {
  const sanitizedBody = removeMarkdownImages(removeFencedCodeBlocks(body));
  const linkMatches = sanitizedBody.matchAll(MARKDOWN_LINK_PATTERN);
  const targets = [];

  for (const match of linkMatches) {
    const rawTarget = match[2] ?? "";
    const target = normalizeLinkTarget(rawTarget);
    if (!target) continue;
    if (isImageLinkTarget(target)) continue;
    if (!isInternalLinkTarget(target, siteHostname)) continue;
    targets.push(target);
  }

  return targets;
}

function countInternalMarkdownLinks(body, siteHostname) {
  return extractInternalMarkdownLinkTargets(body, siteHostname).length;
}

function extractKebabTokens(value) {
  return value.match(KEBAB_TOKEN_PATTERN) ?? [];
}

function loadValidGuideClusters(guidesDir) {
  if (!existsSync(guidesDir)) return [];

  return readdirSync(guidesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => normalizeClusterName(entry.name))
    .filter(Boolean);
}

function loadExplicitClustersFromModuleIndex(moduleIndexPath) {
  if (!existsSync(moduleIndexPath)) return [];

  const source = readFileSync(moduleIndexPath, "utf8");
  const lines = source.split(/\r?\n/);
  const clusters = new Set();
  let inClusterSection = false;

  for (const line of lines) {
    if (/^##+\s+/.test(line)) {
      inClusterSection = /\bclusters?\b/i.test(line);
      continue;
    }

    if (inClusterSection) {
      for (const token of extractKebabTokens(line)) {
        clusters.add(normalizeClusterName(token));
      }
    }

    const inlineDeclaration = line.match(/\bclusters?\s*:\s*(.+)$/i);
    if (inlineDeclaration?.[1]) {
      for (const token of extractKebabTokens(inlineDeclaration[1])) {
        clusters.add(normalizeClusterName(token));
      }
    }
  }

  return [...clusters];
}

function extractPostSlugFromLinkTarget(target) {
  if (!target) return "";

  let routePath = toPathWithoutQueryOrHash(target);
  if (/^https?:\/\//i.test(target)) {
    try {
      routePath = new URL(target).pathname;
    } catch {
      return "";
    }
  }

  const normalizedPath = routePath.replace(/\/+$/, "");
  if (!normalizedPath) return "";

  const segments = normalizedPath.split("/").filter(Boolean);
  const postsIndex = segments.indexOf("posts");
  if (postsIndex < 0 || postsIndex >= segments.length - 1) return "";

  const slug = segments[postsIndex + 1] ?? "";
  return normalizeForComparison(slug).replace(/[^a-z0-9-]/g, "");
}

function countIntraClusterArticleLinks({
  body,
  currentSlug,
  currentCluster,
  clusterBySlug,
  siteHostname,
}) {
  const linkTargets = extractInternalMarkdownLinkTargets(body, siteHostname);
  const linkedSlugs = new Set();

  for (const target of linkTargets) {
    const linkedSlug = extractPostSlugFromLinkTarget(target);
    if (!linkedSlug || linkedSlug === currentSlug) continue;

    const linkedCluster = clusterBySlug.get(linkedSlug);
    if (!linkedCluster || linkedCluster !== currentCluster) continue;

    linkedSlugs.add(linkedSlug);
  }

  return linkedSlugs.size;
}

function getH2Sections(body) {
  const lines = body.split(/\r?\n/);
  const headings = [];

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i]?.match(/^##\s+(.+)$/);
    if (!match?.[1]) continue;
    headings.push({ lineIndex: i, title: match[1].trim() });
  }

  return headings
    .map((current, index) => {
      const nextLine = headings[index + 1]?.lineIndex ?? lines.length;
      const rawBlock = lines.slice(current.lineIndex + 1, nextLine).join("\n");
      const normalizedContent = normalizeSectionContent(rawBlock);

      return {
        title: current.title,
        normalizedTitle: current.title.toLowerCase(),
        isSubstantive: !isNonSubstantiveHeading(current.title.trim()),
        wordCount: countWords(normalizedContent),
      };
    })
    .filter(section => !TOC_TITLES.has(section.normalizedTitle));
}

const files = listContentFiles(BLOG_DIR);
const structureIssues = [];
const metaMissing = [];
const metaShort = [];
const metaLongFail = [];
const metaLongWarning = [];
const titleMissing = [];
const titleMeaningless = [];
const markdownH1Present = [];
const titleSlugWarnings = [];
const internalLinksWarnings = [];
const skippedInternalLinks = [];
const clusterMissing = [];
const clusterInvalid = [];
const clusterLinkWarnings = [];
let clusterWithValueTotal = 0;
const normalizedMetaMap = new Map();
const normalizedTitleMap = new Map();
const normalizedSlugMap = new Map();
const articleRecords = [];
const folderClusters = loadValidGuideClusters(GUIDES_DIR);
const moduleIndexClusters = loadExplicitClustersFromModuleIndex(MODULE_INDEX_PATH);
const validClusterSet = new Set([...folderClusters, ...moduleIndexClusters]);

if (validClusterSet.size === 0) {
  console.error(
    `[check-editorial-structure] FAIL. no valid clusters registered from ${path.relative(REPO_ROOT, GUIDES_DIR)} or ${path.relative(REPO_ROOT, MODULE_INDEX_PATH)}.`
  );
  process.exit(1);
}

for (const filePath of files) {
  const relative = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const source = readFileSync(filePath, "utf8");
  const { frontmatter, body } = extractFrontmatter(source);

  const title = extractField(frontmatter, "title");
  const description = extractField(frontmatter, "description");
  const pubDate = extractField(frontmatter, "pubDate");
  const clusterDetails = extractFieldDetails(frontmatter, CLUSTER_FIELD);
  const clusterValue = normalizeClusterName(clusterDetails.value);
  const internalLinksBehavior =
    extractField(frontmatter, "internalLinks") ||
    extractField(frontmatter, "internal_links");
  let hasValidCluster = false;

  if (!title) {
    titleMissing.push(relative);
    structureIssues.push({
      file: relative,
      message: 'missing required "title".',
    });
  } else {
    const normalizedTitleKey = normalizeTitleKey(title);
    normalizedTitleMap.set(normalizedTitleKey, [
      ...(normalizedTitleMap.get(normalizedTitleKey) ?? []),
      relative,
    ]);

    const normalizedTitle = normalizeForComparison(title).trim();
    const titleWords = toAllWordTokens(title);

    if (
      titleWords.length < MIN_TITLE_WORDS ||
      TITLE_GENERIC_BLACKLIST.has(normalizedTitle)
    ) {
      titleMeaningless.push({ file: relative, title, words: titleWords.length });
      structureIssues.push({
        file: relative,
        message: `title is not meaningful (words=${titleWords.length}, min ${MIN_TITLE_WORDS}).`,
      });
    }

    const titleTokens = new Set(toSignificantTokens(title));
    const slugTokens = getSlugTokens(relative);
    const slugMatch = slugTokens.some(token => titleTokens.has(token));
    if (!slugMatch) {
      titleSlugWarnings.push({ file: relative, title, slugTokens });
    }
  }

  const normalizedSlugKey = normalizeSlugKey(relative);
  normalizedSlugMap.set(normalizedSlugKey, [
    ...(normalizedSlugMap.get(normalizedSlugKey) ?? []),
    relative,
  ]);

  if (!clusterDetails.exists) {
    clusterMissing.push({ file: relative, reason: 'missing required "cluster".' });
  } else if (!clusterDetails.raw) {
    clusterMissing.push({ file: relative, reason: '"cluster" cannot be empty.' });
  } else if (!clusterDetails.isString) {
    clusterInvalid.push({
      file: relative,
      cluster: clusterDetails.raw,
      reason: '"cluster" must be a string scalar.',
    });
    structureIssues.push({
      file: relative,
      message: '"cluster" must be a string scalar.',
    });
  } else if (!clusterValue) {
    clusterMissing.push({
      file: relative,
      reason: '"cluster" cannot be empty after normalization.',
    });
  } else if (!validClusterSet.has(clusterValue)) {
    clusterInvalid.push({
      file: relative,
      cluster: clusterDetails.value,
      reason: `"cluster" value "${clusterDetails.value}" is not registered in src/pages/guias or context/MODULE_INDEX.md.`,
    });
    structureIssues.push({
      file: relative,
      message: `"cluster" value "${clusterDetails.value}" is not registered in src/pages/guias or context/MODULE_INDEX.md.`,
    });
  } else {
    hasValidCluster = true;
  }

  if (clusterDetails.isString && clusterValue) {
    clusterWithValueTotal += 1;
  }

  if (!description.trim()) {
    metaMissing.push(relative);
    structureIssues.push({
      file: relative,
      message: 'missing or empty "description".',
    });
  }
  if (!pubDate) {
    structureIssues.push({
      file: relative,
      message: 'missing required "pubDate".',
    });
  }

  if (pubDate) {
    const parsedDate = new Date(pubDate);
    if (Number.isNaN(parsedDate.getTime()) || !hasExplicitTimezone(pubDate)) {
      structureIssues.push({
        file: relative,
        message: '"pubDate" must be valid ISO date with explicit timezone.',
      });
    }
  }

  if (description.trim()) {
    const trimmedDescription = description.trim().replace(/\s+/g, " ");
    const descriptionLength = Array.from(trimmedDescription).length;
    if (descriptionLength < META_DESCRIPTION_MIN_LENGTH) {
      metaShort.push({ file: relative, length: descriptionLength });
    } else if (descriptionLength > META_DESCRIPTION_HARD_MAX_LENGTH) {
      metaLongFail.push({ file: relative, length: descriptionLength });
    } else if (descriptionLength > META_DESCRIPTION_WARN_MAX_LENGTH) {
      metaLongWarning.push({ file: relative, length: descriptionLength });
    }

    const normalizedDescription = normalizeMetaDescription(trimmedDescription);
    normalizedMetaMap.set(normalizedDescription, [
      ...(normalizedMetaMap.get(normalizedDescription) ?? []),
      { file: relative, length: descriptionLength, value: trimmedDescription },
    ]);
  }

  const markdownH1Headings = extractMarkdownH1Headings(body);
  const markdownH1Count = markdownH1Headings.length;

  if (markdownH1Count > 0) {
    markdownH1Present.push({ file: relative, count: markdownH1Count });
    structureIssues.push({
      file: relative,
      message: `contains ${markdownH1Count} markdown H1 heading(s); markdown H1 is forbidden because H1 is rendered from frontmatter.title.`,
    });
  }

  const h2Sections = getH2Sections(body);
  const substantiveH2Sections = h2Sections.filter(section => section.isSubstantive);
  if (substantiveH2Sections.length < MIN_H2_SECTIONS) {
    structureIssues.push({
      file: relative,
      message: `requires at least ${MIN_H2_SECTIONS} substantive H2 sections (excluding Introduccion/Resumen/Conclusion/Cierre variants).`,
    });
  }

  const shortSection = substantiveH2Sections.find(
    section => section.wordCount < MIN_SECTION_WORDS
  );
  if (shortSection) {
    structureIssues.push({
      file: relative,
      message: `section "${shortSection.title}" has only ${shortSection.wordCount} words (min ${MIN_SECTION_WORDS}, excluding code/images).`,
    });
  }

  if (internalLinksBehavior.toLowerCase() === INTERNAL_LINK_SKIP_VALUE) {
    skippedInternalLinks.push(relative);
  } else {
    const internalLinksCount = countInternalMarkdownLinks(body, SITE_HOSTNAME);
    if (internalLinksCount < MIN_INTERNAL_LINKS) {
      internalLinksWarnings.push({
        file: relative,
        count: internalLinksCount,
      });
    }
  }

  articleRecords.push({
    file: relative,
    slug: normalizedSlugKey,
    cluster: clusterValue,
    hasValidCluster,
    body,
  });
}

const clusterBySlug = new Map();
for (const article of articleRecords) {
  if (!article.hasValidCluster) continue;
  if (clusterBySlug.has(article.slug)) continue;
  clusterBySlug.set(article.slug, article.cluster);
}

for (const article of articleRecords) {
  if (!article.hasValidCluster) continue;
  const sameClusterLinks = countIntraClusterArticleLinks({
    body: article.body,
    currentSlug: article.slug,
    currentCluster: article.cluster,
    clusterBySlug,
    siteHostname: SITE_HOSTNAME,
  });

  if (sameClusterLinks < MIN_CLUSTER_INTERNAL_LINKS) {
    clusterLinkWarnings.push({
      file: article.file,
      count: sameClusterLinks,
    });
  }
}

const metaDuplicates = [...normalizedMetaMap.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([normalized, entries]) => ({
    normalized,
    files: entries.map(entry => entry.file),
  }));
const duplicateTitles = [...normalizedTitleMap.entries()]
  .filter(([, filesForTitle]) => filesForTitle.length > 1)
  .map(([normalized, filesForTitle]) => ({
    normalized,
    files: filesForTitle,
  }));
const duplicateSlugs = [...normalizedSlugMap.entries()]
  .filter(([, filesForSlug]) => filesForSlug.length > 1)
  .map(([slug, filesForSlug]) => ({
    slug,
    files: filesForSlug,
  }));
const titleSlugWarningTotal = titleSlugWarnings.length;
const internalLinksWarningTotal = internalLinksWarnings.length;
const skippedInternalLinksTotal = skippedInternalLinks.length;
const clusterMissingTotal = clusterMissing.length;
const clusterInvalidTotal = clusterInvalid.length;
const clusterLinkWarningTotal = clusterLinkWarnings.length;
const clusterCoveragePct =
  files.length === 0 ? 100 : Math.round((100 * clusterWithValueTotal) / files.length);

const hasFailures =
  clusterInvalidTotal > 0 ||
  structureIssues.length > 0 ||
  metaMissing.length > 0 ||
  metaShort.length > 0 ||
  metaLongFail.length > 0 ||
  metaDuplicates.length > 0 ||
  duplicateTitles.length > 0 ||
  duplicateSlugs.length > 0;

if (metaLongWarning.length > 0) {
  console.warn(
    `[check-editorial-structure] WARN. long_warning=${metaLongWarning.length} (recommended max ${META_DESCRIPTION_WARN_MAX_LENGTH}, hard max ${META_DESCRIPTION_HARD_MAX_LENGTH}).`
  );
  for (const warning of metaLongWarning) {
    console.warn(
      `- ${warning.file}: description length ${warning.length} exceeds recommended max ${META_DESCRIPTION_WARN_MAX_LENGTH} (non-blocking).`
    );
  }
}

if (titleSlugWarningTotal > 0) {
  console.warn(
    `[check-editorial-structure] WARN. title_slug_warning=${titleSlugWarningTotal} (non-blocking).`
  );
  for (const warning of titleSlugWarnings) {
    console.warn(
      `- ${warning.file}: title/slug coherence warning (no overlap with slug tokens: ${warning.slugTokens.join(", ") || "n/a"}).`
    );
  }
}

if (internalLinksWarningTotal > 0 || skippedInternalLinksTotal > 0) {
  console.warn(
    `[check-editorial-structure] WARN. internal_links_warning=${internalLinksWarningTotal} skipped_internal_links=${skippedInternalLinksTotal} min_internal_links=${MIN_INTERNAL_LINKS} (non-blocking).`
  );
  for (const warning of internalLinksWarnings) {
    console.warn(
      `- ${warning.file}: has ${warning.count} internal links (min ${MIN_INTERNAL_LINKS}).`
    );
  }
}

if (
  clusterMissingTotal > 0 ||
  clusterInvalidTotal > 0 ||
  clusterLinkWarningTotal > 0
) {
  console.warn(
    `[check-editorial-structure] WARN. cluster_missing=${clusterMissingTotal} cluster_invalid=${clusterInvalidTotal} cluster_link_warning=${clusterLinkWarningTotal} cluster_coverage_pct=${clusterCoveragePct} cluster_with_value=${clusterWithValueTotal} validated=${files.length} min_cluster_internal_links=${MIN_CLUSTER_INTERNAL_LINKS} (warning-first rollout).`
  );

  if (clusterMissingTotal > 0) {
    const missingSample = clusterMissing.slice(0, MAX_CLUSTER_MISSING_WARNING_ITEMS);
    for (const warning of missingSample) {
      console.warn(`- ${warning.file}: ${warning.reason}`);
    }
    const remaining = clusterMissingTotal - missingSample.length;
    if (remaining > 0) {
      console.warn(`- and ${remaining} more cluster-missing file(s).`);
    }
  }

  for (const warning of clusterLinkWarnings) {
    console.warn(
      `- ${warning.file}: has ${warning.count} intra-cluster internal links (min ${MIN_CLUSTER_INTERNAL_LINKS}).`
    );
  }
}

if (hasFailures) {
  console.error(
    `[check-editorial-structure] FAIL. validated=${files.length} cluster_with_value=${clusterWithValueTotal} cluster_coverage_pct=${clusterCoveragePct} cluster_missing=${clusterMissingTotal} cluster_invalid=${clusterInvalidTotal} cluster_link_warning=${clusterLinkWarningTotal} title_missing=${titleMissing.length} title_meaningless=${titleMeaningless.length} markdown_h1_present=${markdownH1Present.length} title_slug_warning=${titleSlugWarningTotal} internal_links_warning=${internalLinksWarningTotal} skipped_internal_links=${skippedInternalLinksTotal} duplicate_titles=${duplicateTitles.length} duplicate_slugs=${duplicateSlugs.length} missing=${metaMissing.length} short=${metaShort.length} long_fail=${metaLongFail.length} long_warning=${metaLongWarning.length} duplicates=${metaDuplicates.length}`
  );

  for (const issue of structureIssues) {
    console.error(`- ${issue.file}: ${issue.message}`);
  }
  for (const issue of metaShort) {
    console.error(
      `- ${issue.file}: description too short (${issue.length} chars, min ${META_DESCRIPTION_MIN_LENGTH}).`
    );
  }
  for (const issue of metaLongFail) {
    console.error(
      `- ${issue.file}: description too long (${issue.length} chars, hard max ${META_DESCRIPTION_HARD_MAX_LENGTH}).`
    );
  }
  for (const duplicate of metaDuplicates) {
    console.error(
      `- duplicate description: "${duplicate.normalized}" -> ${duplicate.files.join(", ")}`
    );
  }
  for (const duplicate of duplicateTitles) {
    console.error(`- duplicate title "${duplicate.normalized}":`);
    for (const filePath of duplicate.files) {
      console.error(`  - ${filePath}`);
    }
  }
  for (const duplicate of duplicateSlugs) {
    console.error(`- duplicate slug "${duplicate.slug}":`);
    for (const filePath of duplicate.files) {
      console.error(`  - ${filePath}`);
    }
  }

  process.exit(1);
}

console.log(
  `[check-editorial-structure] OK. validated=${files.length} cluster_with_value=${clusterWithValueTotal} cluster_coverage_pct=${clusterCoveragePct} cluster_missing=${clusterMissingTotal} cluster_invalid=${clusterInvalidTotal} cluster_link_warning=${clusterLinkWarningTotal} title_missing=0 title_meaningless=0 markdown_h1_present=0 title_slug_warning=${titleSlugWarningTotal} internal_links_warning=${internalLinksWarningTotal} skipped_internal_links=${skippedInternalLinksTotal} duplicate_titles=0 duplicate_slugs=0 missing=0 short=0 long_fail=0 long_warning=${metaLongWarning.length} duplicates=0 min_h2=${MIN_H2_SECTIONS} min_section_words=${MIN_SECTION_WORDS} min_internal_links=${MIN_INTERNAL_LINKS} min_cluster_internal_links=${MIN_CLUSTER_INTERNAL_LINKS}`
);
