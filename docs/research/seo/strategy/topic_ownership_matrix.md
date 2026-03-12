# Topic Ownership Matrix

Fecha de corte: 2026-03-12

Objetivo: fijar ownership editorial por intención para reducir canibalización, definir qué URL manda en cada topic y qué piezas son soporte.

## Reglas

- `canonical topic owner`: URL principal para la intención dominante.
- `canonical owner cluster`: cluster editorial que posee la intención, aunque la URL siga alojada transitoriamente en otro cluster operativo.
- `supporting`: URL complementaria que no debe intentar rankear por la misma query head.
- `related`: asset enlazado por cercanía temática, sin absorber ownership del topic.
- `hub`: página de entrada y distribución, no reemplaza una guía o comparativa específica.
- `transitional placement`: ubicación operativa temporal que no redefine la casa editorial real.
- Si una pieza no cabe con claridad en una fila, no se publica hasta definir ownership.
- Si una pieza ya tiene owner canónico decidido, `category: general` solo puede sobrevivir como estado transitorio documentado, salvo la excepción explícita de `uf-costo-de-vida`, donde `general` funciona como categoría operativa del frente endurecido.

| Canonical owner cluster | Topic / necesidad dominante | Canonical topic owner | Supporting / complementos | Notas operativas |
|---|---|---|---|---|
| `sueldo-remuneraciones` | calcular sueldo líquido y entender el número final | `/calculadoras/sueldo-liquido/` para intent funcional; `/posts/como-calcular-sueldo-liquido/` para intent explicativo | `/posts/descuentos-de-sueldo/`, `/posts/liquidacion-de-sueldo/`, `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | No reutilizar `sueldo líquido` como keyword head en piezas soporte |
| `sueldo-remuneraciones` | leer una liquidación y auditar líneas | `/posts/liquidacion-de-sueldo/` | `/posts/descuentos-de-sueldo/`, `/posts/como-calcular-sueldo-liquido/` | H1 y snippet deben hablar de documento/comprobante, no de cálculo completo |
| `sueldo-remuneraciones` | distinguir descuentos obligatorios, voluntarios y prohibidos | `/posts/descuentos-de-sueldo/` | `/posts/liquidacion-de-sueldo/`, `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | Debe quedarse en clasificación legal, no repetir tutorial completo de sueldo líquido |
| `sueldo-remuneraciones` | descuento AFP del trabajador | `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | `/posts/como-cambiarse-de-afp/`, `/posts/fondos-afp-a-b-c-d-e/` | No debe expandirse a todo el resto de descuentos de remuneraciones |
| `pensiones-afp` | cambio de AFP | `/posts/como-cambiarse-de-afp/` | `/posts/fondos-afp-a-b-c-d-e/`, `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/` | Query procedural separada de fondos/APV |
| `pensiones-afp` | elección de fondos AFP | `/posts/fondos-afp-a-b-c-d-e/` | `/posts/como-cambiarse-de-afp/`, `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/` | No competir por `mejor AFP` ni por `cambiarme de AFP` |
| `pensiones-afp` | Cuenta 2 AFP | `/posts/que-es-la-cuenta-2-afp/` | `/posts/que-es-el-apv/` | Comparar con APV solo como sección de contraste, no como doble owner |
| `ahorro-e-inversion` | APV y beneficio tributario | `/posts/que-es-el-apv/` | `/calculadoras/apv/`, `/posts/que-es-la-cuenta-2-afp/` | Ownership definitivo en `ahorro-e-inversion`; `pensiones-afp` solo lo enlaza como instrumento relacionado cuando la comparación con Cuenta 2 aporta contexto |
| `ahorro-e-inversion` | elegir instrumento de ahorro/inversión en general | `/posts/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026/` | `/posts/deposito-a-plazo-uf-vs-pesos/`, `/posts/fondos-mutuos-comisiones-rescate-impuestos/`, `/posts/como-invertir-en-etfs-desde-chile/` | Pilar, no comparativa profunda de un solo instrumento |
| `ahorro-e-inversion` | DAP UF vs pesos | `/posts/deposito-a-plazo-uf-vs-pesos/` | pilar general | Mantener intención comparativa puntual |
| `ahorro-e-inversion` | fondos mutuos: costos, rescate e impuestos | `/posts/fondos-mutuos-comisiones-rescate-impuestos/` | pilar general | Mantener foco en fricción/costos, no abrir frente amplio de “qué invertir” |
| `ahorro-e-inversion` | ETFs desde Chile | `/posts/como-invertir-en-etfs-desde-chile/` | pilar general | Procedimental, no reemplaza guía general |
| `ahorro-e-inversion` | interés compuesto (caso inspiracional) | `/posts/el-poder-del-interes-compuesto/` | `/posts/interes-compuesto-nota-metodologica/` | La nota metodológica es soporte, no URL competidora |
| `impuestos-personas` | revisar y enviar F22 | `/posts/operacion-renta-f22-checklist/` | `/posts/devolucion-impuestos-fechas-compensaciones/`, `/posts/boleta-honorarios-2026-retencion-cobertura/` | No invadir calendario de pago ni retención de boletas como head term |
| `impuestos-personas` | fecha/estado/compensación de devolución | `/posts/devolucion-impuestos-fechas-compensaciones/` | F22 checklist | Query posterior al envío |
| `impuestos-personas` | retención de boletas y cobertura anual | `/posts/boleta-honorarios-2026-retencion-cobertura/` | `/calculadoras/boleta-honorarios-liquido/`, `F22 checklist` | Query mixta impuestos/previsión; la calculadora resuelve el líquido mensual sin absorber ownership del artículo |
| `empleo-ingresos` | revisar finiquito y pagos finales | `/posts/finiquito-e-indemnizaciones-en-chile/` | `/posts/indemnizacion-anos-de-servicio-chile/`, `/calculadoras/finiquito-indemnizacion/` | El artículo paraguas conserva ownership; cálculo puntual y años de servicio viven como support + tool |
| `empleo-ingresos` | seguro de cesantía: saldo, cobro y filtro base | `/posts/seguro-de-cesantia/` | `/posts/seguro-cesantia-cuenta-individual-vs-fondo-solidario/`, `/calculadoras/seguro-cesantia/` | El owner resuelve el journey completo; la pieza CIC/FCS descomprime la comparación de fondos |
| `deuda-credito` | costo real del crédito / CAE | `/posts/cae-costo-real-credito-chile/` | `/calculadoras/credito-consumo/`, `/calculadoras/prepago-credito/` | Mantener ownership del concepto; calculadoras resuelven ejecución |
| `deuda-credito` | informe CMF y diferencia con DICOM | `/posts/informe-deudas-cmf-vs-dicom/` | `/posts/suplantacion-identidad-creditos-no-reconocidos/` | La pieza de suplantación puede enlazar pero no debe intentar rankear por `informe de deudas` |
| `deuda-credito` | renegociación Superir | `/posts/renegociacion-superir/` | hub de deuda-crédito | Procedimental, distinta de diagnóstico de deudas |
| `seguridad-financiera` | cargo no reconocido / restitución | `/posts/fraude-tarjeta-que-hacer/` | `/posts/estafas-financieras-chile-vishing-smishing-marketplace/`, `/posts/suplantacion-identidad-creditos-no-reconocidos/` | Restitución reactiva, no prevención general |
| `seguridad-financiera` | prevención por canal | `/posts/estafas-financieras-chile-vishing-smishing-marketplace/` | fraude tarjeta | Foco preventivo |
| `seguridad-financiera` | suplantación + créditos no reconocidos | `/posts/suplantacion-identidad-creditos-no-reconocidos/` | informe CMF, fraude tarjeta | Caso de identidad/deuda, no fraude transaccional puro |
| `presupuesto-control-financiero` | presupuesto mensual y control de gasto hogar | `/posts/como-hacer-presupuesto-mensual-chile/` | `/posts/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026/` | Owner canónico ya decidido. La URL sigue en `cluster: empleo-ingresos`, `category: general` solo como `transitional placement` hasta que exista `/guias/presupuesto-control-financiero/` y al menos un activo satélite o herramienta adicional del mismo cluster |
| `uf-costo-de-vida` | qué es la UF y cómo afecta bolsillo y contratos reajustables | `/posts/que-es-la-uf/` | `/posts/que-es-el-ipc-chile-como-se-calcula/`, `/calculadoras/conversor-uf/`, `/calculadoras/reajuste-arriendo/` | Frente endurecido el 2026-03-12. La URL queda en `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: uf-reajustes-costo-de-vida`. `deuda-credito` puede enlazarla solo como `related / bridge`, no como owner |
| `uf-costo-de-vida` | reajuste de arriendo y lectura de cláusula UF / IPC | `/posts/reajuste-arriendo-uf-ipc-chile/` | `/calculadoras/reajuste-arriendo/`, `/posts/que-es-la-uf/`, `/posts/que-es-el-ipc-chile-como-se-calcula/` | Frente endurecido el 2026-03-12. La URL queda en `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: reajuste-arriendo-contrato-uf-ipc` |
| `uf-costo-de-vida` | IPC, inflación y lectura del costo de vida | `/posts/que-es-el-ipc-chile-como-se-calcula/` | `/posts/que-es-la-uf/`, `/calculadoras/conversor-uf/`, `/calculadoras/reajuste-arriendo/` | Frente endurecido el 2026-03-12. La URL queda en `cluster: uf-costo-de-vida`, `category: general`, `topicRole: owner`, `canonicalTopic: ipc-inflacion-costo-de-vida` |

## Uso operativo

1. Antes de abrir una nueva pieza, mapearla a una fila existente.
2. Si no existe fila, crear una y definir owner antes de redactar.
3. Si una idea entra en una fila ya ocupada por otro owner, decidir entre:
   - ampliar la pieza actual,
   - crear supporting content con intención distinta,
   - o descartar la nueva URL.
