# Editorial Definition of Done (DoD)

## 1) Fuentes primarias mínimas (obligatorio)

Marcar `OK` solo si cada fuente está citada en el artículo con link directo.

- `Impuestos Personas`: mínimo 2 fuentes oficiales (`SII` + `ChileAtiende` o `TGR` según tema).
- `Deudas y Crédito`: mínimo 2 fuentes oficiales (`CMF`/`Superir`/`SERNAC` según tema).
- `Pensiones y Protección Social`: mínimo 2 fuentes oficiales (`SPensiones`/`AFC`/`SUSESO`/`ChileAtiende`).
- `Fraudes y Seguridad Financiera`: mínimo 2 fuentes oficiales (`SERNAC` + `CMF` y/o `CSIRT`).
- `Presupuesto y Costo de Vida`: mínimo 1 fuente primaria metodológica (`Banco Central`/`INE`) + 1 fuente operativa (`SII`/`DT`/SPensiones según caso).
- `Ahorro e Inversión`: mínimo 2 fuentes oficiales (`CMF` + `SII` para tributación cuando aplique).
- Si faltan fuentes verificables: `NO PUBLICAR` y marcar `TODO: fuente primaria faltante`.

## 2) Estructura mínima H1/H2 (obligatorio)

- Un único `H1` que coincida con la intención principal de la query.
- `H2` mínimos obligatorios:
  - `Qué es / Qué cambia`
  - `Paso a paso` o `Cómo se hace`
  - `Casos frecuentes`
  - `Errores comunes`
  - `Preguntas frecuentes`
  - `Fuentes y vigencia normativa`
- Debe incluir al menos 1 ejemplo numérico o caso real por artículo.

## 3) Interlinking pilar ↔ satélites ↔ tools (obligatorio)

- Cada artículo pilar enlaza mínimo a:
  - 2 satélites del mismo cluster.
  - 1 calculadora/tool relevante (si existe).
- Cada calculadora/tool enlaza mínimo a:
  - 1 pilar explicativo.
- Anchor text debe expresar intención (`guía`, `simulador`, `paso a paso`) y no ser genérico (`haz clic aquí`).
- Incluir bloque `Siguiente lectura` al final con links internos priorizados.

## 4) Política anti-canibalización (obligatorio)

Antes de publicar, validar:

- `Title` único por intención (no repetir combinaciones núcleo en pilar/tool).
- `Meta description` diferenciada por intención (explicar vs calcular vs checklist).
- `H1` no duplicado entre URLs del mismo topic.
- `Slug` semántico único por query primaria.
- `Canonical` correcto y sin auto-conflictos.
- `Query target` declarado en frontmatter interno de planificación.

Si existe conflicto con URL previa:

- Resolver con fusión, reposicionamiento de intención o redirección.
- No publicar nueva pieza hasta resolver conflicto.

## 5) Revisión YMYL (si aplica)

Aplica a: impuestos, deudas, fraude, pensiones, derechos del consumidor, salud laboral/licencias.

Checklist YMYL:

- Fecha de vigencia explícita (`actualizado a YYYY-MM-DD`).
- Sección `Esto no reemplaza asesoría profesional` cuando corresponda.
- Lenguaje no ambiguo en plazos legales y requisitos.
- Diferenciar claramente `hecho normativo` vs `recomendación editorial`.
- Verificación cruzada de montos/tasas/plazos contra fuentes primarias.
- Si hay incertidumbre normativa: marcar `TODO` y no afirmar como hecho.

## 6) Criterios de aceptación finales

- Contenido completo según estructura DoD.
- Fuentes mínimas cumplidas y citadas.
- Interlinking interno validado.
- Anti-canibalización validada.
- QA editorial y de links sin errores 404.
- Estado listo para publicar solo con todos los checks en `OK`.
