 
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

function parseCliArgs(argv) {
  const args = {
    out: path.join(
      REPO_ROOT,
      "docs",
      "reports",
      "routes_snapshot_before.json"
    ),
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") {
      args.out = path.resolve(REPO_ROOT, argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

function toSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listContentFiles(baseDir) {
  const result = [];
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
      result.push(absolutePath);
    }
  }

  return result.sort();
}

function getRouteFromRelativePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const withoutExt = normalized.replace(/\.(md|mdx)$/i, "");
  const segments = withoutExt.split("/").filter(Boolean);
  const slug = segments.at(-1) ?? "";
  const folders = segments
    .slice(0, -1)
    .filter(segment => !segment.startsWith("_"))
    .map(segment => toSlug(segment));
  return `/posts/${[...folders, slug].filter(Boolean).join("/")}/`;
}

const args = parseCliArgs(process.argv.slice(2));
const files = listContentFiles(BLOG_DIR);

const routes = files.map(filePath => {
  const relativePath = path.relative(BLOG_DIR, filePath);
  return {
    file: relativePath.replace(/\\/g, "/"),
    route: getRouteFromRelativePath(relativePath),
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  total: routes.length,
  routes,
};

function toComparableShape(value) {
  if (!value || typeof value !== "object") return null;
  const maybeRoutes = Array.isArray(value.routes) ? value.routes : null;
  if (!maybeRoutes) return null;
  return {
    total: Number(value.total ?? maybeRoutes.length),
    routes: maybeRoutes.map(entry => ({
      file: String(entry.file ?? ""),
      route: String(entry.route ?? ""),
    })),
  };
}

const nextComparable = toComparableShape(payload);
const hasPreviousSnapshot = existsSync(args.out);
if (hasPreviousSnapshot) {
  try {
    const previousRaw = readFileSync(args.out, "utf8");
    const previousParsed = JSON.parse(previousRaw);
    const previousComparable = toComparableShape(previousParsed);
    if (
      previousComparable &&
      nextComparable &&
      JSON.stringify(previousComparable) === JSON.stringify(nextComparable)
    ) {
      console.log(
        `[snapshot-routes] No route changes. Kept existing snapshot at ${args.out}`
      );
      process.exit(0);
    }
  } catch {
    // Fall through and overwrite with a fresh valid snapshot.
  }
}

mkdirSync(path.dirname(args.out), { recursive: true });
writeFileSync(args.out, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`[snapshot-routes] Saved ${routes.length} routes to ${args.out}`);
