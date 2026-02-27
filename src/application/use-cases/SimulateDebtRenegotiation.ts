export interface DebtItemInput {
  amount: number;
  overdueMonths: number;
}

export interface DebtRenegotiationInput {
  debts: DebtItemInput[];
  monthlyIncome: number;
  termMonths: number;
  monthlyRatePercent: number;
  ufValue: number;
  minimumOverdueMonths?: number;
  minimumDebtUf?: number;
}

export interface DebtRenegotiationOutput {
  totalDebtClp: number;
  totalDebtUf: number;
  qualifiedDebtUf: number;
  qualifiedDebtCount: number;
  minimumDebtUf: number;
  requirementChecks: {
    hasTwoOrMoreDebts: boolean;
    hasTwoOrMoreQualifiedDebts: boolean;
    reachesMinimumUf: boolean;
  };
  qualifies: boolean;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  incomeBurdenPercent: number;
}

function annuityPayment(
  principal: number,
  monthlyRateDecimal: number,
  termMonths: number
): number {
  if (monthlyRateDecimal === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRateDecimal, termMonths);
  return (principal * monthlyRateDecimal * factor) / (factor - 1);
}

function assertInput(input: DebtRenegotiationInput): void {
  if (!Array.isArray(input.debts) || input.debts.length === 0) {
    throw new Error("debts must include at least one item.");
  }
  if (!Number.isFinite(input.monthlyIncome) || input.monthlyIncome <= 0) {
    throw new Error("monthlyIncome must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.termMonths) || input.termMonths <= 0) {
    throw new Error("termMonths must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.monthlyRatePercent) ||
    input.monthlyRatePercent < 0
  ) {
    throw new Error("monthlyRatePercent must be a finite number >= 0.");
  }
  if (!Number.isFinite(input.ufValue) || input.ufValue <= 0) {
    throw new Error("ufValue must be a finite number greater than 0.");
  }
}

export function simulateDebtRenegotiation(
  input: DebtRenegotiationInput
): DebtRenegotiationOutput {
  assertInput(input);

  const minimumOverdueMonths = input.minimumOverdueMonths ?? 3;
  const minimumDebtUf = input.minimumDebtUf ?? 80;

  const totalDebtClp = input.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalDebtUf = totalDebtClp / input.ufValue;
  const qualifiedDebts = input.debts.filter(
    debt => debt.amount > 0 && debt.overdueMonths >= minimumOverdueMonths
  );
  const qualifiedDebtUf =
    qualifiedDebts.reduce((sum, debt) => sum + debt.amount, 0) / input.ufValue;

  const hasTwoOrMoreDebts =
    input.debts.filter(debt => debt.amount > 0).length >= 2;
  const hasTwoOrMoreQualifiedDebts = qualifiedDebts.length >= 2;
  const reachesMinimumUf = qualifiedDebtUf >= minimumDebtUf;
  const qualifies =
    hasTwoOrMoreDebts && hasTwoOrMoreQualifiedDebts && reachesMinimumUf;

  const monthlyRateDecimal = input.monthlyRatePercent / 100;
  const monthlyPayment = annuityPayment(
    totalDebtClp,
    monthlyRateDecimal,
    input.termMonths
  );
  const totalPaid = monthlyPayment * input.termMonths;
  const totalInterest = totalPaid - totalDebtClp;
  const incomeBurdenPercent = (monthlyPayment / input.monthlyIncome) * 100;

  return {
    totalDebtClp,
    totalDebtUf,
    qualifiedDebtUf,
    qualifiedDebtCount: qualifiedDebts.length,
    minimumDebtUf,
    requirementChecks: {
      hasTwoOrMoreDebts,
      hasTwoOrMoreQualifiedDebts,
      reachesMinimumUf,
    },
    qualifies,
    monthlyPayment,
    totalPaid,
    totalInterest,
    incomeBurdenPercent,
  };
}
