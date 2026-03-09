# Gap Audit v1 — Decision Summary (2026-02-27)

## Decisiones de ejecución (orden de ataque)

1. **Cerrar primero los 3 gaps críticos de Impuestos Personas**:
   - Devolución de impuestos
   - Operación Renta (F22)
   - Boleta de honorarios 2026

   **Por qué:** tienen el SPF más alto del audit (4.40), alta sensibilidad normativa y fuerte estacionalidad de demanda. Son los vacíos con mayor impacto de autoridad y tráfico.

2. **Cerrar luego los 3 gaps críticos de Ahorro/Pensiones sin cobertura**:
   - Licencia médica
   - Depósito a plazo
   - Fondos mutuos
   - ETFs desde Chile

   **Por qué:** hay ausencia estructural (SCA=1.00 en clusters Ahorro e Impuestos) y subrepresentación explícita detectada en el audit.

3. **Atacar después el gap Alta (estafas checklist multicanal)**:
   - Extender cobertura actual de fraude (hoy centrada en Ley 20.009 post-evento) a prevención operacional por canal: llamada/SMS/WhatsApp/marketplace/portabilidad/falsas inversiones.

   **Por qué:** ya existe base editorial robusta en fraude, por lo que el costo marginal es menor y el impacto en completitud del cluster es alto.

4. **Optimizar canibalización en paralelo (sin bloquear producción):**
   - Mantener modelo pilar + herramienta en UF, sueldo líquido, APV, cesantía y renegociación.
   - Diferenciar títulos/meta/canonical/intent por pieza.

   **Por qué:** evita solapamiento de ranking al publicar nuevos satélites.

5. **Postergar media/baja y mejoras incrementales** (CAE, refinamientos de artículos ya fuertes) hasta cubrir todo Crítica + Alta.

## Riesgos y mitigaciones

- **Riesgo 1: Desactualización normativa en temas YMYL (impuestos, honorarios, pensiones, fraude).**
  - Mitigación: bloque “Qué cambió este año” al inicio + fecha de vigencia + revisión calendarizada (mensual/trimestral según tema).

- **Riesgo 2: Canibalización interna entre artículo pilar y tool.**
  - Mitigación: intención explícita por URL, metadatos diferenciados, interlinking dirigido y canonical correcto.

- **Riesgo 3: Contenido técnicamente correcto pero poco accionable.**
  - Mitigación: DoD exige casos reales, errores frecuentes y checklist operativo por tema.

- **Riesgo 4: Bloqueo operativo por falta de fuentes primarias al redactar.**
  - Mitigación: cada item del backlog incluye set mínimo de fuentes obligatorias; si falta evidencia se marca `TODO` y no se publica.

- **Riesgo 5: Backlog no ejecutable sin contexto del audit.**
  - Mitigación: backlog incluye query primaria, SPF, URL sugerida, DoD y links directos a audit/research/issues.
