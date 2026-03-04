import type { APIRoute } from "astro";
import { SITE } from "@/config";

// Derive base path from the configured website URL (e.g. /tuplatainforma)
const BASE = new URL(SITE.website).pathname.replace(/\/$/, "");

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

# No indexar el generador de OG images ni el índice de búsqueda interna
Disallow: ${BASE}/og.png
Disallow: ${BASE}/pagefind/

# Evitar indexar paginación de etiquetas (contenido duplicado de baja prioridad)
Disallow: ${BASE}/tags/*/

# La URL canónica del sitio está en el sitemap
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
