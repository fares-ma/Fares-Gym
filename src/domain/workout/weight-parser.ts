import { WeightValue } from "./types";

/**
 * Parses any raw weight string input into a structured WeightValue.
 * STRICT NON-NEGOTIABLE RULE:
 * Tags "K" and "B" are opaque machine identifiers.
 * They MUST NEVER be converted to kilograms or pounds.
 *
 * Examples:
 * "50K"   -> { rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true }
 * "65k"   -> { rawWeight: "65K", numericValue: 65, unitTag: "K", isUnitConfirmed: true }
 * "200k"  -> { rawWeight: "200K", numericValue: 200, unitTag: "K", isUnitConfirmed: true }
 * "10B"   -> { rawWeight: "10B", numericValue: 10, unitTag: "B", isUnitConfirmed: true }
 * "25"    -> { rawWeight: "25", numericValue: 25, unitTag: "", isUnitConfirmed: false }
 * "25kg"  -> { rawWeight: "25kg", numericValue: 25, unitTag: "kg", isUnitConfirmed: true }
 */
export function parseWeight(raw: string | null | undefined): WeightValue {
  if (!raw || typeof raw !== "string" || raw.trim() === "") {
    return {
      rawWeight: "",
      numericValue: 0,
      unitTag: "",
      isUnitConfirmed: false,
    };
  }

  const clean = raw.trim();
  // Match digits with at most one decimal point, followed by optional unit suffix
  const match = clean.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]*)$/);

  if (!match) {
    return {
      rawWeight: clean,
      numericValue: 0,
      unitTag: "",
      isUnitConfirmed: false,
    };
  }

  const numericValue = parseFloat(match[1]) || 0;
  let rawTag = match[2] ? match[2].trim() : "";

  // Normalize single-character machine tags to uppercase ("k" -> "K", "b" -> "B")
  if (rawTag.toUpperCase() === "K" || rawTag.toUpperCase() === "B") {
    rawTag = rawTag.toUpperCase();
  }

  const isOpaque = rawTag === "K" || rawTag === "B";
  const isStandard = rawTag.toLowerCase() === "kg" || rawTag.toLowerCase() === "lbs";
  const isUnitConfirmed = isOpaque || isStandard;

  return {
    rawWeight: `${numericValue}${rawTag}`,
    numericValue,
    unitTag: rawTag,
    isUnitConfirmed,
  };
}

/**
 * Formats a WeightValue back to display text.
 */
export function formatWeight(weight: WeightValue | null | undefined): string {
  if (!weight) return "-";
  if (weight.rawWeight) return weight.rawWeight;
  return `${weight.numericValue}${weight.unitTag}`;
}
