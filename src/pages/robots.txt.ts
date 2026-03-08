import type { APIRoute } from "astro";
import { SITE } from "@/config";

// Derive base path from the configured website URL (e.g. "/" or "/subpath")
const BASE = new URL(SITE.website).pathname.replace(/\/$/, "");

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

# No indexar el generador de OG images ni el índice de búsqueda interna
Disallow: ${BASE}/og.png
Disallow: ${BASE}/pagefind/

# /search/ y /tags/ quedan crawlables para que los bots vean el noindex
# pero se excluyen del sitemap y de los objetivos de indexación.

# La URL canónica del sitio está en el sitemap
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
