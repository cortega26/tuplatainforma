import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Returns a site-local path for a blog post (ALWAYS leading slash, NEVER includes base).
 * Examples:
 * - "/posts/my-post"
 * - "/posts/subdir/my-post"
 */
export function getPath(
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
