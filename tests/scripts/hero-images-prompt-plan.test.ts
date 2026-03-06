import { describe, expect, it } from "vitest";
import {
  buildPromptFromPlan,
  selectPromptPlan,
} from "../../scripts/hero-images/prompt-plan.mjs";

describe("hero-images deterministic selector", () => {
  it("routes fraud-like content to Template A with severe palette", () => {
    const plan = selectPromptPlan({
      slug: "estafas-financieras-chile",
      title: "Estafas financieras en Chile",
      tags: ["fraude", "seguridad-financiera"],
      category: "seguridad-financiera",
      cluster: "seguridad-financiera",
      summary: "como detectar estafas y evitar fraude",
      headings: ["Que hacer si recibes una llamada sospechosa"],
      leadParagraphs: ["Si te llaman para pedir claves o codigos, debes cortar de inmediato."],
      bodyExcerpt: "El articulo explica como detectar contactos sospechosos y bloquear fraude.",
    });

    expect(plan.template).toBe("A");
    expect(plan.colorKey).toBe("Fraude / Perdida grave");
    expect(plan.approvedModelId).toBe("fraude-estafa");
    expect(plan.sceneId).toBe("A:fraude-estafa");
    expect(plan.sceneChoice).toBe("Fraude / Estafa");
    expect(plan.semantic.primaryIntent).toBe("alertar");
    expect(plan.semantic.visualEvidence.length).toBeGreaterThan(0);
  });

  it("routes UF/IPC content to Template C", () => {
    const plan = selectPromptPlan({
      slug: "que-es-la-uf",
      title: "UF en simple",
      tags: ["uf", "ipc"],
      category: "deuda-credito",
      cluster: "deuda-credito",
      summary: "como cambia la uf segun ipc",
      headings: ["Que es la UF", "Por que la UF sube todos los dias"],
      leadParagraphs: ["Tu arriendo y dividendo pueden cambiar por la UF aunque el contrato no cambie."],
      bodyExcerpt: "La UF refleja la inflacion y afecta pagos cotidianos como arriendo y creditos.",
    });

    expect(plan.template).toBe("C");
    expect(plan.colorKey).toBe("Educativo / Conceptos / Guias");
    expect(plan.approvedModelId).toBe("uf-indicadores");
    expect(plan.sceneId).toBe("C:uf-indicadores");
    expect(plan.iconChoice).toBe("UF / Indicadores");
    expect(plan.semantic.primaryIntent).toBe("explicar");
    expect(plan.semantic.readerSituation).toContain("indicador");
  });

  it("keeps deterministic output for same input", () => {
    const article = {
      slug: "fondos-afp-a-b-c-d-e",
      title: "Fondos AFP",
      tags: ["afp", "pensiones"],
      category: "prevision",
      cluster: "pensiones-afp",
      summary: "diferencias entre fondos afp",
      headings: ["Diferencias entre fondos", "Cual te conviene"],
      leadParagraphs: ["Elegir mal el fondo puede afectar tu pension futura."],
      bodyExcerpt: "El articulo compara riesgo, horizonte y conveniencia de cada fondo.",
    };

    const a = selectPromptPlan(article);
    const b = selectPromptPlan(article);

    expect(a).toEqual(b);
    expect(buildPromptFromPlan(a)).toBe(buildPromptFromPlan(b));
  });

  it("prefers article text signals over coarse category fallback", () => {
    const plan = selectPromptPlan({
      slug: "explicacion-uf",
      title: "Explicacion de la UF",
      tags: [],
      category: "deuda-credito",
      cluster: "deuda-credito",
      summary: "guia para entender la uf",
      headings: ["Que es la UF"],
      leadParagraphs: ["La UF afecta pagos cotidianos como arriendo y dividendos."],
      bodyExcerpt: "Este texto explica la UF y el IPC, no una deuda puntual ni una cobranza.",
    });

    expect(plan.ruleId).toBe("uf");
    expect(plan.template).toBe("C");
    expect(plan.approvedModelId).toBe("uf-indicadores");
    expect(plan.matchedKeywords).toContain("uf");
  });
});
