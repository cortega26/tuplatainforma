# Estrategia de Contenido SEO para Tu Plata Informa

## Contexto, alcance y metodología

Este informe define una estrategia editorial SEO (2–3 meses) para un portal educativo de finanzas personales orientado al chileno sin expertise financiero, priorizando **autoridad temática** y **confianza** por sobre CTAs comerciales tempranos. La investigación se ejecutó el **24/02/2026** (America/Santiago) y se centró en señales cualitativas de demanda en Chile: diversidad de SERP, presencia de trámites oficiales, recurrencia de dudas en guías/FAQ oficiales y privadas, y concentración de resultados en comparadores/afiliados. Cuando no hay datos de volumen exactos, **no se inventan números**: se usa clasificación Alta/Media/Baja con transparencia epistémica.

Fuentes consultadas (representativas, no exhaustivas) incluyen organismos y portales oficiales como entity["organization","Servicio de Impuestos Internos","chilean tax agency"], entity["organization","Comisión para el Mercado Financiero","chilean financial regulator"], entity["organization","ChileAtiende","govt services portal chile"], entity["organization","AFC Chile","unemployment insurance admin"], entity["organization","Superintendencia de Pensiones","pensions regulator chile"], entity["organization","Superintendencia de Seguridad Social","social security supervisor cl"], entity["organization","Superintendencia de Insolvencia y Reemprendimiento","insolvency regulator chile"], entity["organization","Servicio Nacional del Consumidor","chilean consumer agency"], entity["organization","Banco Central de Chile","central bank chile"], entity["organization","Tesorería General de la República","chilean treasury agency"], entity["organization","Biblioteca del Congreso Nacional de Chile","chilean law library"], entity["organization","CSIRT de Gobierno","govt csirt chile"], entity["organization","Comisión Ingresa","student loan cae agency"], entity["organization","Dirección del Trabajo","labor directorate chile"], entity["organization","Subsecretaría de Previsión Social","social security undersecretary"], entity["organization","Instituto Nacional de Estadísticas","national statistics institute cl"], entity["organization","Fonasa","public health insurer chile"] y entity["organization","Superintendencia de Salud","health superintendency cl"]. Se contrastaron además fuentes privadas/mercado como entity["company","BancoEstado","state-owned bank chile"], entity["company","Banco Santander Chile","bank in chile"], entity["company","Banco de Crédito e Inversiones","bci bank chile"], entity["company","Banco Falabella","bank in chile"], entity["company","Fintual","investment fintech chile"], entity["company","BTG Pactual Chile","investment bank chile"], entity["company","ComparaOnline","comparison site chile"], entity["company","Equifax","credit bureau firm"] y entity["organization","Boletín Comercial","commercial bulletin chile"].

Limitaciones explícitas: (i) sin acceso a volúmenes exactos de búsqueda, (ii) extracción de “People Also Ask” (PAA) como señal indirecta —se aproxima mediante FAQs recurrentes y SERP observada— y por eso se etiqueta mayormente como **[INFERENCIA]** o **[SUPUESTO]**.

## Fase 1: Diagnóstico de demanda por cluster

**Entregable A — Tabla de Demanda por Cluster** (10 consultas por cluster; ES-CL real; intención; estacionalidad; señal; tipo de señal; competencia; observación).

**Cluster: Deudas y Crédito**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| cómo saber si estoy en dicom gratis | Verificación | Perenne | Alta | [INFERENCIA] | buró + bancos + “defensa deudores” | Se mezcla “DICOM” con “Informe CMF” (confusión estructural). |
| como saco el informe de deudas cmf con clave unica | Procedimental | Perenne | Alta | [INFERENCIA] | CMF/ChileAtiende + bancos | El trámite existe y es gratuito, pero no se entiende qué incluye. |
| conoce tu deuda cmf no me deja entrar | Procedimental | Perenne | Media | [INFERENCIA] | soporte/foros + oficial | Duda típica de acceso (ClaveÚnica, RUN, errores). |
| renegociacion superir requisitos 80 uf | Procedimental | Perenne | Media | [INFERENCIA] | Superir/ChileAtiende + abogados | La regla “80 UF/90 días/2 deudas” genera búsqueda puntual. |
| renegociar deudas sin abogado chile (superir) | Procedimental | Perenne | Media | [INFERENCIA] | oficial + estudios jurídicos | La necesidad es “arreglar mi vida financiera” sin juicio. |
| consolidar deudas me conviene o me cagan | Comparativa | Perenne | Media | [INFERENCIA] | bancos + comparadores | Lenguaje desconfiado: busca costo real y trampas. |
| repactar deuda banco vs renegociacion | Comparativa | Perenne | Media | [INFERENCIA] | bancos + abogados | Confunde repactación comercial con procedimiento concursal. |
| tasa maxima convencional 2026 cuanto es | Verificación | Mensual (tasas) | Media | [INFERENCIA] | CMF + prensa/educación | Consulta reacciona a “tasa tope” y mora. |
| qué es la CAE de un crédito y cómo se calcula | Informativa | Perenne | Media | [INFERENCIA] | SERNAC + comparadores + bancos | Acronimia ambigua: CAE (crédito) vs CAE (estudiantil). |
| qué pasa si dejo de pagar el CAE (crédito estudiantil) | Verificación | Perenne (picos académicos) | Media | [INFERENCIA] | Ingresa/ChileAtiende + bancos + abogados | Alto estrés; necesidad de opciones (suspensión, rebaja). |

Patrones recurrentes: “cómo saber si…”, “qué pasa si…”, “me conviene… vs …”. PAA estimado (por recurrencia en guías/FAQ): “¿El informe CMF es lo mismo que DICOM?”, “¿Qué deudas aparecen/no aparecen?”, “¿Puedo renegociar si emito boletas?”, “¿Cuánto demora?”. **[INFERENCIA]**.

Soportes observados que sustentan la demanda (muestras): el informe CMF existe, se obtiene con ClaveÚnica, es gratuito y declara desfase de actualización; esto dispara búsquedas “cómo descargar” y “por qué no aparece X”. citeturn19view2. La renegociación concursal tiene umbrales y requisitos explícitos (2+ deudas, 90 días, 80 UF), alimentando consultas exactas de regla. citeturn20view0turn20view1. El reporte comercial gratuito cada 4 meses y su acceso también es fuente de búsqueda “gratis”. citeturn10search10turn10search18.

**Cluster: Impuestos Personas**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| operacion renta 2026 fechas | Verificación | Pico mar–may | Alta | [INFERENCIA] | SII + prensa + contadores | “Fechas” = miedo a multa + devolución. |
| cuando depositan la devolucion de impuestos 2026 | Verificación | Pico abr–may | Alta | [INFERENCIA] | SII + ChileAtiende + prensa | Se mezcla con “retención/compensación”. |
| como revisar la propuesta del sii (f22) | Procedimental | Pico abr | Alta | [INFERENCIA] | SII + blogs contables | Intención: “no meter la pata” en la propuesta. |
| como rectificar el f22 por internet | Procedimental | Pico abr–jun | Media | [INFERENCIA] | SII + asesorías | Rectificar = devolución retenida o error en renta/cargas. |
| sii me retuvo la devolucion por deudas (compensacion) | Verificación | Pico abr–jun | Media | [INFERENCIA] | SII + TGR + foros | Busca “por qué” y “cómo liberar”. |
| boleta de honorarios 2026 15,25 cuanto me llega liquido | Verificación | Pico ene + abr | Alta | [DATO] | SII + ChileAtiende | La tasa 15,25% desde 01/01/2026 es explícita. citeturn21view0turn21view1 |
| retencion boleta honorarios 2026 porcentaje | Verificación | Pico ene | Alta | [DATO] | SII | Pregunta directa a tasa legal y escalamiento. citeturn21view0turn21view2 |
| tengo dos empleadores debo declarar renta? | Verificación | Pico mar–may | Media | [INFERENCIA] | SII + blogs | Perfil poco atendido en lenguaje simple. |
| declarar renta sin obligacion para que me devuelvan | Procedimental | Pico abr | Media | [INFERENCIA] | SII + foros | Intención: “quiero devolución aunque no esté obligado”. |
| clave tributaria sii se me olvido | Procedimental | Pico abr | Media | [INFERENCIA] | SII + soporte | Problema de acceso, no de concepto. |

Patrones recurrentes: “fechas”, “cuándo depositan”, “cómo revisar propuesta”, “por qué me retuvieron”. PAA estimado: “¿Qué pasa si no declaro?”, “¿Por qué no me devolvieron?”, “¿Cómo se calcula la retención de honorarios?”, “¿Cómo se hace la rectificación?”. **[INFERENCIA]**.

Soportes clave: SII publica explícitamente el cambio de retención 14,5% → 15,25% desde 01/01/2026 y el escalamiento a 17% en 2028. citeturn21view0turn21view2. ChileAtiende relaciona emisión de boletas 2025 con cotización obligatoria vía Operación Renta 2026 y cobertura anual (1 julio 2026–30 junio 2027), lo que explica las dudas recurrentes de “me llega líquido / cobertura”. citeturn21view1.

**Cluster: Ahorro e Inversión**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| deposito a plazo en uf o pesos que conviene | Comparativa | Perenne | Media | [INFERENCIA] | bancos + fintech + prensa | Busca “protección inflación vs certeza”. |
| mejores tasas deposito a plazo hoy chile | Transaccional | Perenne | Media | [INFERENCIA] | bancos + comparadores | Difícil competir sin convertirse en comparador. |
| como comparar depositos a plazo (tasa anual vs mensual) | Informativa | Perenne | Media | [INFERENCIA] | bancos + educación financiera | Gap típico: “tasa” sin explicar base y condiciones. |
| fondo mutuo que es y como rescatar | Procedimental | Perenne | Media | [INFERENCIA] | CMF + fintech + AGF | “Rescate” es palabra clave de ansiedad. |
| comisiones fondos mutuos cuanto cobran | Verificación | Perenne | Media | [INFERENCIA] | CMF + privadas | Quiere costo total, no solo “comisión administración”. |
| fondos mutuos pagan impuestos al rescatar? | Verificación | Perenne | Media | [INFERENCIA] | SII + blogs | Alta fricción: tributación explicada con jerga. |
| apv regimen a o b cual me conviene | Comparativa | Pico mar–abr | Media | [INFERENCIA] | CMF + bancos/fintech | Gap: elegir por tramo y objetivo, sin vender producto. |
| como invertir en etf desde chile | Procedimental | Perenne | Media | [INFERENCIA] | fintech + corredoras | Se mezcla con “impuestos / comisiones / custodia”. |
| comisiones corredora bolsa chile cuanto cobran | Verificación | Perenne | Media | [INFERENCIA] | corredoras + fintech | Quieren costo real (comisión, spread, custodia). |
| como declarar acciones o inversiones en el extranjero sii | Procedimental | Pico abr | Media | [INFERENCIA] | SII + contadores | Tema tributario “inversión” de alto riesgo editorial. |

Patrones recurrentes: “qué conviene”, “cuánto cobran”, “cómo rescatar”, “pagan impuestos”. PAA estimado: “¿Qué diferencia hay entre ETF y fondo mutuo?”, “¿Cuánto demora un rescate?”, “¿Qué comisiones existen además de la ‘comisión’?”, “¿Cómo se declaran?”. **[INFERENCIA]**.

Soportes observados: bancos y plataformas promueven acceso a acciones/ETF, lo que sostiene demanda procedimental. citeturn1search25turn15search38. CMF y SII tienen contenido base sobre fondos mutuos y su tratamiento, pero no necesariamente aterrizado a “chileno de a pie”. citeturn12search15turn12search1.

**Cluster: Pensiones y Protección Social**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| como saber mi saldo seguro de cesantia afc | Procedimental | Perenne | Alta | [INFERENCIA] | AFC + ChileAtiende + bancos | Intención: “plata disponible” con RUT/clave. |
| como cobrar seguro de cesantia por internet | Procedimental | Perenne | Alta | [INFERENCIA] | AFC + ChileAtiende | Necesita pasos + documentos + plazos reales. |
| seguro de cesantia requisitos 10 cotizaciones | Verificación | Perenne | Media | [INFERENCIA] | AFC + blogs | Consulta específica de umbral (depende causal/beneficio). |
| licencia medica menos de 11 dias quien paga | Verificación | Perenne (picos invierno) | Media | [INFERENCIA] | SUSESO + foros | Miedo: “me la rechazaron / no me pagaron”. |
| desde que dia pagan licencia medica | Verificación | Perenne | Media | [INFERENCIA] | SUSESO + blogs | Busca regla simple + excepciones. |
| plazo para cobrar subsidio incapacidad laboral | Verificación | Perenne | Media | [INFERENCIA] | SUSESO | Duda administrativa típica (plazos). |
| beneficio años cotizados bac cuanto pagan | Verificación | Pico 2026 | Media | [DATO] | BCN + prensa | Reforma previsional activa beneficios desde 2026. citeturn17view1 |
| reforma de pensiones 7% empleador como me afecta | Informativa | 2025–2027 | Media | [DATO] | BCN + ChileAtiende + prensa | Cronograma y porcentajes explicitados en guías. citeturn17view1turn23search3 |
| fondos generacionales reemplazan multifondos 2027 | Informativa | 2026–2027 | Media | [DATO] | Super Pensiones + prensa | Cambio está declarado para abril 2027. citeturn17view2turn17view1 |
| cambiarse de afp online cuanto demora | Procedimental | Perenne | Media | [INFERENCIA] | AFP + SPensiones | Oportunidad, pero el sitio ya cubre “cambio de AFP” (cautela). |

Patrones recurrentes: “cómo cobrar”, “cómo saber saldo”, “quién paga”, “desde cuándo”. PAA estimado: “¿Qué pasa si me rechazan la licencia?”, “¿Cómo apelar?”, “¿Qué documentos necesito para AFC?”, “¿Cómo me afecta la reforma?”. **[INFERENCIA]**.

Soportes: reforma previsional 2025 tiene elementos concretos (7% adicional empleador gradual; beneficios desde enero 2026; vigencia general abril 2027) y genera dudas masivas porque mezcla cronogramas y conceptos. citeturn17view1turn17view2.

**Cluster: Presupuesto y Costo de Vida**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| valor uf hoy | Verificación | Perenne | Alta | [INFERENCIA] | bancos + conversores + prensa | Query ultra frecuente; alto AdSense y baja intención comercial. |
| uf a pesos conversor | Procedimental | Perenne | Alta | [INFERENCIA] | conversores + bancos | Oportunidad de utilitario simple + explicación. |
| como se calcula la uf con el ipc | Informativa | Perenne | Media | [DATO] | Banco Central + educación | La metodología UF depende del IPC y días 10–9. citeturn25view0 |
| como calcular sueldo liquido en chile | Procedimental | Perenne | Alta | [INFERENCIA] | calculadoras + RRHH/blogs | Gap: explicar descuentos reales + casos. |
| por que mi sueldo liquido baja si me suben el bruto | Verificación | Perenne | Media | [INFERENCIA] | foros + blogs | Excelente para autoridad (“te explico tu liquidación”). |
| regla 50 30 20 presupuesto chile | Informativa | Perenne | Media | [SUPUESTO] | blogs | No siempre aplica en Chile (costo vivienda). Riesgo editorial de “importar recetas”. |
| como hacer un presupuesto mensual | Procedimental | Perenne | Media | [INFERENCIA] | CMF Educa + blogs | Oportunidad de guía + plantilla descargable. |
| que es el gasto hormiga | Informativa | Perenne | Media | [INFERENCIA] | blogs | Tema “popular”, pero riesgo de superficialidad. |
| ipc que es y para que sirve | Informativa | Perenne | Media | [INFERENCIA] | INE + prensa/educación | Puente directo UF/ reajustes / arriendos. |
| como reajustar arriendo por ipc o uf | Procedimental | Perenne | Media | [INFERENCIA] | inmobiliarias + abogados | Alto riesgo legal; requiere tono cuidadoso. |

Patrones: “cómo calcular”, “por qué me pasa”, “qué es”. PAA estimado: “¿UF sube todos los días?”, “¿qué descuentos son obligatorios?”, “¿qué diferencia entre sueldo imponible y líquido?”. **[INFERENCIA]**.

Soportes: Banco Central define UF como índice de reajustabilidad, con reajuste diario del 10 al 9 según variación IPC del mes previo. citeturn25view0. SII publica tabla mensual del Impuesto Único de Segunda Categoría, alimentando consultas de “por qué mi líquido cambió”. citeturn22view0.

**Cluster: Fraudes y Seguridad Financiera**

| Consulta real (ES-CL) | Intención | Estacionalidad | Señal de demanda | Tipo de señal | Competencia SERP | Observación |
|---|---|---|---|---|---|---|
| me hicieron compras con mi tarjeta que hago chile | Procedimental | Perenne (picos eventos) | Alta | [INFERENCIA] | SERNAC + bancos + foros | Intención inmediata: “qué hago ahora”. |
| transferencia no reconocida banco que hago | Procedimental | Perenne | Alta | [INFERENCIA] | SERNAC/CMF + foros | Duda crítica por plazos. |
| fraude banco plazo para reclamar ley 20009 | Verificación | Perenne | Alta | [DATO] | SERNAC + CMF Educa | Plazos (30 días hábiles, umbrales UF) están explicitados. citeturn16view1turn16view2 |
| sernac reclamo fraude tarjeta | Procedimental | Perenne | Media | [INFERENCIA] | SERNAC + guías | Quieren paso-a-paso y checklist de documentos. |
| cmf reclamo banco por fraude | Procedimental | Perenne | Media | [INFERENCIA] | CMF + foros | Confusión: reclamo al banco vs regulador vs SERNAC. |
| me llamaron del banco y me estafaron (vishing) que hago | Procedimental | Perenne | Media | [INFERENCIA] | CSIRT + prensa | Vishing es muy chileno (llamada “del banco”). |
| portabilidad numerica fraudulenta como me doy cuenta | Verificación | Perenne | Media | [DATO] | SERNAC reportes | Aparece como modalidad detectada. citeturn5view0 |
| estafa marketplace mercado libre facebook como evitar | Informativa | Perenne | Media | [SUPUESTO] | blogs + medios | Alta conversación social; difícil “SEO puro” sin enfoque financiero. |
| credito por whatsapp estafa chile | Informativa | Perenne | Media | [INFERENCIA] | SERNAC reportes + prensa | Conecta con “préstamos falsos / suplantación”. |
| inversiones falsas como denunciar cmf alertas ciudadanas | Procedimental | Perenne | Media | [INFERENCIA] | CMF + prensa | Puente a autoridad: “verifica regulados antes”. |

Patrones: “qué hago”, “plazo”, “dónde reclamo”, “me llamaron”. PAA estimado: “¿Cuánto me devuelven?”, “¿Tengo que denunciar?”, “¿Qué pasa si el banco dice culpa mía?”, “¿Qué hago en las primeras 24 horas?”. **[INFERENCIA]**.

Soportes: guías oficiales describen pasos (avisar y bloquear; reclamo formal; denuncia; entrega de comprobante) y plazos (30 días hábiles, hasta 60 días corridos previos; umbral 35 UF; 10/15 días hábiles; 7 días adicionales). citeturn16view1turn16view2. Además, SERNAC publicó dictamen 24/02/2026 reforzando que bancos no pueden descartar fraudes unilateralmente sin resolución judicial, lo que probablemente incrementa búsqueda y cobertura mediática. citeturn16view0.

## Fase 1: Oferta existente y evaluación de calidad

**Entregable 1B — Evaluación de oferta (rúbrica 1–5)**  
Lectura: 1 malo / 3 regular / 5 bueno. Estas notas son **juicio editorial** basado en revisión de páginas y herramientas concretas (links en comentarios).

| Fuente (tipo) | Lenguaje | Completitud | Actualización | Utilidad práctica | Perfil lector | Comentario (evidencia) |
|---|---:|---:|---:|---:|---:|---|
| SII (oficial) | 2 | 4 | 5 | 4 | 3 | Muy correcto pero “tributario”: alto costo cognitivo para novatos; buen soporte de cambios 2026 (retención). `https://www.sii.cl/destacados/boletas_honorarios/` citeturn21view0turn11search4 |
| CMF / CMF Educa (oficial) | 4 | 4 | 4 | 4 | 4 | Buen equilibrio educación + herramientas; define pasos y vigencias (fraude, simuladores). `https://www.cmfchile.cl/educa/…` citeturn16view2turn15search17turn13search0 |
| ChileAtiende (oficial) | 4 | 4 | 4 | 4 | 4 | Muy “cómo hacer”; útil para perfiles (honorarios) aunque a veces resume demasiado. `https://www.chileatiende.gob.cl/fichas/12016…` citeturn21view1turn20view1 |
| SERNAC (oficial) | 4 | 4 | 4 | 5 | 4 | Excelente en fraude: paso a paso + plazos; buen lenguaje ciudadano. `https://www.sernac.cl/portal/604/w3-propertyname-791.html` citeturn16view1turn16view0 |
| Superir (oficial) | 3 | 5 | 4 | 4 | 3 | Completo y con requisitos claros; lenguaje aún “procedimiento”, mejorable con ejemplos. `https://www.superir.gob.cl/perfil-deudor-requisito-renegociacion/` citeturn20view0 |
| Superintendencia de Pensiones (oficial) | 3 | 4 | 4 | 3 | 3 | Mucha norma y detalle; relevante para cotización 10% y cambios 2026/2027. `https://www.spensiones.cl/…/cotizacion-previsional-obligatoria` citeturn24view0turn17view2 |
| SUSESO (oficial) | 3 | 4 | 3 | 3 | 2 | Técnica; útil como fuente primaria, pero no didáctica para el “chileno de a pie”. Ejemplo CAE crédito (sí, otra CAE). `https://www.suseso.cl/606/w3-article-19878.html` citeturn14search18turn15search26 |
| Banco Central (oficial) | 2 | 4 | 4 | 3 | 2 | Fuente primaria UF/IPC; método es técnico, bueno para citar, malo para explicar. `https://si3.bcentral.cl/…/UF.pdf` citeturn25view0 |
| AFC (oficial/operador) | 3 | 4 | 4 | 4 | 3 | Trámites claros, pero el usuario se pierda en causales y combinaciones de beneficios. (Se apoya en ChileAtiende para guía). citeturn0search3turn0search6turn8search3 |
| BancoEstado (privada) | 4 | 3 | 3 | 3 | 3 | Claro y “producto-céntrico”; útil para ejemplos pero sesgo comercial. `https://www.bancoestado.cl/…/credito-de-consumo…` citeturn15search33turn14search15 |
| Fintual (privada) | 4 | 3 | 3 | 3 | 4 | Muy entendible; foco en inversión (sesgo por producto), bueno como contraste. citeturn1search15turn1search18 |
| ComparaOnline (privada) | 3 | 2 | 2 | 3 | 3 | Tiende a “contenido puente” a conversión; útil para sondeo de términos, no para autoridad neutral. `https://www.comparaonline.cl/credito-consumo/tip/...` citeturn15search1turn15search29 |

Conclusión de oferta: el contenido oficial suele ser **correcto pero técnico** (SII, Banco Central, SUSESO), mientras que el contenido privado suele ser **claro pero sesgado** (producto o afiliación). El gap más común es el “**cómo hacer**” + “**casos reales**” + “**errores frecuentes**” en español chileno simple, con fuentes primarias bien citadas.

## Fase 1: Mapa de gaps prioritarios

**Entregable — Mapa de Gaps Prioritarios (15 gaps, ordenados por potencial)**  
Formato: descriptivo; cada gap incluye URLs en código (requerimiento del prompt). Las condiciones de gap se indican como “Condiciones: …” (de la lista 1–7).

**Gap: Confusión estructural entre Informe CMF y DICOM**

CLUSTER: Deudas y Crédito  
CONSULTA ANCLA: “cómo sacar informe de deudas cmf con clave única”  
QUÉ BUSCA REALMENTE EL USUARIO: entender **todas** sus deudas y si “sale en DICOM”, y qué significa para conseguir crédito/arriendo.  
QUÉ EXISTE HOY:  
- `https://www.cmfchile.cl/portal/principal/613/w3-article-95399.html` — trámite y alcance del informe CMF citeturn19view2  
- `https://conocetudeuda.cmfchile.cl/` — portal de acceso (JS) citeturn19view0turn19view2  
- `https://www.boletincomercial.cl/` — acceso a informe comercial gratis c/4 meses (Ley 20.575) citeturn10search10turn10search18  
QUÉ FALTA EXACTAMENTE: una guía neutral que explique “qué aparece / qué NO aparece”, desfase de datos (10–20 días) y cómo usarlo sin paranoia. citeturn19view2  
PERFILES MAL ATENDIDOS: arrendatarios jóvenes; primer empleo; migrantes con residencia definitiva que no entienden historial crediticio.  
RIESGO DE DESACTUALIZACIÓN: Bajo (cambia poco; solo interfaz/alcance).  
POTENCIAL DE MONETIZACIÓN: Autoridad-pura.  
FUENTES CLAVE A CITAR: las 3 URLs anteriores + guía oficial sobre gratuidad informe comercial. citeturn10search10turn10search18turn19view2  
Condiciones: 1 + 3 + 7.

**Gap: Renegociación Superir “en simple” con checklist de documentos**

CLUSTER: Deudas y Crédito  
CONSULTA ANCLA: “renegociación superir requisitos 80 uf”  
QUÉ BUSCA REALMENTE EL USUARIO: saber si califica, qué documentos juntar, cuánto demora y qué pasa si falla.  
QUÉ EXISTE HOY:  
- `https://www.superir.gob.cl/perfil-deudor-requisito-renegociacion/` — requisitos y audiencias citeturn20view0  
- `https://www.chileatiende.gob.cl/fichas/37401-renegociacion-de-las-deudas-de-una-persona` — resumen del trámite citeturn20view1  
QUÉ FALTA EXACTAMENTE: material “anti-error” (ej. confundir 80 UF total vs cada deuda; no tener declaraciones juradas; entrar con documentos incompletos) + casos por perfil (honorarios, cesante, con juicio).  
PERFILES MAL ATENDIDOS: trabajador a honorarios; persona con 2+ acreedores y cobranzas agresivas; familias con ingresos variables.  
RIESGO DE DESACTUALIZACIÓN: Medio (umbral o plataforma puede ajustarse; plazos y audiencias son estables).  
POTENCIAL DE MONETIZACIÓN: Autoridad-pura (y AdSense medio por alto tiempo en página).  
FUENTES CLAVE A CITAR: URLs anteriores. citeturn20view0turn20view1  
Condiciones: 1 + 3 + 4 + 7.

**Gap: “Fraude en medios de pago” con timeline 24h/7d/30d y documentos**

CLUSTER: Fraudes y Seguridad Financiera  
CONSULTA ANCLA: “fraude banco plazo para reclamar ley 20009”  
QUÉ BUSCA REALMENTE EL USUARIO: instrucciones de crisis + plazos + qué hacer si banco dice “culpa tuya”.  
QUÉ EXISTE HOY:  
- `https://www.sernac.cl/portal/604/w3-propertyname-791.html` — pasos y plazos Ley 20.009 citeturn16view1  
- `https://www.cmfchile.cl/educa/621/w3-article-29826.html` — explicación y derechos/deberes citeturn16view2  
- `https://www.sernac.cl/portal/604/w3-article-88179.html` — dictamen 24/02/2026 citeturn16view0  
QUÉ FALTA EXACTAMENTE: una guía “una sola página” que ordene: aviso/bloqueo → reclamo formal → denuncia → entrega comprobante, y qué evidencia guardar (capturas, folios).  
PERFILES MAL ATENDIDOS: adultos mayores; usuarios de banco digital; personas con baja alfabetización digital.  
RIESGO DE DESACTUALIZACIÓN: Medio (criterios/interpretaciones y umbrales UF pueden actualizarse).  
POTENCIAL DE MONETIZACIÓN: AdSense-alto + Autoridad-pura.  
FUENTES CLAVE A CITAR: URLs anteriores. citeturn16view0turn16view1turn16view2  
Condiciones: 1 + 3 + 5 + 7.

**Gap: Estafas “a la chilena” con señales rojas accionables**

CLUSTER: Fraudes y Seguridad Financiera  
CONSULTA ANCLA: “me llamaron del banco y me estafaron (vishing) que hago”  
QUÉ BUSCA REALMENTE EL USUARIO: reconocer patrón y cortar daño (bloquear, cambiar claves, alertar).  
QUÉ EXISTE HOY:  
- `https://www.sernac.cl/portal/604/w3-propertyname-791.html` — marco de restitución cuando hubo operaciones citeturn16view1  
- Reporte SERNAC fraude incluye alertas CSIRT y tipologías (phishing, portabilidad fraudulenta). citeturn5view0  
- `https://www.csirt.gob.cl/alertas/` (alertas públicas) citeturn7search7  
QUÉ FALTA EXACTAMENTE: checklist por canal (llamada/SMS/WhatsApp/marketplace) + “frases típicas” + pasos preventivos.  
PERFILES MAL ATENDIDOS: pymes y emprendedores; adultos mayores; compradores en marketplace.  
RIESGO DE DESACTUALIZACIÓN: Medio (tipos cambian, pero estructura de señales rojas se mantiene).  
POTENCIAL DE MONETIZACIÓN: AdSense-alto.  
FUENTES CLAVE A CITAR: SERNAC (especial + reporte) + CSIRT. citeturn5view0turn16view1turn7search7  
Condiciones: 1 + 6 + 7.

**Gap: UF explicada con impacto cotidiano y “por qué sube todos los días”**

CLUSTER: Presupuesto y Costo de Vida  
CONSULTA ANCLA: “cómo se calcula la uf con el ipc”  
QUÉ BUSCA REALMENTE EL USUARIO: entender reajuste (arriendo/dividendo) sin matemáticas avanzadas.  
QUÉ EXISTE HOY:  
- `https://si3.bcentral.cl/estadisticas/Principal1/Metodologias/EMF/UF.pdf` — definición y cálculo UF citeturn25view0  
- `https://www.ine.cl/estadisticas/economia/indices-de-precio-e-inflacion/indice-de-precios-al-consumidor` — IPC (fuente UF) citeturn25view0turn9search4  
QUÉ FALTA EXACTAMENTE: puente “UF → tu vida”: ejemplo numérico (arriendo en UF), desfase temporal (IPC mes anterior), y mitigaciones.  
PERFILES MAL ATENDIDOS: arrendatarios; familias con créditos indexados; estudiantes.  
RIESGO DE DESACTUALIZACIÓN: Bajo (metodología estable).  
POTENCIAL DE MONETIZACIÓN: AdSense-alto.  
FUENTES CLAVE A CITAR: URLs anteriores. citeturn25view0turn9search4  
Condiciones: 1 + 7.

**Gap: Sueldo líquido explicado desde fuentes primarias (no “calculadora”)**

CLUSTER: Presupuesto y Costo de Vida  
CONSULTA ANCLA: “cómo calcular sueldo líquido en chile”  
QUÉ BUSCA REALMENTE EL USUARIO: entender descuentos obligatorios y por qué cambian (impuesto, tope imponible, tipo contrato).  
QUÉ EXISTE HOY:  
- `https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm` — impuesto único (tabla mensual) citeturn22view0  
- `https://www.spensiones.cl/…/cotizacion-previsional-obligatoria` — 10% AFP (+ comisión + SIS) citeturn24view0  
- `https://www.dt.gob.cl/portal/1628/w3-article-95306.html` — cotización seguro cesantía según contrato citeturn22view1  
QUÉ FALTA EXACTAMENTE: guía “lee tu liquidación” + casos (plazo fijo vs indefinido; imponible distinto; bono no imponible; segundo empleador).  
PERFILES MAL ATENDIDOS: primer empleo; dos empleadores; trabajadores de casa particular.  
RIESGO DE DESACTUALIZACIÓN: Medio (tabla impuesto mensual; tasas SIS/comisiones cambian). citeturn22view0turn24view0  
POTENCIAL DE MONETIZACIÓN: Autoridad-pura + AdSense-alto.  
FUENTES CLAVE A CITAR: URLs anteriores. citeturn22view0turn22view1turn24view0  
Condiciones: 1 + 3 + 4 + 7.

**Gap: Boleta honorarios 2026 — “líquido vs cobertura” y decisión informada**

CLUSTER: Impuestos Personas  
CONSULTA ANCLA: “boleta honorarios 2026 15,25 cuanto me llega liquido”  
QUÉ BUSCA REALMENTE EL USUARIO: cuánto recibe hoy y qué gana/pierde en cobertura previsional por Operación Renta.  
QUÉ EXISTE HOY:  
- `https://www.sii.cl/destacados/boletas_honorarios/` — retención 15,25% y simulador citeturn21view0  
- `https://www.chileatiende.gob.cl/fichas/12016-cotizacion-de-trabajadores-que-emiten-boletas-de-honorarios` — obligación/beneficios/cobertura citeturn21view1  
QUÉ FALTA EXACTAMENTE: explicación “sin slogans”: cómo se conecta retención mensual con cotización anual y cobertura; casos (monto bajo, exentos, pensionados).  
PERFILES MAL ATENDIDOS: honorarios intermitentes; independientes con contrato parcial; quienes pasan el umbral por poco.  
RIESGO DE DESACTUALIZACIÓN: Alto (tasas suben 2027/2028; reglas operativas cambian). citeturn21view2turn21view1  
POTENCIAL DE MONETIZACIÓN: Autoridad-pura (y AdSense).  
FUENTES CLAVE A CITAR: URLs anteriores + escalamiento. `https://www.sii.cl/destacados/boletas_honorarios/aumento_gradual.html` citeturn21view2  
Condiciones: 1 + 5 + 7.

**Gap: Devolución de impuestos explicada desde “plazos y compensaciones”**

CLUSTER: Impuestos Personas  
CONSULTA ANCLA: “cuando depositan la devolucion de impuestos 2026”  
QUÉ BUSCA REALMENTE EL USUARIO: fecha, estado, y por qué se atrasa o se compensa con deudas.  
QUÉ EXISTE HOY:  
- `https://www.sii.cl/ayudas/ayudas_por_servicios/2888-plazos.htm` — plazos y relación declaración/devolución citeturn0search9turn11search22  
- Página SII “declaración en plazo y devolución” (FAQ). citeturn11search8  
QUÉ FALTA EXACTAMENTE: guía con “árbol de decisión”: declaré tal día → me toca tal fecha; si no llegó → revisar causas comunes; cómo leer “compensación”.  
PERFILES MAL ATENDIDOS: trabajadores con dos empleadores; personas con deuda fiscal/tesorería; honorarios.  
RIESGO DE DESACTUALIZACIÓN: Medio (cada año cambia calendario).  
POTENCIAL DE MONETIZACIÓN: AdSense-alto.  
FUENTES CLAVE A CITAR: URLs SII. citeturn0search9turn11search8turn11search22  
Condiciones: 1 + 3 + 7.

**Gap: Reforma previsional 2025/2026/2027 aterrizada a “qué cambia para mí”**

CLUSTER: Pensiones y Protección Social  
CONSULTA ANCLA: “reforma de pensiones 7% empleador como me afecta”  
QUÉ BUSCA REALMENTE EL USUARIO: qué parte es su cuenta, qué parte es seguro social, y desde cuándo.  
QUÉ EXISTE HOY:  
- Guía BCN Ley Fácil (resumen y cronograma) `https://www.bcn.cl/api-leyfacil/...` citeturn17view1  
- Comunicado sobre Fondos Generacionales (reemplazo multifondos abril 2027) citeturn17view2  
- Página ChileAtiende “Aportes del empleador” (cronograma) citeturn23search3  
QUÉ FALTA EXACTAMENTE: un “mapa visual” de porcentajes y una sección de preguntas incómodas (¿aumenta mi sueldo líquido?, ¿qué pasa en licencias?, ¿independientes?).  
PERFILES MAL ATENDIDOS: independientes; trabajadores con licencias médicas; personas cercanas a jubilar.  
RIESGO DE DESACTUALIZACIÓN: Alto (reglamentos y cronogramas pueden moverse).  
POTENCIAL DE MONETIZACIÓN: Autoridad-pura.  
FUENTES CLAVE A CITAR: BCN + SPensiones + ChileAtiende. citeturn17view1turn17view2turn23search3  
Condiciones: 5 + 7.

(Se identificaron más gaps relevantes; para no inflar texto, la estrategia de artículos (Fase 2) se enfoca en un subconjunto de 15 oportunidades que maximizan autoridad/evergreen y cubren los 6 clusters de forma balanceada.)

## Fase 2: Portafolio de artículos evergreen priorizados

**Entregable — Tabla resumen con scoring (ordenada por Score desc.)**  
Escala 1–5 por criterio. Score = Demanda×0,30 + Gap×0,25 + Evergreen×0,20 + Utilidad×0,15 + Competencia×0,10.

| # | Título tentativo | Cluster | Demanda | Gap | Evergreen | Utilidad | Competencia | Score | Monetización |
|---:|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Cómo calcular tu sueldo líquido y leer tu liquidación en Chile (sin perderte) | Presupuesto y Costo de Vida | 5 | 4 | 5 | 5 | 3 | 4,55 | Autoridad-pura |
| 2 | Informe de Deudas CMF: cómo sacarlo, entenderlo y qué NO es (DICOM) | Deudas y Crédito | 4 | 5 | 5 | 5 | 3 | 4,50 | Autoridad-pura |
| 3 | UF en simple: qué es, cómo se calcula y por qué afecta tu arriendo/dividendo | Presupuesto y Costo de Vida | 5 | 4 | 5 | 4 | 3 | 4,40 | AdSense-alto |
| 4 | Fraude con tarjeta/transferencia: qué hacer en 24 horas, plazos y derechos (Ley 20.009) | Fraudes y Seguridad Financiera | 5 | 4 | 4 | 5 | 3 | 4,35 | AdSense-alto |
| 5 | Renegociación Superir: requisitos, paso a paso y errores que te rechazan la solicitud | Deudas y Crédito | 4 | 5 | 4 | 5 | 3 | 4,30 | Autoridad-pura |
| 6 | Seguro de Cesantía: cómo saber tu saldo y cobrarlo (guía sin letra chica) | Pensiones y Protección Social | 4 | 4 | 5 | 5 | 3 | 4,25 | Autoridad-pura |
| 7 | Licencia médica: desde qué día se paga y qué hacer si no te pagan | Pensiones y Protección Social | 4 | 4 | 5 | 5 | 3 | 4,25 | Autoridad-pura |
| 8 | Devolución de impuestos: fechas, estado y causas típicas de retención/compensación | Impuestos Personas | 5 | 4 | 3 | 5 | 3 | 4,15 | AdSense-alto |
| 9 | Depósito a plazo: pesos vs UF, cómo comparar tasas y evitar trampas comunes | Ahorro e Inversión | 4 | 4 | 5 | 4 | 3 | 4,10 | Afiliación-indirecta |
| 10 | Estafas comunes en Chile: vishing, portabilidad fraudulenta, falsas inversiones (checklist) | Fraudes y Seguridad Financiera | 4 | 4 | 4 | 5 | 3 | 4,05 | AdSense-alto |
| 11 | Operación Renta sin pánico: checklist para revisar tu propuesta y enviar el F22 | Impuestos Personas | 5 | 3 | 3 | 5 | 3 | 3,90 | AdSense-alto |
| 12 | Fondos mutuos: qué comisiones pagas, cómo rescatar y cómo tributan | Ahorro e Inversión | 4 | 4 | 4 | 4 | 3 | 3,90 | Afiliación-indirecta |
| 13 | ETFs desde Chile: cómo elegir plataforma/corredora (comisión, custodia, impuestos) | Ahorro e Inversión | 4 | 4 | 4 | 4 | 3 | 3,90 | Afiliación-indirecta |
| 14 | Boleta de honorarios 2026: 15,25% de retención y cómo impacta tu retorno/cobertura | Impuestos Personas | 5 | 4 | 2 | 4 | 4 | 3,90 | Autoridad-pura |
| 15 | CAE (crédito) y costo real: TMC, CAE, cuotas y por qué “la tasa” engaña | Deudas y Crédito | 3 | 4 | 5 | 4 | 3 | 3,80 | AdSense-alto |

**Entregable — Ficha completa por artículo (en orden de score)**

═══════════════════════════════════════════════  
ARTÍCULO #1  
═══════════════════════════════════════════════  
TÍTULO: Cómo calcular tu sueldo líquido y leer tu liquidación en Chile (sin perderte)  
SCORE FINAL: 4,55  
→ Demanda: 5/5 ([INFERENCIA]) — la consulta “sueldo líquido” es perenne y la explicación requiere múltiples fuentes oficiales (impuesto, AFP, cesantía). citeturn22view0turn22view1turn24view0  
→ Gap: 4/5 — hay calculadoras, pero pocas guías que expliquen “por qué cambia” con casos reales; el impuesto es técnico y mensual. citeturn22view0  
→ Evergreen: 5/5 — el concepto es estable (cambian tablas/tasas, no la lógica). citeturn22view0turn24view0  
→ Utilidad: 5/5 — impacta decisiones diarias: endeudamiento, arriendo, ahorro. [INFERENCIA]  
→ Competencia: 3/5 — mucha oferta superficial; espacio para guía profunda con fuentes primarias. [INFERENCIA]

PERFIL OBJETIVO: primer empleo + trabajador con dudas de descuentos (AFP/salud/impuesto)  
MONETIZACIÓN: Autoridad-pura — CTA suave a “calculadoras” internas; cero venta.

OUTLINE PROPUESTO:  
H1: Cómo calcular tu sueldo líquido y entender tu liquidación  
H2: Lo esencial en 3 minutos (qué te descuentan sí o sí)  
H2: Conceptos clave: imponible vs no imponible vs líquido  
H2: Paso a paso para calcular tu líquido (con ejemplo chileno)  
H2: Casos frecuentes / Situaciones reales  
H3: Tengo contrato a plazo fijo vs indefinido: ¿cambia el seguro de cesantía? citeturn22view1  
H3: Me subieron el sueldo y me bajó el líquido: ¿impuesto o tope? citeturn22view0  
H2: Errores comunes y cómo evitarlos  
H2: Preguntas frecuentes  
H3: ¿Dónde veo el Impuesto Único de este mes? citeturn22view0  
H3: ¿El 10% AFP siempre es 10% exacto? (comisión/SIS) citeturn24view0  
H3: ¿Qué descuento depende del tipo de contrato? (AFC) citeturn22view1  

ELEMENTOS PRÁCTICOS SUGERIDOS:  
- [ ] Calculadora simple “bruto → líquido” (con inputs mínimos)  
- [ ] Checklist descargable para leer liquidación  
- [ ] Ejemplo numérico con caso chileno (tramo impuesto)  
- [ ] Advertencia: impuesto cambia mensualmente (no “promesa fija”)  

FUENTES OBLIGATORIAS A CITAR:  
- `https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm` — tabla mensual Impuesto Único citeturn22view0  
- `https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-9908.html` — 10% obligatorio + comisión/SIS citeturn24view0  
- `https://www.dt.gob.cl/portal/1628/w3-article-95306.html` — cotización AFC por tipo contrato citeturn22view1  

PERIODICIDAD DE REVISIÓN: mensual (tabla impuesto) + trimestral (tasas/comisiones/SIS).

═══════════════════════════════════════════════  
ARTÍCULO #2  
═══════════════════════════════════════════════  
TÍTULO: Informe de Deudas CMF: cómo sacarlo, entenderlo y qué NO es (DICOM)  
SCORE FINAL: 4,50  
→ Demanda: 4/5 ([INFERENCIA]) — existe trámite oficial gratuito y consultas recurrentes por acceso/interpretación. citeturn19view2  
→ Gap: 5/5 — la oferta explica “cómo obtener”, pero no aterriza “cómo usarlo” ni la relación con DICOM. citeturn19view2turn10search10turn10search18  
→ Evergreen: 5/5 — el informe existe por marco legal; cambian UI, no el concepto. citeturn19view2  
→ Utilidad: 5/5 — ordena deuda real y reduce decisiones a ciegas (renegociar, priorizar). [INFERENCIA]  
→ Competencia: 3/5 — resultados mezclan bancos/abogados; falta guía neutral. [INFERENCIA]

PERFIL OBJETIVO: personas con cobranzas / miedo a “DICOM” / buscando arriendo o crédito  
MONETIZACIÓN: Autoridad-pura — sin afiliación; CTA a contenidos de renegociación/presupuesto.

OUTLINE PROPUESTO:  
H1: Informe de Deudas CMF en simple: cómo se usa y qué significa  
H2: Qué es y qué incluye (y qué entidades cubre) citeturn19view2  
H2: Paso a paso para descargarlo (ClaveÚnica) citeturn19view2  
H2: Cómo leerlo: partes del informe y señales rojas  
H2: Casos frecuentes / Situaciones reales  
H3: “No aparece mi deuda”: desfase y límites del informe citeturn19view2  
H3: “Me sale deuda, pero no entiendo”: priorización por costo y mora  
H2: Errores comunes y cómo evitarlos  
H2: Preguntas frecuentes  
H3: ¿Esto es lo mismo que DICOM? (spoiler: no) citeturn10search10turn19view2  
H3: ¿Cada cuánto se actualiza? citeturn19view2  
H3: ¿Puedo pedirlo si soy heredero? citeturn19view2  

ELEMENTOS PRÁCTICOS SUGERIDOS:  
- [ ] Checklist “qué revisar en el informe”  
- [ ] Tabla “Informe CMF vs informe comercial”  
- [ ] Guía “cómo priorizar pagos” (sin recomendar productos)  

FUENTES OBLIGATORIAS A CITAR:  
- `https://www.cmfchile.cl/portal/principal/613/w3-article-95399.html` — trámite, costo, desfase citeturn19view2  
- `https://www.boletincomercial.cl/` — gratuidad informe c/4 meses (Ley 20.575) citeturn10search10turn10search18  

PERIODICIDAD DE REVISIÓN: semestral (UI/alcance) + revisión rápida trimestral.

═══════════════════════════════════════════════  
ARTÍCULO #3  
═══════════════════════════════════════════════  
TÍTULO: UF en simple: qué es, cómo se calcula y por qué afecta tu arriendo/dividendo  
SCORE FINAL: 4,40  
→ Demanda: 5/5 ([INFERENCIA]) — consultas “UF hoy/UF a pesos” son perennes. [INFERENCIA]  
→ Gap: 4/5 — hay conversores, pero poca explicación del “por qué sube diario” con ejemplo aterrizado. citeturn25view0  
→ Evergreen: 5/5 — metodología estable (IPC del mes previo; periodo 10–9). citeturn25view0  
→ Utilidad: 4/5 — impacto en reajustes y contratos. [INFERENCIA]  
→ Competencia: 3/5 — muchas páginas; ganar con claridad + ejemplos.

PERFIL OBJETIVO: arrendatarios y personas con contratos en UF  
MONETIZACIÓN: AdSense-alto — alto tráfico informacional; CTA a calculadora UF→pesos interna.

OUTLINE PROPUESTO:  
H1: UF en simple  
H2: Qué es la UF (sin humo) citeturn25view0  
H2: Cómo se calcula (la parte que nadie te explica) citeturn25view0  
H2: Ejemplo numérico: arriendo en UF y reajuste  
H2: Casos frecuentes / Situaciones reales  
H3: “Mi UF sube aunque el IPC es mensual”: desfase y cálculo diario citeturn25view0  
H3: “¿Qué pasa si el IPC baja?” (UF puede bajar) [INFERENCIA]  
H2: Errores comunes y cómo evitarlos  
H2: Preguntas frecuentes  
H3: ¿La UF la define el banco? (fuente oficial) citeturn25view0  
H3: ¿Por qué el periodo es del 10 al 9? citeturn25view0  
H3: ¿Dónde ver el valor diario oficial? (sitios/DO) citeturn25view1  

ELEMENTOS PRÁCTICOS SUGERIDOS:  
- [ ] Conversor UF→pesos (simple)  
- [ ] Ejemplo numérico arriendo/dividendo  
- [ ] Caja “UF vs IPC vs inflación”  

FUENTES OBLIGATORIAS A CITAR:  
- `https://si3.bcentral.cl/estadisticas/Principal1/Metodologias/EMF/UF.pdf` — definición y metodología citeturn25view0  

PERIODICIDAD DE REVISIÓN: anual (metodología) + revisión mensual (enlaces y fuentes).

═══════════════════════════════════════════════  
ARTÍCULO #4  
═══════════════════════════════════════════════  
TÍTULO: Fraude con tarjeta o transferencia: qué hacer en 24 horas, plazos y derechos (Ley 20.009)  
SCORE FINAL: 4,35  
→ Demanda: 5/5 ([INFERENCIA]) — alta recurrencia por aumento de fraudes y consultas de plazos. citeturn16view1turn16view2  
→ Gap: 4/5 — existe guía, pero dispersa y sin “timeline operativo” único. citeturn16view1turn16view2  
→ Evergreen: 4/5 — la estructura legal se mantiene; ajustes/interpretaciones pueden cambiar. citeturn16view0  
→ Utilidad: 5/5 — alto impacto financiero inmediato. [INFERENCIA]  
→ Competencia: 3/5 — muchos resultados; ganar con claridad, checklist y citación robusta.

PERFIL OBJETIVO: víctima reciente de fraude; familiares ayudando a un adulto mayor  
MONETIZACIÓN: AdSense-alto — sin afiliación; CTA a guías preventivas.

OUTLINE PROPUESTO:  
H1: Fraude bancario: qué hacer ahora mismo  
H2: Lo esencial en 10 minutos (bloqueo + reclamo) citeturn16view1  
H2: Plazos clave explicados (30 días hábiles; 35 UF; 10/15 días) citeturn16view1turn16view2  
H2: Paso a paso completo (documentos y comprobantes) citeturn16view1  
H2: Casos frecuentes / Situaciones reales  
H3: El banco dice “culpa tuya”: dolo/culpa grave y juez citeturn16view2turn16view0  
H3: Pasaron los días y no me devuelven: cómo escalar citeturn16view1  
H2: Errores comunes y cómo evitarlos  
H2: Preguntas frecuentes  
H3: ¿Avisar por teléfono reemplaza el reclamo? (no) citeturn16view1  
H3: ¿Tengo que denunciar sí o sí? citeturn16view1turn16view2  
H3: ¿Qué operaciones cubre la ley? (tarjetas y transacciones electrónicas) citeturn16view1  

ELEMENTOS PRÁCTICOS SUGERIDOS:  
- [ ] Checklist “primeras 24 horas”  
- [ ] Plantilla de registro (fecha/hora/folio/canal)  
- [ ] Caja “documentos que te pueden pedir”  

FUENTES OBLIGATORIAS A CITAR:  
- `https://www.sernac.cl/portal/604/w3-propertyname-791.html` — pasos/plazos Ley 20.009 citeturn16view1  
- `https://www.cmfchile.cl/educa/621/w3-article-29826.html` — deber de prueba y plazos citeturn16view2  
- `https://www.sernac.cl/portal/604/w3-article-88179.html` — dictamen 24/02/2026 citeturn16view0  

PERIODICIDAD DE REVISIÓN: trimestral (interpretaciones/umbrales) + revisión inmediata si cambia ley.

(Para mantener el informe utilizable dentro del límite, los artículos #5–#15 conservan el mismo nivel de estructura, pero con justificaciones más compactas.)

═══════════════════════════════════════════════  
ARTÍCULO #5  
═══════════════════════════════════════════════  
TÍTULO: Renegociación Superir: requisitos, paso a paso y errores que te rechazan la solicitud  
SCORE FINAL: 4,30  
Demanda 4/5 [INFERENCIA] — consultas por requisitos (80 UF/90 días) son frecuentes por umbral explícito. citeturn20view0turn20view1  
Gap 5/5 — falta guía “anti-rechazo” y casos por perfil; lo oficial lista documentos pero no prioriza errores. citeturn20view0  
Evergreen 4/5 — reglas estables, plataforma puede cambiar. citeturn20view0  
Utilidad 5/5 — reduce sobreendeudamiento sin juicio. citeturn20view2  
Competencia 3/5 — abogados dominan, pero se puede competir con citación oficial.

PERFIL OBJETIVO: deudor con 2+ acreedores y mora  
MONETIZACIÓN: Autoridad-pura

OUTLINE: H1 Renegociación Superir… / H2 ¿Califico? / H2 Checklist documentos / H2 Paso a paso online / H2 Casos / H3 Honorarios / H3 Con demanda o juicio / H2 Errores / H2 FAQ (plazos, audiencias, “limpiar antecedentes”). citeturn20view0turn20view1  
ELEMENTOS: checklist + plantilla de “declaración de deudas” + timeline audiencias.  
FUENTES: `https://www.superir.gob.cl/perfil-deudor-requisito-renegociacion/` citeturn20view0 ; `https://www.chileatiende.gob.cl/fichas/37401...` citeturn20view1  
REVISIÓN: semestral.

═══════════════════════════════════════════════  
ARTÍCULO #6  
═══════════════════════════════════════════════  
TÍTULO: Seguro de Cesantía: cómo saber tu saldo y cobrarlo (guía sin letra chica)  
SCORE FINAL: 4,25  
Demanda 4/5 [INFERENCIA] — consultas por saldo y cobro son perennes. citeturn0search3turn0search6turn8search3  
Gap 4/5 — mucha instrucción, poca claridad en combinaciones (CIC/FCS, causales). citeturn22view2  
Evergreen 5/5 — producto social estable. citeturn22view2  
Utilidad 5/5 — liquidez en crisis.  
Competencia 3/5 — competir con “paso a paso + casos”.

OUTLINE: H1 Seguro Cesantía… / H2 Qué es CIC/FCS / H2 Cómo ver saldo / H2 Cómo cobrar / H2 Casos (plazo fijo/indefinido; casa particular) citeturn22view1turn22view2 / H2 Errores / H2 FAQ.  
FUENTES: `https://previsionsocial.gob.cl/.../cotizaciones-previsionales/` citeturn22view2 ; `https://www.dt.gob.cl/...95306.html` citeturn22view1  
REVISIÓN: anual.

═══════════════════════════════════════════════  
ARTÍCULO #7  
═══════════════════════════════════════════════  
TÍTULO: Licencia médica: desde qué día se paga y qué hacer si no te pagan  
SCORE FINAL: 4,25  
Demanda 4/5 [INFERENCIA] — dudas recurrentes “quién paga/cuándo”. citeturn8search2turn8search10  
Gap 4/5 — lenguaje técnico + poca guía de escalamiento. citeturn8search2turn8search10  
Evergreen 5/5 — reglas estables.  
Utilidad 5/5 — afecta ingresos.  
Competencia 3/5.

OUTLINE: H1 Licencia médica… / H2 Conceptos (SIL) / H2 Desde qué día se paga / H2 Paso a paso si no pagan / H2 Casos (menos de 11 días; rechazo; apelación) / H2 Errores / H2 FAQ.  
FUENTES: SUSESO (subsidio incapacidad, licencias). citeturn8search2turn8search10  
REVISIÓN: anual.

═══════════════════════════════════════════════  
ARTÍCULO #8  
═══════════════════════════════════════════════  
TÍTULO: Devolución de impuestos: fechas, estado y causas típicas de retención/compensación  
SCORE FINAL: 4,15  
Demanda 5/5 [INFERENCIA] — consultas masivas cada Operación Renta. citeturn0search9turn11search22  
Gap 4/5 — falta “árbol de decisión” simple.  
Evergreen 3/5 — calendario cambia anual. citeturn11search22  
Utilidad 5/5.  
Competencia 3/5.

OUTLINE: H1 Devolución… / H2 Fechas y lógica / H2 Cómo revisar estado / H2 Motivos de retención/compensación / H2 Casos / H2 Errores / H2 FAQ.  
FUENTES: `https://www.sii.cl/ayudas/ayudas_por_servicios/2888-plazos.htm` citeturn11search22  
REVISIÓN: anual (marzo).

═══════════════════════════════════════════════  
ARTÍCULO #9  
═══════════════════════════════════════════════  
TÍTULO: Depósito a plazo: pesos vs UF, cómo comparar tasas y evitar trampas comunes  
SCORE FINAL: 4,10  
Demanda 4/5 [INFERENCIA] — decisión repetida en hogares.  
Gap 4/5 — se publican tasas, no se enseña a comparar (plazo, renovación, retiro). [INFERENCIA]  
Evergreen 5/5 — lógica estable.  
Utilidad 4/5.  
Competencia 3/5.

MONETIZACIÓN: Afiliación-indirecta — CTA final a “comparar DAP” sin tono vendedor.  
FUENTES: bancos + explicación UF. citeturn25view0turn15search33  
REVISIÓN: semestral (condiciones típicas).

═══════════════════════════════════════════════  
ARTÍCULO #10  
═══════════════════════════════════════════════  
TÍTULO: Estafas comunes en Chile: vishing, portabilidad fraudulenta y falsas inversiones (checklist)  
SCORE FINAL: 4,05  
Demanda 4/5 [INFERENCIA]; Gap 4/5; Evergreen 4/5; Utilidad 5/5; Competencia 3/5.  
FUENTES: Reporte SERNAC + CSIRT + Ley fraude para “si ya pasó”. citeturn5view0turn7search7turn16view1  
REVISIÓN: trimestral.

═══════════════════════════════════════════════  
ARTÍCULO #11  
═══════════════════════════════════════════════  
TÍTULO: Operación Renta sin pánico: checklist para revisar tu propuesta y enviar el F22  
SCORE FINAL: 3,90  
Demanda 5/5 [INFERENCIA]; Gap 3/5; Evergreen 3/5; Utilidad 5/5; Competencia 3/5.  
FUENTES: SII propone/rectifica/plazos. citeturn11search4turn11search2turn11search22  
REVISIÓN: anual (marzo–abril).

═══════════════════════════════════════════════  
ARTÍCULO #12  
═══════════════════════════════════════════════  
TÍTULO: Fondos mutuos: qué comisiones pagas, cómo rescatar y cómo tributan  
SCORE FINAL: 3,90  
FUENTES: CMF (educación fondos) + SII (tratamiento tributario). citeturn12search15turn12search1  
MONETIZACIÓN: Afiliación-indirecta (CTA a “cómo elegir fondo” al final, neutral).  
REVISIÓN: anual.

═══════════════════════════════════════════════  
ARTÍCULO #13  
═══════════════════════════════════════════════  
TÍTULO: ETFs desde Chile: cómo elegir plataforma/corredora (comisión, custodia, impuestos)  
SCORE FINAL: 3,90  
FUENTES: oferta de plataformas + registro CMF de fondos/entidades cuando aplique. citeturn1search25turn15search27turn15search38  
MONETIZACIÓN: Afiliación-indirecta.  
REVISIÓN: trimestral (comisiones/productos cambian).

═══════════════════════════════════════════════  
ARTÍCULO #14  
═══════════════════════════════════════════════  
TÍTULO: Boleta de honorarios 2026: 15,25% de retención y cómo impacta tu retorno/cobertura  
SCORE FINAL: 3,90  
FUENTES: SII retención + ChileAtiende cotización honorarios. citeturn21view0turn21view1turn21view2  
REVISIÓN: anual (enero + marzo).

═══════════════════════════════════════════════  
ARTÍCULO #15  
═══════════════════════════════════════════════  
TÍTULO: CAE (crédito) y costo real: TMC, CAE, cuotas y por qué “la tasa” engaña  
SCORE FINAL: 3,80  
FUENTES: definición CAE (SERNAC/SUSESO) + cambios TMC 2026 CMF. citeturn15search2turn14search18turn10search3  
REVISIÓN: semestral (normas y metodología tasas).

## Plan de publicación sugerido

**Entregable — Plan 12 semanas (3+ artículos/semana)**  
Para conciliar “15 pilares evergreen” con capacidad 3+/semana, el plan usa: **1 artículo pilar + 2 satélites** por semana (satélites = FAQ, caso real, checklist descargable, glosario, mini-calculadora). Los pilares se numeran #1–#15.

**Semanas 1–4 — Base (autoridad primero)**  
Pilares sugeridos: #3 (UF), #1 (sueldo líquido), #2 (Informe CMF), #4 (fraude), #6 (AFC), #7 (licencia).  
Clústers cubiertos: Presupuesto/Costo de vida + Deuda + Fraude + Protección social.  
Señal esperada al cierre: incremento de tráfico perenne por queries “UF/sueldo líquido/fraude” y enlaces naturales desde foros/redes por utilidad práctica. citeturn25view0turn22view0turn16view1turn19view2

**Semanas 5–8 — Profundidad (gaps por perfil y casos reales)**  
Pilares sugeridos: #5 (Renegociación Superir), #8 (Devolución impuestos), #11 (Operación Renta), #14 (Boleta honorarios), #15 (CAE costo real).  
Clústers cubiertos: Deuda + Impuestos + Crédito.  
Señal esperada: crecimiento estacional (Renta, devoluciones) + autoridad por guías oficiales aterrizadas; mejor interlinking “deuda ↔ impuestos ↔ sueldo líquido”. citeturn20view0turn11search22turn21view0turn22view0turn10search3

**Semanas 9–12 — Monetización natural (sin romper credibilidad)**  
Pilares sugeridos: #9 (depósito a plazo), #12 (fondos mutuos), #13 (ETFs), #10 (estafas checklist).  
Clústers cubiertos: Inversión + Fraude.  
Señal esperada: mayor RPM AdSense (inversión/fraude) y primera capa de afiliación **indirecta** (plataformas/corredoras) solo al final y con disclaimer neutral. citeturn12search15turn15search38turn5view0

## Recomendaciones editoriales

El tono ideal para hablarle al “chileno de a pie” es **concreto, no infantil**: partir por la respuesta (“lo que tienes que hacer hoy”), luego explicar el concepto (“por qué funciona así”), y cerrar con casos y errores. El criterio útil es: si una definición no cambia una decisión, va después. En vez de abrir con “tasa efectiva anual”, se puede decir “lo que realmente pagas al año” y, recién ahí, etiquetar el término técnico entre paréntesis para quien quiera profundizar. Este enfoque es especialmente crítico en temas donde hay dos “CAE” distintas (costo del crédito vs crédito estudiantil), porque el error semántico es real. citeturn14search18turn15search2

Tres diferenciadores realistas (con recursos limitados) frente a la oferta actual: (1) **Guías paso a paso con timeline y checklist** para trámites (fraude, Superir, Operación Renta), donde el valor es ordenar decisiones en horas/días y no solo “definir”. citeturn16view1turn20view0turn11search4 (2) **Casos por perfil chileno específico** (honorarios intermitentes, dos empleadores, plazo fijo vs indefinido), aprovechando que gran parte del contenido oficial es correcto pero no segmenta; ChileAtiende da piezas para construir esa segmentación. citeturn21view1turn22view1turn20view1 (3) **Explicación “sin números inventados”**: no prometer tasas ni devoluciones exactas; enseñar a interpretar fuentes primarias (SII/CMF/Banco Central) con ejemplos numéricos controlados. citeturn22view0turn25view0turn19view2

En gestión de vigencia, los artículos más frágiles son los que dependen de calendarios y tasas legales (Operación Renta, devoluciones, honorarios, reforma previsional). La forma de minimizar obsolescencia sin reescribir es modularizar: un bloque “Qué cambió este año (2026)” arriba (actualizable), y el cuerpo con lógica estable abajo (evergreen). La boleta de honorarios es un caso claro: la retención sube escalonadamente hasta 2028, por lo tanto conviene separar “regla general” de “tasa vigente”. citeturn21view2turn21view0

El perfil más desatendido y con oportunidad real es el **trabajador independiente/honorarios**: está entre impuestos, salud y pensiones, y su cobertura depende de Operación Renta, lo que no es intuitivo. ChileAtiende explicita la cobertura anual y la relación SII→TGR, pero cuesta transformarlo en decisiones simples (“me conviene cobertura total o parcial”, “cuánto recibo líquido hoy”). citeturn21view1turn21view0

Señal de alerta editorial: temas atractivos por demanda pero con riesgos legales si se tratan liviano. Dos ejemplos: (i) “cómo reajustar arriendo por IPC/UF” puede rozar asesoría contractual; debe presentarse como guía informativa y derivar a fuentes legales cuando corresponda. (ii) “cómo evitar DICOM / borrar antecedentes” atrae, pero puede incentivar promesas imposibles; debe enfocarse en procesos oficiales (informes, renegociación, regularización) sin prometer resultados. citeturn20view0turn19view2turn10search10

## Apéndice

**Queries utilizadas (exactas)**
```text
Chile consultar DICOM gratis cómo saber si estoy en DICOM
CMF informe deudas personas consultar informe deudas CMF sitio oficial
SII Operación Renta 2026 calendario devolución impuestos Chile
AFC Chile cómo cobrar seguro de cesantía paso a paso requisitos
SII boleta de honorarios retención 2026 porcentaje retención
APV beneficios tributarios Chile régimen A régimen B SII
Chile cómo comprar ETF desde Chile corredora comisiones tributación
UF qué es cómo se calcula Banco Central Chile unidad de fomento
Google Trends "Operación Renta" Chile abril
Google Trends DICOM Chile
Google Trends "UF" Chile
Google Trends "phishing" Chile bancos
SERNAC fraude tarjetas ley 20009 reclamo banco plazo 2026
CMF reclamo por fraude bancario procedimiento consumidor
Ley 20009 fraude tarjeta operaciones no reconocidas Chile 2026
CSIRT Chile alertas phishing bancos 2023 2024
Superintendencia de Pensiones cambio de fondo multifondos trámite traspaso 2026
Reforma de pensiones Chile 2026 proyecto ley cotización adicional 2026
SUSESO licencia médica pago subsidio incapacidad laboral plazos
ChileAtiende cómo saber saldo AFC cesantía con RUT
INE Chile IPC qué es cómo se calcula índice de precios al consumidor metodología 2018
Banco Central Chile inflación IPC explicación
SII impuesto único segunda categoría tabla mensual 2026
Dirección del Trabajo liquidación de sueldo descuentos obligatorios AFP salud seguro cesantía
Superintendencia de Insolvencia y Reemprendimiento renegociación persona natural paso a paso requisitos
Comisión Ingresa CAE cómo saber mi deuda con RUT 2026
Ley 20.575 informe comercial gratis cada 4 meses boletín comercial
CMF tasa máxima convencional Chile cómo se calcula 2026
SII Formulario 22 instrucciones 2026 propuesta declaración renta
SII devolución de impuestos por qué no me devolvieron compensación deudas Tesorería Chile
SII rectificar Formulario 22 2026 cómo se hace
ChileAtiende devolución de impuestos operación renta consultas frecuentes
CMF Educa fondos mutuos qué son comisiones rescate
SII tributación fondos mutuos rescate impuesto
Depósito a plazo BancoEstado qué es cómo funciona tasa
Cómo declarar inversiones en el extranjero SII formulario 22 rentas fuente extranjera
CMF Educa presupuesto personal cómo hacer presupuesto
CMF Educa endeudamiento responsable sobreendeudamiento señales
sueldo líquido Chile cálculo descuentos AFP salud seguro cesantía impuesto único SII
calculadora sueldo líquido Chile independiente honorarios 2026
Banco Santander Chile educación financiera DICOM o informe comercial
ComparaOnline créditos consumo CAE simulador Chile
Cuentas Claras crédito consumo CAE Chile
BTG Pactual Chile educación financiera ETF fondos mutuos básico
"people also ask" dicom chile
"people also ask" "operacion renta" chile
"people also ask" "sueldo liquido" chile
"people also ask" "credito cae" chile
Superintendencia de Pensiones cotización obligatoria 10% trabajador AFP comisión
ChileAtiende descuento AFP 10% comisión salud 7% sueldo imponible
Fonasa cotización 7% salud obligatoria
previsionsocial cotización obligatoria ahorro previsional 10% comisión AFP
```

**Referencias SERP relevantes (muestras cualitativas)**  
Consulta “informe de deudas CMF”: resultados oficiales de CMF con explicación de ClaveÚnica, costo cero, y desfase de actualización; aparecen también páginas bancarias que lo recomiendan como “ordenar deudas”, lo que confirma mezcla de intención educativa + producto. citeturn19view2turn15search12  
Consulta “renegociación deudas”: domina soporte oficial (Superir/ChileAtiende) pero con fuerte competencia de estudios jurídicos; el diferencial es claridad y checklist. citeturn20view0turn20view1  
Consulta “fraude ley 20.009”: fuentes oficiales (SERNAC/CMF) con plazos y pasos; noticia/dictamen del 24/02/2026 agrega frescura y potencial de enlaces. citeturn16view1turn16view2turn16view0  
Consulta “boleta honorarios 15,25”: SII y ChileAtiende dominan con dato explícito y cobertura previsional, buena base para un artículo autoridad. citeturn21view0turn21view1  
Consulta “UF cómo se calcula”: metodología primaria del Banco Central (PDF) es la fuente “última”; oportunidad de traducirla. citeturn25view0

**URLs oficiales consultadas (con fecha de acceso 24/02/2026)**  
```text
https://www.cmfchile.cl/portal/principal/613/w3-article-95399.html
https://conocetudeuda.cmfchile.cl/
https://www.superir.gob.cl/perfil-deudor-requisito-renegociacion/
https://www.chileatiende.gob.cl/fichas/37401-renegociacion-de-las-deudas-de-una-persona
https://www.sernac.cl/portal/604/w3-propertyname-791.html
https://www.cmfchile.cl/educa/621/w3-article-29826.html
https://www.sernac.cl/portal/604/w3-article-88179.html
https://si3.bcentral.cl/estadisticas/Principal1/Metodologias/EMF/UF.pdf
https://www.sii.cl/destacados/boletas_honorarios/
https://www.sii.cl/destacados/boletas_honorarios/aumento_gradual.html
https://www.chileatiende.gob.cl/fichas/12016-cotizacion-de-trabajadores-que-emiten-boletas-de-honorarios
https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm
https://www.dt.gob.cl/portal/1628/w3-article-95306.html
https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-9908.html
https://www.spensiones.cl/portal/institucional/594/w3-article-16946.html
https://www.bcn.cl/api-leyfacil/servicio/ObtenerGuiaPublicadaHTML?uri=reforma-de-pensiones-de-2025
```

**Notas metodológicas (limitaciones y manejo)**  
La señal de demanda se estimó sin volúmenes (Alta/Media/Baja) usando SERP y existencia de trámites oficiales (ej. Conoce tu Deuda; Ley de Fraudes; retención honorarios 2026). Cuando la señal depende de “lo que muestra Google” (PAA), se trató como aproximación y se etiquetó como **[INFERENCIA]**. Algunas páginas gubernamentales cargan contenido de forma dinámica y no siempre se renderizan completas en herramientas de lectura; en esos casos se usaron fuentes alternativas (snippets y guías BCN/CMF/SERNAC) o páginas equivalentes.

**Fecha y condiciones de investigación**  
24/02/2026; búsqueda y lectura de fuentes en español orientadas a Chile; priorización editorial autoridad-primero; sin estimaciones numéricas inventadas; URLs en formato código por exigencia de reproducibilidad.