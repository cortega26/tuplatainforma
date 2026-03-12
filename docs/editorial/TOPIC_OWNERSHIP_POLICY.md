# Topic Ownership Policy

Fecha de corte: 2026-03-12

Autoridad aplicable:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/INVARIANTS.md`
4. `context/CONTRACTS.md`
5. `docs/research/seo/strategy/topic_ownership_matrix.md`

Invariantes y contratos preservados:
- `URL.PUBLIC.NO_POST_ID`
- `INVARIANT.EDITORIAL.TOPIC_OWNER_UNIQUENESS`
- `INVARIANT.EDITORIAL.TOPIC_OWNERSHIP_METADATA_HARDENED_CLUSTERS`
- `CONTRACT.EDITORIAL.TOPIC_OWNERSHIP`
- `CONTRACT.EDITORIAL.CLUSTER_POLICY`

## 1. Leyes operativas

1. Cada URL indexable tiene un solo `canonical owner`.
2. `cluster` actual y `category` actual describen placement operativo, no redefinen por sí solos el owner canónico.
3. Un hub solo puede tratar como `core` lo que pertenece a su owner cluster. Los temas vecinos solo entran como `related`.
4. `category: general` no puede funcionar como clasificación final cuando el owner ya está decidido. La única excepción operativa actual es `uf-costo-de-vida`, donde `general` queda documentada como categoría propia del frente mientras la taxonomía no requiera un valor dedicado.
5. Si una URL está alojada transitoriamente en una casa equivocada por limitaciones productivas, ese estado debe quedar explicitado en policy + auditoría + backlog.

## 2. Modelo de decisión

### 2.1 Canonical ownership

Una pieza pertenece al cluster cuya pregunta dominante cumple los tres criterios:

1. resuelve la necesidad principal por la que el usuario llega;
2. define el CTA o siguiente paso natural;
3. mantiene la intención aunque cambie el ejemplo, soporte o activo relacionado.

Si dos clusters parecen plausibles, gana el que responde la decisión primaria y el otro solo puede enlazar como `related`.

### 2.2 Core vs related

- `core`: contenido que el hub usaría para ordenar, profundizar y expandir su propio cluster sin pedir permiso semántico a otro cluster.
- `related`: contenido útil para comparación, contraste o salida lateral, pero cuyo owner vive en otro cluster.

Regla práctica: si quitar el enlace rompe la cobertura del hub, era `core`; si solo empeora el contexto comparativo, era `related`.

### 2.3 Transitional placement

Una URL puede permanecer publicada fuera de su owner canónico solo si se cumplen todos:

1. el owner futuro ya está decidido;
2. el hub/cluster productivo todavía no existe;
3. la URL no se reetiqueta falsamente como parte definitiva del cluster actual;
4. el estado transitorio queda documentado en `src/config/editorial-topic-policy.mjs`, `docs/research/seo/strategy/topic_ownership_matrix.md` y `pnpm run audit:topic-overlap`;
5. existe una condición concreta de migración.

### 2.4 Condición de migración

- `como-hacer-presupuesto-mensual-chile` migra cuando exista `/guias/presupuesto-control-financiero/` y al menos un satélite o herramienta adicional del mismo cluster.
- El frente `uf-costo-de-vida` quedó endurecido el 2026-03-12: UF, IPC y reajuste de arriendo ya operan con `cluster` canónico y ownership explícito.

## 3. Boundary matrix

| Cluster | Misión editorial | Responde | No responde | Criterio de inclusión | Criterio de exclusión | Ejemplos core | Relacionado, no core |
|---|---|---|---|---|---|---|---|
| `ahorro-e-inversion` | Elegir instrumentos y estrategias para ahorrar o invertir mejor según plazo, costo, riesgo e impuestos | "¿Qué instrumento me conviene?" "¿Cómo afecta impuestos/costos?" | Operación AFP obligatoria, contingencias laborales, continuidad de ingreso | Decisiones de asignación de ahorro, comparación de instrumentos, beneficio tributario, costos de inversión | Si la pregunta principal es AFP obligatoria o contingencia laboral | `que-es-el-apv`, `como-invertir-en-etfs-desde-chile`, `deposito-a-plazo-uf-vs-pesos` | `que-es-la-cuenta-2-afp`, `como-hacer-presupuesto-mensual-chile` |
| `pensiones-afp` | Resolver decisiones del sistema previsional obligatorio y sus instrumentos propios | "¿Me cambio de AFP?" "¿Qué fondo elijo?" "¿Cómo funciona Cuenta 2 dentro del ecosistema AFP?" | Elección general de instrumentos de ahorro con beneficio tributario fuera del core AFP | AFP, fondos, cuenta 2, reforma previsional, operación previsional obligatoria | Si la pregunta dominante es elegir un instrumento de ahorro general o bajar impuesto al ahorrar | `como-cambiarse-de-afp`, `fondos-afp-a-b-c-d-e`, `que-es-la-cuenta-2-afp` | `que-es-el-apv` |
| `empleo-ingresos` | Cubrir contingencias laborales que interrumpen o alteran el flujo de ingreso del trabajo | "¿Qué pasa si quedo cesante?" "¿Cuándo pagan licencia/finiquito?" | Presupuesto del hogar, inflación/UF como sistema de reajuste, elección de instrumentos de ahorro | Problemas laborales, continuidad de caja, subsidios, seguros, finiquito | Si el problema principal no nace de una contingencia del trabajo | `seguro-de-cesantia`, `licencia-medica-desde-que-dia-pagan`, `finiquito-e-indemnizaciones-en-chile` | `como-hacer-presupuesto-mensual-chile` |
| `deuda-credito` | Resolver diagnóstico de deuda, costo real del crédito y salidas formales frente a obligaciones financieras | "¿Qué deudas aparecen a mi nombre?" "¿Cuánto me cuesta realmente este crédito?" "¿Puedo renegociar?" | Explicación macro de UF/IPC/costo de vida, presupuesto del hogar, prevención de fraude | CAE, reporte CMF, DICOM, renegociación, prepago, lectura de obligaciones crediticias | Si la intención principal es entender reajustes UF o inflación más allá del producto crediticio | `cae-costo-real-credito-chile`, `informe-deudas-cmf-vs-dicom`, `renegociacion-superir` | `que-es-la-uf` como bridge `related` |
| `presupuesto-control-financiero` | Enseñar control de caja doméstica, presupuesto, hábitos y asignación del excedente antes de invertir | "¿Cómo ordeno mis gastos?" "¿Cómo hago un presupuesto?" | AFP obligatoria, contingencias laborales, macroexplicación centrada en reajustes UF | Presupuesto, gasto hormiga, control financiero, fondo de emergencia, cash-flow del hogar | Si la intención principal es elegir un instrumento de inversión o resolver un evento laboral | `como-hacer-presupuesto-mensual-chile` | `ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026` |
| `uf-costo-de-vida` | Traducir IPC, inflación, UF y reajustes a impacto práctico en bolsillo y contratos | "¿Qué es el IPC?" "¿Cómo me afecta la UF?" "¿Cómo sube el costo de vida?" | Crédito puro, AFP obligatoria, presupuesto del hogar como hábito | IPC, inflación, UF, reajustes de arriendo, lectura de costo de vida | Si la intención principal es producto crediticio o control de gasto doméstico | `que-es-el-ipc-chile-como-se-calcula`, `que-es-la-uf`, `reajuste-arriendo-uf-ipc-chile`, `calculadoras/conversor-uf`, `calculadoras/reajuste-arriendo` | `como-hacer-presupuesto-mensual-chile` |

## 4. URL decision log

| URL | Estado actual | Owner canónico | Ubicación actual | Estado de ubicación | Tratamiento correcto en hubs | Acción inmediata | Acción futura | Justificación editorial |
|---|---|---|---|---|---|---|---|---|
| `que-es-el-apv` | `cluster: ahorro-e-inversion`, `category: ahorro-inversion`, `topicRole: owner`, `canonicalTopic: apv-beneficio-tributario` | `ahorro-e-inversion` | correcta | válida | `core` en ahorro e inversión; `related` en pensiones-afp | mantener metadata y hub AFP como `related` explícito | ninguna migración pendiente | La decisión dominante es instrumento de ahorro con beneficio tributario, no operación AFP obligatoria |
| `como-hacer-presupuesto-mensual-chile` | `cluster: empleo-ingresos`, `category: general` | `presupuesto-control-financiero` | `empleo-ingresos` | transitoria | no tratarlo como core de `empleo-ingresos`; enlazarlo solo como salida lateral desde ahorro/inversión o hubs futuros | documentar transición en policy + registry + auditoría; no falsear category/cluster actuales | migrar cuando exista `/guias/presupuesto-control-financiero/` y un segundo activo satélite o herramienta | La necesidad dominante es control financiero del hogar, no contingencia laboral |
| `que-es-la-uf` | `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: uf-reajustes-costo-de-vida` | `uf-costo-de-vida` | correcta | endurecida | core del hub `uf-costo-de-vida`; `deuda-credito` solo puede enlazarla como `related / bridge` | mantener metadata endurecida y bridges acotados desde obligaciones reajustables | ninguna migración pendiente | La necesidad dominante es entender UF, inflación y reajustes de bolsillo/contratos; crédito solo aporta un caso de uso relacionado |
| `reajuste-arriendo-uf-ipc-chile` | `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: reajuste-arriendo-contrato-uf-ipc` | `uf-costo-de-vida` | correcta | endurecida | core del hub y satélite explicativo de la calculadora | mantener metadata endurecida y linking causal con la calculadora, UF e IPC | ninguna migración pendiente | La necesidad dominante es entender cómo se aplica una cláusula de reajuste de arriendo en UF o IPC y cuánto impacta el pago, no resolver un problema de crédito |
| `que-es-el-ipc-chile-como-se-calcula` | `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: ipc-inflacion-costo-de-vida` | `uf-costo-de-vida` | correcta | endurecida | core del hub `uf-costo-de-vida`; fuera de ahí solo entra como related contextual | mantener metadata endurecida y evitar que vuelva a usarse como core laboral | ninguna migración pendiente | La intención dominante es inflación, reajuste y bolsillo; no continuidad de ingreso laboral |
