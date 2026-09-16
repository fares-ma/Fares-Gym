import { WeightValue } from "./types";

export interface HeatingSetSuggestion {
  setNumber: number;
  percentage: number;
  weight: WeightValue;
  suggestedReps: string;
}

/**
 * Parses heating rule string (e.g. "1-2", "1-3", "0") into set count.
 */
export function getHeatingSetCount(rule: string | null | undefined): number {
  if (!rule || rule.trim() === "0" || rule.trim() === "-") return 0;
  const parts = rule.split("-").map((s) => parseInt(s.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[1])) {
    return parts[1]; // Use upper bound
  }
  if (parts.length >= 1 && !isNaN(parts[0])) {
    return parts[0];
  }
  return 1;
}

/**
 * Pure domain logic to calculate warm-up / heating set weight recommendations.
 * Preserves opaque unit tags (e.g. "K" or "B") without conversion.
 *
 * Ladder:
 * - 1 set: 60% of working weight
 * - 2 sets: 50%, 75%
 * - 3 sets: 50%, 70%, 85%
 */
export function calculateWarmupSets(
  workingWeight: WeightValue,
  heatingRule: string
): HeatingSetSuggestion[] {
  const count = getHeatingSetCount(heatingRule);
  if (count <= 0 || workingWeight.numericValue <= 0) {
    return [];
  }

  const tag = workingWeight.unitTag;
  const targetNum = workingWeight.numericValue;

  const percentagesByCount: Record<number, { pct: number; reps: string }[]> = {
    1: [{ pct: 0.6, reps: "6-8" }],
    2: [
      { pct: 0.5, reps: "6-8" },
      { pct: 0.75, reps: "3-4" },
    ],
    3: [
      { pct: 0.5, reps: "6-8" },
      { pct: 0.7, reps: "3-4" },
      { pct: 0.85, reps: "1-2" },
    ],
  };

  const ladder = percentagesByCount[count] || percentagesByCount[2];

  return ladder.map((step, idx) => {
    // Round to nearest 2.5 or 0.5
    const rawVal = targetNum * step.pct;
    const rounded = Math.round(rawVal * 2) / 2;

    return {
      setNumber: idx + 1,
      percentage: Math.round(step.pct * 100),
      weight: {
        rawWeight: `${rounded}${tag}`,
        numericValue: rounded,
        unitTag: tag,
        isUnitConfirmed: workingWeight.isUnitConfirmed,
      },
      suggestedReps: step.reps,
    };
  });
}
