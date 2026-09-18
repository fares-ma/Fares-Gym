import { db } from "../data/db";
import {
  appSettings,
  exercises,
  workoutSessions,
  meals,
  scheduleBlocks,
  bodyMetrics,
  performedSets,
} from "../data/schema";
import { eq, count } from "drizzle-orm";

export interface SettingsSummary {
  lastBackupAt: string | null;
  dbStatus: "connected" | "error";
  unitTags: {
    tagK: { confirmed: boolean; description: string; usageCount: number };
    tagB: { confirmed: boolean; description: string; usageCount: number };
  };
  tableStats: {
    exercisesCount: number;
    completedSessionsCount: number;
    loggedMealsCount: number;
    scheduleBlocksCount: number;
    weightLogsCount: number;
  };
}

/**
 * Retrieves high-level settings summary and system diagnostics for Settings Hub.
 */
export async function getAppSettingsSummary(): Promise<SettingsSummary> {
  try {
    const [
      settingsRows,
      exCountRow,
      sessCountRow,
      mealCountRow,
      schedCountRow,
      weightCountRow,
      setsRows,
    ] = await Promise.all([
      db.select().from(appSettings),
      db.select({ count: count() }).from(exercises),
      db.select({ count: count() }).from(workoutSessions).where(eq(workoutSessions.status, "completed")),
      db.select({ count: count() }).from(meals),
      db.select({ count: count() }).from(scheduleBlocks),
      db.select({ count: count() }).from(bodyMetrics),
      db.select({ actualWeight: performedSets.actualWeight }).from(performedSets),
    ]);

    const settingsMap = new Map<string, string>();
    for (const r of settingsRows) {
      settingsMap.set(r.key, r.value);
    }

    // Count usage of K and B tags in performed sets
    let kCount = 0;
    let bCount = 0;
    for (const s of setsRows) {
      if (s.actualWeight?.unitTag === "K") kCount++;
      if (s.actualWeight?.unitTag === "B") bCount++;
    }

    return {
      lastBackupAt: settingsMap.get("last_backup_timestamp") || null,
      dbStatus: "connected",
      unitTags: {
        tagK: {
          confirmed: settingsMap.get("unit_tag_K_confirmed") === "true",
          description:
            settingsMap.get("unit_tag_K_description") ||
            "معرّف الماكينة K (Machine Pin Stack)",
          usageCount: kCount,
        },
        tagB: {
          confirmed: settingsMap.get("unit_tag_B_confirmed") === "true",
          description:
            settingsMap.get("unit_tag_B_description") ||
            "معرّف الماكينة B (Machine Block Stack)",
          usageCount: bCount,
        },
      },
      tableStats: {
        exercisesCount: Number(exCountRow[0]?.count ?? 0),
        completedSessionsCount: Number(sessCountRow[0]?.count ?? 0),
        loggedMealsCount: Number(mealCountRow[0]?.count ?? 0),
        scheduleBlocksCount: Number(schedCountRow[0]?.count ?? 0),
        weightLogsCount: Number(weightCountRow[0]?.count ?? 0),
      },
    };
  } catch {
    return {
      lastBackupAt: null,
      dbStatus: "error",
      unitTags: {
        tagK: { confirmed: false, description: "Machine Pin Stack (K)", usageCount: 0 },
        tagB: { confirmed: false, description: "Machine Block Stack (B)", usageCount: 0 },
      },
      tableStats: {
        exercisesCount: 0,
        completedSessionsCount: 0,
        loggedMealsCount: 0,
        scheduleBlocksCount: 0,
        weightLogsCount: 0,
      },
    };
  }
}
