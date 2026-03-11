# Taxonomy and Hub Strategy

## Objetivo

Resolver la taxonomía semántica y la estrategia de hubs antes de seguir expandiendo clusters, evitando canibalización entre hubs, artículos, calculadoras y páginas de soporte.

## Decisiones canónicas

### 1. Estrategia de URL para hubs

- Los hubs viven bajo el prefijo estable `/guias/<cluster>/`.
- No se cambia la estrategia pública existente; Sprint 2B solo la aplica con una separación semántica más precisa.
- Los hubs son páginas de navegación y decisión, no artículos largos ni calculadoras disfrazadas.

### 2. Tipos de página y su rol

| Tipo | Prefijo | Rol primario | Regla de intención |
|---|---|---|---|
| Hub | `/guias/<cluster>/` | Ordena el cluster y distribuye tráfico | Responde intención amplia/mixta; no compite por query procedimental exacta |
| Artículo | `/posts/<slug>/` | Explica una duda concreta | Posee una pregunta o caso específico |
| Calculadora | `/calculadoras/<slug>/` | Ejecuta el cálculo | Posee intención funcional/transaccional |
| Glosario | `/glosario/<slug>/` | Define términos | Posee intención definicional corta |
| Legal explainer | `/leyes/<slug>/` | Resume norma fuente | Posee intención normativa y de respaldo |

### 3. Regla para calculadoras

- Las calculadoras permanecen bajo `/calculadoras/`.
- El hub enlaza a la calculadora, pero no se crean “landing pages de calculadora” separadas salvo que exista una intención propia distinta y comprobable.
- Regla actual para sueldo: `calculadora de sueldo líquido` sigue siendo `/calculadoras/sueldo-liquido/`.

## Top-level clusters elegidos

### Clusters vivos en arquitectura

| Cluster | Hub canónico | Rol |
|---|---|---|
| `sueldo-remuneraciones` | `/guias/sueldo-remuneraciones/` | Sueldo líquido, liquidación, descuentos, impuesto único, remuneraciones mensuales |
| `empleo-ingresos` | `/guias/empleo-ingresos/` | Contingencias laborales: cesantía, licencia, finiquito, interrupción de caja |
| `pensiones-afp` | `/guias/pensiones-afp/` | AFP obligatoria, fondos, Cuenta 2 y decisiones previsionales; APV solo como asset relacionado cuando aporta comparación |
| `ahorro-e-inversion` | `/guias/ahorro-e-inversion/` | Instrumentos, costos, impuestos y horizonte de inversión |
| `impuestos-personas` | `/guias/impuestos-personas/` | Operación Renta y obligaciones tributarias de personas |
| `deuda-credito` | `/guias/deuda-credito/` | Crédito, deuda, renegociación, CAE y costo financiero |
| `seguridad-financiera` | `/guias/seguridad-financiera/` | Fraude, estafas, suplantación y protección |

### Clusters futuros ya resueltos semánticamente

| Tema futuro | Hub recomendado | Decisión |
|---|---|---|
| Cesantía y protección social | Mantener dentro de `empleo-ingresos` | No abrir hub separado mientras la intención dominante siga siendo contingencia laboral |
| UF / inflación / costo de vida | Futuro `/guias/uf-costo-de-vida/` | Separarlo de deuda cuando exista al menos un hub + 2 activos satélite que justifiquen autoridad propia |
| Presupuesto / control financiero | Futuro `/guias/presupuesto-control-financiero/` | Separarlo de empleo cuando la intención sea hábito/flujo doméstico, no ingreso laboral |

## Naming logic

- El slug del cluster debe describir el territorio semántico amplio, no una query exacta.
- El H1 del hub debe sonar humano y amplio, pero no repetir la query procedural exacta del artículo pilar.
- Los artículos toman la pregunta o problema específico.
- Las calculadoras comienzan con “Calculadora” o “Simulador”.
- El glosario usa el término exacto.
- Las páginas legales usan el nombre oficial de la norma.

## Anti-cannibalization rules

### Sueldo/remuneraciones

| Intención | URL canónica | Qué no debe hacer la URL |
|---|---|---|
| `sueldo liquido` / navegación amplia | `/guias/sueldo-remuneraciones/` | No duplicar el tutorial completo ni el cálculo ejecutable |
| `como calcular sueldo liquido` | `/posts/como-calcular-sueldo-liquido/` | No intentar rankear como calculadora |
| `calculadora sueldo liquido` | `/calculadoras/sueldo-liquido/` | No absorber toda la narrativa educativa |
| `cuanto descuenta la AFP de tu sueldo` | `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | No expandirse a “todo sueldo líquido” |
| `descuentos sueldo` | Futuro artículo satélite | No usar el artículo AFP como reemplazo permanente |
| `liquidacion de sueldo` | Futuro artículo satélite | No usar el hub como explicación campo a campo |

### Regla APV

- `APV` pertenece canónicamente a `ahorro-e-inversion` porque la intención dominante es elegir un instrumento de ahorro con beneficio tributario.
- `pensiones-afp` puede enlazar APV solo como `related` cuando la comparación con Cuenta 2 o decisiones previsionales vecinas aporta contexto.
- No se duplica un pilar APV en ambos clusters ni se trata APV como core AFP por proximidad temática.

## Cuándo un tema se convierte en cada tipo de activo

### Tema -> hub

Crear un hub cuando se cumplen las tres condiciones:

1. El tema reúne al menos 1 intención amplia + 1 calculadora o herramienta + 2 activos satélite.
2. Existen subintenciones que hoy compiten entre sí si no se ordenan.
3. El usuario necesita elegir “por dónde entrar” antes de leer.

### Tema -> artículo de soporte

Crear un artículo cuando:

- Responde una pregunta específica.
- Tiene un ángulo distinto al pilar y al hub.
- Puede enlazar naturalmente a una calculadora o a un artículo hermano sin duplicarse.

### Tema -> calculadora landing page

Mantener o crear una calculadora cuando:

- La intención dominante es ejecutar un cálculo o simulación.
- El usuario necesita inputs propios.
- El valor principal no es la explicación sino el resultado.

### Tema -> glosario o soporte legal

Usar glosario cuando:

- La fricción es de vocabulario.
- El término aparece repetidamente en el cluster.
- La respuesta puede ser corta y estable.

Usar legal explainer cuando:

- La duda exige respaldo normativo.
- El usuario necesita verificar vigencia o fuente legal.
- El detalle legal sería excesivo dentro del artículo principal.

## Encaje del sueldo cluster dentro de la estructura

- `sueldo-remuneraciones` es el cluster productivo para ingreso mensual regular.
- `empleo-ingresos` deja de absorber sueldo líquido y queda para interrupciones del ingreso.
- `pensiones-afp` vuelve a concentrarse en decisiones previsionales, no en lectura general de la liquidación.
- La calculadora de sueldo líquido sigue separada pero enlazada desde el hub y los artículos.
- Glosario y leyes apoyan la comprensión sin convertirse en primarios del cluster.

## Resultado operativo de Sprint 2B

- Hub elegido: `/guias/sueldo-remuneraciones/`
- Artículo pilar: `/posts/como-calcular-sueldo-liquido/`
- Calculadora: `/calculadoras/sueldo-liquido/`
- Satélite activo: `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/`
- Soportes iniciales: `/glosario/afp/`, `/glosario/afc/`, `/leyes/dl-824-impuesto-renta/`, `/leyes/ley-19728-seguro-cesantia/`
