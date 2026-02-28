# Article Aggregate Contract (DDD)

Fecha: 2026-02-28  
Contexto: `Content`  
Aggregate: `Article`

## 1) Decisión de identidad canónica

Decisión: **Estrategia B** (`frontmatter.slug` es identidad de dominio).

### Justificación

- En inventario 2026-02-28, los 11 `slug` existentes coinciden con `post.id` (sin mismatches).
- Los 7 artículos sin `slug` pueden derivarlo de filename actual (`post.id`) sin cambiar URLs públicas.
- Permite separar identidad de negocio (`slug`) de detalle técnico (`post.id`), reduciendo acoplamiento a la estructura de carpetas.
- Habilita invariantes explícitas de SEO (unicidad, estabilidad, migración con alias/canonical).

### Trade-offs y riesgos

- Corto plazo: el runtime actual todavía usa `post.id` para rutas.
- Riesgo futuro: cambios de `slug` sin política de alias podrían romper enlaces.
- Mitigación: `slug` obligatorio + regla de estabilidad post-publicación + mecanismo de alias/redirect antes de admitir cambios de slug.

## 2) Construcción de URL/Canonical/RSS/Breadcrumb

### Estado transicional (sin romper producción)

- Public URL efectiva: mantiene resolución actual (`/posts/{post.id}/`), pero con `slug` normalizado a ese mismo valor para todos los artículos existentes.
- Canonical URL: `https://{site}/posts/{slug}/` (equivale al path actual al normalizar `slug=id`).
- RSS item link: usar la URL canónica (`/posts/{slug}/`), que en transición coincide con la actual.
- Breadcrumbs: último segmento basado en `slug` canónico (mismo valor observable que el actual en transición).

### Estado objetivo

- Public URL: `/posts/{slug}/` (fuente de verdad: `frontmatter.slug`).
- `post.id`: fallback técnico/compatibilidad, no identidad de dominio.
- Si `slug` cambia post-publicación: alias legacy obligatorio + canonical apuntando al slug nuevo + redirect verificable.

## 3) Contrato final propuesto (`Article`)

### 3.1 Campos del contrato

| Campo | Tipo | Requerido | Default | Legacy source | Notas |
|---|---|---|---|---|---|
| `title` | `string` | Sí | - | - | No vacío, rango definido por invariantes. |
| `description` | `string` | Sí | - | - | No vacío, rango SEO definido por invariantes. |
| `slug` | `string` | Sí | derivado de `post.id` solo en migración | filename/`post.id` | Identidad canónica, único en publicables. |
| `pubDate` | `date` (ISO 8601 con zona) | Sí | - | `pubDatetime` | Única fuente de verdad de publicación. |
| `tags` | `string[]` | Sí | `[]` | - | Siempre array, sin nulos. |
| `category` | `string` (enum editorial) | Sí | `general` en transición | inferencia temporal | En objetivo debe venir explícito de authoring. |
| `draft` | `boolean` | Sí | `false` | - | Controla publicabilidad. |
| `featured` | `boolean` | Sí | `false` | - | Curación editorial. |
| `updatedDate` | `date \| null` | No | `null` | `modDatetime` | Si existe, debe ser `>= pubDate`. |
| `author` | `string` | Sí | `SITE.author` | - | Evita nulls en OG/layout. |
| `lang` | `string` | Sí | `es-CL` | - | Idioma editorial por artículo. |
| `canonical` | `string` (URL absoluta) | No | - | `canonicalURL` | Solo si canonical externa o alias gestionado. |
| `heroImage` | `string` | No | - | `ogImage` | Nombre de dominio editorial para imagen principal. |
| `series` | `string` | No | - | - | Agrupación opcional. |
| `cluster` | `string` | No | - | - | Agrupación temática opcional. |

### 3.2 Campos deprecados/prohibidos

| Campo | Estado | Reemplazo |
|---|---|---|
| `pubDatetime` | Deprecated -> Prohibido tras normalización | `pubDate` |
| `modDatetime` | Deprecated -> Prohibido tras normalización | `updatedDate` |
| `canonicalURL` | Deprecated -> Prohibido tras normalización | `canonical` |
| `ogImage` | Deprecated editorialmente (mantener compatibilidad temporal) | `heroImage` |

## 4) Convenciones de naming y semántica

- `pubDate` y `updatedDate` son nombres únicos permitidos para fechas editoriales.
- Todas las fechas deben venir en ISO 8601 con zona explícita (`Z` u offset).
- `slug` en kebab-case.
- `tags` y `category` en minúsculas/kebab-case.

## 5) Política de compatibilidad URL/SEO (no ruptura)

- Regla base: para artículos existentes, `slug` se normaliza al `post.id` actual.
- Resultado: no cambia ninguna URL pública observada en `/posts/...`.
- Si en el futuro existe divergencia `slug != post.id`:
  - Mantener ruta legacy resoluble (redirect 301 o ruta alias).
  - `canonical` del legacy debe apuntar a `/posts/{slug}/`.
  - RSS y sitemap deben listar solo la URL canónica.

## 6) Plan de migración por etapas (diseño)

### Etapa 1 - Enforcement con compatibilidad temporal

- Introducir schema validable en colección Astro con contrato final.
- Permitir lectura legacy solo como compatibilidad de entrada:
  - `pubDatetime -> pubDate`
  - `modDatetime -> updatedDate`
  - `canonicalURL -> canonical`
- Invariantes críticas activas desde inicio: `draft` boolean, fecha publicable válida, `slug` derivable/único.

Gate verificable:
- `check:frontmatter` sin errores críticos.
- `astro check` y `build` en verde.
- Snapshot de rutas públicas igual al baseline.

### Etapa 2 - Normalización idempotente de frontmatter

- Script idempotente que:
  - agrega faltantes (`slug`, `category`, `featured`, `draft`, `tags`, `lang`);
  - renombra legacy a contrato final (`pubDatetime`/`modDatetime`/`canonicalURL`);
  - no altera slugs publicados existentes;
  - deriva `slug` faltante desde filename (`post.id`) para no romper URLs.

Gate verificable:
- Segunda ejecución del script sin cambios (`git diff` vacío).
- 0 archivos con campos deprecados.
- 0 duplicados de `slug` en publicables.

### Etapa 3 - Integración runtime al contrato final

- Cambiar módulos de runtime para consumir `slug`, `pubDate`, `updatedDate`.
- Mantener compatibilidad de rutas legacy cuando exista divergencia histórica.
- Garantizar salida SEO:
  - RSS links canónicos únicos.
  - sitemap sin duplicados de alias.
  - breadcrumbs consistentes con canónica.

Gate verificable:
- Comparación antes/después de rutas públicas resueltas.
- Validación de `/rss.xml` y `sitemap-index.xml` sin regresiones.

