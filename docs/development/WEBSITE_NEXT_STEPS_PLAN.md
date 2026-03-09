# Website Next Steps Plan

Fecha de corte: 2026-03-07

## Objetivo

Definir el orden de ataque de los próximos pasos de Monedario para maximizar confianza, frescura editorial y distribución, sin abrir frentes que hoy tengan retorno marginal menor.

## Fuentes base

- `docs/TECH_DEBT_BACKLOG.md`
- `docs/development/BACKLOG_EDITORIAL.md`
- `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1_summary.md`
- `context/CURRENT_STATE.md`

## Invariantes y contratos a preservar

- `context/INVARIANTS.md`:
  - `URL.PUBLIC.NO_POST_ID`
  - `ROUTES.NO_SILENT_CHANGES`
  - `RSS.NO_REMOVALS`
- `context/CONTRACTS.md`:
  - `CONTRACT.PUBLIC_URLS`
  - `CONTRACT.ROUTES_SNAPSHOT`
  - `CONTRACT.RSS_POLICY`
  - `CONTRACT.ARTICLE_STRUCTURE`

## Decision Summary

Orden recomendado de trabajo:

1. Corregir y estabilizar la presencia institucional minima.
2. Construir una capa de Actualidad util y recurrente.
3. Cerrar deuda editorial/YMYL que hoy limita endurecimiento de gates.
4. Activar distribucion en redes a partir de contenido fresco.
5. Ejecutar mejoras UX/UI puntuales orientadas a descubrimiento y conversion.
6. Postergar auditoria completa o trabajo de logo hasta que los puntos anteriores esten resueltos.

## Razonamiento

- SEO tecnico, performance y guardrails ya estan en un estado razonablemente maduro para esta fase.
- El mayor retorno incremental no viene de otra ronda general de auditoria, sino de aumentar frescura, cobertura y ritmo editorial.
- La presencia institucional en X y LinkedIn era prerequisito de credibilidad; ya existe, pero debe mantenerse alineada con el sitio.
- La deuda editorial visible sigue siendo relevante, especialmente el backfill de artefactos YMYL legacy.

## Fase 0 - Presencia institucional real

Estado:

- X creado: `@monedario_cl`
- LinkedIn creado: `https://www.linkedin.com/company/monedario`

Trabajo:

- Mantener enlaces del sitio alineados con las cuentas reales.
- Definir una bio corta consistente entre sitio, X y LinkedIn.
- Publicar 3 a 5 piezas base de presentacion antes de empujar distribucion fuerte.

Criterio de salida:

- Todos los enlaces institucionales publicos del sitio apuntan a cuentas reales.
- La identidad visual y textual minima es consistente entre web y redes.
- Existe contenido base suficiente para no mostrar perfiles vacios.

## Fase 1 - Actualidad util, no noticias genericas

Objetivo:

Convertir Monedario en una referencia de "que cambio y que significa para ti" en finanzas personales para Chile, sin transformarlo en un medio de noticias generalista.

Enfoque editorial:

- Priorizar cambios regulatorios, operativos y estacionales.
- Publicar piezas explicativas cortas o actualizaciones sustantivas de articulos existentes.
- Evitar cobertura de contingencia sin utilidad practica.

Formatos sugeridos:

- `Actualizacion`: cambio puntual sobre un tema ya cubierto.
- `Vigencia`: que cambia este mes, este trimestre o este ano.
- `Checklist operativo`: que hacer ahora ante una fecha o cambio concreto.

Primeros temas sugeridos:

1. Operacion Renta y devolucion de impuestos mientras dure la ventana estacional.
2. Reformas previsionales y efectos de implementacion por tramo/fecha.
3. Cambios de UF, IPC, honorarios, AFC o reglas operativas que afecten calculadoras y articulos pilar.
4. Alertas practicas de fraude o seguridad financiera con vigencia clara.

Criterio de salida:

- Existe una politica editorial clara para Actualidad.
- Hay un backlog de 6 a 10 temas calendarizados.
- Se publican al menos 4 piezas o updates sustantivos en un ciclo de 30 dias.
- Home y navegacion pueden exponer la capa de Actualidad sin quedar vacias.

## Fase 2 - Cierre de deuda editorial y YMYL

Objetivo:

Reducir deuda que hoy limita confiabilidad, enforcement global y velocidad de publicacion.

Items prioritarios:

1. `TD-0016`: backfill de artefactos YMYL legacy.
2. Normalizacion continua de `updatedDate` cuando haya refresh sustantivo real.
3. Registro formal en backlog de articulos publicados fuera del audit original.

Razon:

- Sin cerrar esa deuda, el proyecto sigue dependiendo de enforcement por diff y conserva riesgo editorial invisible.
- Esta fase mejora confianza interna y hace mas segura la expansion de Actualidad.

Criterio de salida:

- `EDITORIAL_ENFORCE=1 pnpm run check:editorial` pasa sobre todo el corpus, o queda una lista residual explicitamente acotada y calendarizada.
- Cada refresh sustantivo deja trazabilidad en backlog o registro editorial.
- Los articulos no auditados ya estan absorbidos en el backlog canonico.

## Fase 3 - Distribucion en redes

Objetivo:

Usar X y LinkedIn como canal de distribucion de contenido util ya publicado, no como tarea aislada de branding.

Secuencia:

1. Reempaquetar cada pieza de Actualidad en un post corto para X.
2. Publicar una version mas contextual en LinkedIn para temas de trabajo, impuestos y cambios normativos.
3. Medir manualmente que temas generan mas guardados, clics y comentarios utiles.

Regla:

- No abrir Facebook, Reddit u otras redes solo por presencia. Abrirlas cuando exista formato y cadencia sostenible.

Criterio de salida:

- Existe una rutina de distribucion por cada publicacion importante.
- Cada pieza importante tiene al menos una adaptacion para X y una para LinkedIn.
- Hay aprendizaje observable sobre que clusters atraen mas atencion.

## Fase 4 - UX/UI focalizada

Objetivo:

Mejorar descubrimiento, claridad y conversion editorial una vez que haya mas material fresco que ordenar.

Focos sugeridos:

1. Mejor jerarquia de home entre guias, actualidad y calculadoras.
2. Navegacion mas explicita para clusters prioritarios.
3. Mejor interlinking visible entre articulo pilar, pieza de actualidad y calculadora.
4. Refinar CTA institucionales y de seguimiento en redes.

Regla:

- Evitar rediseño amplio antes de que la capa de Actualidad exista y pruebe una nueva arquitectura de descubrimiento.

Criterio de salida:

- Se reduce friccion para llegar a cluster, herramienta o update relevante.
- La home deja claro que ofrece el sitio hoy: guias, calculadoras y actualidad util.

## Lo que no deberia ir primero

## Auditoria completa

No es el mejor siguiente paso porque ya hay evidencia de trabajo reciente en performance, guardrails, validaciones y estructura editorial. Conviene volver a auditar de forma completa despues de ejecutar una nueva fase relevante, no antes.

## Logo

Puede aportar consistencia, pero no desbloquea crecimiento ni confianza tanto como frescura editorial, cuentas institucionales reales y distribucion util.

## Redes adicionales

No conviene abrir mas canales hasta que X y LinkedIn tengan contenido minimo, tono consistente y una cadencia verificable.

## Sprint sugerido de 30 dias

Semana 1:

1. Cerrar presencia institucional minima.
2. Definir politica de Actualidad y calendario de 30 dias.
3. Seleccionar 6 a 10 temas ancla.

Semana 2:

1. Publicar 2 piezas de Actualidad o 2 refresh sustantivos.
2. Adaptar cada pieza a X y LinkedIn.
3. Registrar trazabilidad editorial.

Semana 3:

1. Publicar otras 2 piezas.
2. Empezar backfill por lote de artefactos YMYL legacy.
3. Evaluar si ya existe suficiente material para exponer Actualidad en navegacion.

Semana 4:

1. Ajustar backlog segun respuesta observada.
2. Definir mejoras UX/UI acotadas sobre home y navegacion.
3. Planificar siguiente ciclo editorial.

## Senales para reconsiderar el orden

Cambiar el orden solo si ocurre una de estas condiciones:

- Caida visible de calidad tecnica en build, rutas, RSS o performance.
- Cambio normativo mayor que exija priorizar refresh YMYL inmediato.
- Aparicion de analytics o Search Console mostrando que el principal cuello de botella es navegacion, no frescura.

## Resultado esperado

Si se sigue este orden, Monedario deberia ganar:

- Mas senal de frescura y vigencia.
- Mejor autoridad practica en clusters YMYL.
- Mejor material para distribuir en redes.
- Un fundamento mas claro para una mejora UX/UI posterior con datos reales.
