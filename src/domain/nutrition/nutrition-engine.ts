import {
  MealEntry,
  NutritionTarget,
  MacroProgress,
  DailyNutritionSummary,
  TdeeCalculationInput,
  TdeeCalculationResult,
} from "./types";

/**
 * Calculates consumed daily totals across all logged meals.
 */
export function calculateDailyTotals(meals: MealEntry[]): {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
} {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      proteinGrams: Math.round((acc.proteinGrams + (meal.proteinGrams || 0)) * 10) / 10,
      carbsGrams: Math.round((acc.carbsGrams + (meal.carbsGrams || 0)) * 10) / 10,
      fatsGrams: Math.round((acc.fatsGrams + (meal.fatsGrams || 0)) * 10) / 10,
    }),
    { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0 }
  );
}

/**
 * Computes progress, completion percentage, and remaining amount against a target.
 */
export function calculateMacroProgress(consumed: number, target: number): MacroProgress {
  const safeConsumed = Math.max(0, consumed);
  const safeTarget = Math.max(0, target);

  if (safeTarget <= 0) {
    return {
      consumed: safeConsumed,
      target: 0,
      remaining: 0,
      percentage: 0,
      isSurplus: safeConsumed > 0,
    };
  }

  const percentage = Math.round((safeConsumed / safeTarget) * 100);
  const remaining = Math.max(0, Math.round((safeTarget - safeConsumed) * 10) / 10);
  const isSurplus = safeConsumed > safeTarget;

  return {
    consumed: safeConsumed,
    target: safeTarget,
    remaining,
    percentage,
    isSurplus,
  };
}

/**
 * Builds a complete daily nutrition summary combining target and logged meals.
 */
export function buildDailyNutritionSummary(
  date: string,
  target: NutritionTarget | null,
  meals: MealEntry[]
): DailyNutritionSummary {
  const totals = calculateDailyTotals(meals);

  return {
    date,
    target,
    meals,
    calories: calculateMacroProgress(totals.calories, target?.targetCalories ?? 0),
    protein: calculateMacroProgress(totals.proteinGrams, target?.targetProtein ?? 0),
    carbs: calculateMacroProgress(totals.carbsGrams, target?.targetCarbs ?? 0),
    fats: calculateMacroProgress(totals.fatsGrams, target?.targetFats ?? 0),
  };
}

/**
 * Computes estimated TDEE and standard balanced reference splits using Mifflin-St Jeor formula.
 * This is an informational calculator only — results are never automatically enforced.
 */
export function calculateTDEE(input: TdeeCalculationInput): TdeeCalculationResult {
  const { weightKg, heightCm, age, activityMultiplier } = input;

  // Mifflin-St Jeor Equation for males: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  const tdee = Math.round(bmr * activityMultiplier);

  // Standard fitness guideline: ~2.0g protein per kg bodyweight
  const suggestedProteinGrams = Math.round(weightKg * 2.0);
  // ~25% calories from fats (9 kcal/g)
  const suggestedFatsGrams = Math.round((tdee * 0.25) / 9);
  // Remainder from carbohydrates (4 kcal/g)
  const proteinCalories = suggestedProteinGrams * 4;
  const fatsCalories = suggestedFatsGrams * 9;
  const suggestedCarbsGrams = Math.max(
    0,
    Math.round((tdee - proteinCalories - fatsCalories) / 4)
  );

  return {
    bmr,
    tdee,
    suggestedProteinGrams,
    suggestedCarbsGrams,
    suggestedFatsGrams,
  };
}
