export interface RetirementEmployerContributionScheduleEntry {
  startsOn: string;
  endsBefore?: string;
  employerContributionToIndividualAccountPercent: number;
}

export const RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_VERSION =
  "spensiones-2026-03-direct-account";

export const RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_SOURCE = {
  label:
    "Superintendencia de Pensiones - cronograma de cotización del empleador a la cuenta individual",
  url: "https://www.spensiones.cl/portal/educacion/594/w3-article-16318.html",
  lastVerified: "2026-03-12",
} as const;

export const RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE: readonly RetirementEmployerContributionScheduleEntry[] =
  [
    {
      startsOn: "2025-08-01",
      endsBefore: "2026-08-01",
      employerContributionToIndividualAccountPercent: 0.1,
    },
    {
      startsOn: "2026-08-01",
      endsBefore: "2027-08-01",
      employerContributionToIndividualAccountPercent: 0.25,
    },
    {
      startsOn: "2027-08-01",
      endsBefore: "2028-08-01",
      employerContributionToIndividualAccountPercent: 0.5,
    },
    {
      startsOn: "2028-08-01",
      endsBefore: "2029-08-01",
      employerContributionToIndividualAccountPercent: 0.75,
    },
    {
      startsOn: "2029-08-01",
      endsBefore: "2030-08-01",
      employerContributionToIndividualAccountPercent: 1,
    },
    {
      startsOn: "2030-08-01",
      endsBefore: "2031-08-01",
      employerContributionToIndividualAccountPercent: 1.5,
    },
    {
      startsOn: "2031-08-01",
      endsBefore: "2032-08-01",
      employerContributionToIndividualAccountPercent: 2,
    },
    {
      startsOn: "2032-08-01",
      endsBefore: "2033-08-01",
      employerContributionToIndividualAccountPercent: 3,
    },
    {
      startsOn: "2033-08-01",
      employerContributionToIndividualAccountPercent: 4.5,
    },
  ] as const;

function parseUtcDate(dateLike: string): number {
  return Date.parse(`${dateLike}T00:00:00.000Z`);
}

export function getEmployerContributionToIndividualAccountPercentForDate(
  dateLike: string
): number {
  const timestamp = parseUtcDate(dateLike);

  for (const entry of RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE) {
    const startsOn = parseUtcDate(entry.startsOn);
    const endsBefore = entry.endsBefore
      ? parseUtcDate(entry.endsBefore)
      : Number.POSITIVE_INFINITY;

    if (timestamp >= startsOn && timestamp < endsBefore) {
      return entry.employerContributionToIndividualAccountPercent;
    }
  }

  return 0;
}
