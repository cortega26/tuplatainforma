# sueldo_cluster_closure_report

## Cluster inventory after Sprint 2C

- Hub page:
  - `/guias/sueldo-remuneraciones/`
- Calculator path:
  - `/calculadoras/sueldo-liquido/`
- Article satellites:
  - `/posts/como-calcular-sueldo-liquido/`
  - `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/`
  - `/posts/descuentos-de-sueldo/`
  - `/posts/liquidacion-de-sueldo/`
- Glossary / legal support:
  - `/glosario/afp/`
  - `/glosario/afc/`
  - `/leyes/dl-824-impuesto-renta/`
  - `/leyes/ley-19728-seguro-cesantia/`

## Internal-link coverage

- The hub now exposes guide, calculator, AFP, descuentos and liquidación as first-line cluster entry points.
- The pilar article links to the new descuentos and liquidación satellites.
- The AFP satellite now links back into descuentos and the cluster hub.
- The new descuentos satellite links to hub, calculator, pilar, liquidación, AFP, glossary and cesantía support.
- The new liquidación satellite links to hub, calculator, descuentos, pilar and AFP.
- The calculator section config was expanded so sueldo-cluster readers can move from calculation to document reading and discount interpretation without leaving the cluster.

## Major remaining gaps

- No dedicated satélite yet for `impuesto único segunda categoría` as a sueldo-cluster sub-intent.
- Search-platform validation for the cluster remains incomplete because Bing Webmaster access is still missing.
- Hero-image pipeline artifacts for the two new slugs are not yet wired into the image manifest system, although frontmatter paths now exist.

## Canonical-pattern assessment

Yes. After Sprint 2C, the sueldo/remuneraciones cluster is strong enough to serve as the canonical pattern for the next cluster because it now includes:

- one hub
- one calculator
- one pilar guide
- two intent satellites for document and discount sub-intents
- one focused AFP sub-satellite
- glossary and legal support links
- explicit article-to-calculator and intra-cluster navigation
