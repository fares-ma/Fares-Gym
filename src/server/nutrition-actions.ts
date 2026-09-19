"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../data/db";
import { meals, nutritionTargets } from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";
import { getUserTodayDateStr } from "../lib/date-utils";


import { MealInputSchema, TargetInputSchema } from "./schemas";

/**
 * Logs a new meal for a specified calendar date.
 */
export async function logMealAction(input: {
  date: string;
  name: string;
  calories: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatsGrams?: number;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = MealInputSchema.parse(input);

    await db.insert(meals).values({
      id: crypto.randomUUID(),
      date: parsed.date,
      name: parsed.name,
      calories: parsed.calories,
      proteinGrams: parsed.proteinGrams,
      carbsGrams: parsed.carbsGrams,
      fatsGrams: parsed.fatsGrams,
      loggedAt: new Date(),
    });

    revalidatePath("/nutrition");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to log meal:", err);
    return { success: false, error: err.message || "Failed to log meal" };
  }
}

/**
 * Deletes a previously logged meal.
 */
export async function deleteMealAction(
  mealId: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(meals).where(eq(meals.id, mealId));

    revalidatePath("/nutrition");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete meal:", err);
    return { success: false, error: err.message || "Failed to delete meal" };
  }
}

/**
 * Records a new target snapshot with an effective date.

 */
export async function updateNutritionTargetsAction(input: {
  effectiveDate?: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = TargetInputSchema.parse(input);
    const today = getUserTodayDateStr();
    const effectiveDate = parsed.effectiveDate || today;


    await db.insert(nutritionTargets).values({
      id: crypto.randomUUID(),
      effectiveDate,
      targetCalories: parsed.targetCalories,
      targetProtein: parsed.targetProtein,
      targetCarbs: parsed.targetCarbs,
      targetFats: parsed.targetFats,
    });

    revalidatePath("/nutrition");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update nutrition targets:", err);
    return { success: false, error: err.message || "Failed to update targets" };
  }
}
