# Calculator Portfolio Policy

Fecha de corte: 2026-03-12

## Objetivo

Evitar que `/calculadoras/` vuelva a crecer como una lista plana sin frontera de producto. Cada herramienta debe tener un JTBD distinguible, una familia explícita y una decisión visible sobre si corresponde crear, extender, fusionar o retirar.

## Fuentes de verdad

- Runtime/landing source of truth: `src/config/calculatorPortfolio.ts`
- Landing pública: `src/pages/calculadoras/index.astro`
- Backlog de deuda: `docs/TECH_DEBT_BACKLOG.md` (`TD-0027`)

## Familias vigentes

| Familia | Qué resuelve | Herramientas activas |
|---|---|---|
| `ingresos` | Flujo mensual y contingencia laboral | `sueldo-liquido`, `seguro-cesantia` |
| `ahorro-prevision` | APV hoy vs pensión futura | `apv`, `simulador-jubilacion` |
| `deuda-credito` | Crédito nuevo, deuda usada, prepago o salida formal | `credito-consumo`, `tarjeta-credito`, `prepago-credito`, `simulador-renegociacion` |
| `vivienda-uf` | Conversión indexada y reajuste contractual | `conversor-uf`, `reajuste-arriendo` |

## Regla de decisión

### 1. Crear una calculadora nueva solo si el JTBD es distinto

Se permite una herramienta nueva solo si cumple todo:

- El usuario llega con una pregunta que no se resuelve agregando uno o dos inputs a una calculadora existente.
- El output esperado cambia de forma material, no solo el copy o un bloque explicativo.
- Existe una frontera clara de entrada: deuda nueva vs deuda ya tomada, APV hoy vs pensión futura, referencia UF vs reajuste contractual, etc.
- La landing puede explicar en una frase cuándo usarla y cuándo no.

### 2. Extender una calculadora existente si la decisión es la misma

No se abre una herramienta nueva si el JTBD sigue siendo el mismo y cambia solo:

- un parámetro adicional;
- un tramo legal o tope;
- una vista más detallada del mismo resultado;
- copy editorial o ayudas de interpretación.

En esos casos se extiende la calculadora existente y se actualiza su ficha en `src/config/calculatorPortfolio.ts`.

### 3. Fusionar si dos herramientas compiten por la misma entrada mental

Fusionar cuando dos calculadoras comparten:

- mismo disparador de usuario;
- mismo resultado principal;
- misma frontera temporal;
- diferencias menores que caben como variantes o estados dentro de una sola UI.

Si no se puede explicar la diferencia en una frase tipo "usa A si..., usa B si...", la separación probablemente es mala.

### 4. Retirar o esconder si la herramienta queda absorbida

Retirar o despromover cuando:

- un modelo nuevo absorbe por completo el JTBD anterior;
- el tráfico esperado ya pertenece a otra familia con mejor frontera;
- la herramienta obliga a repetir advertencias para explicar que no resuelve la duda principal.

## Checklist obligatorio para nuevas propuestas

Toda propuesta de nueva calculadora debe declarar, antes de implementarse:

| Campo | Obligatorio |
|---|---|
| URL tentativa | Sí |
| Familia propuesta | Sí |
| JTBD principal en una frase | Sí |
| Qué calculadora actual es la más cercana | Sí |
| Por qué no basta con extender la calculadora cercana | Sí |
| Riesgo de overlap (`bajo`, `medio`, `alto`) | Sí |
| Regla visible de elección para la landing | Sí |
| Output principal esperado | Sí |
| Fuentes o parámetros oficiales críticos | Sí |

## Plantilla mínima para backlog / issue

```md
## Calculator Intake
- URL tentativa:
- Familia:
- JTBD principal:
- Usuario llega pensando:
- Calculadora actual más cercana:
- Qué le falta a la calculadora actual:
- Riesgo de overlap: bajo|medio|alto
- Regla visible de elección para `/calculadoras/`:
- Output principal:
- Fuente primaria o parámetro oficial crítico:
```

## Mantenimiento operativo

Cuando se crea, fusiona o retira una calculadora:

1. Actualizar `src/config/calculatorPortfolio.ts`.
2. Verificar que `/calculadoras/` sigue agrupando por familia y mantiene ayuda visible de elección.
3. Si cambia el portafolio activo, actualizar `docs/TECH_DEBT_BACKLOG.md` o el issue operativo correspondiente.
4. Si la frontera semántica cambia a nivel de producto, agregar checkpoint en `context/PROJECT_CONTEXT_MASTER.md`.
