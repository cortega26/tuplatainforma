# PROJECT_CONTEXT_MASTER

## 0. Resumen ejecutivo
El repositorio es un sitio estático en **Astro 5** (fork/customización sobre base AstroPaper) enfocado en educación financiera para Chile, con contenido editorial y una suite de calculadoras financieras.
El proyecto está funcional en producción bajo subpath (`/tuplatainforma`) y combina contenido Markdown/MDX con páginas `.astro` de lógica cliente.
Las personalizaciones más relevantes son: homepage editorial, calculadoras, helpers de rutas para subpath, mejoras de UX (breadcrumbs/back button/reveal), y componentes de indicadores económicos.
Los riesgos principales están en deuda de mantenibilidad y consistencia operativa: valores financieros hardcodeados con fecha, lógica duplicada, falta de tests, y mezcla de gestores de paquetes/workflows.

## 1. Stack técnico

### Runtime y package management
- **Node objetivo:** 20 (`README.md`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`).
- **Gestores en uso (inconsistente):** `pnpm` y `npm`.
- **Lockfiles presentes:** `pnpm-lock.yaml` y `package-lock.json`.

### Dependencias principales (relevantes)

| Paquete | Spec (`package.json`) | Resuelto (`pnpm-lock.yaml`) | Uso principal |
|---|---|---|---|
| `astro` | `^5.16.6` | `5.17.3` | Framework SSG |
| `@astrojs/mdx` | `^4.3.13` | `4.3.13` | Soporte MDX |
| `@astrojs/sitemap` | `^3.6.0` | `3.7.0` | Sitemap |
| `@astrojs/rss` | `^4.0.14` | `4.0.15` | Feed RSS |
| `tailwindcss` | `^4.1.18` | `4.2.1` | Estilos |
| `@tailwindcss/vite` | `^4.1.18` | `4.2.1` | Integración Tailwind-Vite |
| `@tailwindcss/typography` | `^0.5.19` | `0.5.19` | Prose styles |
| `pagefind` | `^1.4.0` | `1.4.0` | Índice de búsqueda estática |
| `@pagefind/default-ui` | `^1.4.0` | `1.4.0` | UI buscador |
| `dayjs` | `^1.11.19` | `1.11.19` | Fechas y timezone |
| `remark-toc` | `^9.0.0` | `9.0.0` | TOC Markdown |
| `remark-collapse` | `^0.1.2` | `0.1.2` | Colapso de TOC |
| `@shikijs/transformers` | `^3.20.0` | `3.23.0` | Transformadores de código |
| `satori` | `^0.18.3` | `0.18.4` | Plantillas OG SVG |
| `@resvg/resvg-js` | `^2.6.2` | `2.6.2` | Render SVG->PNG |
| `sharp` | `^0.34.5` | `0.34.5` | Pipeline de imágenes |
| `slugify` | `^1.6.6` | `1.6.6` | Slugs |
| `lodash.kebabcase` | `^4.1.1` | `4.1.1` | Slug fallback |
| `typescript` | `^5.9.3` | `5.9.3` | Tipado |
| `eslint` | `^9.39.2` | `9.39.3` | Lint |
| `eslint-plugin-astro` | `^1.5.0` | `1.6.0` | Lint Astro |
| `@astrojs/check` | `^0.9.2` | `0.9.6` | Typecheck Astro |
| `prettier` | `^3.7.4` | `3.8.1` | Formato |
| `prettier-plugin-astro` | `^0.14.1` | `0.14.1` | Formato Astro |

### Configuración Astro relevante
Archivo: `astro.config.ts`

```ts
site: SITE.website
base: "/tuplatainforma"
integrations: [sitemap(...), mdx()]
markdown.remarkPlugins: [remarkToc, remarkCollapse]
markdown.shikiConfig.transformers: [transformerFileName, ...]
vite.plugins: [tailwindcss()]
image: { responsiveStyles: true, layout: "constrained" }
env.schema: PUBLIC_GOOGLE_SITE_VERIFICATION
experimental: { preserveScriptOrder: true, fonts: [...] }
```

Puntos clave:
- `site` y `base` dependen de `src/config.ts` (`SITE.website` y subpath).
- Sitemap filtra `/archives` según `SITE.showArchives`.
- No hay adapter explícito: comportamiento estático por defecto.

## 2. Arquitectura de proyecto (visión macro)

### Estructura resumida

```text
.
├─ src/
│  ├─ pages/                   # rutas Astro + endpoints
│  │  ├─ calculadoras/         # 10 calculadoras cliente-side
│  │  ├─ posts/                # listing paginado + detalle + OG dinámico
│  │  ├─ tags/                 # index + listing paginado por tag
│  │  ├─ archives/             # archivo anual/mensual
│  │  ├─ search.astro          # Pagefind UI
│  │  ├─ rss.xml.ts / robots.txt.ts / og.png.ts
│  ├─ data/blog/               # contenido Markdown/MDX (colección blog)
│  ├─ components/              # componentes UI y utilitarios visuales
│  ├─ layouts/                 # Layout, Main, PostDetails
│  ├─ utils/                   # paths, tags, OG, indicadores, etc.
│  ├─ styles/                  # Tailwind v4 + typography custom
│  ├─ config.ts                # SITE config
│  └─ content.config.ts        # colección blog
├─ public/                     # favicon, OG estático, pagefind generado
├─ .github/workflows/          # CI y deploy
├─ package.json
├─ pnpm-lock.yaml
└─ package-lock.json
```

### Flujo de build/deploy (inferido del repo)
- `pnpm run build` (script `build`):
  1. `astro check`
  2. `astro build`
  3. `pagefind --site dist`
  4. `cp -r dist/pagefind public/`
- CI (`.github/workflows/ci.yml`): usa `pnpm install`, lint, format check, build.
- Deploy (`.github/workflows/deploy.yml`): usa `npm ci` + `npm run build` + GitHub Pages.
- Dockerfile: build con `pnpm`, runtime con `nginx`.

### Convenciones observadas
- Alias `@/*` en `tsconfig.json`.
- URLs internas usan `getPath()` (`src/utils/getPath.ts`) para respetar `BASE_URL` y evitar duplicación de base.
- Colección `blog` desde `src/data/blog` (`src/content.config.ts`), con schema zod.
- Slugs de tags y títulos normalizados con `slugifyStr` (`src/utils/slugify.ts`).
- Proyecto en español (`SITE.lang = "es"`, textos de UI en español).

## 3. Customizaciones y divergencias del tema base

### Customizaciones confirmadas del proyecto
- **Suite de calculadoras financieras** (`src/pages/calculadoras/*.astro`): sueldo líquido, APV, UF, crédito consumo, tarjeta, prepago, cesantía, jubilación, renegociación, reajuste arriendo.
- **Homepage editorial personalizada** (`src/pages/index.astro`): hero + secundarias + placeholders + CTA calculadoras + animación `RevealOnScroll`.
- **Componente de valor económico dinámico para contenido** (`src/components/IndicadorEconomico.astro`) usando `mindicador.cl` vía `src/utils/indicadores.ts`, consumido en MDX (`src/data/blog/que-es-el-apv.mdx`).
- **UX de navegación para subpath**: `getPath`, breadcrumbs robustos (`src/components/Breadcrumb.astro`), back button con `sessionStorage` (`src/components/BackButton.astro`).
- **Tarjetas y placeholders por categoría**: `ArticlePlaceholder.astro` + `categoryIcons.ts`.
- **Relacionado por score de tags** (`src/components/RelatedPosts.astro`).
- **Buscador Pagefind localizado al español** (`src/pages/search.astro`) + bundle en `/pagefind/`.
- **OG dinámico** para sitio y posts (`src/pages/og.png.ts`, `src/pages/posts/[...slug]/index.png.ts`, `src/utils/generateOgImages.ts`).

### Probables overrides de AstroPaper (con incertidumbre explícita)
No hay snapshot del upstream dentro del repo para diff directo; por lo tanto estos se clasifican como **probables overrides** por nombre/ruta y cambios de comportamiento:
- `src/layouts/Layout.astro`, `src/layouts/Main.astro`, `src/layouts/PostDetails.astro`.
- `src/components/Header.astro`, `Footer.astro`, `Card.astro`, `Tag.astro`, `Datetime.astro`, `Pagination.astro`.
- `src/styles/global.css` y `src/styles/typography.css`.

## 4. Inventario de contenido

### Artículos

| Nombre/Slug | Tipo | Ubicación (ruta) | Descripción breve | Estado |
|---|---|---|---|---|
| `como-calcular-sueldo-liquido` | Artículo MD | `src/data/blog/como-calcular-sueldo-liquido.md` | Guía de sueldo líquido y descuentos | Publicado |
| `como-cambiarse-de-afp` | Artículo MD | `src/data/blog/como-cambiarse-de-afp.md` | Cambio de AFP y reforma | Publicado |
| `cuanto-descuenta-la-afp-de-tu-sueldo` | Artículo MD | `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md` | Desglose descuento AFP | Publicado |
| `fondos-afp-a-b-c-d-e` | Artículo MD | `src/data/blog/fondos-afp-a-b-c-d-e.md` | Fondos A-E y riesgo | Publicado |
| `fraude-tarjeta-que-hacer` | Artículo MD | `src/data/blog/fraude-tarjeta-que-hacer.md` | Qué hacer ante fraude | Publicado |
| `informe-deudas-cmf-vs-dicom` | Artículo MD | `src/data/blog/informe-deudas-cmf-vs-dicom.md` | CMF vs DICOM | Publicado |
| `que-es-el-apv` | Artículo MDX | `src/data/blog/que-es-el-apv.mdx` | APV régimen A/B + indicadores dinámicos | Publicado |
| `que-es-la-cuenta-2-afp` | Artículo MD | `src/data/blog/que-es-la-cuenta-2-afp.md` | Cuenta 2 AFP | Publicado |
| `que-es-la-uf` | Artículo MD | `src/data/blog/que-es-la-uf.md` | UF e impacto práctico | Publicado |
| `renegociacion-superir` | Artículo MD | `src/data/blog/renegociacion-superir.md` | Renegociación Superir | Publicado |
| `seguro-de-cesantia` | Artículo MD | `src/data/blog/seguro-de-cesantia.md` | CIC/FCS y cobro | Publicado |

### Páginas

| Nombre/Slug | Tipo | Ubicación (ruta) | Descripción breve | Estado |
|---|---|---|---|---|
| `/` | Página | `src/pages/index.astro` | Home editorial | Publicado |
| `/about/` | Página | `src/pages/about.astro` | Nosotros + aviso legal | Publicado |
| `/posts/` | Página dinámica | `src/pages/posts/[...page].astro` | Listado paginado de artículos | Publicado |
| `/posts/:slug/` | Página dinámica | `src/pages/posts/[...slug]/index.astro` | Detalle de artículo | Publicado |
| `/tags/` | Página | `src/pages/tags/index.astro` | Índice de etiquetas | Publicado |
| `/tags/:tag/` | Página dinámica | `src/pages/tags/[tag]/[...page].astro` | Artículos por etiqueta | Publicado |
| `/archives/` | Página | `src/pages/archives/index.astro` | Archivo por año/mes | Publicado |
| `/search/` | Página | `src/pages/search.astro` | Búsqueda Pagefind | Publicado |
| `/404` | Página | `src/pages/404.astro` | No encontrado | Publicado |

### Calculadoras

| Nombre/Slug | Tipo | Ubicación (ruta) | Descripción breve | Estado |
|---|---|---|---|---|
| `sueldo-liquido` | Calculadora | `src/pages/calculadoras/sueldo-liquido.astro` | Sueldo líquido chileno | Publicado |
| `conversor-uf` | Calculadora | `src/pages/calculadoras/conversor-uf.astro` | UF ↔ CLP | Publicado |
| `apv` | Calculadora | `src/pages/calculadoras/apv.astro` | APV régimen A vs B | Publicado |
| `tarjeta-credito` | Calculadora | `src/pages/calculadoras/tarjeta-credito.astro` | Costo real por pago mínimo | Publicado |
| `simulador-jubilacion` | Calculadora | `src/pages/calculadoras/simulador-jubilacion.astro` | Proyección AFP | Publicado |
| `credito-consumo` | Calculadora | `src/pages/calculadoras/credito-consumo.astro` | Cuota, intereses y CAE | Publicado |
| `seguro-cesantia` | Calculadora | `src/pages/calculadoras/seguro-cesantia.astro` | CIC/FCS estimado | Publicado |
| `simulador-renegociacion` | Calculadora | `src/pages/calculadoras/simulador-renegociacion.astro` | Elegibilidad Superir | Publicado |
| `prepago-credito` | Calculadora | `src/pages/calculadoras/prepago-credito.astro` | Prepagar vs invertir | Publicado |
| `reajuste-arriendo` | Calculadora | `src/pages/calculadoras/reajuste-arriendo.astro` | UF/IPC/pesos | Publicado |

### Herramientas / otros endpoints

| Nombre/Slug | Tipo | Ubicación (ruta) | Descripción breve | Estado |
|---|---|---|---|---|
| `/rss.xml` | Endpoint | `src/pages/rss.xml.ts` | Feed RSS | Publicado |
| `/robots.txt` | Endpoint | `src/pages/robots.txt.ts` | Robots + sitemap | Publicado |
| `/og.png` | Endpoint | `src/pages/og.png.ts` | OG del sitio dinámico | Publicado |
| `/posts/:slug/index.png` | Endpoint dinámico | `src/pages/posts/[...slug]/index.png.ts` | OG dinámico por post sin `ogImage` | Publicado |
| `about.md.bak` | Legacy | `src/pages/about.md.bak` | Versión previa de página About | Experimental/Legacy |
| `Card.astro.bak` | Legacy | `src/components/Card.astro.bak` | Versión previa de tarjeta | Experimental/Legacy |

## 5. Rutas y páginas

### Base pública
- `astro.config.ts` define `base: "/tuplatainforma"`.
- Todas las rutas públicas salen con prefijo `/tuplatainforma` en producción (GitHub Pages).

### Mapa de rutas públicas (site-local)
- `/`
- `/about/`
- `/search/`
- `/archives/` (si `SITE.showArchives`)
- `/calculadoras/`
- `/calculadoras/apv/`
- `/calculadoras/conversor-uf/`
- `/calculadoras/credito-consumo/`
- `/calculadoras/prepago-credito/`
- `/calculadoras/reajuste-arriendo/`
- `/calculadoras/seguro-cesantia/`
- `/calculadoras/simulador-jubilacion/`
- `/calculadoras/simulador-renegociacion/`
- `/calculadoras/sueldo-liquido/`
- `/calculadoras/tarjeta-credito/`
- `/posts/` (paginado)
- `/posts/:slug/` (11 slugs actuales)
- `/posts/:slug/index.png` (solo posts sin `ogImage` y con `SITE.dynamicOgImage=true`)
- `/tags/`
- `/tags/:tag/` (36 tags actuales)
- `/rss.xml`
- `/robots.txt`
- `/og.png`
- `/404`

### Rutas dinámicas y generación
- `src/pages/posts/[...page].astro` usa `paginate(getSortedPosts(posts), { pageSize: SITE.postPerPage })`.
  - Con `SITE.postPerPage=8` y 11 posts publicados: **2 páginas** (`/posts/`, `/posts/2/`).
- `src/pages/posts/[...slug]/index.astro` usa `getStaticPaths` basado en `getPostPath(...)`.
- `src/pages/tags/[tag]/[...page].astro` genera rutas por tag con `paginate`.
  - 36 tags actuales; max 5 posts por tag; con pageSize=8 -> hoy sólo primera página por tag.
- `src/pages/posts/[...slug]/index.png.ts` genera OG por post sin imagen definida.

## 6. Funcionalidades clave

### Componentes/feature list
- `src/components/Breadcrumb.astro`: migas de pan robustas para subpath/base.
- `src/components/BackButton.astro`: navegación contextual por `sessionStorage.backUrl`.
- `src/components/RevealOnScroll.astro`: reveal por `IntersectionObserver`.
- `src/components/RelatedPosts.astro`: recomendación por score de tags y fecha.
- `src/components/ArticlePlaceholder.astro`: placeholder visual por categoría.
- `src/components/IndicadorEconomico.astro`: render en runtime/build de UF/UTM para MDX.
- `src/pages/search.astro`: buscador estático Pagefind con traducciones ES y persistencia de query.
- `src/layouts/PostDetails.astro`: detalle de post con progreso de lectura, heading links y copy button en bloques de código.

### Utilidades
- `src/utils/getPath.ts`: normaliza rutas con `BASE_URL` y evita duplicar base.
- `src/utils/getSortedPosts.ts` + `postFilter.ts`: orden por fecha y filtro draft/publicación programada.
- `src/utils/getUniqueTags.ts` + `getPostsByTag.ts`: agregación y filtrado de tags.
- `src/utils/slugify.ts`: estrategia híbrida para slug.
- `src/utils/categoryIcons.ts`: mapeo tag -> icono/color.
- `src/utils/indicadores.ts`: consume provider económico snapshot-first con modo live opcional y fallback controlado.
- `src/utils/generateOgImages.ts` + `og-templates/*`: OG dinámicas vía `satori` + `resvg`.
- `src/utils/animateCount.ts`: animación numérica (usada en `seguro-cesantia`).

## 7. Assets y recursos estáticos
- `public/favicon.svg`: favicon.
- `public/tuplatainforma-og.jpg`: OG estática base (`SITE.ogImage`).
- `public/pagefind/**`: bundle/índice de búsqueda (generado por build, ruta gitignored).
- `src/assets/icons/*.svg`: set de iconos UI/social.
- `src/assets/images/*.png`: imágenes de apoyo.
- Tipografías:
  - Cargadas manualmente en `src/layouts/Layout.astro` (`Fraunces`, `Source Sans 3`).
  - Variables consumidas en `src/styles/global.css` (`--font-display`, `--font-body`).
  - Config experimental adicional en `astro.config.ts` (`Inter`, `Playfair Display`).

## 8. Deuda técnica (resumen)
Ver backlog vivo: [context/TECH_DEBT_BACKLOG.md](./TECH_DEBT_BACKLOG.md)

Top 5 por urgencia/riesgo:
- `TD-0002` Valores financieros hardcodeados y fechas fijas en calculadoras.
- `TD-0001` Estrategia de package manager/lockfiles inconsistente.
- `TD-0004` Ausencia de tests automáticos para lógica financiera.
- `TD-0003` Lógica tributaria duplicada entre calculadoras.
- `TD-0010` Lógica de calculadoras acoplada a DOM e `innerHTML`.
