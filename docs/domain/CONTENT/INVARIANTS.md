# Domain Invariants - Article

Fecha: 2026-02-28  
Contexto: `Content`  
Aggregate: `Article`

## 1) Identidad y SEO

### INV-001: `slug` obligatorio y único en artículos publicables

Regla:
- Todo `Article` publicable (`draft=false`) debe tener `slug`.
- No puede existir más de un artículo publicable con el mismo `slug`.

Válido:
```yaml
---
title: "..."
description: "..."
slug: deposito-a-plazo-uf-vs-pesos
pubDate: 2026-02-28T16:10:00Z
tags: [deposito-a-plazo, uf]
category: ahorro-inversion
draft: false
featured: false
---
```

Falla:
```yaml
---
title: "..."
description: "..."
pubDate: 2026-02-28T16:10:00Z
tags: [deposito-a-plazo, uf]
category: ahorro-inversion
draft: false
---
```

Error esperado:
- `Missing required field "slug" for publishable article`

### INV-002: estabilidad de identidad post-publicación

Regla:
- Un artículo ya publicado no puede cambiar `slug` sin declarar alias/redirect/canonical de compatibilidad.

Falla esperada:
- `Slug changed for published article without compatibility mapping`

### INV-003: `draft=true` excluye publicación

Regla:
- Si `draft=true`, el artículo no debe aparecer en listados, RSS ni sitemap.

Falla esperada:
- `Draft article leaked into publication outputs (list/rss/sitemap)`

## 2) Fechas

### INV-004: una sola semántica de fechas editoriales

Regla:
- Campos válidos: `pubDate`, `updatedDate`.
- Campos legacy (`pubDatetime`, `modDatetime`) prohibidos después de normalización.

Falla esperada:
- `Deprecated date field detected: pubDatetime`

### INV-005: fecha de publicación parseable con zona explícita

Regla:
- `pubDate` debe ser fecha ISO 8601 parseable, con `Z` u offset.

Falla:
```yaml
pubDate: 2026-02-28 16:10:00
```

Error esperado:
- `Invalid pubDate: must be ISO 8601 with timezone`

### INV-006: `updatedDate >= pubDate` cuando exista

Válido:
```yaml
pubDate: 2026-02-28T15:00:00Z
updatedDate: 2026-03-01T12:00:00Z
```

Falla:
```yaml
pubDate: 2026-03-01T12:00:00Z
updatedDate: 2026-02-28T15:00:00Z
```

Error esperado:
- `updatedDate must be greater than or equal to pubDate`

## 3) Tipos y defaults

### INV-007: `draft` y `featured` son boolean reales

Falla:
```yaml
draft: "false"
featured: "true"
```

Error esperado:
- `Invalid type for "draft": expected boolean`
- `Invalid type for "featured": expected boolean`

### INV-008: `tags` siempre array (default `[]`)

Regla:
- `tags` debe existir y ser array.
- Elementos no vacíos, trim, deduplicados case-insensitive.

Falla:
```yaml
tags: ahorro, inversion
```

Error esperado:
- `Invalid type for "tags": expected string[]`

### INV-009: `category` obligatoria y controlada

Regla:
- `category` debe existir en vocabulario permitido:
  - `ahorro-inversion`
  - `impuestos`
  - `prevision`
  - `deuda-credito`
  - `seguridad-financiera`
  - `empleo-ingresos`
  - `general`

Error esperado:
- `Invalid category value: "<valor>"`

## 4) Calidad mínima editorial/SEO

### INV-010: `title` no vacío y rango de longitud

Regla:
- Longitud: `20..110` caracteres.

Falla esperada:
- `title length out of range (20..110)`

### INV-011: `description` no vacía y rango de longitud

Regla:
- Longitud: `120..200` caracteres.

Falla esperada:
- `description length out of range (120..200)`

### INV-012: canonical válida cuando exista

Regla:
- `canonical` debe ser URL absoluta `https://`.

Falla esperada:
- `Invalid canonical URL: must be absolute https URL`

## 5) Compatibilidad runtime y deprecaciones

### INV-013: campos runtime no pueden ser "a veces"

Regla:
- Todo campo consumido por runtime debe existir o tener default explícito de schema.

Falla esperada:
- `Runtime-required field missing without default: <field>`

### INV-014: campos deprecados bloqueados tras normalización

Regla:
- Prohibidos: `pubDatetime`, `modDatetime`, `canonicalURL`.

Falla esperada:
- `Deprecated field not allowed: <field>`

