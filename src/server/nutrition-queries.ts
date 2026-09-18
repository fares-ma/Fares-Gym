import { db } from "../data/db";
import { meals, nutritionTargets } from "../data/schema";
import { eq, desc, lte } from "drizzle-orm";
import {
  MealEntry,
  NutritionTarget,
  DailyNutritionSummary,
} from "../domain/nutrition/types";
import { buildDailyNutritionSummary } from "../domain/nutrition/nutrition-engine";

/**
 * Retrieves the active nutrition target snapshot for a given date.
 */
export async function getNutritionTargets(dateStr: string): Promise<NutritionTarget | null> {
  const [targetRow] = await db
    .select()
    .from(nutritionTargets)
    .where(lte(nutritionTargets.effectiveDate, dateStr))
    .orderBy(desc(nutritionTargets.effectiveDate))
    .limit(1);

  if (!targetRow) {
    return null;
  }

  return {
    id: targetRow.id,
    effectiveDate: targetRow.effectiveDate,
    targetCalories: targetRow.targetCalories,
    targetProtein: targetRow.targetProtein,
    targetCarbs: targetRow.targetCarbs,
    targetFats: targetRow.targetFats,
  };
}

/**
 * Retrieves all meals logged for a specific calendar date (YYYY-MM-DD).
 */
export async function getMealsForDate(dateStr: string): Promise<MealEntry[]> {
  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.date, dateStr))
    .orderBy(desc(meals.loggedAt));

  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    name: r.name,
    calories: r.calories,
    proteinGrams: r.proteinGrams,
    carbsGrams: r.carbsGrams,
    fatsGrams: r.fatsGrams,
    loggedAt: new Date(r.loggedAt),
  }));
}

/**
 * Combines active target and meals for a date into a complete DailyNutritionSummary.
 */
export async function getDailyNutrition(dateStr: string): Promise<DailyNutritionSummary> {
  const [target, dayMeals] = await Promise.all([
    getNutritionTargets(dateStr),
    getMealsForDate(dateStr),
  ]);

  return buildDailyNutritionSummary(dateStr, target, dayMeals);
}
