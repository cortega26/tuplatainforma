export interface TaxInput {
  taxableIncome: number;
  utm: number;
}

export interface TaxResult {
  taxAmount: number;
  marginalRate: number;
}

interface TaxBracket {
  upperLimit: number;
  rate: number;
  deduction: number;
}

function assertTaxInput(input: TaxInput): void {
  if (!Number.isFinite(input.taxableIncome) || input.taxableIncome < 0) {
    throw new Error("taxableIncome must be a finite number >= 0.");
  }

  if (!Number.isFinite(input.utm) || input.utm <= 0) {
    throw new Error("utm must be a finite number > 0.");
  }
}

function buildSecondCategoryTaxBrackets(utm: number): readonly TaxBracket[] {
  return [
    { upperLimit: 13.5 * utm, rate: 0, deduction: 0 },
    { upperLimit: 30 * utm, rate: 0.04, deduction: 13.5 * utm * 0.04 },
    {
      upperLimit: 50 * utm,
      rate: 0.08,
      deduction: 30 * utm * (0.08 - 0.04) + 13.5 * utm * 0.04,
    },
    {
      upperLimit: 70 * utm,
      rate: 0.135,
      deduction: 50 * utm * (0.135 - 0.08) + 30 * utm * 0.04,
    },
    {
      upperLimit: 90 * utm,
      rate: 0.23,
      deduction: 70 * utm * (0.23 - 0.135) + 50 * utm * 0.08,
    },
    {
      upperLimit: 120 * utm,
      rate: 0.304,
      deduction: 90 * utm * (0.304 - 0.23) + 70 * utm * 0.135,
    },
    {
      upperLimit: 150 * utm,
      rate: 0.35,
      deduction: 120 * utm * (0.35 - 0.304) + 90 * utm * 0.23,
    },
    {
      upperLimit: Number.POSITIVE_INFINITY,
      rate: 0.4,
      deduction: 150 * utm * (0.4 - 0.35) + 120 * utm * 0.304,
    },
  ] as const;
}

export function calculateSecondCategoryTax(input: TaxInput): TaxResult {
  assertTaxInput(input);

  const brackets = buildSecondCategoryTaxBrackets(input.utm);
  const bracket =
    brackets.find(candidate => input.taxableIncome <= candidate.upperLimit) ??
    brackets[brackets.length - 1];

  const taxAmount = Math.max(
    0,
    input.taxableIncome * bracket.rate - bracket.deduction
  );

  return {
    taxAmount,
    marginalRate: bracket.rate,
  };
}
