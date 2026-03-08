# Internal Link Pattern Notes

## Objetivo

Documentar el patrón de linking implementado para el cluster `sueldo-remuneraciones` y dejarlo listo para reutilización en otros clusters.

## Componentes introducidos

- `src/components/ContextLinkSection.astro`
- `src/config/sueldoClusterLinks.ts`

El componente renderiza bloques consistentes de tarjetas. La configuración separa la lógica de negocio de los textos, rutas y CTAs por cluster.

## Lógica implementada

### Article -> calculator

- Cada artículo del cluster sueldo muestra un bloque `Siguiente paso`.
- La primera tarjeta apunta a `/calculadoras/sueldo-liquido/`.
- La calculadora siempre se presenta como siguiente acción funcional, no como reemplazo del artículo.

### Article -> glossary

- Cada artículo del cluster sueldo muestra un bloque `Apoyo contextual`.
- Se enlaza a glosario solo cuando el término destraba la lectura de la liquidación.
- En Sprint 2B se eligieron `AFP` y `AFC` porque aparecen directamente en los descuentos mensuales.

### Article -> legal explainer

- El mismo bloque `Apoyo contextual` enlaza a leyes cuando la duda requiere respaldo normativo.
- En Sprint 2B se eligieron:
  - `DL 824` para impuesto único / segunda categoría.
  - `Ley 19.728` para seguro de cesantía.

### Hub -> child page

- El hub `/guias/sueldo-remuneraciones/` muestra primero la ruta principal:
  - guía pilar
  - calculadora
  - artículo satélite AFP
- Después muestra soportes de glosario y marco legal.
- El hub también define rutas de salida hacia clusters vecinos para evitar mezcla semántica.

### Child page -> hub

- Los dos artículos editados incluyen link visible al hub dentro del cuerpo.
- La calculadora incluye un bloque `Ruta del cluster` que devuelve al hub y a los dos artículos activos.

## Regla editorial derivada

- El hub ordena.
- El artículo explica.
- La calculadora ejecuta.
- El glosario define.
- La ley respalda.

Si una página intenta hacer dos de esas cosas a la vez, se evalúa riesgo de canibalización.

## Cómo reutilizar el patrón

1. Crear un archivo de configuración del cluster con:
   - tarjetas primarias
   - soportes de glosario
   - soportes legales
   - secciones por slug
2. Reusar `ContextLinkSection.astro`.
3. Conectar artículos vía `PostDetails.astro`.
4. Conectar calculadora o landing funcional en su propia página.
5. Asegurar al menos:
   - 1 link visible al hub desde el cuerpo del artículo
   - 1 CTA estructurado hacia la calculadora
   - 1 bloque de soporte contextual

## Límites aplicados en Sprint 2B

- No se desplegó sitewide.
- No se añadieron bloques en clusters fuera de sueldo/remuneraciones.
- No se transformó el glosario o las leyes en primarios del cluster.
