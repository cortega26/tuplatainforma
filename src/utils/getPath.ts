import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Builds an internal URL path that respects Astro's configured `base`.
 * Examples:
 * - getPath("posts/mi-articulo") => "/tuplatainforma/posts/mi-articulo"
 * - getPath("/posts/mi-articulo") => "/tuplatainforma/posts/mi-articulo"
 */
export function getPath(path: string): string {
  const rawBase = import.meta.env.BASE_URL || "/";
  const normalizedBase =
    rawBase === "/" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) return normalizedPath;
  if (normalizedPath === "/") return `${normalizedBase}/`;

  // Avoid duplicating base when a caller already passed it.
  if (
    normalizedPath === normalizedBase ||
    normalizedPath.startsWith(`${normalizedBase}/`)
  ) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Returns a site-local path for a blog post (ALWAYS leading slash, NEVER includes base).
 * Examples:
 * - "/posts/my-post"
 * - "/posts/subdir/my-post"
 */
export function getPostPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(Boolean)
    .filter(path => !path.startsWith("_"))
    .slice(0, -1)
    .map(segment => slugifyStr(segment));

  const basePath = includeBase ? "posts" : "";

  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  const parts =
    !pathSegments || pathSegments.length < 1
      ? [basePath, slug]
      : [basePath, ...pathSegments, slug];

  return "/" + parts.filter(Boolean).join("/");
}
