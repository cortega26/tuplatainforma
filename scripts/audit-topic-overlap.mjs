import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  CANONICAL_TOPIC_REGISTRY,
  HARDENED_OWNERSHIP_CLUSTERS,
  allowsGeneralCategoryInCluster,
  getAllowedCategoriesForCluster,
  getCanonicalTopicEntry,
  getTransitionalOwnershipEntry,
  isDocumentedTransitionalPlacement,
} from "../src/config/editorial-topic-policy.mjs";
import { HUB_ARTICLE_ASSIGNMENTS } from "../src/config/editorial-hub-model.mjs";

const REPO_ROOT = process.cwd();
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

const STOPWORDS = new Set([
  "a",
  "al",
  "ante",
  "bajo",
  "cabe",
  "como",
  "con",
  "contra",
  "cual",
  "cuando",
  "chile",
  "de",
  "del",
  "desde",
  "donde",
  "durante",
  "e",
  "el",
  "ella",
  "en",
  "entre",
  "era",
  "es",
  "esta",
  "este",
  "esto",
  "fue",
  "ha",
  "hasta",
  "la",
  "las",
  "lo",
  "los",
  "mas",
  "me",
  "mi",
  "mis",
  "o",
  "para",
  "pero",
  "por",
  "que",
  "se",
  "segun",
  "si",
  "sin",
  "sobre",
  "su",
  "sus",
  "te",
  "tras",
  "tu",
  "tus",
  "un",
  "una",
  "uno",
  "y",
  "2025",
  "2026",
  "2027",
  "2028",
]);

function listMarkdownFiles(dir) {
  return readdirSync(dir)
    .filter(entry => /\.(md|mdx)$/i.test(entry))
    .sort()
    .map(entry => path.join(dir, entry));
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value) {
  return normalize(value)
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => token.length > 2)
    .filter(token => !STOPWORDS.has(token));
}

function toTokenSet(value) {
  return new Set(tokenize(value));
}

function jaccard(setA, setB) {
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection += 1;
  }
  return intersection / union.size;
}

function readArticle(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = frontmatterMatch ? yaml.load(frontmatterMatch[1]) ?? {} : {};
  const body = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;
  const metaMatch = raw.match(
    /META:\s*keyword_primary="([^"]+)"\s*\|\s*intent="([^"]+)"(?:\s*\|\s*cluster="([^"]+)")?/i
  );
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map(match =>
    match[1].trim()
  );

  return {
    filePath,
    file: path.basename(filePath),
    slug: frontmatter.slug,
    title: frontmatter.title,
    category: frontmatter.category,
    cluster: frontmatter.cluster,
    draft: frontmatter.draft ?? false,
    unlisted: frontmatter.unlisted ?? false,
    topicRole:
      typeof frontmatter.topicRole === "string" ? frontmatter.topicRole : "",
    canonicalTopic:
      typeof frontmatter.canonicalTopic === "string"
        ? frontmatter.canonicalTopic
        : "",
    description: frontmatter.description,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    keywordPrimary: metaMatch?.[1]?.trim() ?? "",
    intent: metaMatch?.[2]?.trim() ?? "",
    metaCluster: metaMatch?.[3]?.trim() ?? "",
    titleTokens: toTokenSet(frontmatter.title),
    slugTokens: toTokenSet(frontmatter.slug),
    descriptionTokens: toTokenSet(frontmatter.description),
    headingTokens: toTokenSet(headings.join(" ")),
  };
}

function classifyPair(a, b) {
  const sameCluster = a.cluster === b.cluster;
  const titleSimilarity = jaccard(a.titleTokens, b.titleTokens);
  const slugSimilarity = jaccard(a.slugTokens, b.slugTokens);
  const descriptionSimilarity = jaccard(a.descriptionTokens, b.descriptionTokens);
  const headingSimilarity = jaccard(a.headingTokens, b.headingTokens);
  const keywordOverlap =
    a.keywordPrimary && b.keywordPrimary
      ? jaccard(toTokenSet(a.keywordPrimary), toTokenSet(b.keywordPrimary))
      : 0;
  const exactKeyword =
    a.keywordPrimary &&
    b.keywordPrimary &&
    normalize(a.keywordPrimary) === normalize(b.keywordPrimary);
  const score =
    (sameCluster ? 0.28 : 0) +
    titleSimilarity * 0.28 +
    slugSimilarity * 0.16 +
    descriptionSimilarity * 0.16 +
    headingSimilarity * 0.08 +
    keywordOverlap * 0.12;
  const strongSignals = [
    titleSimilarity >= 0.12,
    slugSimilarity >= 0.18,
    descriptionSimilarity >= 0.14,
    headingSimilarity >= 0.2,
    keywordOverlap >= 0.3,
  ].filter(Boolean).length;
  const reviewSignals = [
    titleSimilarity >= 0.08,
    slugSimilarity >= 0.15,
    descriptionSimilarity >= 0.08,
    headingSimilarity >= 0.12,
    keywordOverlap >= 0.2,
  ].filter(Boolean).length;

  let type = null;
  let severity = null;

  if (
    exactKeyword ||
    (sameCluster &&
      titleSimilarity >= 0.22 &&
      (descriptionSimilarity >= 0.18 || headingSimilarity >= 0.22))
  ) {
    type = "candidate_strong_overlap";
    severity = "alta";
  } else if (sameCluster && strongSignals >= 2) {
    type = "candidate_same_intent";
    severity = "media";
  } else if (sameCluster && score >= 0.3 && reviewSignals >= 2) {
    type = "candidate_cluster_review";
    severity = "baja";
  }

  return {
    type,
    severity,
    score,
    titleSimilarity,
    slugSimilarity,
    descriptionSimilarity,
    headingSimilarity,
    keywordOverlap,
    sameCluster,
  };
}

function formatPair(candidate) {
  const {
    severity,
    score,
    titleSimilarity,
    slugSimilarity,
    descriptionSimilarity,
    headingSimilarity,
    keywordOverlap,
    left,
    right,
    type,
  } = candidate;

  return [
    `[${severity}] ${type} score=${score.toFixed(3)}`,
    `  - ${left.slug} <-> ${right.slug}`,
    `  - title=${titleSimilarity.toFixed(3)} slug=${slugSimilarity.toFixed(3)} desc=${descriptionSimilarity.toFixed(3)} h2=${headingSimilarity.toFixed(3)} keyword=${keywordOverlap.toFixed(3)}`,
    `  - "${left.title}"`,
    `  - "${right.title}"`,
  ].join("\n");
}

const files = listMarkdownFiles(BLOG_DIR);
const articles = files.map(readArticle);
const articlesBySlug = new Map(articles.map(article => [article.slug, article]));

const metadataWarnings = [];
const transitionalPlacements = [];
for (const article of articles) {
  if (
    article.draft !== true &&
    HARDENED_OWNERSHIP_CLUSTERS.includes(article.cluster) &&
    (!article.topicRole || !article.canonicalTopic)
  ) {
    metadataWarnings.push(
      `[ownership] ${article.file}: missing topicRole/canonicalTopic in hardened cluster "${article.cluster}"`
    );
  }

  const allowedCategories = getAllowedCategoriesForCluster(article.cluster);
  if (
    allowedCategories &&
    !allowedCategories.includes(article.category) &&
    article.category !== "general"
  ) {
    metadataWarnings.push(
      `[taxonomy] ${article.file}: category="${article.category}" does not match cluster="${article.cluster}"`
    );
  }

  if (
    article.draft !== true &&
    HARDENED_OWNERSHIP_CLUSTERS.includes(article.cluster) &&
    article.canonicalTopic &&
    !getCanonicalTopicEntry(article.cluster, article.canonicalTopic)
  ) {
    metadataWarnings.push(
      `[ownership] ${article.file}: canonicalTopic="${article.canonicalTopic}" is not registered for hardened cluster "${article.cluster}"`
    );
  }

  if (
    article.metaCluster &&
    normalize(article.metaCluster) !== normalize(article.cluster)
  ) {
    metadataWarnings.push(
      `[metadata] ${article.file}: META cluster="${article.metaCluster}" differs from frontmatter cluster="${article.cluster}"`
    );
  }

  const transitionalEntry = getTransitionalOwnershipEntry(article.slug);
  if (transitionalEntry) {
    if (
      !isDocumentedTransitionalPlacement({
        slug: article.slug,
        cluster: article.cluster,
        category: article.category,
      })
    ) {
      metadataWarnings.push(
        `[transitional] ${article.file}: documented transitional placement expects cluster="${transitionalEntry.currentCluster}" and category="${transitionalEntry.currentCategory}", found cluster="${article.cluster}" and category="${article.category}"`
      );
    } else {
      transitionalPlacements.push(
        [
          article.slug,
          `current=${article.cluster}/${article.category}`,
          `canonical=${transitionalEntry.canonicalOwnerCluster}`,
          `topic=${transitionalEntry.canonicalTopic}`,
          `target=${transitionalEntry.targetHubPath}`,
        ].join(" | ")
      );
    }

    if (article.topicRole || article.canonicalTopic) {
      metadataWarnings.push(
        `[transitional] ${article.file}: transitional article should not declare hardened-style ownership metadata until it reaches its canonical cluster`
      );
    }
  } else if (
    article.draft !== true &&
    article.category === "general" &&
    !allowsGeneralCategoryInCluster({
      cluster: article.cluster,
      topicRole: article.topicRole,
      unlisted: article.unlisted,
    }) &&
    !(article.unlisted === true && article.topicRole === "reference")
  ) {
    metadataWarnings.push(
      `[taxonomy] ${article.file}: category="general" requires a documented transitional placement or an explicit unlisted reference rationale`
    );
  }
}

const ownerGroups = new Map();
for (const article of articles) {
  if (
    article.draft === true ||
    article.topicRole !== "owner" ||
    !article.canonicalTopic
  ) {
    continue;
  }

  const groupKey = `${article.cluster}::${article.canonicalTopic}`;
  ownerGroups.set(groupKey, [...(ownerGroups.get(groupKey) ?? []), article.file]);
}

for (const [groupKey, files] of ownerGroups.entries()) {
  if (files.length < 2) continue;
  metadataWarnings.push(
    `[ownership] duplicate owner declaration for "${groupKey}": ${files.join(", ")}`
  );
}

const ownershipSummary = [];
for (const cluster of HARDENED_OWNERSHIP_CLUSTERS) {
  const clusterRegistry = CANONICAL_TOPIC_REGISTRY[cluster] ?? {};
  const articlesByTopic = new Map();

  for (const article of articles) {
    if (article.draft === true || article.cluster !== cluster || !article.canonicalTopic) {
      continue;
    }
    const topicArticles = articlesByTopic.get(article.canonicalTopic) ?? [];
    topicArticles.push(article);
    articlesByTopic.set(article.canonicalTopic, topicArticles);
  }

  for (const canonicalTopic of Object.keys(clusterRegistry).sort()) {
    const topicArticles = articlesByTopic.get(canonicalTopic) ?? [];
    const owners = topicArticles.filter(article => article.topicRole === "owner");
    const supports = topicArticles.filter(article => article.topicRole === "support");
    const references = topicArticles.filter(article => article.topicRole === "reference");
    ownershipSummary.push(
      [
        cluster,
        canonicalTopic,
        `owner=${owners.map(article => article.slug).join(",") || "-"}`,
        `support=${supports.map(article => article.slug).join(",") || "-"}`,
        `reference=${references.map(article => article.slug).join(",") || "-"}`,
      ].join(" | ")
    );
  }
}

const hubWarnings = [];
const hubOwnershipSummary = [];
for (const [hubCluster, assignments] of Object.entries(HUB_ARTICLE_ASSIGNMENTS)) {
  const duplicateAssignments = new Set();
  const seenSlugs = new Set();
  for (const bucket of ["core", "related"]) {
    for (const item of assignments[bucket]) {
      if (seenSlugs.has(item.slug)) duplicateAssignments.add(item.slug);
      seenSlugs.add(item.slug);
    }
  }

  if (duplicateAssignments.size > 0) {
    hubWarnings.push(
      `[hub] ${hubCluster}: duplicated slug assignments detected (${[...duplicateAssignments].join(", ")})`
    );
  }

  for (const item of assignments.core) {
    const article = articlesBySlug.get(item.slug);
    if (!article) {
      hubWarnings.push(
        `[hub-core] ${hubCluster}: slug "${item.slug}" is declared in hub config but no article was found`
      );
      continue;
    }

    const transitionalEntry = getTransitionalOwnershipEntry(article.slug);
    const coreMatchesOwner =
      article.cluster === hubCluster ||
      transitionalEntry?.canonicalOwnerCluster === hubCluster;

    if (!coreMatchesOwner) {
      hubWarnings.push(
        `[hub-core] ${hubCluster}: "${item.slug}" is marked core but its canonical owner is "${transitionalEntry?.canonicalOwnerCluster ?? article.cluster}"`
      );
    }
  }

  for (const item of assignments.related) {
    const article = articlesBySlug.get(item.slug);
    if (!article) {
      hubWarnings.push(
        `[hub-related] ${hubCluster}: slug "${item.slug}" is declared in hub config but no article was found`
      );
      continue;
    }

    const transitionalEntry = getTransitionalOwnershipEntry(article.slug);
    const relatedMatchesForeignOwner =
      article.cluster !== hubCluster ||
      (transitionalEntry &&
        transitionalEntry.canonicalOwnerCluster !== hubCluster);

    if (!relatedMatchesForeignOwner) {
      hubWarnings.push(
        `[hub-related] ${hubCluster}: "${item.slug}" is marked related but still resolves to the same canonical owner cluster`
      );
    }
  }

  hubOwnershipSummary.push(
    [
      hubCluster,
      `core=${assignments.core.map(item => item.slug).join(",") || "-"}`,
      `related=${assignments.related.map(item => item.slug).join(",") || "-"}`,
    ].join(" | ")
  );
}

const candidates = [];
for (let index = 0; index < articles.length; index += 1) {
  for (let otherIndex = index + 1; otherIndex < articles.length; otherIndex += 1) {
    const left = articles[index];
    const right = articles[otherIndex];
    const pair = classifyPair(left, right);
    if (!pair.type) continue;
    candidates.push({ ...pair, left, right });
  }
}

candidates.sort((a, b) => b.score - a.score);

console.log("[audit-topic-overlap] Corpus summary");
console.log(
  `- articles=${articles.length} metadata_warnings=${metadataWarnings.length} candidates=${candidates.length}`
);
console.log("");

console.log("[audit-topic-overlap] Hardened ownership summary");
for (const line of ownershipSummary) {
  console.log(`- ${line}`);
}
console.log("");

console.log("[audit-topic-overlap] Transitional placement summary");
if (transitionalPlacements.length === 0) {
  console.log("- none");
} else {
  for (const line of transitionalPlacements) {
    console.log(`- ${line}`);
  }
}
console.log("");

console.log("[audit-topic-overlap] Hub ownership summary");
for (const line of hubOwnershipSummary) {
  console.log(`- ${line}`);
}
console.log("");

if (metadataWarnings.length > 0) {
  console.log("[audit-topic-overlap] Metadata and taxonomy warnings");
  for (const warning of metadataWarnings) {
    console.log(`- ${warning}`);
  }
  console.log("");
}

if (hubWarnings.length > 0) {
  console.log("[audit-topic-overlap] Hub ownership warnings");
  for (const warning of hubWarnings) {
    console.log(`- ${warning}`);
  }
  console.log("");
}

console.log("[audit-topic-overlap] Top candidate pairs");
for (const candidate of candidates.slice(0, 20)) {
  console.log(formatPair(candidate));
}
