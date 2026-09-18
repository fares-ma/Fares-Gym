import { db } from "../data/db";
import {
  bodyMetrics,
  performedSets,
  workoutSessions,
  workoutPrograms,
  exercises,
} from "../data/schema";
import { desc, asc, eq, and } from "drizzle-orm";
import {
  BodyWeightEntry,
  ExercisePR,
  SessionVolumePoint,
  ConsistencyMetrics,
  PerformedSetRecord,
} from "../domain/progress/types";
import {
  computeExercisePRs,
  calculateSessionVolume,
  computeConsistencyMetrics,
} from "../domain/progress/progress-engine";
import { getUserNow } from "./activities-queries";

/**
 * Retrieves chronological body weight logs.
 */
export async function getBodyWeightHistory(limitDays: number = 90): Promise<BodyWeightEntry[]> {
  const rows = await db
    .select()
    .from(bodyMetrics)
    .orderBy(asc(bodyMetrics.date));

  return rows
    .filter((r) => r.weightKg !== null)
    .map((r) => ({
      id: r.id,
      date: r.date,
      weightKg: r.weightKg!,
      notes: r.notes,
    }));
}

/**
 * Computes all-time PRs for all exercises with tags preserved.
 */
export async function getAllExercisePRs(): Promise<ExercisePR[]> {
  const [setsRows, exerciseRows] = await Promise.all([
    db
      .select()
      .from(performedSets)
      .where(
        and(
          eq(performedSets.type, "working"),
          eq(performedSets.completed, true)
        )
      )
      .orderBy(asc(performedSets.timestamp)),
    db.select().from(exercises),
  ]);

  const exerciseNames: Record<string, string> = {};
  for (const ex of exerciseRows) {
    exerciseNames[ex.id] = ex.displayName;
  }

  const setRecords: PerformedSetRecord[] = setsRows.map((s) => ({
    id: s.id,
    sessionId: s.sessionId,
    exerciseId: s.exerciseId,
    type: s.type,
    actualReps: s.actualReps,
    actualWeight: s.actualWeight,
    status: s.status,
    timestamp: s.timestamp,
  }));

  return computeExercisePRs(setRecords, exerciseNames);
}

/**
 * Retrieves volume data points per completed workout session.
 */
export async function getWorkoutVolumeHistory(): Promise<SessionVolumePoint[]> {
  const [sessionsRows, setsRows, programsRows] = await Promise.all([
    db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.status, "completed"))
      .orderBy(asc(workoutSessions.startedAt)),
    db
      .select()
      .from(performedSets)
      .where(
        and(
          eq(performedSets.type, "working"),
          eq(performedSets.completed, true)
        )
      ),
    db.select().from(workoutPrograms),
  ]);

  const programNames: Record<string, string> = {};
  for (const p of programsRows) {
    programNames[p.id] = p.name;
  }

  // Group sets by session
  const setsBySession: Record<string, PerformedSetRecord[]> = {};
  for (const s of setsRows) {
    if (!setsBySession[s.sessionId]) {
      setsBySession[s.sessionId] = [];
    }
    setsBySession[s.sessionId].push({
      id: s.id,
      sessionId: s.sessionId,
      exerciseId: s.exerciseId,
      type: s.type,
      actualReps: s.actualReps,
      actualWeight: s.actualWeight,
      status: s.status,
      timestamp: s.timestamp,
    });
  }

  const points: SessionVolumePoint[] = [];

  for (const session of sessionsRows) {
    const sets = setsBySession[session.id] || [];
    const volume = calculateSessionVolume(sets);
    const dateStr = session.startedAt.toISOString().split("T")[0];
    const programName = programNames[session.programId] || session.programId;

    points.push({
      sessionId: session.id,
      date: dateStr,
      programName,
      totalVolume: volume,
      workingSetsCount: sets.length,
    });
  }

  return points;
}

/**
 * Consolidated query returning all data needed for the Progress Dashboard.
 */
export async function getProgressSummary(): Promise<{
  consistency: ConsistencyMetrics;
  bodyWeights: BodyWeightEntry[];
  prs: ExercisePR[];
  volumes: SessionVolumePoint[];
}> {
  const now = getUserNow();

  const [sessionsRows, bodyWeights, prs, volumes] = await Promise.all([
    db.select().from(workoutSessions),
    getBodyWeightHistory(),
    getAllExercisePRs(),
    getWorkoutVolumeHistory(),
  ]);

  const consistency = computeConsistencyMetrics(sessionsRows, now);

  return {
    consistency,
    bodyWeights,
    prs,
    volumes,
  };
}
