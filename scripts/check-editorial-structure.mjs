/* eslint-disable no-console */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

const MIN_H2_SECTIONS = 2;
const MIN_SECTION_WORDS = 8;
const MIN_TITLE_WORDS = 4;
const MIN_INTERNAL_LINKS = 1;
const META_DESCRIPTION_MIN_LENGTH = 70;
const META_DESCRIPTION_WARN_MAX_LENGTH = 155;
const META_DESCRIPTION_HARD_MAX_LENGTH = 200;
const INTERNAL_LINK_SKIP_VALUE = "ignore";
const SITE_HOSTNAME = process.env.SITE_HOSTNAME?.trim().toLowerCase() || null;
const IMAGE_LINK_EXTENSION_PATTERN =
  /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i;
const MARKDOWN_LINK_PATTERN =
  /\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g;
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

function hasExplicitTimezone(value) {
  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
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

function countInternalMarkdownLinks(body, siteHostname) {
  const sanitizedBody = removeMarkdownImages(removeFencedCodeBlocks(body));
  const linkMatches = sanitizedBody.matchAll(MARKDOWN_LINK_PATTERN);
  let internalLinks = 0;

  for (const match of linkMatches) {
    const rawTarget = match[2] ?? "";
    const target = normalizeLinkTarget(rawTarget);
    if (!target) continue;
    if (isImageLinkTarget(target)) continue;
    if (!isInternalLinkTarget(target, siteHostname)) continue;
    internalLinks += 1;
  }

  return internalLinks;
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
const normalizedMetaMap = new Map();
const normalizedTitleMap = new Map();
const normalizedSlugMap = new Map();

for (const filePath of files) {
  const relative = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const source = readFileSync(filePath, "utf8");
  const { frontmatter, body } = extractFrontmatter(source);

  const title = extractField(frontmatter, "title");
  const description = extractField(frontmatter, "description");
  const pubDate = extractField(frontmatter, "pubDate");
  const internalLinksBehavior =
    extractField(frontmatter, "internalLinks") ||
    extractField(frontmatter, "internal_links");

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

const hasFailures =
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

if (hasFailures) {
  console.error(
    `[check-editorial-structure] FAIL. validated=${files.length} title_missing=${titleMissing.length} title_meaningless=${titleMeaningless.length} markdown_h1_present=${markdownH1Present.length} title_slug_warning=${titleSlugWarningTotal} internal_links_warning=${internalLinksWarningTotal} skipped_internal_links=${skippedInternalLinksTotal} duplicate_titles=${duplicateTitles.length} duplicate_slugs=${duplicateSlugs.length} missing=${metaMissing.length} short=${metaShort.length} long_fail=${metaLongFail.length} long_warning=${metaLongWarning.length} duplicates=${metaDuplicates.length}`
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
  `[check-editorial-structure] OK. validated=${files.length} title_missing=0 title_meaningless=0 markdown_h1_present=0 title_slug_warning=${titleSlugWarningTotal} internal_links_warning=${internalLinksWarningTotal} skipped_internal_links=${skippedInternalLinksTotal} duplicate_titles=0 duplicate_slugs=0 missing=0 short=0 long_fail=0 long_warning=${metaLongWarning.length} duplicates=0 min_h2=${MIN_H2_SECTIONS} min_section_words=${MIN_SECTION_WORDS} min_internal_links=${MIN_INTERNAL_LINKS}`
);
