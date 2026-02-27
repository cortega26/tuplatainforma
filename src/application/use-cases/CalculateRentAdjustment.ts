export interface UfRentAdjustmentInput {
  rentUf: number;
  previousUfValue: number;
  currentUfValue: number;
}

export interface UfRentAdjustmentOutput {
  previousRentClp: number;
  currentRentClp: number;
  differenceClp: number;
  ufVariationPercent: number;
}

export interface IpcRentAdjustmentInput {
  currentRentClp: number;
  ipcVariationPercent: number;
}

export interface IpcRentAdjustmentOutput {
  adjustedRentClp: number;
  differenceClp: number;
  appliedFactor: number;
}

function assertPositiveNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a finite number greater than 0.`);
  }
}

export function calculateUfRentAdjustment(
  input: UfRentAdjustmentInput
): UfRentAdjustmentOutput {
  assertPositiveNumber(input.rentUf, "rentUf");
  assertPositiveNumber(input.previousUfValue, "previousUfValue");
  assertPositiveNumber(input.currentUfValue, "currentUfValue");

  const previousRentClp = input.rentUf * input.previousUfValue;
  const currentRentClp = input.rentUf * input.currentUfValue;
  const differenceClp = currentRentClp - previousRentClp;
  const ufVariationPercent =
    ((input.currentUfValue - input.previousUfValue) / input.previousUfValue) *
    100;

  return {
    previousRentClp,
    currentRentClp,
    differenceClp,
    ufVariationPercent,
  };
}

export function calculateIpcRentAdjustment(
  input: IpcRentAdjustmentInput
): IpcRentAdjustmentOutput {
  assertPositiveNumber(input.currentRentClp, "currentRentClp");
  if (!Number.isFinite(input.ipcVariationPercent)) {
    throw new Error("ipcVariationPercent must be a finite number.");
  }

  const appliedFactor = 1 + input.ipcVariationPercent / 100;
  const adjustedRentClp = input.currentRentClp * appliedFactor;
  const differenceClp = adjustedRentClp - input.currentRentClp;

  return {
    adjustedRentClp,
    differenceClp,
    appliedFactor,
  };
}
