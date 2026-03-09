# descuentos_sueldo_build_report

- URL created: `/posts/descuentos-de-sueldo/`
- Target intent: informar qué descuentos del sueldo son obligatorios, cuáles requieren autorización y cuáles no corresponden.
- Relationship to sueldo hub: se integra como satélite operativo dentro de `/guias/sueldo-remuneraciones/` para cubrir el sub-intent "descuentos sueldo" sin depender solo del artículo AFP.
- Relationship to calculator: enlaza a `/calculadoras/sueldo-liquido/` como control numérico después de distinguir descuentos legales vs otros descuentos.
- Relationship to glossary / legal explainers: enlaza a `/glosario/afp/`, `/glosario/afc/`, `/leyes/dl-824-impuesto-renta/` y `/leyes/ley-19728-seguro-cesantia/`.
- Internal links added:
  - hacia el hub `/guias/sueldo-remuneraciones/`
  - hacia la calculadora `/calculadoras/sueldo-liquido/`
  - hacia `/posts/como-calcular-sueldo-liquido/`
  - hacia `/posts/liquidacion-de-sueldo/`
  - hacia `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/`
  - hacia `/posts/seguro-de-cesantia/`
- Page type: `mixed` (informational + procedural)
- Unresolved follow-up gaps:
  - revisar en un sprint posterior si conviene un satélite específico para `impuesto único sueldo`
  - si se quiere operación repetible en CI para hero prompts, falta incorporar este slug al pipeline de imágenes canónico
