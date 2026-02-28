/**
 * Canonical content-path helpers governed by domain identity (`slug`).
 */
export function getCanonicalPathFromSlug(
  slug: string,
  options: { includeBase?: boolean } = {}
): string {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  const localPath = `/posts/${normalizedSlug}/`;
  if (options.includeBase === false) return localPath;

  const rawBase = import.meta.env.BASE_URL || "/";
  const normalizedBase =
    rawBase === "/" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;
  if (!normalizedBase) return localPath;
  if (localPath === "/") return `${normalizedBase}/`;

  return `${normalizedBase}${localPath}`;
}

export function getCanonicalOgImagePathFromSlug(slug: string): string {
  const canonicalPath = getCanonicalPathFromSlug(slug);
  return `${canonicalPath}index.png`;
}

export function getSlugParamFromCanonicalSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, "");
}

