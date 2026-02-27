import { describe, expect, it } from "vitest";
import { calculateNetSalary } from "@/application/use-cases/CalculateNetSalary";
import { calculateApvComparison } from "@/application/use-cases/CalculateApvComparison";
import { convertUf } from "@/application/use-cases/ConvertUf";
import { estimateUnemploymentCoverage } from "@/application/use-cases/EstimateUnemploymentCoverage";
import { calculateConsumerCredit } from "@/application/use-cases/CalculateConsumerCredit";
import { simulateCreditCardCost } from "@/application/use-cases/SimulateCreditCardCost";
import { simulateCreditPrepayment } from "@/application/use-cases/SimulateCreditPrepayment";
import { simulateDebtRenegotiation } from "@/application/use-cases/SimulateDebtRenegotiation";
import {
  calculateIpcRentAdjustment,
  calculateUfRentAdjustment,
} from "@/application/use-cases/CalculateRentAdjustment";
import { simulateRetirementProjection } from "@/application/use-cases/SimulateRetirementProjection";

const UTM = 67294;
const UF = 39300;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

describe("Regression - Sueldo Líquido", () => {
  it("case 1", () => {
    const result = calculateNetSalary({
      grossSalary: 900000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { utm: UTM },
    });
    expect(round2(result.netSalary)).toBe(734670);
    expect(round2(result.deductions.tax)).toBe(0);
    expect(round2(result.effectiveRates.marginalTaxPercent)).toBe(0);
  });

  it("case 2", () => {
    const result = calculateNetSalary({
      grossSalary: 1500000,
      afpRatePercent: 10.77,
      healthSystem: "isapre",
      isapreAdditionalPercent: 2,
      economicParameters: { utm: UTM },
    });
    expect(round2(result.netSalary)).toBe(1182650.76);
    expect(round2(result.deductions.tax)).toBe(11799.24);
    expect(round2(result.deductions.total)).toBe(317349.24);
  });

  it("case 3", () => {
    const result = calculateNetSalary({
      grossSalary: 4500000,
      afpRatePercent: 10.49,
      healthSystem: "fonasa",
      economicParameters: { utm: UTM },
    });
    expect(round2(result.netSalary)).toBe(3450513.05);
    expect(round2(result.deductions.tax)).toBe(235436.95);
    expect(round2(result.effectiveRates.marginalTaxPercent)).toBe(13.5);
  });
});

describe("Regression - APV", () => {
  it("case 1", () => {
    const result = calculateApvComparison({
      grossSalary: 1400000,
      monthlyApvContribution: 100000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    expect(round2(result.taxableBase)).toBe(1151220);
    expect(round2(result.taxWithoutApv)).toBe(9710.04);
    expect(round2(result.regimeA.monthlyBenefit)).toBe(15000);
    expect(round2(result.regimeB.monthlyBenefit)).toBe(4000);
    expect(result.recommendedRegime).toBe("A");
  });

  it("case 2", () => {
    const result = calculateApvComparison({
      grossSalary: 2400000,
      monthlyApvContribution: 250000,
      afpRatePercent: 10.77,
      healthSystem: "isapre",
      isapreAdditionalPercent: 2,
      economicParameters: { uf: UF, utm: UTM },
    });
    expect(round2(result.taxableBase)).toBe(1925520);
    expect(round2(result.taxWithoutApv)).toBe(40682.04);
    expect(round2(result.regimeA.monthlyBenefit)).toBe(33647);
    expect(round2(result.regimeB.monthlyBenefit)).toBe(6550);
    expect(result.recommendedRegime).toBe("A");
  });

  it("case 3", () => {
    const result = calculateApvComparison({
      grossSalary: 6000000,
      monthlyApvContribution: 900000,
      afpRatePercent: 10.49,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    expect(round2(result.taxableBase)).toBe(4950600);
    expect(round2(result.taxWithoutApv)).toBe(421956.9);
    expect(round2(result.regimeA.monthlyBenefit)).toBe(33647);
    expect(round2(result.regimeB.monthlyBenefit)).toBe(37662.5);
    expect(result.recommendedRegime).toBe("B");
  });
});

describe("Regression - Conversor UF", () => {
  it("case 1", () => {
    const result = convertUf({ amount: 10, ufValue: UF, direction: "uf_to_clp" });
    expect(round2(result.ufAmount)).toBe(10);
    expect(round2(result.clpAmount)).toBe(393000);
  });

  it("case 2", () => {
    const result = convertUf({
      amount: 1000000,
      ufValue: UF,
      direction: "clp_to_uf",
    });
    expect(round2(result.ufAmount)).toBe(25.45);
    expect(round2(result.clpAmount)).toBe(1000000);
  });

  it("case 3", () => {
    const result = convertUf({
      amount: 2500.5,
      ufValue: 40123.45,
      direction: "uf_to_clp",
    });
    expect(round2(result.ufAmount)).toBe(2500.5);
    expect(round2(result.clpAmount)).toBe(100328686.73);
  });
});

describe("Regression - Seguro de Cesantía", () => {
  it("case 1", () => {
    const result = estimateUnemploymentCoverage({
      grossSalary: 1200000,
      contractType: "indefinido",
      terminationCause: "necesidad",
      monthsContributed: 24,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 131.9 } },
    });
    expect(round2(result.taxableSalaryClp)).toBe(1200000);
    expect(round2(result.estimatedCicBalance)).toBe(777600);
    expect(round2(result.totalCoverage)).toBe(777600);
    expect(result.monthsCovered).toBe(1);
    expect(result.eligibleForSolidarityFund).toBe(true);
  });

  it("case 2", () => {
    const result = estimateUnemploymentCoverage({
      grossSalary: 800000,
      contractType: "plazo-fijo",
      terminationCause: "vencimiento",
      monthsContributed: 4,
      currentCicBalance: 500000,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 131.9 } },
    });
    expect(round2(result.taxableSalaryClp)).toBe(800000);
    expect(round2(result.estimatedCicBalance)).toBe(500000);
    expect(round2(result.totalCoverage)).toBe(500000);
    expect(result.monthsCovered).toBe(1);
    expect(result.eligibleForSolidarityFund).toBe(false);
  });

  it("case 3", () => {
    const result = estimateUnemploymentCoverage({
      grossSalary: 3000000,
      contractType: "indefinido",
      terminationCause: "renuncia",
      monthsContributed: 8,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 131.9 } },
    });
    expect(round2(result.taxableSalaryClp)).toBe(3000000);
    expect(round2(result.estimatedCicBalance)).toBe(648000);
    expect(round2(result.totalCoverage)).toBe(648000);
    expect(result.monthsCovered).toBe(1);
    expect(result.eligibleForSolidarityFund).toBe(false);
  });
});

describe("Regression - Crédito de Consumo", () => {
  it("case 1", () => {
    const result = calculateConsumerCredit({
      principal: 5000000,
      termMonths: 36,
      rateValue: 3.49,
      rateType: "mensual",
      monthlyInsurance: 5500,
      operatingCosts: 120000,
    });
    expect(round2(result.monthlyPaymentTotal)).toBe(251566.68);
    expect(round2(result.totalPaid)).toBe(9176400.56);
    expect(round2(result.totalInterest)).toBe(4176400.56);
    expect(round2(result.caePercent)).toBe(56.75);
  });

  it("case 2", () => {
    const result = calculateConsumerCredit({
      principal: 12000000,
      termMonths: 60,
      rateValue: 51.5,
      rateType: "anual",
      monthlyInsurance: 8000,
      operatingCosts: 220000,
    });
    expect(round2(result.monthlyPaymentTotal)).toBe(491237.19);
    expect(round2(result.totalPaid)).toBe(29694231.12);
    expect(round2(result.totalInterest)).toBe(17694231.12);
    expect(round2(result.caePercent)).toBe(54.62);
  });

  it("case 3", () => {
    const result = calculateConsumerCredit({
      principal: 2500000,
      termMonths: 18,
      rateValue: 2.2,
      rateType: "mensual",
    });
    expect(round2(result.monthlyPaymentTotal)).toBe(169701.87);
    expect(round2(result.totalPaid)).toBe(3054633.74);
    expect(round2(result.totalInterest)).toBe(554633.74);
    expect(round2(result.caePercent)).toBe(29.84);
  });
});

describe("Regression - Tarjeta de Crédito", () => {
  it("case 1", () => {
    const result = simulateCreditCardCost({
      debt: 1500000,
      monthlyRatePercent: 3.5,
      minimumPaymentPercent: 5,
    });
    expect(result.baseline.months).toBe(425);
    expect(round2(result.baseline.totalPaid)).toBe(4992336.1);
    expect(round2(result.baseline.totalInterest)).toBe(3492336.1);
    expect(result.doubledPayment.months).toBe(117);
    expect(round2(result.doubledPayment.totalPaid)).toBe(2307224.14);
  });

  it("case 2", () => {
    const result = simulateCreditCardCost({
      debt: 2800000,
      monthlyRatePercent: 2.9,
      minimumPaymentPercent: 4,
      fixedMonthlyPayment: 180000,
    });
    expect(result.baseline.months).toBe(21);
    expect(round2(result.baseline.totalPaid)).toBe(3777036.44);
    expect(round2(result.baseline.totalInterest)).toBe(977036.44);
    expect(result.doubledPayment.months).toBe(9);
    expect(round2(result.doubledPayment.totalPaid)).toBe(3219155.16);
  });

  it("case 3", () => {
    const result = simulateCreditCardCost({
      debt: 650000,
      monthlyRatePercent: 4.2,
      minimumPaymentPercent: 8,
      maxMonths: 240,
    });
    expect(result.baseline.months).toBe(168);
    expect(round2(result.baseline.totalPaid)).toBe(1366967.6);
    expect(round2(result.baseline.totalInterest)).toBe(716967.6);
    expect(result.doubledPayment.months).toBe(61);
    expect(round2(result.doubledPayment.totalPaid)).toBe(881184.6);
  });
});

describe("Regression - Prepago de Crédito", () => {
  it("case 1", () => {
    const result = simulateCreditPrepayment({
      currentBalance: 20000000,
      monthlyPayment: 420000,
      monthlyRatePercent: 0.95,
      remainingMonths: 180,
      prepaymentAmount: 2000000,
      effect: "reducir-plazo",
      alternativeAnnualReturnPercent: 6,
    });
    expect(round2(result.interestSavings)).toBe(1525805.22);
    expect(result.monthsSaved).toBe(8);
    expect(round2(result.investmentGain)).toBe(728943.92);
    expect(result.mathematicallyBetterToPrepay).toBe(true);
  });

  it("case 2", () => {
    const result = simulateCreditPrepayment({
      currentBalance: 15000000,
      monthlyPayment: 320000,
      monthlyRatePercent: 1.1,
      remainingMonths: 120,
      prepaymentAmount: 1500000,
      effect: "reducir-cuota",
      alternativeAnnualReturnPercent: 4,
    });
    expect(round2(result.interestSavings)).toBe(-4675827.73);
    expect(result.monthsSaved).toBe(-53);
    expect(round2(result.newMonthlyPaymentIfReducePayment ?? 0)).toBe(203165.15);
    expect(round2(result.investmentGain)).toBe(367213.89);
    expect(result.mathematicallyBetterToPrepay).toBe(false);
  });

  it("case 3", () => {
    const result = simulateCreditPrepayment({
      currentBalance: 5000000,
      monthlyPayment: 180000,
      monthlyRatePercent: 0.8,
      remainingMonths: 48,
      prepaymentAmount: 500000,
      effect: "reducir-plazo",
      alternativeAnnualReturnPercent: 8,
    });
    expect(round2(result.interestSavings)).toBe(136551.75);
    expect(result.monthsSaved).toBe(3);
    expect(round2(result.investmentGain)).toBe(113903.37);
    expect(result.mathematicallyBetterToPrepay).toBe(true);
  });
});

describe("Regression - Renegociación", () => {
  it("case 1", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 1800000, overdueMonths: 4 },
        { amount: 2200000, overdueMonths: 5 },
      ],
      monthlyIncome: 1200000,
      termMonths: 48,
      monthlyRatePercent: 1.2,
      ufValue: UF,
    });
    expect(result.qualifies).toBe(true);
    expect(round2(result.qualifiedDebtUf)).toBe(101.78);
    expect(round2(result.monthlyPayment)).toBe(110110.21);
    expect(round2(result.incomeBurdenPercent)).toBe(9.18);
    expect(round2(result.totalPaid)).toBe(5285289.97);
  });

  it("case 2", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 500000, overdueMonths: 4 },
        { amount: 900000, overdueMonths: 2 },
        { amount: 700000, overdueMonths: 6 },
      ],
      monthlyIncome: 900000,
      termMonths: 36,
      monthlyRatePercent: 1.4,
      ufValue: UF,
    });
    expect(result.qualifies).toBe(false);
    expect(round2(result.qualifiedDebtUf)).toBe(30.53);
    expect(round2(result.monthlyPayment)).toBe(74661.87);
    expect(round2(result.incomeBurdenPercent)).toBe(8.3);
    expect(round2(result.totalPaid)).toBe(2687827.23);
  });

  it("case 3", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 4000000, overdueMonths: 10 },
        { amount: 3500000, overdueMonths: 12 },
        { amount: 2200000, overdueMonths: 7 },
      ],
      monthlyIncome: 2500000,
      termMonths: 60,
      monthlyRatePercent: 0.95,
      ufValue: UF,
    });
    expect(result.qualifies).toBe(true);
    expect(round2(result.qualifiedDebtUf)).toBe(246.82);
    expect(round2(result.monthlyPayment)).toBe(212841.65);
    expect(round2(result.incomeBurdenPercent)).toBe(8.51);
    expect(round2(result.totalPaid)).toBe(12770498.83);
  });
});

describe("Regression - Reajuste de Arriendo", () => {
  it("case 1 (UF)", () => {
    const result = calculateUfRentAdjustment({
      rentUf: 12,
      previousUfValue: 38500,
      currentUfValue: 39300,
    });
    expect(round2(result.previousRentClp)).toBe(462000);
    expect(round2(result.currentRentClp)).toBe(471600);
    expect(round2(result.differenceClp)).toBe(9600);
    expect(round2(result.ufVariationPercent)).toBe(2.08);
  });

  it("case 2 (UF)", () => {
    const result = calculateUfRentAdjustment({
      rentUf: 25,
      previousUfValue: 37000,
      currentUfValue: 40100,
    });
    expect(round2(result.previousRentClp)).toBe(925000);
    expect(round2(result.currentRentClp)).toBe(1002500);
    expect(round2(result.differenceClp)).toBe(77500);
    expect(round2(result.ufVariationPercent)).toBe(8.38);
  });

  it("case 3 (IPC)", () => {
    const result = calculateIpcRentAdjustment({
      currentRentClp: 550000,
      ipcVariationPercent: 4.2,
    });
    expect(round2(result.adjustedRentClp)).toBe(573100);
    expect(round2(result.differenceClp)).toBe(23100);
    expect(round2(result.appliedFactor)).toBe(1.04);
  });
});

describe("Regression - Simulador de Jubilación", () => {
  it("case 1", () => {
    const result = simulateRetirementProjection({
      currentAge: 30,
      retirementAge: 65,
      grossSalary: 1500000,
      currentBalance: 12000000,
      annualReturnPercent: 5,
      lifeExpectancyAge: 90,
      currentYear: 2026,
    });
    expect(round2(result.projectedBalance)).toBe(296191641.23);
    expect(round2(result.estimatedMonthlyPension)).toBe(987305.47);
    expect(round2(result.salaryReplacementPercent)).toBe(65.82);
    expect(round2(result.apvExtraProjectionAt100kMonthly)).toBe(110846297.45);
  });

  it("case 2", () => {
    const result = simulateRetirementProjection({
      currentAge: 40,
      retirementAge: 65,
      grossSalary: 2200000,
      currentBalance: 45000000,
      annualReturnPercent: 4,
      lifeExpectancyAge: 92,
      currentYear: 2026,
    });
    expect(round2(result.projectedBalance)).toBe(274240088.25);
    expect(round2(result.estimatedMonthlyPension)).toBe(846420.03);
    expect(round2(result.salaryReplacementPercent)).toBe(38.47);
    expect(round2(result.apvExtraProjectionAt100kMonthly)).toBe(50884811.94);
  });

  it("case 3", () => {
    const result = simulateRetirementProjection({
      currentAge: 28,
      retirementAge: 60,
      grossSalary: 950000,
      currentBalance: 2500000,
      annualReturnPercent: 6.5,
      lifeExpectancyAge: 87,
      currentYear: 2026,
    });
    expect(round2(result.projectedBalance)).toBe(179743710.49);
    expect(round2(result.estimatedMonthlyPension)).toBe(554764.54);
    expect(round2(result.salaryReplacementPercent)).toBe(58.4);
    expect(round2(result.apvExtraProjectionAt100kMonthly)).toBe(123575774.63);
  });
});
