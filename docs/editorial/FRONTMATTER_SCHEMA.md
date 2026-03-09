# Frontmatter Schema (Editorial)

## Objetivo

Definir un contrato mínimo, estable y validable para artículos en `src/data/blog/`.

## Esquema obligatorio mínimo

| Campo | Tipo | Requerido | Regla |
|---|---|---|---|
| `title` | string | Sí | Único por intención de búsqueda dentro del cluster. |
| `description` | string | Sí | 130-170 caracteres, diferenciada por URL. |
| `pubDate` | date-time ISO 8601 | Sí | Fecha de publicación. |
| `updatedDate` | date-time ISO 8601 | No (recomendado) | Solo si hay cambios sustantivos. |
| `author` | string | Sí | Fijo: `"Equipo TuPlataInforma"`. |
| `tags` | string[] | Sí | Al menos 1 tag semántico. |
| `lang` | string | Sí | Fijo: `es-CL`. |
| `category` | string (enum) | Sí | Ver valores permitidos abajo. |
| `cluster` | string (enum) | Sí | Ver valores permitidos abajo. |
| `topicRole` | string (enum) | No (sí en clusters endurecidos) | `owner`, `support`, `reference`. |
| `canonicalTopic` | string | No (sí cuando existe `topicRole`) | Identificador estable en kebab-case de la necesidad primaria. |
| `canonical` | string (URL absoluta) | No (si aplica) | Obligatorio cuando exista contenido duplicado/cross-domain. |
| `draft` | boolean | Sí | `false` para publicar. |

## Valores permitidos: `category` y `cluster`

Usados para taxonomía, navegación y agrupación. Deben coincidir con los slugs de las guías en `src/pages/guias/`.

| `category` | `cluster` | Descripción |
|---|---|---|
| `prevision` | `pensiones-afp` | AFP, fondos, cuenta 2, pensiones |
| `empleo-ingresos` | `sueldo-remuneraciones` | Sueldo líquido, liquidación, descuentos, impuesto único y remuneraciones mensuales |
| `empleo-ingresos` | `empleo-ingresos` | Cesantía, licencia médica, finiquito e interrupción del ingreso laboral |
| `impuestos` | `impuestos-personas` | Operación renta, F22, boletas honorarios, devolución |
| `ahorro-inversion` | `ahorro-e-inversion` | DAP, fondos mutuos, ETFs, APV, Cuenta 2 |
| `deuda-credito` | `deuda-credito` | CMF, DICOM, renegociación Superir, UF |
| `seguridad-financiera` | `seguridad-financiera` | Fraude, estafas, suplantación |

> **Regla:** `cluster` debe coincidir con un directorio existente en `src/pages/guias/`. `category` es el valor que se usa en filtros y agregaciones. Ambos deben ser consistentes entre sí. `general` solo se tolera como deuda explícita o pieza de referencia, no como sustituto por defecto de la categoría principal del cluster.

## Contrato mínimo de ownership (Fase 3)

Campos mínimos:

| Campo | Requerido | Regla | Qué previene |
|---|---|---|---|
| `topicRole` | Sí en `sueldo-remuneraciones`, `pensiones-afp`, `ahorro-e-inversion`; opcional fuera de esos clusters | `owner`, `support`, `reference` | Ambigüedad sobre si una URL manda o solo complementa |
| `canonicalTopic` | Sí cuando existe `topicRole` | kebab-case estable, por ejemplo `calcular-sueldo-liquido` | Double-owner y drift sobre la misma necesidad |

Trade-off editorial:

- Costo bajo: dos campos cortos en frontmatter.
- Beneficio alto: permite verificar ownership sin NLP pesado.
- Decisión deliberada: `targetQuery` y listas complejas de comparación quedan fuera del contrato mínimo para evitar sobrecarga y churn editorial.

## Compatibilidad técnica actual

El código actual de la colección `blog` espera:

- `pubDatetime` (equivalente de `pubDate`)
- `modDatetime` (equivalente de `updatedDate`)
- `canonicalURL` (equivalente de `canonical`)

Para evitar regresiones, la migración debe ser por fases: primero normalizar contenido y luego alinear `src/content.config.ts`.

## Plantilla recomendada

```yaml
---
title: "..."
description: "..."
pubDate: 2026-02-28T10:00:00Z
updatedDate: 2026-02-28T10:00:00Z # opcional
tags:
  - ...
lang: es-CL
canonical: https://dominio.cl/posts/slug/ # opcional
draft: false
---
```

## Hallazgos de Sprint 0 (estado actual)

- Patrón actual consistente en 11/11 artículos, pero con contrato legacy:
  - usa `pubDatetime` en vez de `pubDate`
  - usa `slug` en frontmatter (campo no usado por la ruta real)
  - no declara `lang`
  - no declara `canonical`
  - no declara `updatedDate/modDatetime` en la mayoría de los casos

## Propuesta de diff (no aplicada)

### Diff patrón para cada artículo (11 archivos)

```diff
 ---
 title: "..."
 author: "Equipo TuPlataInforma"
-pubDatetime: 2026-02-24T10:00:00Z
-slug: ...
+pubDate: 2026-02-24T10:00:00Z
+updatedDate: 2026-02-24T10:00:00Z # opcional recomendado
 featured: true
 draft: false
 tags:
   - ...
 description: "..."
+lang: es-CL
+canonical: https://tu-dominio.cl/posts/.../ # si aplica
 ---
```

### Archivos impactados por el diff patrón

- `src/data/blog/como-calcular-sueldo-liquido.md`
- `src/data/blog/como-cambiarse-de-afp.md`
- `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`
- `src/data/blog/fondos-afp-a-b-c-d-e.md`
- `src/data/blog/fraude-tarjeta-que-hacer.md`
- `src/data/blog/informe-deudas-cmf-vs-dicom.md`
- `src/data/blog/que-es-el-apv.mdx`
- `src/data/blog/que-es-la-cuenta-2-afp.md`
- `src/data/blog/que-es-la-uf.md`
- `src/data/blog/renegociacion-superir.md`
- `src/data/blog/seguro-de-cesantia.md`

## Historial de cambios

- **2026-03-03:** Agregados campos `author` y `category`/`cluster` como obligatorios al esquema. Formalizados enums de valores permitidos para `category` y `cluster` (DE-004). Se resolvieron inconsistencias taxonómicas detectadas en auditoría editorial.
