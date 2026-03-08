# Sueldo Cluster Build Report

## Hub URL elegido

- `/guias/sueldo-remuneraciones/`

## Páginas incluidas en el cluster activo

- Hub: `/guias/sueldo-remuneraciones/`
- Artículo pilar: `/posts/como-calcular-sueldo-liquido/`
- Artículo satélite: `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/`
- Calculadora: `/calculadoras/sueldo-liquido/`

## Conexiones a calculadora creadas

- `como-calcular-sueldo-liquido` ahora enlaza inline al hub, a la calculadora y al satélite AFP.
- `cuanto-descuenta-la-afp-de-tu-sueldo` ahora enlaza inline al hub y al artículo pilar.
- `PostDetails.astro` renderiza un bloque estructurado `Siguiente paso` con CTA a la calculadora.
- La calculadora ahora muestra una sección `Ruta del cluster` que devuelve al hub y a los artículos.

## Glossary / legal links añadidos

Bloques estructurados conectados a:

- `/glosario/afp/`
- `/glosario/afc/`
- `/leyes/dl-824-impuesto-renta/`
- `/leyes/ley-19728-seguro-cesantia/`

## Internal-link modules añadidos

- `ContextLinkSection.astro`
- `sueldoClusterLinks.ts`

Estos módulos quedaron conectados a:

- ambos artículos del cluster
- la calculadora de sueldo líquido
- el nuevo hub

## Páginas refrescadas o creadas

### Creadas

- `src/pages/guias/sueldo-remuneraciones/index.astro`
- `src/components/ContextLinkSection.astro`
- `src/config/sueldoClusterLinks.ts`

### Refrescadas

- `src/data/blog/como-calcular-sueldo-liquido.md`
- `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`
- `src/pages/calculadoras/sueldo-liquido.astro`
- `src/layouts/PostDetails.astro`
- `src/pages/guias/index.astro`
- `src/pages/guias/empleo-ingresos/index.astro`
- `src/pages/guias/pensiones-afp/index.astro`
- `src/components/Header.astro`
- `src/config/clusters.ts`

## Ajustes taxonómicos concretos

- `como-calcular-sueldo-liquido` pasa de `empleo-ingresos` a `sueldo-remuneraciones`.
- `cuanto-descuenta-la-afp-de-tu-sueldo` deja de vivir en `pensiones-afp` y pasa a `sueldo-remuneraciones`.
- `empleo-ingresos` queda explícitamente orientado a contingencias.
- `pensiones-afp` deja de tratar sueldo líquido como activo del cluster.

## Gaps no resueltos

- Falta un artículo satélite específico para `descuentos sueldo`.
- Falta un artículo satélite específico para `liquidación de sueldo`.
- No se intentó crear nuevas páginas de glosario propias del cluster porque los soportes existentes ya cubrían AFP/AFC y la prioridad del sprint era taxonomía + hub.

## Follow-up tasks requeridos

- `MB-034` crear artículo para descuentos de sueldo obligatorios.
- `MB-035` crear explainer para liquidación de sueldo.
