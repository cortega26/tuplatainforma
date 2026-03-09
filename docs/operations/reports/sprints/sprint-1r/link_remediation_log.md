# Link Remediation Log — Sprint 1R

## Summary

Sprint 1A identified broken official-source links plus one broken internal pattern generated on article pages. Sprint 1R replaced every confirmed official-source `404` found in repository content with a live official equivalent and removed the source-level `mailto:` share link that triggered the `/cdn-cgi/l/email-protection` pattern under Cloudflare.

## Remediation Table

| Broken target | Files updated | Action taken | Result |
| --- | --- | --- | --- |
| `https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/` | [`src/data/laws/dl-824-impuesto-renta.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/dl-824-impuesto-renta.md) | Replaced with `https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm` | Replaced |
| `https://www.sii.cl/contribuyentes/atencion_contribuyentes/tribunal_tributario/` | [`src/data/laws/dl-830-codigo-tributario.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/dl-830-codigo-tributario.md) | Replaced with the current official TTA site `https://www.tta.cl/` | Replaced |
| `https://www.cmfchile.cl/portal/principal/613/w3-article-27329.html` | [`src/data/laws/ley-21236-portabilidad-financiera.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21236-portabilidad-financiera.md) | Replaced with live CMF Portabilidad Financiera page `https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43999.html` | Replaced |
| `https://www.chileatiende.gob.cl/fichas/134983-conoce-las-principales-fechas-clave-de-la-reforma-de-pensiones` | [`src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md), [`src/data/blog/fondos-afp-a-b-c-d-e.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/fondos-afp-a-b-c-d-e.md) | Replaced with current ChileAtiende pension-contribution page `https://www.chileatiende.gob.cl/fichas/130987-aportes-del-empleador-al-sistema-de-pensiones` | Replaced |
| `https://www.spensiones.cl/apps/rentabilidad/genRentabilidad.php` | [`src/data/blog/como-cambiarse-de-afp.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/como-cambiarse-de-afp.md) | Replaced with current SPensiones rentabilidad page `https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-9585.html` | Replaced |
| `https://www.cmfchile.cl/portal/estadisticas/606/w3-propertyvalue-17008.html` | [`src/data/blog/cae-costo-real-credito-chile.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/cae-costo-real-credito-chile.md) | Replaced with live CMF TMC/interés corriente publication `https://www.cmfchile.cl/portal/estadisticas/617/w3-propertyvalue-43345.html?indice=15.1` | Replaced |
| `https://www.cmfchile.cl/educa/621/w3-article-29903.html` | [`src/data/blog/cae-costo-real-credito-chile.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/cae-costo-real-credito-chile.md) | Replaced with live CMF Educa credit page `https://www.cmfchile.cl/educa/621/w3-propertyvalue-43579.html` | Replaced |
| `https://www.cmfchile.cl/portal/estadisticas/606/w3-propertyvalue-17636.html` | [`src/data/laws/ley-18010-credito-dinero.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-18010-credito-dinero.md) | Replaced with live CMF TMC/interés corriente publication `https://www.cmfchile.cl/portal/estadisticas/617/w3-propertyvalue-43345.html?indice=15.1` | Replaced |
| `https://www.cmfchile.cl/portal/principal/613/w3-propertyname-833.html` | [`src/data/laws/ley-21680-registro-deuda-consolidada.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21680-registro-deuda-consolidada.md) | Replaced with live CMF debt-report explainer `https://www.cmfchile.cl/portal/principal/613/w3-article-95399.html` | Replaced |
| `https://www.sernac.cl/portal/604/w3-propertyname-3780.html` | [`src/data/laws/ley-20555-sernac-financiero.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-20555-sernac-financiero.md) | Replaced with current SERNAC financial-consumer page `https://www.sernac.cl/proteccion-al-consumidor/consumidor-financiero` | Replaced |
| `https://www.sii.cl/destacados/trabajadores_independientes/` | [`src/data/laws/ley-21133-honorarios-retencion.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/laws/ley-21133-honorarios-retencion.md) | Replaced with current SII boletas/honorarios hub `https://www.sii.cl/destacados/boletas_honorarios/` | Replaced |
| `https://www.sii.cl/valores_y_fechas/utm/` | [`src/data/blog/que-es-la-cuenta-2-afp.md`](/home/carlos/VS_Code_Projects/tuplatainforma/src/data/blog/que-es-la-cuenta-2-afp.md) | Replaced with current yearly UTM table `https://www.sii.cl/valores_y_fechas/utm/utm2026.htm` | Replaced |
| `/cdn-cgi/l/email-protection` internal pattern on article pages | [`src/constants.ts`](/home/carlos/VS_Code_Projects/tuplatainforma/src/constants.ts) | Removed the article share-widget `mailto:` link that Cloudflare was rewriting into a broken internal email-protection URL | Eliminated in local build |

## Residual Host Responses

- `https://www.pdichile.cl`
  - Automated fetch returns `403`.
  - This is a host-side blocking response, not a Sprint 1A `404`.
  - No replacement was made because the official site itself remains valid for human users.
- LinkedIn share URLs return `999` in automated audit mode.
  - This is an anti-bot response from LinkedIn, not a broken citation target.

## Validation Evidence

- Local source-link audit after remediation found no official-source `404` URLs in repository content.
- `pnpm run build` external summary dropped from official-source `404`s to only:
  - `pdichile.cl` `403`
  - LinkedIn `999`
- `rg -n "mailto:|email-protection" dist src public` returns no matches after removing the mail share link.
