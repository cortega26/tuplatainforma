/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

function resolveArg(input, fallback) {
  return path.resolve(REPO_ROOT, input ?? fallback);
}

const strict = process.argv.includes("--strict");
const positional = process.argv.slice(2).filter(arg => arg !== "--strict");

const baselinePath = resolveArg(
  positional[0],
  "docs/reports/rss_snapshot.json"
);
const currentPath = resolveArg(
  positional[1],
  "docs/reports/rss_snapshot_after.json"
);

function loadSnapshot(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return items
    .filter(item => typeof item.link === "string" && item.link.length > 0)
    .map(item => ({
      link: item.link,
      title: item.title ?? "",
      pubDate: item.pubDate ?? "",
      guid: item.guid ?? "",
    }))
    .sort((a, b) => a.link.localeCompare(b.link));
}

const baselineItems = loadSnapshot(baselinePath);
const currentItems = loadSnapshot(currentPath);

const baselineByLink = new Map(baselineItems.map(item => [item.link, item]));
const currentByLink = new Map(currentItems.map(item => [item.link, item]));

const removed = [...baselineByLink.keys()]
  .filter(link => !currentByLink.has(link))
  .sort();
const added = [...currentByLink.keys()]
  .filter(link => !baselineByLink.has(link))
  .sort();

if (removed.length > 0) {
  console.error(`[compare-rss] Removed items detected (${removed.length}):`);
  for (const link of removed) {
    console.error(`- ${link}`);
  }
  process.exit(1);
}

if (added.length > 0) {
  console.warn(`[compare-rss] Added items (${added.length}) are allowed:`);
  for (const link of added) {
    console.warn(`+ ${link}`);
  }
}

if (strict) {
  const baselineSerialized = JSON.stringify(baselineItems);
  const currentSerialized = JSON.stringify(currentItems);
  if (baselineSerialized !== currentSerialized) {
    console.error(
      "[compare-rss] Strict mode failed: RSS snapshots differ beyond set comparison."
    );
    process.exit(1);
  }
}

console.log(
  `[compare-rss] OK. baseline=${baselineItems.length} current=${currentItems.length} removed=0 added=${added.length}`
);
