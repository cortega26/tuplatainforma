---
title: "Nota metodológica: simulación de interés compuesto 1990-2025"
description: "Supuestos, fórmulas, fuentes y cálculos corregidos del ejercicio sobre invertir el 10% del sueldo mínimo en el NASDAQ-100 entre 1990 y 2025."
slug: interes-compuesto-nota-metodologica
author: "Equipo Monedario"
pubDate: 2026-03-06T15:00:00Z
updatedDate: 2026-03-07T13:09:35Z
tags:
  - ahorro
  - interes-compuesto
  - nasdaq-100
category: general
cluster: ahorro-e-inversion
lang: es-CL
unlisted: true
featured: false
draft: false
heroImage: /images/hero/interes-compuesto-nota-metodologica.avif
---

Este documento detalla los supuestos, fuentes de datos y fórmulas utilizados en el artículo [El poder del interés compuesto: cómo el 10% del sueldo mínimo se convierte en más de $125 millones](/posts/el-poder-del-interes-compuesto/). El objetivo es que cualquier persona pueda replicar o cuestionar los resultados.

**Fecha de corte del ejercicio:** **2025-12-31**.

**Corrección aplicada en esta revisión:** la serie 2025 del NASDAQ-100 dejó de usar un dato parcial conservador y pasó a usar el cierre anual reportado para 2025. Ese ajuste cambia el resultado final del ejercicio de **USD 104.018 / CLP 100,9 millones** a **USD 129.495 / CLP 125,6 millones**.

## 1. Período y estructura de la simulación

- **Período:** enero de 1990 a diciembre de 2025 (**432 meses = 36 años**).
- **Meses con aporte:** **408**.
- **Meses sin aporte (lagunas):** **24**, distribuidos aleatoriamente con semilla fija (`numpy.random.seed(42)`).
- **Edad de inicio laboral asumida:** **18 años**.
- **Edad de retiro al final de la fase de acumulación:** **54 años**.

## 2. Sueldo mínimo histórico (CLP)

Se usaron valores del sueldo mínimo bruto chileno como puntos de control. Entre reajustes, el sueldo mínimo permanece constante; no se interpola linealmente, sino que se trata como **función escalón**.

| Año  | Sueldo mínimo bruto (CLP) |
| ---- | ------------------------- |
| 1990 | $17.374                   |
| 1992 | $33.000                   |
| 1994 | $52.000                   |
| 1996 | $74.000                   |
| 1998 | $90.500                   |
| 2000 | $105.500                  |
| 2002 | $119.000                  |
| 2004 | $135.000                  |
| 2006 | $155.510                  |
| 2008 | $159.000                  |
| 2010 | $172.000                  |
| 2012 | $193.000                  |
| 2014 | $225.000                  |
| 2016 | $257.500                  |
| 2018 | $288.000                  |
| 2020 | $320.500                  |
| 2022 | $380.000                  |
| 2024 | $460.000                  |
| 2025 | $500.000                  |

**Fuentes base declaradas por el ejercicio:** SUSESO, Dirección del Trabajo y Biblioteca del Congreso Nacional.

## 3. Descuentos previsionales y cálculo del sueldo líquido

Se aplica un descuento estándar de trabajador dependiente:

| Descuento                       | Porcentaje |
| ------------------------------- | ---------- |
| AFP (cotización)                | 10,0%      |
| Salud (Fonasa mínimo)           | 7,0%       |
| Seguro de cesantía (trabajador) | 0,6%       |
| **Total descuentos**            | **17,6%**  |

El factor líquido queda así:

```text
factor_liquido = 1 - 0,176 = 0,824
aporte_CLP = sueldo_bruto x 0,824 x 0,10
```

No se incluye impuesto único de segunda categoría porque el escenario trabaja a nivel de sueldo mínimo. En enero de 1990, el aporte resultante es cercano a **$1.431 CLP**.

## 4. Tipo de cambio CLP/USD histórico

Los aportes en pesos se convierten a USD con el tipo de cambio del mes. El ejercicio usa puntos de control históricos y una interpolación lineal entre ellos.

| Año  | CLP por USD |
| ---- | ----------- |
| 1990 | 340         |
| 1993 | 400         |
| 1996 | 415         |
| 1999 | 508         |
| 2001 | 634         |
| 2003 | 600         |
| 2005 | 560         |
| 2007 | 525         |
| 2009 | 560         |
| 2011 | 483         |
| 2013 | 495         |
| 2015 | 655         |
| 2017 | 649         |
| 2019 | 703         |
| 2020 | 795         |
| 2021 | 800         |
| 2022 | 873         |
| 2023 | 840         |
| 2024 | 960         |
| 2025 | 970         |

El tipo de cambio final usado para convertir el resultado a pesos es **970 CLP/USD** en diciembre de 2025.

## 5. Retornos del NASDAQ-100 (Total Return)

Se usan retornos anuales del NASDAQ-100 con reinversión de dividendos. El retorno mensual equivalente se calcula así:

```text
retorno_mensual = (1 + retorno_anual)^(1/12) - 1
```

Serie anual usada:

| Año  | Retorno anual                                     |
| ---- | ------------------------------------------------- |
| 1990 | -6,5%                                             |
| 1991 | +70,0%                                            |
| 1992 | +15,5%                                            |
| 1993 | +13,0%                                            |
| 1994 | +3,0%                                             |
| 1995 | +42,5%                                            |
| 1996 | +43,0%                                            |
| 1997 | +21,0%                                            |
| 1998 | +85,5%                                            |
| 1999 | +102,5%                                           |
| 2000 | -37,0%                                            |
| 2001 | -32,5%                                            |
| 2002 | -37,8%                                            |
| 2003 | +50,2%                                            |
| 2004 | +10,7%                                            |
| 2005 | +2,5%                                             |
| 2006 | +7,2%                                             |
| 2007 | +19,0%                                            |
| 2008 | -41,9%                                            |
| 2009 | +54,1%                                            |
| 2010 | +20,1%                                            |
| 2011 | +2,8%                                             |
| 2012 | +18,2%                                            |
| 2013 | +37,1%                                            |
| 2014 | +19,1%                                            |
| 2015 | +9,4%                                             |
| 2016 | +7,1%                                             |
| 2017 | +33,1%                                            |
| 2018 | -1,0%                                             |
| 2019 | +38,6%                                            |
| 2020 | +48,9%                                            |
| 2021 | +27,3%                                            |
| 2022 | -32,6%                                            |
| 2023 | +54,9%                                            |
| 2024 | +25,6%                                            |
| 2025 | +20,2% _(cierre anual 2025 usado en la revisión)_ |

**Fuente declarada por el ejercicio:** Nasdaq (histórico NDX y scorecard de diciembre de 2025).

## 6. Mecánica de la simulación mes a mes

Para cada mes `i`:

1. La cartera crece o cae según el retorno mensual equivalente del NASDAQ-100.
2. Si el mes no es laguna, el aporte en CLP se convierte a USD y se suma al portafolio.
3. Se registra el valor de la cartera en USD y en CLP.

```text
portfolio_usd = portfolio_usd x (1 + retorno_mensual[i])

si i no pertenece al set de lagunas:
  aporte_clp = sueldo_bruto[i] x 0,824 x 0,10
  aporte_usd = aporte_clp / tc[i]
  portfolio_usd = portfolio_usd + aporte_usd
```

## 7. Resultados de la fase de acumulación

| Métrica                                           | Valor                   |
| ------------------------------------------------- | ----------------------- |
| Total aportado (CLP)                              | $6.183.108              |
| Total aportado (USD, al TC histórico de cada mes) | $9.453                  |
| Valor final del portafolio (dic 2025, USD)        | $129.495                |
| Valor final del portafolio (dic 2025, CLP a 970)  | $125.610.531 (~$125,6M) |
| Multiplicador sobre lo aportado                   | 13,7x                   |

## 8. Cálculo de la mensualidad de retiro

Se usa una anualidad ordinaria con capital decreciente, asumiendo:

- **Tasa de retorno durante el retiro:** 6% anual nominal.
- **Colchón final:** 10% del capital original (~$12.950 USD / ~$12,6M CLP).
- **Horizonte:** escenarios de 301, 333 y 366 meses según expectativa de vida referencial usada en el ejercicio.

Fórmula:

```text
PV_disponible = capital - colchon / (1 + tasa_m)^n
PMT = PV_disponible x tasa_m / (1 - (1 + tasa_m)^(-n))
```

Resultados:

| Escenario           | Meses | Mensualidad (USD) | Mensualidad (CLP) |
| ------------------- | ----- | ----------------- | ----------------- |
| Hombre (~79 años)   | 301   | $802              | ~$778.000         |
| Promedio (~82 años) | 333   | $771              | ~$748.000         |
| Mujer (~84 años)    | 366   | $746              | ~$723.000         |

## 9. Lo que esta simulación no modela

- **Costos de transacción e impuestos:** no incluidos.
- **Inflación:** montos mostrados en nominal, no en pesos de poder adquisitivo constante.
- **Riesgo de secuencia de retornos:** en retiro se usa tasa constante, no retornos variables.
- **Accesibilidad histórica:** en 1990 un trabajador chileno de sueldo mínimo no tenía acceso práctico al NASDAQ-100.
- **Tipo de cambio durante el retiro:** el modelo congela la conversión final en diciembre de 2025.

## 10. Críticas razonables y cómo leer el resultado

Estas son objeciones válidas al ejercicio y conviene dejarlas por escrito:

- **Benchmark optimista:** el NASDAQ-100 fue uno de los índices más ganadores del período y además es más concentrado que un índice amplio. Eso sesga el ejemplo hacia un resultado alto.
- **Efecto cambiario mezclado con retorno financiero:** el resultado final en CLP recoge tanto la evolución del índice como la depreciación del peso frente al dólar.
- **Lagunas simplificadas:** asumir 24 meses aleatorios sirve para ilustrar, pero no replica trayectorias laborales reales, donde la cesantía tiende a concentrarse en crisis o etapas de mayor estrés.
- **Magnitudes nominales:** el valor final y las mensualidades no están expresados en poder adquisitivo constante.
- **Retiro suavizado:** la etapa de jubilación usa una tasa promedio fija, por lo que no modela bien el daño potencial de una mala secuencia de retornos al inicio del retiro.

La lectura correcta no es "este será tu resultado", sino "esta es la escala que puede alcanzar un ahorro persistente bajo un escenario favorable de mercado y disciplina".

## 11. Datos inmobiliarios usados como referencia

Para la imagen mental del departamento se usaron rangos de mercado de 2025:

| Comuna           | Precio promedio departamento 2 dorm. | Fuente declarada        |
| ---------------- | ------------------------------------ | ----------------------- |
| La Florida       | ~3.700 UF                            | BDO Chile / BioBioChile |
| San Miguel       | ~3.500 UF                            | BDO Chile / BioBioChile |
| Macul            | ~3.800 UF                            | urbani.cl               |
| Santiago Centro  | ~3.100 UF                            | BDO Chile / BioBioChile |
| Estación Central | ~2.600 UF                            | BDO Chile / BioBioChile |

El capital final de **$125,6 millones CLP** equivale aproximadamente a **3.263 UF**, usando una UF cercana a $38.500 en diciembre de 2025. En esa lógica, el resultado permite comprar al contado una unidad en el rango inferior de las comunas listadas o una propiedad de mayor estándar en varias ciudades regionales.

Los rangos de arriendo referenciales de **$350.000 a $500.000 mensuales** para departamentos de 2 dormitorios en comunas intermedias de Santiago se atribuyen en el documento corregido a datos publicados por TocToc y HDI Seguros para 2025.

## Uso correcto de esta nota

Úsala para auditar el ejercicio, no para extrapolar rentabilidades futuras. Si quieres convertir esta idea en una decisión real, el siguiente paso no es copiar el número final, sino revisar vehículo, costos, liquidez, impuestos y tolerancia a caídas con una guía práctica como [cómo invertir en ETFs desde Chile](/posts/como-invertir-en-etfs-desde-chile/).

_Documento de carácter educativo. No constituye asesoría financiera personalizada._
