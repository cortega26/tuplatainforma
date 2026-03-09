# 1. Resumen ejecutivo

- Diagnóstico general: el problema principal en Monedario no es duplicación literal masiva; es **frontera editorial insuficientemente fijada** en algunos clusters, especialmente `sueldo-remuneraciones`, y **ownership temático inconsistente** en ahorro/previsión.
- Nivel de gravedad: `media`, con focos `alta` en remuneraciones y `media` en taxonomía/ownership.
- Cantidad aproximada de conflictos detectados:
  - `3` conflictos de alta prioridad por canibalización/solapamiento fuerte.
  - `5` conflictos de prioridad media por diferenciación insuficiente o ownership ambiguo.
  - `4` observaciones estructurales de taxonomía/metadata que facilitan futuros solapamientos.
- Impacto probable:
  - UX: rutas cercanas pueden parecer intercambiables en remuneraciones.
  - SEO: riesgo de dispersar señales entre artículos hermanos y entre hub/article en ahorro/previsión.
  - arquitectura editorial: crecimiento difícil de sostener si no se fija owner por intención.

# 2. Metodología usada

- Recorrido real del repo:
  - revisión de `docs/AI_ENGINEERING_CONSTITUTION.md`, `AGENTS.md`, `context/INVARIANTS.md`, `context/CONTRACTS.md`, `docs/editorial/NORMA_YMYL.md`, `context/EDITORIAL_AI_PIPELINE.md`, `docs/editorial/FRONTMATTER_SCHEMA.md`;
  - inventario de corpus en `src/data/blog`, `src/data/glossary`, `src/data/laws`, `src/pages/guias`, `src/pages/calculadoras`;
  - lectura manual de hubs y artículos candidatos;
  - ejecución de análisis léxico sobre títulos, slugs, descriptions, headings y comentarios `META`.
- Señales comparadas:
  - similitud de title, slug, description y H2;
  - cluster/category;
  - presencia o ausencia de `keyword_primary` e `intent`;
  - promesa del primer párrafo;
  - tipo de página y papel dentro del cluster;
  - interlinks hacia piezas hermanas;
  - evidencia de query ownership previa en `docs/research/seo/strategy/keyword_url_map.md`.
- Definición operativa:
  - duplicado: misma necesidad + mismo formato + promesa casi igual;
  - solapamiento fuerte: misma necesidad parcial, distinta formulación;
  - canibalización: dos URLs podrían disputar el mismo head term o resolver la misma intención dominante;
  - coexistencia válida: comparten tema, pero resuelven tareas distintas.
- Limitaciones:
  - no se usaron datos de Search Console ni SERP externas en esta corrida;
  - no toda la colección usa metadata de intención estructurada;
  - algunas decisiones siguen siendo editoriales, no meramente mecánicas.

# 3. Hallazgos priorizados

## H-01

- URLs o archivos implicados:
  - `src/data/blog/como-calcular-sueldo-liquido.md`
  - `src/data/blog/descuentos-de-sueldo.md`
  - `src/data/blog/liquidacion-de-sueldo.md`
- Títulos implicados:
  - "Sueldo líquido en Chile: qué te descuentan, por qué y cómo calcularlo tú mismo"
  - "Descuentos de sueldo en Chile: cuáles son obligatorios y cuáles no"
  - "Liquidación de sueldo en Chile: cómo leerla y qué revisar"
- Tipo de conflicto: `canibalización por intención + solapamiento temático fuerte`
- Severidad: `alta`
- Explicación razonada:
  - la pieza de sueldo líquido ya se presenta como hub práctico del cluster y enlaza a las otras dos desde la primera línea (`src/data/blog/como-calcular-sueldo-liquido.md:23`);
  - además explica descuentos, imponible y lectura de liquidación en el mismo cuerpo (`src/data/blog/como-calcular-sueldo-liquido.md:27-202`);
  - la pieza de descuentos vuelve a cubrir AFP, salud, cesantía e impuesto con checklist de revisión (`src/data/blog/descuentos-de-sueldo.md:25-124`);
  - la pieza de liquidación repite revisión de imponible, descuentos y checklist (`src/data/blog/liquidacion-de-sueldo.md:33-126`);
  - el problema no es que una deba desaparecer, sino que hoy las tres compiten por la misma necesidad intermedia: “entender por qué el líquido no cuadra”.
- Decisión recomendada: `mantener las tres, pero con diferenciación editorial explícita y ownership rígido`
- Acción específica sugerida:
  - `como-calcular-sueldo-liquido`: owner del cálculo completo y del paso de bruto/imponible a líquido;
  - `descuentos-de-sueldo`: owner de clasificación legal de descuentos, no del cálculo completo;
  - `liquidacion-de-sueldo`: owner del documento/comprobante y de la auditoría de líneas;
  - reescribir title/description de soporte para evitar reutilizar “sueldo líquido” como promesa principal.

## H-02

- URLs o archivos implicados:
  - `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`
  - `src/data/blog/como-calcular-sueldo-liquido.md`
  - `src/data/blog/descuentos-de-sueldo.md`
- Títulos implicados:
  - "¿Cuánto descuenta la AFP de tu sueldo y para qué sirve ese dinero?"
  - "Sueldo líquido en Chile: qué te descuentan, por qué y cómo calcularlo tú mismo"
  - "Descuentos de sueldo en Chile: cuáles son obligatorios y cuáles no"
- Tipo de conflicto: `solapamiento temático fuerte`
- Severidad: `alta`
- Explicación razonada:
  - la pieza AFP es válida como subintención, pero sigue explicando el resto de descuentos previsionales y empuja de vuelta a sueldo líquido (`src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md:102-137`);
  - el owner AFP queda diluido cuando el artículo vuelve a abrir salud, cesantía e impuesto en vez de mantenerse en AFP obligatoria, comisión y cambio de administradora.
- Decisión recomendada: `mantener, pero convertirla en supporting article claramente AFP-specific`
- Acción específica sugerida:
  - reforzar title, H1 y snippet con `AFP`, `cotización obligatoria`, `comisión`, `cambio de AFP`;
  - recortar contenido lateral sobre otros descuentos;
  - dejar CTA visible hacia sueldo líquido para la visión completa.

## H-03

- URLs o archivos implicados:
  - `src/data/blog/que-es-el-apv.mdx`
  - `src/data/blog/que-es-la-cuenta-2-afp.md`
  - `src/pages/guias/pensiones-afp/index.astro`
  - `src/pages/guias/ahorro-e-inversion/index.astro`
- Títulos implicados:
  - "¿Qué es el APV y cómo funciona el beneficio tributario en Chile?"
  - "¿Qué es la Cuenta 2 de la AFP y cuándo conviene usarla?"
- Tipo de conflicto: `ownership temático ambiguo / arquitectura de información`
- Severidad: `alta`
- Explicación razonada:
  - `APV` está en `cluster: ahorro-e-inversion` (`src/data/blog/que-es-el-apv.mdx:14-16`), pero el hub de `pensiones-afp` lo promueve como pieza de previsión (`src/pages/guias/pensiones-afp/index.astro:33-36`);
  - Cuenta 2 sí vive en `pensiones-afp` (`src/data/blog/que-es-la-cuenta-2-afp.md:14-16`) y compara con APV (`src/data/blog/que-es-la-cuenta-2-afp.md:75-107`);
  - el keyword map existente ya advertía que la frontera `AFP/APV/Cuenta 2` requería decisión taxonómica (`docs/research/seo/strategy/keyword_url_map.md:19`).
- Decisión recomendada: `definir un owner estructural y mantener coexistencia`
- Acción específica sugerida:
  - elegir una sola casa principal para APV: `ahorro-e-inversion` si el foco es beneficio tributario y decisión de instrumento; `pensiones-afp` si el foco será previsional puro;
  - una vez decidido, alinear cluster, hub principal y anchors;
  - no abrir nuevas URLs “APV vs Cuenta 2” hasta fijar ese ownership.

## H-04

- URLs o archivos implicados:
  - `src/data/blog/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.md`
  - `src/pages/guias/ahorro-e-inversion/index.astro`
  - `src/data/blog/fondos-mutuos-comisiones-rescate-impuestos.md`
  - `src/data/blog/como-invertir-en-etfs-desde-chile.md`
  - `src/data/blog/deposito-a-plazo-uf-vs-pesos.md`
- Títulos implicados:
  - "Ahorro e inversión en Chile: instrumentos, costos e impuestos (guía 2026)"
  - "Fondos mutuos: comisiones, rescate e impuestos (sin letra chica)"
  - "Cómo invertir en ETFs desde Chile: comisiones, custodia e impuestos"
  - "Depósito a plazo: UF vs pesos — qué conviene y cuándo"
- Tipo de conflicto: `cluster sano con riesgo de deriva`
- Severidad: `media`
- Explicación razonada:
  - aquí no hay canibalización fuerte hoy; hay una estructura correcta de pilar + subguías;
  - el riesgo está en que el pilar y los hijos comparten el patrón “costos e impuestos” y dos artículos quedaron taxonómicamente como `impuestos` pese a ser ahorro/inversión (`src/data/blog/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.md:8-15`, `src/data/blog/fondos-mutuos-comisiones-rescate-impuestos.md:8-15`);
  - si se publican más piezas con esa lógica, el pilar perderá ownership.
- Decisión recomendada: `mantener sin fusionar, pero corregir ownership/taxonomía`
- Acción específica sugerida:
  - reafirmar el pilar como guía de elección de instrumento;
  - reservar fondos mutuos para costo/rescate/impuestos;
  - evitar futuros títulos del cluster con patrón genérico “instrumentos, costos e impuestos”;
  - corregir category para que no arrastre al cluster hacia `impuestos`.

## H-05

- URLs o archivos implicados:
  - `src/data/blog/el-poder-del-interes-compuesto.md`
  - `src/data/blog/interes-compuesto-nota-metodologica.md`
- Títulos implicados:
  - "El poder del interés compuesto: cómo el 10% del sueldo mínimo se convierte en más de $125 millones"
  - "Nota metodológica: simulación de interés compuesto 1990-2025"
- Tipo de conflicto: `coexistencia válida`
- Severidad: `baja`
- Explicación razonada:
  - el artículo principal es pieza editorial inspiracional y la nota es soporte metodológico;
  - el riesgo no es SEO sino de señal interna si la nota intenta comportarse como artículo competidor.
- Decisión recomendada: `mantener ambas`
- Acción específica sugerida:
  - marcar la nota como soporte explícito en matriz de ownership;
  - no optimizarla para la misma query head.

## H-06

- URLs o archivos implicados:
  - `src/data/blog/fraude-tarjeta-que-hacer.md`
  - `src/data/blog/estafas-financieras-chile-vishing-smishing-marketplace.md`
  - `src/data/blog/suplantacion-identidad-creditos-no-reconocidos.md`
- Títulos implicados:
  - "Te hicieron un cargo que no reconoces: qué hacer en las primeras 24 horas (Ley 20.009)"
  - "Estafas financieras en Chile: señales por canal y checklist de 24 horas"
  - "Suplantación de identidad y créditos no reconocidos: cómo detectar, frenar y reclamar"
- Tipo de conflicto: `coexistencia válida con bordes a reforzar`
- Severidad: `media`
- Explicación razonada:
  - fraude tarjeta es restitución reactiva y Ley 20.009 (`src/data/blog/fraude-tarjeta-que-hacer.md:28-208`);
  - estafas es prevención por canal (`src/data/blog/estafas-financieras-chile-vishing-smishing-marketplace.md:26-116`);
  - suplantación es identidad/deuda no reconocida (`src/data/blog/suplantacion-identidad-creditos-no-reconocidos.md:26-115`);
  - conviven bien, pero comparten “primeras 24/72 horas” y reclamo rápido, por lo que el snippet debe seguir marcando bien el tipo de daño.
- Decisión recomendada: `mantener ambas/todas, con diferenciación editorial explícita`
- Acción específica sugerida:
  - reforzar en H1/meta el tipo de incidente: cargo no reconocido, prevención de estafa, crédito/deuda por suplantación;
  - mantener interlinks cruzados actuales.

## H-07

- URLs o archivos implicados:
  - `src/data/blog/operacion-renta-f22-checklist.md`
  - `src/data/blog/devolucion-impuestos-fechas-compensaciones.md`
  - `src/data/blog/boleta-honorarios-2026-retencion-cobertura.md`
- Títulos implicados:
  - "Operación Renta F22 en Chile: checklist para revisar, enviar y rectificar sin errores"
  - "Devolución de impuestos en Chile: fechas de pago, estado y compensaciones"
  - "Boleta de honorarios 2026: retención 15,25%, líquido recibido y cobertura anual"
- Tipo de conflicto: `cluster sano`
- Severidad: `baja`
- Explicación razonada:
  - las tres piezas cubren momentos distintos: revisar/enviar, cobrar/devolver, retención/cobertura;
  - el enlazado interno ya separa bien las necesidades (`src/data/blog/operacion-renta-f22-checklist.md:33`, `src/data/blog/devolucion-impuestos-fechas-compensaciones.md:31`, `src/data/blog/boleta-honorarios-2026-retencion-cobertura.md:42`).
- Decisión recomendada: `mantener ambas/todas sin cambios estructurales`
- Acción específica sugerida:
  - seguir evitando títulos que mezclen F22 con fechas de devolución.

## H-08

- URLs o archivos implicados:
  - `src/data/blog/reforma-previsional-2025-que-cambia-y-como-te-afecta.md`
  - `src/pages/guias/pensiones-afp/index.astro`
- Títulos implicados:
  - "Reforma previsional 2025: qué cambia, cuándo y cómo te afecta (guía actualizada)"
- Tipo de conflicto: `infraexposición estructural`
- Severidad: `media`
- Explicación razonada:
  - la pieza no compite de forma fuerte con otras, pero hoy está débilmente integrada al hub de pensiones, que prioriza cambio AFP, descuentos, fondos, Cuenta 2 y APV (`src/pages/guias/pensiones-afp/index.astro:8-34`);
  - eso incentiva a otros artículos del cluster a absorber explicaciones de reforma dentro de piezas que no deberían ser owner.
- Decisión recomendada: `mantener y subirla a supporting article visible del hub`
- Acción específica sugerida:
  - agregarla al hub o a un bloque “contexto normativo” para que deje de contaminar otras piezas como explicación lateral.

# 4. Matriz de decisiones

| Contenido A | Contenido B / grupo | Conflicto | Severidad | Decisión | Acción inmediata | Acción estructural |
|---|---|---|---|---|---|---|
| `como-calcular-sueldo-liquido` | `descuentos-de-sueldo`, `liquidacion-de-sueldo` | canibalización por intención intermedia | alta | mantener con ownership rígido | reescribir H1/meta de soporte | fijar owner en matriz y usarlo antes de nuevas piezas |
| `cuanto-descuenta-la-afp-de-tu-sueldo` | `como-calcular-sueldo-liquido`, `descuentos-de-sueldo` | subtopic que invade el head cluster | alta | mantener como support AFP | recortar expansiones sobre otros descuentos | usar `topic_owner`/`supporting_for` en próximas revisiones |
| `que-es-el-apv` | `que-es-la-cuenta-2-afp`, hubs ahorro/pensiones | ownership ambiguo | alta | mantener ambas, decidir casa principal | decidir cluster owner de APV | alinear hub, category, interlinks y matriz |
| pilar ahorro e inversión | DAP, fondos mutuos, ETFs | riesgo de deriva más que canibalización | media | mantener cluster sano | no repetir patrón title genérico en nuevas piezas | corregir category/ownership del cluster |
| `el-poder-del-interes-compuesto` | `interes-compuesto-nota-metodologica` | coexistencia válida | baja | mantener ambas | marcar nota como soporte | evitar optimización por la misma query head |
| `fraude-tarjeta-que-hacer` | `estafas-financieras...`, `suplantacion-identidad...` | bordes cercanos pero defendibles | media | mantener las tres | reforzar snippets/H1 por tipo de incidente | mantener mapa de ownership del cluster |
| `operacion-renta-f22-checklist` | `devolucion-impuestos...`, `boleta-honorarios...` | cluster sano | baja | mantener | sin cambio urgente | conservar separación por momento del usuario |
| `reforma-previsional-2025...` | cluster `pensiones-afp` | no canibaliza, pero contamina otras piezas por ausencia en hub | media | mantener y visibilizar | subirla en hub o bloque relacionado | evitar que otros artículos absorban explicación de reforma |

# 5. Proceso permanente recomendado

- Flujo propuesto:
  - usar `docs/research/seo/strategy/topic_ownership_matrix.md` como mapa base;
  - correr `pnpm run audit:topic-overlap` en cada sprint editorial y antes de abrir una URL nueva;
  - exigir decisión explícita `owner/support/merge/discard` antes de redactar.
- Checklist previa a creación:
  - [ ] ¿La necesidad ya tiene owner?
  - [ ] ¿La nueva pieza cambia intención o solo repite el tema?
  - [ ] ¿Es mejor ampliar una URL existente?
  - [ ] ¿Su H1 sería distinguible sin leer la URL?
  - [ ] ¿Tiene cluster y category coherentes?
- Checklist previa a publicación:
  - [ ] title y description no repiten la promesa del owner;
  - [ ] la intro deja claro el problema exacto que resuelve;
  - [ ] existe interlink al owner o al support correspondiente;
  - [ ] si es pieza soporte, no ataca el mismo head term;
  - [ ] si es YMYL refresh, sigue `NORMA_YMYL` y pipeline editorial.
- Revisión periódica:
  - mensual por cluster activo;
  - trimestral del corpus completo;
  - inmediata al detectar 3+ nuevas piezas en un mismo cluster.
- Campos/editorial metadata recomendada:
  - `primary_intent`
  - `target_query`
  - `content_type`
  - `topic_owner`
  - `supporting_for`
  - `canonical_topic`
- Automatizaciones sugeridas y ROI:
  - `pnpm run audit:topic-overlap`: ROI alto;
  - matriz de ownership versionada: ROI alto;
  - validación CI obligatoria por similitud semántica: ROI bajo por ahora.

# 6. Quick wins

1. Fijar ownership explícito del cluster `sueldo-remuneraciones` y reescribir solo títulos/metadescripciones de soporte.
2. Resolver la casa principal de `APV` antes de crear más contenido previsional/ahorro alrededor.
3. Corregir incoherencias `category` vs `cluster` en piezas de ahorro/inversión.
4. Integrar `reforma-previsional-2025-que-cambia-y-como-te-afecta` al hub de pensiones para quitar presión lateral sobre otras piezas.
5. Exigir `keyword_primary` + `intent` en todas las piezas nuevas aunque siga siendo vía comentario `META`.

# 7. Cambios estructurales de mediano plazo

- Endurecer el contrato editorial para volver obligatorios `primary_intent`, `target_query` y `content_type` en frontmatter cuando el corpus esté alineado.
- Evaluar validación automática de coherencia `category`/`cluster` dentro de `check-frontmatter` o `check-editorial-structure`.
- Separar con más claridad el dominio temático `presupuesto / control financiero` del cluster `empleo-ingresos` si ese corpus crece.
