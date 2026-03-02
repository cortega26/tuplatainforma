# NORMA EDITORIAL YMYL - Precision, Credibilidad y Autoridad (v1.0)

**Proyecto:** Tu Plata Informa  
**Fecha:** 2026-03-02  
**Estado:** ACTIVA (obligatoria para todo contenido nuevo y toda revision sustantiva)

---

## 0) Proposito

Esta norma define **reglas verificables** para que cada articulo alcance **>= 9.5/10** (apuntando a 10) en:

- **Precision normativa** (YMYL)
- **Respuesta directa a intencion de busqueda**
- **Credibilidad (fuentes, vigencia, trazabilidad)**
- **Autoridad (estructura, claridad, cobertura de excepciones)**
- **No-regresion editorial** (evitar volver a "respuestas abstractas")

**Principio rector:** *Primero la regla; luego la explicacion.*

---

## 1) Definicion operativa de "9.5/10"

Un articulo se considera **>= 9.5/10** si cumple **TODOS** los requisitos MUST y falla como maximo **1** requisito SHOULD (sin fallar ningun MUST critico).

### 1.1 MUST (bloqueantes)

1. **Respuesta Ancla en <= 2 pantallas**  
   La query principal debe tener una **respuesta concreta** (numero/regla/criterio) en la primera seccion util.
2. **Regla declarada de forma afirmativa**  
   Prohibido "rodear" la respuesta (meta-proceso). Se admite contexto **despues** de la regla.
3. **Vigencia explicita**  
   Cada regla debe indicar su **marco temporal**: "vigente a 2026-03-02" o "desde/hasta".
4. **Fuentes oficiales minimas**  
   Para cada regla critica YMYL: al menos **1 fuente oficial** (SII, SUSESO, ChileAtiende, BCN, SPensiones, CMF, etc.).
5. **Excepciones relevantes**  
   Si existen excepciones comunes o condiciones, se enumeran (aunque sea breve).
6. **No confundir**: aprobacion, vigencia, implementacion  
   Si se habla de reformas/cambios en calendario, debe separarse en "aprobado", "entra en vigencia", "se implementa".
7. **No inferencias sin etiqueta**  
   Toda sintesis juridica o "tabla de impacto" basada en articulos legales debe marcarse como **"resumen orientativo"** y senalar que puede variar por contrato/caso.
8. **Coherencia interna**  
   No puede haber contradicciones entre secciones, FAQ y resumenes.
9. **Frontmatter valido y senales de frescura**  
   `updatedDate` existe cuando hubo revision sustantiva y coincide con "Ultima revision" (si esa seccion existe).

### 1.2 SHOULD (no bloqueantes pero esperados)

- "Que hacer / pasos" cuando aplica (checklists, arbol de decision).
- Definiciones rapidas ("en 1 linea") para terminos clave.
- Ejemplo numerico simple cuando la intencion es calculo.
- Interlinking hacia pilares/guias complementarias (sin canibalizar).

---

## 2) Regla Anti-Abstraccion (nucleo del problema)

### 2.1 Regla

**En todo contenido YMYL, la primera aparicion de la respuesta debe ser concreta.**  
La explicacion puede ser profunda, pero **no puede sustituir** la regla.

### 2.2 Patrones prohibidos

- "Depende..." sin listar de que depende.
- "Es un criterio relevante..." sin decir el efecto.
- "Primero hay que entender..." antes de dar el numero/regla.
- "Generalmente..." si existe norma especifica accesible.

### 2.3 Plantilla obligatoria "Respuesta Ancla"

Insertar al inicio de la seccion clave:

> **Respuesta rapida (regla general):** {regla concreta}.  
> **Excepcion(es) comun(es):** {lista breve}.  
> **Vigencia:** {fecha/marco}.  
> **Fuente(s):** {link(s) oficial(es)}.

---

## 3) Control de inferencias juridicas (proteccion de credibilidad)

### 3.1 Cuando se permite "inferir"

Se permite sintetizar efectos practicos **solo** si:

- esta respaldado por articulos legales citados, y
- se etiqueta como **resumen orientativo**, y
- incluye limitador de alcance.

### 3.2 Etiqueta obligatoria

En tablas/resumenes de impacto por causal/articulo:

> **Nota (resumen orientativo):** Esta sintesis simplifica la norma para fines informativos. El resultado puede variar segun contrato, antiguedad exacta, topes legales y eventuales reclamaciones o interpretacion administrativa/judicial. Revisa la fuente oficial o asesorate si es un caso complejo.

### 3.3 Regla de "no extrapolacion"

No extrapolar efectos que requieran jurisprudencia o casuistica sin respaldo oficial.

---

## 4) Reglas de reformas y calendarios (evitar errores graves)

Cuando el articulo mencione reformas/cambios (p. ej., pensiones 2025-2027), el bloque debe dividirse **exactamente** asi:

### Bloque obligatorio: "Que cambia {ano-ano}"

- **Que esta aprobado (ley / norma):**
- **Desde cuando rige (vigencia legal):**
- **Desde cuando se aplica (implementacion operativa):**
- **Que cambia hoy vs despues (comparacion):**
- **Fuente(s) oficial(es):**

**Prohibicion:** frases que hagan parecer que algo "ya se descuenta" si el cambio aun no aplica.

---

## 5) Politica de `updatedDate` (senal de frescura sin trampas)

### 5.1 Cuando actualizar `updatedDate`

Solo si existe **cambio sustantivo** en:

- reglas/numeros/umbral/criterio,
- reforma o calendario,
- estructura de respuesta ancla,
- correccion de error importante,
- ampliacion de cobertura (FAQ, causales, pasos).

### 5.2 Cuando NO actualizar

- cambios de estilo, ortografia menor,
- ajustes de interlinks,
- reordenamiento sin contenido nuevo,
- "para que se vea fresco".

### 5.3 Evidencia minima

Toda actualizacion de `updatedDate` requiere **registro** (1 linea) en backlog/registro:

- que cambio
- por que
- fuente(s) que justifican

---

## 6) Checklist de revision (GATE antes de merge)

**Obligatoria** para todo PR editorial YMYL.

### 6.1 Respuesta e intencion

- [ ] La **Respuesta rapida** contiene un numero/regla concreta.
- [ ] Responde exactamente la query ancla (sin meta-proceso).
- [ ] Excepciones/condiciones enumeradas (si existen).

### 6.2 Precision y trazabilidad

- [ ] Cada regla critica tiene **fuente oficial**.
- [ ] Se indica **vigencia** o marco temporal.
- [ ] No hay contradicciones entre secciones/FAQ.

### 6.3 Reformas/calendario (si aplica)

- [ ] Separado en aprobado/vigencia/implementacion.
- [ ] "Hoy vs despues" no induce error.

### 6.4 Inferencias (si aplica)

- [ ] Tabla/resumen marcado como "orientativo" + limitadores.
- [ ] No hay extrapolaciones sin respaldo.

### 6.5 Senales de frescura

- [ ] `updatedDate` actualizado **solo** si hubo cambio sustantivo.
- [ ] "Ultima revision" y `updatedDate` coherentes (si existe seccion).

---

## 7) Scorecard (para exigir 9.5+)

Calificar 0-10 con esta ponderacion:

- **Respuesta ancla (35%)**
- **Precision + fuentes (25%)**
- **Vigencia + calendario (15%)**
- **Excepciones + cobertura (15%)**
- **Claridad + estructura (10%)**

**Regla:** cualquier articulo con **< 9.5** no se publica; vuelve a iteracion.

---

## 8) Prompt operativo para el agente (copiar y pegar)

> **TAREA:** Elevar el articulo a >= 9.5/10 segun la "NORMA EDITORIAL YMYL v1.0".  
> **INSTRUCCIONES:**  
> 1) Identifica la query ancla y escribe una **Respuesta rapida** (regla concreta + vigencia + fuente oficial).  
> 2) Lista excepciones y condiciones comunes.  
> 3) Si hay reformas/cambios, crea bloque "aprobado / vigencia / implementacion / hoy vs despues".  
> 4) Si haces sintesis juridica, etiqueta como **resumen orientativo** y agrega limitadores.  
> 5) Manten estructura SEO e interlinking; no cambies slug.  
> 6) Actualiza `updatedDate` solo si hubo cambio sustantivo y registra el cambio en el backlog.  
> **ENTREGABLE:** diff conceptual + citas oficiales + scorecard final con justificacion.

---

## 9) Implementacion recomendada (minima, sin tocar runtime)

- Guardar este archivo como `docs/editorial/NORMA_YMYL.md` (o similar).
- Referenciarlo desde tu prompt base / `AGENTS.md` editorial.
- GATE de PR: checklist marcada + scorecard pegado en el PR.

---

**Fin de norma.**
