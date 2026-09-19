import { getTimeAwareGreeting } from "../lib/utils";
import { getUserTodayDateStr, formatUserArabicDate } from "../lib/date-utils";
import {
  getWorkoutProgramsWithRotation,
  getActiveWorkoutSession,
} from "./workout-queries";
import { getDailyNutrition } from "./nutrition-queries";
import { getDashboardActivities } from "./activities-queries";
import { EnrichedScheduleBlock, ReminderItem } from "../domain/activities/types";

export interface HomeDashboardData {
  greeting: string;
  todayDateStr: string;
  arabicDate: string;
  mission: {
    activeSession: {
      id: string;
      programId: string;
      programName: string;
      exerciseCount: number;
    } | null;
    nextProgram: {
      id: string;
      name: string;
      exerciseCount: number;
    } | null;
    isRestDay: boolean;
  };
  nutrition: {
    consumedCalories: number;
    targetCalories: number;
    proteinConsumed: number;
    proteinTarget: number;
    carbsConsumed: number;
    carbsTarget: number;
    fatConsumed: number;
    fatTarget: number;
    loggedMeals: number;
    totalMeals: number;
  };
  schedule: EnrichedScheduleBlock[];
  reminders: ReminderItem[];
}

/**
 * Aggregates all data required for the Home Dashboard.
 * Strictly adheres to Invariant 3: returns truthful database state with no phantom seed data.
 */
export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const greeting = getTimeAwareGreeting();
  const todayDateStr = getUserTodayDateStr();
  const arabicDate = formatUserArabicDate();

  let activeSession: HomeDashboardData["mission"]["activeSession"] = null;
  let nextProgram: HomeDashboardData["mission"]["nextProgram"] = null;
  let isRestDay = false;

  let nutrition = {
    consumedCalories: 0,
    targetCalories: 0,
    proteinConsumed: 0,
    proteinTarget: 0,
    carbsConsumed: 0,
    carbsTarget: 0,
    fatConsumed: 0,
    fatTarget: 0,
    loggedMeals: 0,
    totalMeals: 0,
  };

  let schedule: EnrichedScheduleBlock[] = [];
  let reminders: ReminderItem[] = [];

  try {
    const [rotationResult, activeData, nutritionData, activitiesData] = await Promise.all([
      getWorkoutProgramsWithRotation().catch(() => ({ programs: [], nextProgramId: "" })),
      getActiveWorkoutSession().catch(() => null),
      getDailyNutrition(todayDateStr).catch(() => null),
      getDashboardActivities().catch(() => ({ schedule: [], reminders: [] })),
    ]);

    // 1. Mission determination
    if (activeData) {
      activeSession = {
        id: activeData.session.id,
        programId: activeData.session.programId,
        programName: activeData.program.name,
        exerciseCount: activeData.exercises?.length || 0,
      };
    } else if (rotationResult.programs.length > 0) {
      const scheduledProg =
        rotationResult.programs.find((p) => p.isNextScheduled) || rotationResult.programs[0];
      if (scheduledProg) {
        nextProgram = {
          id: scheduledProg.id,
          name: scheduledProg.name,
          exerciseCount: scheduledProg.exerciseCount || 0,
        };
      }
    } else {
      isRestDay = true;
    }

    // 2. Nutrition snapshot
    if (nutritionData) {
      nutrition = {
        consumedCalories: nutritionData.calories.consumed || 0,
        targetCalories: nutritionData.calories.target || 0,
        proteinConsumed: nutritionData.protein.consumed || 0,
        proteinTarget: nutritionData.protein.target || 0,
        carbsConsumed: nutritionData.carbs.consumed || 0,
        carbsTarget: nutritionData.carbs.target || 0,
        fatConsumed: nutritionData.fats.consumed || 0,
        fatTarget: nutritionData.fats.target || 0,
        loggedMeals: nutritionData.meals.length || 0,
        totalMeals: nutritionData.meals.length || 0,
      };
    }

    // 3. Schedule & Reminders
    if (activitiesData) {
      schedule = activitiesData.schedule || [];
      reminders = activitiesData.reminders || [];
    }
  } catch (err) {
    console.error("Error fetching home dashboard data:", err);
  }

  return {
    greeting,
    todayDateStr,
    arabicDate,
    mission: {
      activeSession,
      nextProgram,
      isRestDay,
    },
    nutrition,
    schedule,
    reminders,
  };
}
