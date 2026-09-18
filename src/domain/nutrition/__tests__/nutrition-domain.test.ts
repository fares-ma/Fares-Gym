import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDailyTotals,
  calculateMacroProgress,
  buildDailyNutritionSummary,
  calculateTDEE,
} from "../nutrition-engine";
import { MealEntry, NutritionTarget } from "../types";

describe("Nutrition Calculation Engine", () => {
  it("should calculate daily totals for empty meals", () => {
    const totals = calculateDailyTotals([]);
    assert.deepEqual(totals, {
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatsGrams: 0,
    });
  });

  it("should sum meals correctly including decimals", () => {
    const meals: MealEntry[] = [
      {
        id: "1",
        date: "2026-09-17",
        name: "فطار الشوفان",
        calories: 550,
        proteinGrams: 42.5,
        carbsGrams: 65.2,
        fatsGrams: 11.3,
        loggedAt: new Date(),
      },
      {
        id: "2",
        date: "2026-09-17",
        name: "غداء فراخ وأرز",
        calories: 750,
        proteinGrams: 55.5,
        carbsGrams: 80.4,
        fatsGrams: 15.2,
        loggedAt: new Date(),
      },
    ];

    const totals = calculateDailyTotals(meals);
    assert.equal(totals.calories, 1300);
    assert.equal(totals.proteinGrams, 98.0);
    assert.equal(totals.carbsGrams, 145.6);
    assert.equal(totals.fatsGrams, 26.5);
  });

  it("should calculate macro progress under target", () => {
    const progress = calculateMacroProgress(80, 160);
    assert.equal(progress.consumed, 80);
    assert.equal(progress.target, 160);
    assert.equal(progress.remaining, 80);
    assert.equal(progress.percentage, 50);
    assert.equal(progress.isSurplus, false);
  });

  it("should calculate macro progress at exact target", () => {
    const progress = calculateMacroProgress(2000, 2000);
    assert.equal(progress.remaining, 0);
    assert.equal(progress.percentage, 100);
    assert.equal(progress.isSurplus, false);
  });

  it("should calculate macro progress in surplus", () => {
    const progress = calculateMacroProgress(2400, 2000);
    assert.equal(progress.consumed, 2400);
    assert.equal(progress.target, 2000);
    assert.equal(progress.remaining, 0);
    assert.equal(progress.percentage, 120);
    assert.equal(progress.isSurplus, true);
  });

  it("should handle zero target safely without division by zero", () => {
    const progress = calculateMacroProgress(100, 0);
    assert.equal(progress.percentage, 0);
    assert.equal(progress.remaining, 0);
    assert.equal(progress.isSurplus, true);
  });

  it("should build full daily nutrition summary accurately", () => {
    const target: NutritionTarget = {
      id: "t1",
      effectiveDate: "2026-09-01",
      targetCalories: 2500,
      targetProtein: 180,
      targetCarbs: 250,
      targetFats: 70,
    };

    const meals: MealEntry[] = [
      {
        id: "m1",
        date: "2026-09-17",
        name: "Meal 1",
        calories: 1250,
        proteinGrams: 90,
        carbsGrams: 125,
        fatsGrams: 35,
        loggedAt: new Date(),
      },
    ];

    const summary = buildDailyNutritionSummary("2026-09-17", target, meals);
    assert.equal(summary.date, "2026-09-17");
    assert.equal(summary.calories.percentage, 50);
    assert.equal(summary.calories.remaining, 1250);
    assert.equal(summary.protein.percentage, 50);
    assert.equal(summary.carbs.percentage, 50);
    assert.equal(summary.fats.percentage, 50);
  });

  it("should build daily nutrition summary with null target safely using 0 targets", () => {
    const meals: MealEntry[] = [
      {
        id: "m1",
        date: "2026-09-17",
        name: "Meal 1",
        calories: 500,
        proteinGrams: 40,
        carbsGrams: 50,
        fatsGrams: 15,
        loggedAt: new Date(),
      },
    ];

    const summary = buildDailyNutritionSummary("2026-09-17", null, meals);
    assert.equal(summary.date, "2026-09-17");
    assert.equal(summary.target, null);
    assert.equal(summary.calories.target, 0);
    assert.equal(summary.calories.consumed, 500);
    assert.equal(summary.calories.isSurplus, true);
    assert.equal(summary.protein.target, 0);
    assert.equal(summary.protein.consumed, 40);
    assert.equal(summary.carbs.target, 0);
    assert.equal(summary.carbs.consumed, 50);
    assert.equal(summary.fats.target, 0);
    assert.equal(summary.fats.consumed, 15);
  });

  it("should calculate standard TDEE with Mifflin-St Jeor formula", () => {
    // 80kg, 180cm, 25 years old, moderate activity (1.55)
    // BMR = (10 * 80) + (6.25 * 180) - (5 * 25) + 5 = 800 + 1125 - 125 + 5 = 1805
    // TDEE = 1805 * 1.55 = 2797.75 -> 2798
    const result = calculateTDEE({
      weightKg: 80,
      heightCm: 180,
      age: 25,
      activityMultiplier: 1.55,
    });

    assert.equal(result.bmr, 1805);
    assert.equal(result.tdee, 2798);
    assert.equal(result.suggestedProteinGrams, 160); // 80 * 2
    assert.ok(result.suggestedFatsGrams > 0);
    assert.ok(result.suggestedCarbsGrams > 0);
  });
});
