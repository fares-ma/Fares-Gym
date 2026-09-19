"use server";

import { revalidatePath } from "next/cache";
import { db } from "../data/db";
import {
  exercises,
  workoutPrograms,
  workoutProgramExercises,
  workoutSessions,
  performedSets,
  meals,
  nutritionTargets,
  scheduleBlocks,
  weeklySplits,
  reminders,
  notes,
  dailyActivities,
  bodyMetrics,
  appSettings,
} from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";
import { getUserNow, getUserTodayDateStr } from "../lib/date-utils";

export interface ExportDataResult {
  success: boolean;
  jsonData?: string;
  filename?: string;
  error?: string;
}

/**
 * Exports sovereign JSON backup of all 14 data tables in Neon PostgreSQL.
 */
export async function exportAllDataAction(): Promise<ExportDataResult> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const [
      exercisesData,
      programsData,
      programExercisesData,
      sessionsData,
      performedSetsData,
      mealsData,
      nutritionTargetsData,
      scheduleBlocksData,
      weeklySplitsData,
      remindersData,
      notesData,
      activitiesData,
      bodyMetricsData,
      settingsData,
    ] = await Promise.all([
      db.select().from(exercises),
      db.select().from(workoutPrograms),
      db.select().from(workoutProgramExercises),
      db.select().from(workoutSessions),
      db.select().from(performedSets),
      db.select().from(meals),
      db.select().from(nutritionTargets),
      db.select().from(scheduleBlocks),
      db.select().from(weeklySplits),
      db.select().from(reminders),
      db.select().from(notes),
      db.select().from(dailyActivities),
      db.select().from(bodyMetrics),
      db.select().from(appSettings),
    ]);

    const now = getUserNow();
    const localDateStr = getUserTodayDateStr();
    const utcTimestampStr = new Date().toISOString();

    const backupPayload = {
      meta: {
        app: "Fares Hub",
        exportVersion: "1.0.0",
        exportedAtUtc: utcTimestampStr,
        exportedAtLocalDate: localDateStr,
        timezone: "Africa/Cairo",
        source: "Neon Serverless PostgreSQL",
        targetUser: "fares",
      },
      data: {
        exercises: exercisesData,
        workoutPrograms: programsData,
        workoutProgramExercises: programExercisesData,
        workoutSessions: sessionsData,
        performedSets: performedSetsData,
        meals: mealsData,
        nutritionTargets: nutritionTargetsData,
        scheduleBlocks: scheduleBlocksData,
        weeklySplits: weeklySplitsData,
        reminders: remindersData,
        notes: notesData,
        dailyActivities: activitiesData,
        bodyMetrics: bodyMetricsData,
        appSettings: settingsData,
      },
    };

    // Record last backup timestamp in app_settings
    await db
      .insert(appSettings)
      .values({
        key: "last_backup_timestamp",
        value: utcTimestampStr,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: utcTimestampStr,
          updatedAt: now,
        },
      });

    revalidatePath("/settings");

    return {
      success: true,
      jsonData: JSON.stringify(backupPayload, null, 2),
      filename: `fares-hub-backup-${localDateStr}.json`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Export failed";
    return { success: false, error: msg };
  }
}

/**
 * Confirms or updates notes for opaque unit tags (K or B).
 */
export async function confirmUnitTagAction(input: {
  tag: "K" | "B";
  description: string;
  confirmed: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const now = getUserNow();
    const confirmedKey = `unit_tag_${input.tag}_confirmed`;
    const descKey = `unit_tag_${input.tag}_description`;

    await Promise.all([
      db
        .insert(appSettings)
        .values({
          key: confirmedKey,
          value: input.confirmed ? "true" : "false",
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: appSettings.key,
          set: { value: input.confirmed ? "true" : "false", updatedAt: now },
        }),
      db
        .insert(appSettings)
        .values({
          key: descKey,
          value: input.description.trim(),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: appSettings.key,
          set: { value: input.description.trim(), updatedAt: now },
        }),
    ]);

    revalidatePath("/settings");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update unit tag";
    return { success: false, error: msg };
  }
}

import { logoutAction as authLogoutAction } from "./auth";

/**
 * Canonical logoutAction delegated to auth.
 */
export async function logoutAction(): Promise<void> {
  return authLogoutAction();
}

