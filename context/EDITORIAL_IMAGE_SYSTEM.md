# Editorial Image System

Last updated: 2026-03-04\
Status: Active\
Version: 3.0 — reemplaza v2.x

---

## Índice

1. [Propósito y alcance](#1-propósito-y-alcance)
2. [Identidad visual](#2-identidad-visual)
3. [Tono y estética](#3-tono-y-estética)
4. [Templates de composición](#4-templates-de-composición)
5. [Sistema de color](#5-sistema-de-color)
6. [Sistema de ilustración](#6-sistema-de-ilustración)
7. [Tipografía como elemento gráfico](#7-tipografía-como-elemento-gráfico)
8. [Dimensiones y formatos](#8-dimensiones-y-formatos)
9. [Estructura de archivos](#9-estructura-de-archivos)
10. [Validación y CI/CD](#10-validación-y-cicd)
11. [Casos límite y resolución](#11-casos-límite-y-resolución)

---

# PARTE I — IDENTIDAD VISUAL

---

## 1. Propósito y alcance

Este documento define el sistema visual de imágenes destacadas (`heroImage`) para tuplatainforma. Es la referencia única para creación de contenido nuevo, migraciones visuales y generación automatizada.

> **⚠️ Dominio YMYL**\
> Este sitio opera en el dominio "Tu dinero o tu vida". La evolución visual de v3 no relaja ese principio — lo reencuadra. La credibilidad ahora se construye también a través de cercanía y reconocimiento, no solo a través de sobriedad. Un lector que se identifica con la imagen confía más en el contenido.

Aplica a:

- Todos los artículos nuevos en `src/data/blog/`
- Actualizaciones de contenido existente (content refresh)
- Migraciones visuales de artículos legacy
- Generación automatizada vía pipeline editorial

Documento complementario: `context/EDITORIAL_AI_PIPELINE.md`

---

## 2. Identidad visual

### 2.1 El cambio de v2 a v3

v2 era correcto pero frío. Cumplía las reglas sin generar vínculo. El lector encontraba la información, pero no tenía razón para volver.

v3 mantiene toda la arquitectura técnica de v2 — sistema de color semántico, safe area, presupuesto de tamaño, validación CI — y agrega una capa de personalidad que convierte las imágenes en un motivo de visita, no solo en una etiqueta visual del artículo.

**Lo que no cambia:** paleta semántica base, dimensiones, formatos, validación de build.\
**Lo que cambia:** templates, sistema de ilustración, uso de tipografía como elemento gráfico, paleta extendida.

### 2.2 Referentes

El sistema v3 se calibra entre dos referentes:

**NerdWallet** — claridad funcional. Cada imagen comunica el tema sin ambigüedad. El lector sabe en un vistazo de qué trata el artículo. La estructura es el mensaje.

**Investopedia** — autoridad educativa. Las imágenes refuerzan que el contenido es confiable y bien fundamentado. La estética no es decorativa — acompaña el argumento.

Lo que estos referentes tienen en común con tuplatainforma: **hablan de plata sin hacerlo complicado**. El diseño debe hacer lo mismo.

### 2.3 Principio rector

> Las imágenes deben hacer que el lector piense *"esto es para mí"* antes de leer el título.

Eso requiere que las imágenes representen situaciones, no conceptos. Una persona mirando una pantalla con números. Una mano sosteniendo un documento. Una mesa con una taza y una calculadora. Escenas que cualquier chileno reconoce como parte de su vida financiera cotidiana.

---

## 3. Tono y estética

### 3.1 Tono general

**Claro, cercano, sin condescendencia.**

El tono visual de tuplatainforma es el de un amigo que sabe de finanzas y te explica bien las cosas. No es un banco. No es una fintech con estética startup. No es un profesor universitario. Es alguien que entiende que la plata es un tema serio pero que puede tratarse sin hacerlo intimidante.

### 3.2 Equilibrio emocional por tipo de contenido

No todos los artículos tienen el mismo peso emocional. Las imágenes deben calibrarse:

| Tipo de contenido | Tono visual |
|-------------------|-------------|
| Educativo / informativo | Claro, ordenado, invita a explorar |
| Acción / herramienta | Directo, funcional, da confianza |
| Alerta / riesgo | Serio pero no alarmista. Nunca dramático. |
| Motivacional / ahorro | Cálido, posible, cotidiano |

### 3.3 Regla anti-AI-aesthetic

Más relevante que nunca en v3. Las escenas e ilustraciones de personajes son el territorio donde la estética IA es más obvia y más dañina para la credibilidad.

| ✗ PROHIBIDO | ✓ PERMITIDO |
|-------------|-------------|
| Renders hiperrealistas | Ilustración vectorial plana |
| Personajes con proporciones incorrectas | Personajes simples, geométricos, abstractos |
| Estética cripto: monedas doradas, neón | Objetos cotidianos reconocibles |
| Iluminación cinematográfica saturada | Paleta contenida, colores planos |
| Rostros generados por IA | Sin rostros, o rostros abstraídos a formas simples |
| Fondos fotorrealistas con elementos imposibles | Fondos sólidos o con escenas simples y planas |
| Texturas de piel o cabello generadas | Siluetas y formas geométricas |

> **Sobre los rostros:** la opción más segura y consistente es no incluirlos. Los personajes pueden expresar situaciones completamente a través de postura, objetos y contexto. Un personaje de espaldas frente a una pantalla comunica "trabajo, concentración, datos" sin necesitar un rostro.

---

## 4. Templates de composición

v3 introduce cinco templates. Los tres de v2 se conservan con modificaciones; se agregan dos nuevos.

El orden refleja prioridad de uso. **Scene Illustration** es el nuevo default para artículos con carga narrativa. **Icon Focus** se mantiene para artículos técnicos y de referencia.

---

### Template A — Scene Illustration `[DEFAULT para artículos narrativos]`

Una escena cotidiana abstracta con personaje(s) simplificado(s), ilustrada en estilo vectorial plano. Comunica la situación del lector, no el concepto del artículo.

**Cuándo usar:**
- El artículo describe una situación que el lector puede estar viviendo (cesantía, deuda, jubilación, primer sueldo)
- El contenido tiene carga emocional relevante
- El artículo es un punto de entrada — alguien llegará sin saber qué busca exactamente

**Estructura:**
- Fondo de color semántico (ver sección 5)
- Escena con 1–2 elementos humanos simplificados y 2–4 objetos de contexto
- Sin texto en la imagen
- Textura de fondo opcional a ≤8% de opacidad

**Ejemplos de escenas por tema:**

| Tema | Escena |
|------|--------|
| Cesantía / desempleo | Figura sentada, portátil cerrado, taza vacía |
| Primer sueldo | Figura de pie, sobre en mano, postura de sorpresa |
| Deuda / crédito | Figura frente a papeles apilados, mano en la frente |
| Jubilación / AFP | Figura sentada en silla cómoda, ventana con luz |
| Fraude / estafa | Figura mirando el teléfono, postura de alerta |
| Presupuesto | Figura en mesa, papeles, calculadora, taza |
| Ahorro | Figura depositando moneda en recipiente |
| Impuestos | Figura frente a pantalla con formulario |

---

### Template B — Icon Focus `[DEFAULT para artículos técnicos y de referencia]`

Fondo sólido de color semántico con ícono centrado. Ideal cuando el artículo es principalmente una referencia técnica o una guía de conceptos donde la claridad importa más que la narrativa.

**Cuándo usar:**
- El artículo es una referencia técnica (qué es la UF, cómo funciona el CAE)
- El artículo presenta una calculadora o herramienta
- El concepto es inequívoco y el ícono lo comunica sin ambigüedad

**Estructura de capas:**
1. **Fondo:** color sólido semántico
2. **Textura:** patrón geométrico a ≤8% de opacidad. **Obligatorio.**
3. **Ícono:** centrado, 35–45% del ancho total
4. **Etiqueta** *(opcional)*: categoría en mayúsculas pequeñas, tercio inferior, blanco al 85%

**Selección de ícono:** usar criterio narrativo de la tabla en sección 6.3.

---

### Template C — Type + Icon `[NUEVO]`

Tipografía grande como elemento gráfico dominante, acompañada de un ícono secundario. Para artículos donde un dato o cifra clave puede representar el artículo completo.

**Cuándo usar:**
- El artículo gira en torno a una cifra específica (tasa de interés, porcentaje, monto)
- El concepto clave se puede expresar en 1–3 palabras de alto impacto
- El artículo es estacional o ligado a un evento concreto (declaración de renta, reajuste del sueldo mínimo)

**Estructura:**
- Fondo de color semántico
- Texto grande ocupando 50–65% del ancho de la imagen (ver sección 7)
- Ícono secundario a escala reducida (15–20% del ancho), en esquina o complementando el texto
- Sin otros elementos

**Ejemplos:**

| Dato | Texto en imagen | Ícono secundario |
|------|-----------------|-----------------|
| Tasa de interés máxima | `29,4%` | `percent` |
| Reajuste sueldo mínimo | `+5,9%` | `trending-up` |
| Plazo para declarar renta | `30 abril` | `calendar` |
| Meses de cesantía cubiertos | `5 meses` | `shield-check` |

---

### Template D — Split Layout `[EXCEPCIÓN — contexto institucional]`

Composición dividida: 50% color de fondo con ícono o escena mínima, 50% fotografía editorial.

**Cuándo usar:**
- El artículo involucra una institución física reconocible (banco, SII, AFP, registro civil)
- La fotografía del contexto añade legitimidad que la ilustración no puede replicar

**Reglas fotografía:**
- Colores desaturados o duotono sutil con color de la paleta
- Sin texto superpuesto
- Sin grading cinemático
- Fotografía en el 50% derecho

---

### Template E — Editorial Photography `[EXCEPCIÓN — impacto emocional crítico]`

Fotografía editorial a borde completo con duotono.

**Cuándo usar:**
- El artículo trata pérdida económica grave, fraude o crisis financiera personal
- La fotografía añade peso emocional que ningún otro template puede replicar

**Reglas:**
- Duotono obligatorio con color de la paleta
- Opacidad del duotono: 20–35%
- Sin texto superpuesto
- Sin grading cinemático

---

## 5. Sistema de color

### 5.1 Paleta semántica extendida

v3 amplía la paleta para soportar los nuevos templates y dar mayor variación visual al grid. Los colores nuevos se integran sin romper la coherencia semántica.

| Color | Hex | Categorías | Novedad |
|-------|-----|------------|---------|
| Teal — Base | `#0d9488` | Finanzas general · AFP · Empleo · Ahorro | v2 |
| Teal oscuro | `#0f766e` | Variante secundaria | v2 |
| Teal claro | `#14b8a6` | Variante terciaria / series | v2 |
| Amber — Alerta | `#d97706` | Crédito · Deuda · Impuestos · Riesgo | v2 |
| Amber oscuro | `#b45309` | Variante secundaria Amber | v2 |
| Red-Amber | `#c2410c` | Fraude activo · Pérdida grave | v2 |
| Slate — Neutral | `#475569` | Banca · Instituciones · Referencia técnica | v2 |
| Slate medio | `#64748b` | Variante Slate | v2 |
| Indigo — Educativo | `#4f46e5` | Conceptos · Guías educativas · Glosario | **v3** |
| Indigo oscuro | `#4338ca` | Variante Indigo | **v3** |
| Emerald — Motivacional | `#059669` | Ahorro activo · Metas · Logros financieros | **v3** |
| Emerald oscuro | `#047857` | Variante Emerald | **v3** |
| Rose — Alerta suave | `#e11d48` | Advertencias · Errores comunes · Trampas | **v3** |

**Criterio para los colores nuevos:**

- **Indigo** se incorpora porque el teal cubría demasiados conceptos distintos. Cuando el artículo es puramente educativo/conceptual, el indigo señala "esto te enseña algo" en lugar de "esto te informa sobre un tema".
- **Emerald** se diferencia del teal en intención: el teal es neutral sobre finanzas; el emerald transmite progreso, logro, avance. Para artículos sobre metas de ahorro o hábitos financieros positivos.
- **Rose** completa el espectro de alerta. El amber es para riesgo estructural (deuda, impuestos). El rose es para advertencias accionables: errores que el lector puede estar cometiendo ahora.

### 5.2 Variación de luminosidad

Rotar entre variantes (base → oscuro → claro) de forma secuencial dentro de una misma categoría para evitar monotonía en el grid.

### 5.3 Reglas de gradiente

- **No recomendado.** Los fondos sólidos son la norma.
- **Si se usa:** solo entre dos tonos de la misma familia.
- **Prohibido:** gradientes entre familias distintas.

---

# PARTE II — ILUSTRACIÓN Y TIPOGRAFÍA

---

## 6. Sistema de ilustración

Esta sección aplica principalmente a Template A (Scene Illustration). Define las reglas que garantizan que las escenas sean consistentes entre sí y mantengan el tono editorial.

### 6.1 Estilo de personajes

**Abstracción geométrica simple.** Los personajes se construyen con formas básicas: círculo para la cabeza, rectángulos y curvas para el cuerpo. Sin detalles anatómicos. Sin expresiones faciales detalladas — preferiblemente sin rostro visible.

**Por qué sin rostro:** los rostros generados por IA son el marcador más reconocible de contenido artificial. Eliminarlos también evita el problema de representación (género, etnia, edad) y hace los personajes más universalmente identificables.

**Paleta de personajes:**
- Color de forma: tono cálido neutro plano (`#d4a574` o equivalente), nunca fotorrealista
- Ropa: colores planos dentro de la paleta del sistema
- Sin sombras complejas — máximo una sombra sólida simple a 15% de opacidad

### 6.2 Objetos de contexto

Los objetos anclan la escena al tema financiero. Deben ser:

- **Reconocibles** a primera vista (pantalla, billetera, sobre, calculadora, documento)
- **Planos** — mismo estilo ilustrado que los personajes
- **En escala coherente** con el personaje

Máximo 4 objetos por escena. Más elementos no añaden claridad, la reducen.

### 6.3 Tabla de íconos — criterio narrativo

La columna **"Ícono narrativo"** es la que debe usarse por defecto en Template B. El ícono semántico se mantiene como referencia pero no es la primera opción.

| Concepto | Ícono semántico | Ícono narrativo | Razonamiento |
|----------|----------------|-----------------|--------------|
| Cesantía / desempleo | `user-minus` | `clock` | Lo que siente el lector: el tiempo que corre |
| Impuestos / SII | `calculator` | `calendar` | La fecha límite es la experiencia real |
| Crédito / Deuda | `credit-card` | `trending-down` | La dirección, no el instrumento |
| Inflación / Precios | `trending-up` | `shopping-cart` | El carrito que sube de precio |
| Ahorro / APV | `piggy-bank` | `target` | La meta, no el contenedor |
| Banco / Cuenta corriente | `building-2` | `smartphone` | Cómo el lector interactúa hoy con el banco |
| Fraude / Estafa | `shield-alert` | `alert-triangle` | Alerta inmediata, más urgente |
| Sueldo / Nómina | `banknote` | `banknote` | Funciona bien, mantener |
| AFP / Pensión | `umbrella` | `hourglass` | El tiempo es el concepto central |
| Seguro | `shield-check` | `shield-check` | Funciona bien, mantener |
| Inversión / Fondos | `bar-chart-2` | `bar-chart-2` | Funciona bien, mantener |
| Hipoteca / Arriendo | `home` | `key` | La llave como momento de decisión |
| Presupuesto / Gastos | `list-checks` | `split` | Dividir, priorizar, distribuir |
| UF / Indicadores | `activity` | `activity` | Funciona bien, mantener |
| Renegociación | `refresh-cw` | `refresh-cw` | Funciona bien, mantener |

### 6.4 Fuentes de íconos aprobadas

| Set | Estilo preferido | Notas |
|-----|-----------------|-------|
| Lucide | Linear (stroke) | Preferido. Grid 24×24, stroke 2px. |
| Phosphor | Linear o Filled | Alternativa cuando Lucide no cubre el concepto. |
| Unicons | Linear o Filled | Uso excepcional. |

**Especificaciones técnicas:**
- Grid base: 24×24px
- Stroke: 2px consistente. No mezclar grosor.
- Escala en Template B: 35–45% del ancho total
- No mezclar linear con filled en una misma imagen

---

## 7. Tipografía como elemento gráfico

Esta sección aplica a Template C (Type + Icon).

### 7.1 Principio

El texto en Template C no es informativo — es visual. Funciona como el ícono en Template B: ancla el tema, crea jerarquía, genera curiosidad. El lector no necesita leerlo para entender de qué trata el artículo; lo siente.

### 7.2 Especificaciones

- **Fuente:** sans-serif geométrica de peso bold o black. Inter, Plus Jakarta Sans o equivalente.
- **Tamaño:** ocupa 50–65% del ancho de la imagen
- **Color:** blanco puro o tono muy claro del color de fondo (contraste mínimo 4.5:1)
- **Alineación:** centrado o ligeramente desplazado hacia la izquierda para dar espacio al ícono secundario
- **Contenido permitido:** cifras, porcentajes, fechas cortas, 1–3 palabras de alto impacto

### 7.3 Qué no hacer

- Sin oraciones completas — esto no es texto informativo
- Sin más de un elemento tipográfico por imagen
- Sin fuentes serif ni decorativas
- Sin efectos (sombra, degradado, outline) — tipografía plana

### 7.4 Ejemplos válidos e inválidos

```
✓  "29,4%"
✓  "30 abril"
✓  "5 meses"
✓  "UF hoy"

✗  "Tasa máxima de interés convencional"
✗  "¿Cuánto puedes ahorrar?"
✗  "CAE · Crédito con Aval del Estado"
```

---

# PARTE III — ESPECIFICACIONES TÉCNICAS

---

## 8. Dimensiones y formatos

### 8.1 Dimensiones canónicas

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| Dimensiones | `1200 × 630 px` | Ratio 1.91:1, compatibilidad Open Graph máxima |
| Ratio aspect | `1.91:1` | OG estándar. Las cards usan `aspect-video` (16:9) |
| Safe area cards | `1134 × 596 px` centrado | Garantiza visibilidad en crop 16:9 |
| Formato preferido | `.avif` | Mejor compresión, soporte moderno |
| Formato fallback | `.webp` | Compatibilidad amplia |
| Formatos prohibidos | `.jpg` / `.png` | No introducir en el proyecto |

> **⚠️ Safe area y crop 16:9**\
> Las cards renderizan en `aspect-video` (16:9), recortando verticalmente el OG 1.91:1. Todos los elementos clave deben estar dentro del área central `1134 × 596 px`. En Template A esto es especialmente crítico: la escena completa debe ser legible en el crop.

### 8.2 Presupuesto de tamaño

- **Máximo absoluto:** `80 KB` (81.920 bytes). El build falla si se supera.
- **Objetivo ideal:** `≤ 50 KB`.
- **Template A:** apuntar a 40–55 KB. Las ilustraciones vectoriales planas comprimen bien en avif.
- **Templates D y E (fotografía):** usar nivel de calidad 45–55% en avif.

### 8.3 Safe margins

Área segura efectiva: `1080 × 567 px` dentro de los `1200 × 630 px` totales (margen 10% en todos los lados).

---

## 9. Estructura de archivos

### 9.1 Ubicación

```
src/assets/images/blog/
```

Sin subdirectorios.

### 9.2 Convención de naming

```
[slug].avif
```

```
# Correcto
cesantia-seguro-desempleo.avif

# Incorrecto
cesantia-seguro-desempleo-v2.avif
cesantia_seguro_desempleo.avif
Cesantia-Seguro-Desempleo.avif
```

### 9.3 Referencia en frontmatter

```yaml
---
title: "Seguro de Cesantía: cuánto recibirás y por cuánto tiempo"
slug: cesantia-seguro-desempleo
heroImage: ../../assets/images/blog/cesantia-seguro-desempleo.avif
---
```

---

## 10. Validación y CI/CD

### 10.1 Comando

```bash
pnpm run check:images
```

Valida: formatos permitidos (`.avif` y `.webp`), tamaño máximo (81.920 bytes). Falla con `exit code 1` ante cualquier infracción.

### 10.2 Integración

Integrado en `check` y `build` en `package.json`. Si una imagen infringe las reglas, el build falla antes de deploy.

---

## 11. Casos límite y resolución

| Caso | Resolución |
|------|------------|
| ¿Template A o B para este artículo? | Si describe una situación personal → A. Si el protagonista es una institución o proceso técnico → B. |
| Artículo cruza dos categorías | Color de la categoría con mayor peso en el titular. Documentar si genera duda recurrente. |
| El ícono narrativo no existe en Lucide | Buscar en Phosphor. Si tampoco, usar el semántico de la tabla. |
| Imagen supera 80 KB con `.avif` | Re-exportar con calidad 55–65%. Template A rara vez llega a este límite. |
| Serie de artículos (cluster) | Mantener template e ícono base para toda la serie. Variar solo el color con la regla de rotación de sección 5.2. |
| Template C: el dato es demasiado largo | Si no cabe en ≤6 caracteres de forma legible, usar Template B. |
| Safe area 1.91:1 vs crop 16:9 | Diseñar en 1200×630. Elementos clave dentro de 1134×596. Verificar en ambos ratios antes de publicar. |
| Personaje con rostro necesario para la escena | Abstraer a silueta o vista de espalda. Si es imprescindible, forma geométrica simple sin rasgos. |