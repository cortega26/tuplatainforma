export type UfConversionDirection = "uf_to_clp" | "clp_to_uf";

export interface UfConversionInput {
  amount: number;
  ufValue: number;
  direction: UfConversionDirection;
}

export interface UfConversionOutput {
  ufAmount: number;
  clpAmount: number;
}

function assertInput(input: UfConversionInput): void {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("amount must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.ufValue) || input.ufValue <= 0) {
    throw new Error("ufValue must be a finite number greater than 0.");
  }
}

export function convertUf(input: UfConversionInput): UfConversionOutput {
  assertInput(input);

  if (input.direction === "uf_to_clp") {
    return {
      ufAmount: input.amount,
      clpAmount: input.amount * input.ufValue,
    };
  }

  return {
    ufAmount: input.amount / input.ufValue,
    clpAmount: input.amount,
  };
}
