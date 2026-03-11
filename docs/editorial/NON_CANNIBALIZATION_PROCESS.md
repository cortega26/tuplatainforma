# Proceso Permanente de No Canibalización Editorial

Fecha de corte: 2026-03-09

Autoridad aplicable:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/INVARIANTS.md`
4. `context/CONTRACTS.md`
5. `docs/editorial/SEO_ARCHITECTURE.md`

Invariantes preservados:
- `URL.PUBLIC.NO_POST_ID`
- `FRONTMATTER.VALID`
- `INVARIANT.EDITORIAL.NO_DUPLICATE_TITLES`
- `INVARIANT.EDITORIAL.CLUSTER_DECLARED`
- `CONTRACT.EDITORIAL.TITLE_UNIQUENESS`

## 1. Propósito

Evitar cuatro fallas recurrentes:

- dos URLs que prometen resolver la misma necesidad;
- artículos distintos con el mismo núcleo de intención;
- hubs que compiten con sus propias piezas soporte;
- crecimiento editorial sin ownership claro de topic.

El principio operativo es simple: una intención dominante tiene un owner claro. Las demás piezas del cluster existen solo si cambian de forma explícita la necesidad, el formato o el momento del usuario.

## 2. Taxonomía de conflicto

### 2.1 Duplicado casi directo

- misma necesidad dominante;
- mismo tipo de página;
- mismo ángulo editorial;
- títulos/slugs/metadescripciones muy cercanos;
- cuerpo con secciones sustantivas equivalentes.

Acción por defecto: fusionar o redirigir.

### 2.2 Solapamiento temático fuerte

- tema general compartido;
- subproblema todavía insuficientemente diferenciado;
- el usuario puede llegar a cualquiera de las dos URLs esperando casi lo mismo.

Acción por defecto: mantener solo si se fuerza diferenciación editorial visible en H1, intro, snippet, interlinks y sección “si tu duda es otra”.

### 2.3 Canibalización por intención de búsqueda

- queries diferentes en superficie, pero la necesidad real es la misma;
- SERP e intención dominante apuntan al mismo tipo de respuesta;
- una URL secundaria intenta capturar el mismo head term del owner.

Acción por defecto: asignar `canonical topic owner` y reposicionar la otra pieza como support.

### 2.4 Coexistencia válida

Piezas que pueden convivir si cambian de forma clara al menos dos de estos ejes:

- intención dominante;
- formato (`hub`, `guide`, `calculator`, `glossary`, `law`, `method note`);
- momento del usuario;
- amplitud vs profundidad;
- problema principal resuelto.

### 2.5 Cluster sano

Un cluster es sano cuando existe:

- un hub de entrada;
- un owner por intención head;
- soporte para subintenciones reales;
- interlinking explícito hacia la pieza correcta;
- ausencia de H1/snippets intercambiables.

## 3. Falsos positivos que se deben evitar

- títulos parecidos dentro de un mismo cluster pero con tareas distintas;
- calculadora vs artículo pilar con intención claramente separada;
- artículo principal vs nota metodológica;
- glosario o ley que solo define o documenta una norma sin competir por el head term;
- comparativa puntual vs guía general, siempre que el snippet no prometa lo mismo.

## 4. Flujo operativo

### 4.1 Revisión previa a creación

1. Buscar en `docs/research/seo/strategy/topic_ownership_matrix.md` si ya existe owner.
2. Ejecutar `pnpm run audit:topic-overlap`.
3. Revisar manualmente:
   - títulos;
   - slugs;
   - metadescripción;
   - cluster;
   - query primaria prevista;
   - necesidad exacta del usuario;
   - tipo de página esperado.
4. Si la idea entra en un owner existente, decidir:
   - ampliar la URL actual;
   - crear supporting content con nuevo ángulo;
   - o descartar la nueva pieza.

### 4.2 Revisión previa a publicación

Checklist bloqueante:

- [ ] La pieza declara owner o support dentro de un cluster real.
- [ ] H1 y meta description no duplican la promesa del owner existente.
- [ ] La query primaria inferida no compite con otra URL del mismo cluster.
- [ ] El primer párrafo deja claro “qué resuelve esta URL” y “qué no resuelve”.
- [ ] Si existe pieza hermana, hay interlink explícito en ambos sentidos.
- [ ] Si la pieza es soporte, no reutiliza el head term del owner como title principal.
- [ ] Si la pieza es tool, no duplica la narrativa completa del artículo.

### 4.3 Revisión periódica del corpus

Cadencia recomendada:

- mensual para clusters en crecimiento;
- trimestral para revisión completa del sitio;
- inmediata después de publicar 3 o más piezas nuevas en un mismo cluster.

Orden de prioridad:

1. featured + hubs;
2. clusters con más de 3 URLs activas;
3. piezas estacionales o YMYL;
4. artículos con title/description cercanos o ownership ambiguo.

## 5. Metadata editorial mínima

Contrato mínimo activo en Fase 4:

- `topicRole`: `owner`, `support`, `reference`
- `canonicalTopic`: identificador estable en kebab-case para la necesidad primaria

Estado operativo:

- En `sueldo-remuneraciones`, `pensiones-afp` y `ahorro-e-inversion`, los artículos publicados **deben** declarar ambos campos.
- Si aparece `topicRole`, `canonicalTopic` pasa a ser obligatorio.
- En clusters endurecidos, `canonicalTopic` debe existir en el registro central `src/config/editorial-topic-policy.mjs`.
- Dos páginas publicadas no pueden declarar `topicRole: owner` para el mismo `cluster + canonicalTopic`.
- En clusters endurecidos, `support` o `reference` no pueden quedar huérfanos de owner.
- `category: general` no sirve como escape hatch en clusters endurecidos; solo se acepta para piezas `reference` + `unlisted`.

Campos que siguen fuera del contrato mínimo por ahora:

- `targetQuery`
- `contentType`
- `funnelStage`
- `comparesWith`

Razón: agregan costo editorial y mantenimiento, pero todavía no entregan suficiente ROI como para endurecerlos.

La convención `<!-- META: keyword_primary="..." | intent="..." | cluster="..." -->` queda como insumo transicional de auditoría, no como contrato canónico.

## 6. Implantación técnica mínima con ROI real

### Ya implementado en esta fase

- `scripts/audit-topic-overlap.mjs`
- comando `pnpm run audit:topic-overlap`
- `docs/research/seo/strategy/topic_ownership_matrix.md`
- auditoría inicial documentada

### ROI de automatización sugerida

Alta:

- script de candidatos por similitud e incoherencia taxonómica;
- matriz de ownership mantenida en el repo;
- revisión manual obligatoria cuando el script detecta conflicto fuerte.

Media:

- endurecer validación para exigir `keyword_primary` e `intent` en artículos nuevos.

Baja por ahora:

- scoring NLP complejo;
- embeddings;
- bloqueo CI por similitud semántica.

La similitud semántica debe seguir siendo warning-first. Bloquear CI por heurísticas todavía generaría demasiados falsos positivos en un corpus pequeño.

## 7. Señales que gatillan revisión manual obligatoria

- `candidate_strong_overlap` en `pnpm run audit:topic-overlap`;
- dos piezas del mismo cluster con title similarity >= `0.22`;
- una pieza soporte que menciona la misma query head del owner en title/H1/description;
- category/cluster incoherente;
- un hub que enlaza piezas fuera de su ownership sin aclarar por qué;
- featured article que compite con su propia tool o support page.

## 8. Gobernanza editorial

- La matriz de ownership se actualiza antes o junto con cada nueva URL indexable.
- Cada conflicto resuelto debe dejar una decisión explícita: `merge`, `support`, `rename`, `retarget`, `redirect`, `keep`.
- Cuando una pieza YMYL cambie de ownership o enfoque, se debe tratar como refresh sustantivo y seguir `docs/editorial/NORMA_YMYL.md` y `context/EDITORIAL_AI_PIPELINE.md`.
