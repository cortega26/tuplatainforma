# Editorial Image System

Last updated: 2026-03-05\
Status: Active\
Version: 3.4 — selección semántica obligatoria + prompt recipes validados

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
12. [Prompt Engineering anti-AI](#12-prompt-engineering-anti-ai)

---

# PARTE I — IDENTIDAD VISUAL

---

## 1. Propósito y alcance

Este documento define el sistema visual de imágenes destacadas (`heroImage`) para monedario. Es la referencia única para creación de contenido nuevo, migraciones visuales y generación automatizada.

> **⚠️ Dominio YMYL**\
> Este sitio opera en el dominio "Tu dinero o tu vida". La evolución visual de v3 no relaja ese principio — lo reencuadra. La credibilidad ahora se construye también a través de cercanía y reconocimiento, no solo a través de sobriedad. Un lector que se identifica con la imagen confía más en el contenido.

Aplica a:

- Todos los artículos nuevos en `src/data/blog/`
- Actualizaciones de contenido existente (content refresh)
- Migraciones visuales de artículos legacy
- Generación automatizada vía pipeline editorial

Regla mandatoria desde v3.3:

- La creación de toda `heroImage` nueva o reemplazada debe partir de la lectura del artículo.
- Queda prohibido seleccionar imagen solo por `slug`, `tags`, `category` o intuición libre del agente.
- La lectura del artículo no autoriza a describir una escena nueva.
- La lectura del artículo solo sirve para escoger el mejor modelo aprobado dentro del catálogo visual canónico.

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

Lo que estos referentes tienen en común con monedario: **hablan de plata sin hacerlo complicado**. El diseño debe hacer lo mismo.

### 2.3 Principio rector

> Las imágenes deben hacer que el lector piense *"esto es para mí"* antes de leer el título.

Eso requiere que las imágenes representen situaciones, no conceptos. Una persona mirando una pantalla con números. Una mano sosteniendo un documento. Una mesa con una taza y una calculadora. Escenas que cualquier chileno reconoce como parte de su vida financiera cotidiana.

---

## 3. Tono y estética

### 3.1 Tono general

**Claro, cercano, sin condescendencia.**

El tono visual de monedario es el de un amigo que sabe de finanzas y te explica bien las cosas. No es un banco. No es una fintech con estética startup. No es un profesor universitario. Es alguien que entiende que la plata es un tema serio pero que puede tratarse sin hacerlo intimidante.

Objetivo adicional de marca:

- Cada imagen debe poder reconocerse como parte de la misma familia visual en menos de 2 segundos.
- La prioridad es memorabilidad simple, no detalle.
- La imagen debe sentirse propia de Monedario, no genérica de banco, fintech o dashboard.

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
- Fondo de color semántico sólido (ver sección 5)
- Escena con 1 elemento humano simplificado y 1–2 objetos de contexto
- Sin texto en la imagen
- Sin textura, sombra ni degradado
- Lectura inmediata con una sola acción clara

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

Máximo 2 objetos por escena. Más elementos no añaden claridad, la reducen.

Reglas adicionales:

- Debe existir **1 objeto principal dominante**.
- El segundo objeto, si existe, solo apoya la lectura.
- Evitar mesas, escritorios o mobiliario grande salvo que sean indispensables para entender la acción.
- Evitar pilas de tarjetas, dashboards, paneles o UI flotante: elevan la carga cognitiva y enfrían la escena.

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

---

## 12. Prompt Engineering anti-AI

Esta sección traduce las reglas visuales del sistema a instrucciones de prompt concretas para generadores de imagen (Midjourney, Firefly, DALL-E, Ideogram, etc.). El objetivo es producir imágenes que cumplan el sistema visual de monedario y que **no activen el reconocimiento de "imagen IA"** en el lector.

---

### 12.1 Por qué las imágenes parecen IA — y cómo evitarlo

El lector moderno reconoce las imágenes IA por marcadores específicos, no por la imagen completa. Eliminar esos marcadores es suficiente para cambiar la percepción.

| Marcador IA más reconocido | Por qué ocurre | Cómo neutralizarlo en el prompt |
|---------------------------|----------------|----------------------------------|
| Iluminación volumétrica / rim light / god rays | El modelo por defecto dramatiza la luz | Pedir explícitamente `flat lighting`, `no shadows`, `uniform illumination` |
| Piel o cabello hiperrealistas | El modelo optimiza para fotorrealismo | Pedir `geometric shapes only`, `no skin texture`, `vector-style characters` |
| Profundidad de campo y bokeh | Estética fotográfica que los modelos emulan | `flat composition`, `no depth of field`, `no blur` |
| Objetos imposibles o deformados | Falla del modelo en geometría compleja | Limitar objetos a 1–2 máximo, simples y reconocibles |
| Colores saturados y gradientes complejos | El modelo maximiza impacto visual por defecto | Especificar paleta hex exacta, `solid color background`, `no gradients` |
| Tipografía generada (letras incorrectas) | Debilidad estructural de los modelos | Nunca pedir texto en la imagen; añadirlo en post-proceso |
| Composición "cinematográfica" | El modelo interpreta "buena imagen" como cine | `flat design`, `editorial illustration`, `2D graphic` |
| Escena demasiado corporativa | El modelo sesga hacia oficina, dashboard o ejecutivo | No pedir "estilo financiero" genérico. Pedir una acción concreta + 1-2 props concretos |

---

### 12.2 Estructura base del prompt

Todo prompt para monedario debe parecerse a los prompts validados manualmente. La regla es simple: pedir menos, pero pedirlo de forma concreta.

Estructura fija:

```
[ESTILO BASE] + [BACKGROUND] + [SCENE] + [LIGHTING] + [PALETA] + [COMPOSICION] + [CANVAS] + [NEGATIVOS]
```

**ESTILO BASE**
```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.
```

**BACKGROUND**
```
Background: solid color [HEX].
```

**SCENE**
```
Scene: one geometric human figure [postura], shown from behind or as a faceless silhouette -
simple circle for head, basic rectangles for body. The figure is near [1-2 objetos].
All objects are flat geometric shapes, same illustration style.
```

**LIGHTING**
```
Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
```

**PALETA**
```
Color palette: 3 colors maximum, all flat fills.
```

**COMPOSICION**
```
Composition: all elements within the central 80% of the canvas.
```

**CANVAS**
```
Canvas: 1200x630 pixels, landscape.
```

---

### 12.3 Negativos permanentes — copiar siempre

Este bloque se incluye en **todos los prompts** sin excepción. Es el núcleo del sistema anti-AI.

```
NEGATIVE PROMPT (copiar íntegro):

Do not include text, letters, numbers, logos, or watermarks.
Do not add photorealistic details, skin texture, hair texture, or facial features.
Do not add depth of field, bokeh, rim lighting, volumetric light, lens flare,
drop shadows, gradients, glows, or neon colors.
Do not use 3D rendering or CGI.
No cinematic lighting.
No realistic anatomy.
Do not add extra objects beyond the named scene props.
```

---

### 12.4 Plantillas de prompt por template

#### Template A — Scene Illustration

```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color [HEX de la categoria].

Scene: one geometric human figure [postura], shown from behind or as a faceless silhouette -
simple circle for head, basic rectangles for body. The figure is near [1-2 objetos].
All objects are flat geometric shapes, same illustration style.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 3 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

[negativos permanentes de 12.3]
```

**Ejemplo — artículo sobre presupuesto familiar:**
```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color #0d9488.

Scene: one geometric human figure seated at a table, leaning slightly forward, shown from behind or as a faceless silhouette - simple circle for head, basic rectangles for body. The figure is near calculator, stacked papers. All objects are flat geometric shapes, same illustration style.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 3 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

Do not include text, letters, numbers, logos, or watermarks. Do not add photorealistic details, skin texture, hair texture, or facial features. Do not add depth of field, bokeh, rim lighting, volumetric light, lens flare, drop shadows, gradients, glows, or neon colors. Do not use 3D rendering or CGI. No cinematic lighting. No realistic anatomy. Do not add extra objects beyond the named scene props.
```

---

#### Template B — Icon Focus

```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color [HEX].
Scene: one simple geometric [nombre del icono / objeto] icon, centered, occupying 40% of the canvas width. Use flat filled shapes only. No secondary elements.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 2 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

[negativos permanentes de 12.3]
```

**Ejemplo — artículo sobre AFP:**
```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color #0d9488.
Scene: one simple geometric hourglass shape icon, centered, occupying 40% of the canvas width. Use flat filled shapes only. No secondary elements.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 2 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

Do not include text, letters, numbers, logos, or watermarks. Do not add photorealistic details, skin texture, hair texture, or facial features. Do not add depth of field, bokeh, rim lighting, volumetric light, lens flare, drop shadows, gradients, glows, or neon colors. Do not use 3D rendering or CGI. No cinematic lighting. No realistic anatomy. Do not add extra objects beyond the named scene props.
```

---

#### Template C — Type + Icon

> ⚠️ No pedir texto al modelo. Generar solo el fondo + ícono secundario. El texto se agrega en post-proceso con Figma, Canva o equivalente usando las especificaciones de sección 7.

```
Create a flat vector editorial illustration for a personal finance website.
2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color [HEX].
Scene: one small geometric [nombre del icono] icon in the bottom right area. Use flat filled shapes only. No other objects.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 2 colors maximum, all flat fills.
Composition: keep the left two-thirds of the canvas completely empty for text overlay. All visible elements must stay within the rightmost 30% of the canvas.
Canvas: 1200x630 pixels, landscape.

[negativos permanentes de 12.3]
```

---

#### Templates D y E — Fotografía

Para los templates que usan fotografía real, no se genera con IA. Se busca en bancos de imágenes bajo licencia (Unsplash, Pexels, Adobe Stock). El duotono y la desaturación se aplican en post-proceso.

Criterios de búsqueda para fotografía:
- Sin personas con rostro en primer plano
- Sin logos ni marcas reconocibles
- Sin estética "stock photo" obvia (poses forzadas, fondo blanco)
- Preferir: manos sosteniendo objetos, espacios de trabajo vistos desde arriba, objetos sobre superficies texturadas

---

### 12.5 Ajustes por generador

Cada herramienta tiene comportamientos por defecto distintos. Estos ajustes complementan el prompt base.

| Generador | Ajuste adicional | Nota |
|-----------|-----------------|------|
| Midjourney | Agregar `--style raw` y `--stylize 50` | `raw` reduce la "mejora" automática. Stylize bajo = menos drama visual |
| DALL-E 3 | Incluir en el prompt: `"do not add photorealistic details, maintain flat 2D style throughout"` | El modelo tiende a agregar realismo sin pedirlo |
| Adobe Firefly | Seleccionar estilo "Flat Graphic" o "Vector Look" en la interfaz antes de generar | El selector de estilo es más efectivo que el prompt para Firefly |
| Ideogram | Usar `--style illustration` | Buen control de estilo plano. Agregar `--palette [hex]` si está disponible |
| Stable Diffusion | Usar modelo "juggernaut-xl" o "dreamshaper" con LoRA flat-design | Los modelos base de SD tienden al fotorrealismo |

---

### 12.6 Checklist de verificación antes de publicar

Antes de usar cualquier imagen generada, verificar:

- [ ] Sin rostros visibles ni expresiones faciales
- [ ] Sin texturas de piel, cabello o tela realista
- [ ] Sin iluminación volumétrica, rim light o bokeh
- [ ] Sin gradientes en el fondo (el fondo es color sólido)
- [ ] Sin texto generado en la imagen
- [ ] Sin objetos deformados o anatómicamente incorrectos
- [ ] Paleta de hasta 3 colores planos, todos dentro del sistema
- [ ] La escena se entiende en menos de 2 segundos
- [ ] Hay una sola acción clara y un objeto principal dominante
- [ ] No se percibe como clipart corporativo, dashboard o anuncio fintech
- [ ] La escena completa es legible en crop 16:9 (safe area 1134×596)
- [ ] Tamaño del archivo ≤ 80 KB tras exportar en .avif

Si algún punto falla: regenerar o ajustar el prompt. No corregir en post-proceso elementos que indican estética IA — la corrección parcial sigue siendo detectable.
---

## 13. Pipeline determinístico y auditable (v3.2)

### 13.1 Source of truth técnico

La implementación canónica de prompts vive en:

- `scripts/hero-images/config.mjs`

Incluye:

- `COLORS`
- `SCENE_EXAMPLES`
- `APPROVED_PROMPT_MODELS`
- `POSTURAS`
- `OBJETOS_SUGERIDOS`
- `NEGATIVES`
- builders `buildPromptA/B/C(...)`

Consumidores actuales:

- `scripts/prompt-generator.jsx` importa esta config compartida y no debe redefinir paletas, escenas ni builders localmente.

Nota de migración:

- Existe un generador externo (`prompt-generator.txt`, fuera del repo) usado como referencia de diseño.
- Ese archivo no es fuente canónica operativa en CI.
- Cualquier ajuste de política visual debe reflejarse primero en este documento y en `scripts/hero-images/config.mjs`.

### 13.2 Definición de artículo publicado

Para el pipeline de hero images:

- `publicable = draft !== true`

Esta definición está alineada con contratos/invariantes editoriales actuales.

### 13.3 Contrato de `heroImage`

Contrato preferido:

- `heroImage: /images/hero/<slug>.avif`

Reglas:

- Archivo físico en `public/images/hero/<slug>.avif`
- Extensiones permitidas: `.avif`, `.webp`
- Presupuesto de tamaño: `<= 80KB`
- Naming canónico: basename igual al slug

Compatibilidad transicional:

- Se permite path legacy por defecto en `check-hero-images`.
- Para endurecer, usar `--require-public-path`.
- El gate bloqueante valida dos condiciones:
  - `heroImage` resoluble (path actual del artículo).
  - asset canónico presente en `public/images/hero/<slug>.avif|.webp`.
- El modo `public-only` queda disponible para endurecimiento futuro.

### 13.4 Flujo operativo

1. Scan (`scan-articles`)
2. Lectura del artículo y derivación semántica de escena
3. Build prompts (`build-prompts`)
4. Render programático opcional (`render-svg-scenes`) para escenas determinísticas
5. Generación OpenAI opcional (`generate-images --run`) solo como benchmark o fallback
6. Postproceso (`postprocess-images`) a `.avif` 1200x630
7. Aplicación (`apply-images`) a `public/images/hero` + wiring de frontmatter
8. Guardrails CI (`check-hero-images`)

### 13.4.1 Regla obligatoria de lectura semántica

Antes de crear un prompt, el agente o script debe leer el artículo y escoger un modelo aprobado del catálogo visual. No puede inventar una escena nueva ni ampliar la receta del catálogo.

Campos obligatorios de decisión:

- `readerSituation`: situación principal que vive el lector
- `primaryIntent`: intención dominante del artículo (`explicar`, `alertar`, `comparar`, `guiar`, `calcular`)
- `toneClass`: tono visual esperado (`neutral`, `serio`, `alerta`, `educativo`, `progreso`)
- `templateChoice`: `A`, `B` o `C`
- `approvedModelId`: id del modelo aprobado elegido desde `SCENE_EXAMPLES`
- `sceneChoice` o `iconChoice`
- `visualEvidence`: frases breves que expliquen por qué esa escena sí corresponde al texto

La selección semántica debe responder a esta pregunta:

> Si el lector viera la imagen sin leer el título, ¿reconocería la situación concreta descrita por el artículo?

Regla operativa:

- `articulo -> clasificacion -> approvedModelId -> prompt`
- No permitido: `articulo -> descripcion libre de escena -> prompt`

Ejemplos de selección válida:

- Artículo sobre cesantía: elegir `A:cesantia`
- Artículo sobre deuda o CAE: elegir `A:deuda-credito`
- Artículo sobre ahorro: elegir `A:ahorro`
- Artículo sobre UF o IPC: elegir `C:uf-indicadores`

Ejemplos inválidos:

- Inventar una escena no presente en el catálogo del generador React
- Agregar objetos no contemplados en el modelo aprobado
- Redactar un prompt nuevo a partir de párrafos completos del artículo

### 13.4.2 Qué queda prohibido

No cumple la norma:

- elegir imagen solo por `slug`
- elegir imagen solo por `category` o `cluster`
- elegir imagen solo por coincidencia superficial de keywords
- usar una escena \"genérica de finanzas\" sin relación clara con el cuerpo del artículo
- cambiar de template o escena por gusto visual si contradice el tono o la situación descrita

Sí cumple la norma:

- usar metadata como punto de partida y luego confirmar/ajustar con lectura del artículo
- seleccionar una escena del sistema controlado (`Template A/B/C`) que represente la situación principal
- registrar por qué la escena elegida calza con el contenido

### 13.4.3 Regla operativa para agentes

Para cada artículo publicado o refresh visual:

1. Leer el artículo completo o una extracción estructurada construida desde el cuerpo completo.
2. Identificar la situación principal del lector, no solo el tema.
3. Elegir el template según la función editorial del artículo.
4. Elegir escena/objetos/ícono dentro del sistema visual existente.
5. Construir el prompt final recién después de esa decisión.

La lectura del cuerpo del artículo es mandatoria. La heurística por metadata sola no es suficiente para aprobar una imagen final.

Comandos base:

```bash
node scripts/hero-images/scan-articles.mjs
node scripts/hero-images/build-prompts.mjs
node scripts/check-hero-prompts.mjs
node scripts/hero-images/render-svg-scenes.mjs
node scripts/hero-images/render-svg-scenes.mjs --scene cesantia
node scripts/hero-images/render-svg-scenes.mjs --slug informe-deudas-cmf-vs-dicom
node scripts/hero-images/generate-images.mjs --dry-run
node scripts/hero-images/generate-images.mjs --dry-run --slug que-es-la-uf --model gpt-image-1
node scripts/hero-images/generate-images.mjs --dry-run --slug que-es-la-uf --compare-models dall-e-3,gpt-image-1
node scripts/hero-images/postprocess-images.mjs
node scripts/hero-images/apply-images.mjs --enforce-public-path
node scripts/check-hero-images.mjs
```

### 13.4.4 Render SVG determinístico (POC activo)

Cuando el objetivo visual es:

- geometría simple
- baja carga cognitiva
- branding repetible
- control estricto de composición

el camino preferido es renderizar la imagen desde código, no pedirla a un modelo generativo.

Implementación actual del POC:

- `scripts/hero-images/svg/primitives.mjs`
- `scripts/hero-images/svg/components.mjs`
- `scripts/hero-images/svg/scene-registry.mjs`
- `scripts/hero-images/render-svg-scenes.mjs`

Escenas SVG implementadas hoy:

- `cesantia`
- `deuda-credito`
- `ahorro`

Reglas del renderer SVG:

- una escena cerrada por `approvedModelId`
- figuras geométricas sin rostro
- props fijos y controlados
- paleta por roles (`background`, `primary`, `dark`, `light`, `accent`)
- sin textura
- sin gradientes
- sin detalle micro
- sin deriva visual por prompt rewriting

Objetivo del POC:

- validar dirección visual
- estabilizar una gramática propia de Monedario
- sustituir gradualmente el uso de IA donde la consistencia pese más que la variación

### 13.5 Reproducibilidad

Artefactos determinísticos:

- `scripts/hero-images/manifest.json`
- `scripts/hero-images/prompts.json`

Artefactos semánticos obligatorios por entrada:

- `template`
- `sceneId`
- `selectors.ruleId`
- `visualEvidence` o campo equivalente de justificación semántica
- `promptHash`

Garantías:

- Orden estable por slug
- Heurísticas determinísticas de selección (`prompt-plan.mjs`)
- La decisión visual debe ser trazable desde el texto del artículo hacia la escena elegida
- `promptHash` (`sha256`) por entrada para detectar drift

### 13.6 Guardrails de CI (sin secretos)

En CI estándar:

- no se ejecuta generación OpenAI
- sí se ejecuta scan/build/check
- `check-hero-prompts` bloquea ausencia de evidencia textual o selección metadata-only
- `check-hero-images` bloquea falta de asset público, formato inválido o presupuesto excedido

En workflow manual/scheduled con secretos:

- se habilita `generate-images --run`
- `generate-images` acepta:
  - `--slug <slug>` para probar un solo artículo
  - `--model <model>` para fijar el modelo (`dall-e-3`, `gpt-image-1`, etc.)
  - `--compare-models modelA,modelB` para comparar dos modelos con el mismo prompt
  - `OPENAI_IMAGE_MODEL` como override global de modelo por entorno
- la salida queda en staging para revisión humana (sin commit automático)

Estado de enforcement:

- Bloqueante por script hoy: existencia de `heroImage`, asset canónico, formato y presupuesto.
- Mandatorio por norma desde v3.3: lectura semántica del artículo antes de elegir imagen.
- Mientras no exista un checker semántico más profundo, la correspondencia texto-imagen se considera enforcement mixto: artefacto + revisión humana.
