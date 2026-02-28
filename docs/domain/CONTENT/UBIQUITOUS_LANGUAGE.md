# Ubiquitous Language - Content Context

Fecha: 2026-02-28  
Bounded Context: `Content`  
Aggregate Root: `Article`

## Terms

- `Article`: unidad atómica de publicación editorial en `src/data/blog/*.{md,mdx}`.
- `Content Source`: archivo fuente de un `Article` (incluye frontmatter + body).
- `Identity`: identificador de dominio estable del `Article` (`slug` canónico).
- `Slug`: identificador legible y SEO-critical, único global en artículos publicables.
- `PostId`: identificador técnico de Astro (`entry.id`), derivado de ruta/filename.
- `Public URL`: URL pública resoluble del artículo (`/posts/{slug}/` en estado objetivo).
- `Canonical URL`: URL preferida para indexación; si existe duplicación/alias, apunta a la canónica.
- `Alias URL`: URL legacy que debe seguir resolviendo y redirigir/canonicalizar a la canónica.
- `PubDate`: fecha de publicación editorial efectiva (fuente de verdad de publicación).
- `UpdatedDate`: fecha de actualización editorial sustantiva (no build time).
- `Draft`: bandera de no-publicación. Si `true`, el artículo no debe salir en listados/RSS/sitemap.
- `Featured`: bandera de curación editorial para superficies destacadas.
- `Tags`: etiquetas temáticas (taxonomía flexible) para navegación y relacionados.
- `Category`: clasificación editorial primaria (taxonomía controlada).
- `Publicable Article`: artículo con `draft=false` y contrato válido.
- `Publication Pipeline`: validación de contrato + generación de rutas + RSS + sitemap + build.

## Semántica de estado

- `Publicado`: artículo versionado en rama de publicación (`main`) con `draft=false`.
- `No publicado`: artículo `draft=true` o inválido por contrato (build/CI bloquea).

