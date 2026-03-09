import { describe, expect, it } from "vitest";

import {
  getReachedScrollMilestones,
  isOfficialSourceUrl,
} from "@/utils/analytics";

describe("analytics utilities", () => {
  it("returns only reached scroll milestones", () => {
    expect(getReachedScrollMilestones(0)).toEqual([]);
    expect(getReachedScrollMilestones(24.9)).toEqual([]);
    expect(getReachedScrollMilestones(25)).toEqual([25]);
    expect(getReachedScrollMilestones(80)).toEqual([25, 50, 75]);
    expect(getReachedScrollMilestones(130)).toEqual([25, 50, 75, 100]);
  });

  it("detects official Chilean source domains", () => {
    expect(isOfficialSourceUrl("https://www.sii.cl/portales")).toBe(true);
    expect(isOfficialSourceUrl("https://chileatiende.gob.cl/fichas/")).toBe(
      true
    );
    expect(
      isOfficialSourceUrl(
        "https://si3.bcentral.cl/Indicadoressiete/secure/Indicadoresdiarios.aspx"
      )
    ).toBe(true);
    expect(isOfficialSourceUrl("https://www.comparaonline.cl")).toBe(false);
    expect(isOfficialSourceUrl("/posts/que-es-la-uf/")).toBe(false);
  });
});
