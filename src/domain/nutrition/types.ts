export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  loggedAt: Date;
}

export interface NutritionTarget {
  id: string;
  effectiveDate: string; // YYYY-MM-DD
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

export interface MacroProgress {
  consumed: number;
  target: number;
  remaining: number;
  percentage: number;
  isSurplus: boolean;
}

export interface DailyNutritionSummary {
  date: string;
  target: NutritionTarget;
  meals: MealEntry[];
  calories: MacroProgress;
  protein: MacroProgress;
  carbs: MacroProgress;
  fats: MacroProgress;
}

export interface TdeeCalculationInput {
  weightKg: number;
  heightCm: number;
  age: number;
  activityMultiplier: number; // e.g. 1.2 (sedentary), 1.375 (light), 1.55 (moderate), 1.725 (heavy)
}

export interface TdeeCalculationResult {
  bmr: number;
  tdee: number;
  suggestedProteinGrams: number;
  suggestedCarbsGrams: number;
  suggestedFatsGrams: number;
}
