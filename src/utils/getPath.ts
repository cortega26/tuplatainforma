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
