import { db } from "../data/db";
import {
  workoutPrograms,
  workoutProgramExercises,
  exercises,
  workoutSessions,
  performedSets,
  WeightValue,
} from "../data/schema";
import { eq, desc, and } from "drizzle-orm";
import { getNextProgramId } from "../domain/workout/rotation-engine";
import { ProgramSummary, ExerciseTarget } from "../domain/workout/types";

/**
 * Fetches all active workout programs and computes rotation state.
 */
export async function getWorkoutProgramsWithRotation(): Promise<{
  programs: ProgramSummary[];
  nextProgramId: string;
}> {
  // 1. Fetch active programs, exercises, and completed sessions in parallel
  const [allPrograms, allProgramExercises, completedSessions] = await Promise.all([
    db.select().from(workoutPrograms).where(eq(workoutPrograms.isActive, true)),
    db
      .select({
        programId: workoutProgramExercises.programId,
        programVersion: workoutProgramExercises.programVersion,
      })
      .from(workoutProgramExercises),
    db
      .select({
        programId: workoutSessions.programId,
        completedAt: workoutSessions.completedAt,
      })
      .from(workoutSessions)
      .where(eq(workoutSessions.status, "completed"))
      .orderBy(desc(workoutSessions.completedAt)),
  ]);

  // Retain only maximum version per program id
  const programsById = new Map<string, (typeof allPrograms)[number]>();
  for (const prog of allPrograms) {
    const existing = programsById.get(prog.id);
    if (!existing || prog.version > existing.version) {
      programsById.set(prog.id, prog);
    }
  }

  const sortedPrograms = Array.from(programsById.values()).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  // Determine rotation from most recently completed session
  const lastCompletedSession = completedSessions[0];
  const nextProgramId = getNextProgramId(
    sortedPrograms.map((p) => ({ id: p.id, orderIndex: p.orderIndex })),
    lastCompletedSession?.programId
  );

  // Group exercise counts by programId:version
  const exerciseCountMap = new Map<string, number>();
  for (const row of allProgramExercises) {
    const key = `${row.programId}:${row.programVersion}`;
    exerciseCountMap.set(key, (exerciseCountMap.get(key) || 0) + 1);
  }

  // Map last completed date per program
  const lastDoneMap = new Map<string, Date>();
  for (const sess of completedSessions) {
    if (sess.completedAt && !lastDoneMap.has(sess.programId)) {
      lastDoneMap.set(sess.programId, new Date(sess.completedAt));
    }
  }

  // Build program summaries in memory with zero extra queries
  const programSummaries: ProgramSummary[] = sortedPrograms.map((prog) => ({
    id: prog.id,
    name: prog.name,
    version: prog.version,
    orderIndex: prog.orderIndex,
    isActive: prog.isActive ?? true,
    exerciseCount: exerciseCountMap.get(`${prog.id}:${prog.version}`) || 0,
    isNextScheduled: prog.id === nextProgramId,
    lastCompletedAt: lastDoneMap.get(prog.id) || null,
  }));

  return {
    programs: programSummaries,
    nextProgramId,
  };
}

/**
 * Fetches details for a single workout program including all exercises in order.
 */
export async function getProgramDetails(
  programId: string,
  version?: number
): Promise<{
  program: typeof workoutPrograms.$inferSelect;
  exercises: ExerciseTarget[];
} | null> {
  const whereCondition =
    version !== undefined
      ? and(eq(workoutPrograms.id, programId), eq(workoutPrograms.version, version))
      : eq(workoutPrograms.id, programId);

  const [program] = await db
    .select()
    .from(workoutPrograms)
    .where(whereCondition)
    .orderBy(desc(workoutPrograms.version))
    .limit(1);

  if (!program) return null;

  const progExercises = await db
    .select({
      id: workoutProgramExercises.id,
      exerciseId: workoutProgramExercises.exerciseId,
      orderIndex: workoutProgramExercises.orderIndex,
      heatingRule: workoutProgramExercises.heating,
      workingSets: workoutProgramExercises.workingSets,
      targetReps: workoutProgramExercises.targetReps,
      rest: workoutProgramExercises.rest,
      defaultWeight: workoutProgramExercises.defaultWeight,
      displayName: exercises.displayName,
    })
    .from(workoutProgramExercises)
    .innerJoin(exercises, eq(workoutProgramExercises.exerciseId, exercises.id))
    .where(
      and(
        eq(workoutProgramExercises.programId, program.id),
        eq(workoutProgramExercises.programVersion, program.version)
      )
    );

  const sortedExercises: ExerciseTarget[] = progExercises
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((e) => ({
      id: e.id,
      exerciseId: e.exerciseId,
      displayName: e.displayName,
      orderIndex: e.orderIndex,
      heatingRule: e.heatingRule,
      workingSets: e.workingSets,
      targetReps: e.targetReps,
      targetRest: e.rest,
      defaultWeight: (e.defaultWeight as WeightValue) || {
        rawWeight: "",
        numericValue: 0,
        unitTag: "",
        isUnitConfirmed: false,
      },
    }));

  return {
    program,
    exercises: sortedExercises,
  };
}

/**
 * Checks for an in-progress workout session.
 */
export async function getActiveWorkoutSession() {
  const [activeSession] = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.status, "in_progress"))
    .orderBy(desc(workoutSessions.startedAt))
    .limit(1);

  if (!activeSession) return null;

  // Fetch program info for the locked version recorded on the active session
  const details = await getProgramDetails(
    activeSession.programId,
    activeSession.programVersion
  );
  if (!details) return null;

  // Fetch all set entries
  const entries = await db
    .select()
    .from(performedSets)
    .where(eq(performedSets.sessionId, activeSession.id))
    .orderBy(performedSets.exerciseId, performedSets.setNumber);

  return {
    session: activeSession,
    program: details.program,
    exercises: details.exercises,
    entries,
  };
}

/**
 * Fetches completed workout history in reverse chronological order.
 */
export async function getWorkoutHistory(limit = 30) {
  const history = await db
    .select({
      id: workoutSessions.id,
      programId: workoutSessions.programId,
      programVersion: workoutSessions.programVersion,
      startedAt: workoutSessions.startedAt,
      completedAt: workoutSessions.completedAt,
      durationSeconds: workoutSessions.durationSeconds,
      notes: workoutSessions.notes,
      programName: workoutPrograms.name,
    })
    .from(workoutSessions)
    .innerJoin(
      workoutPrograms,
      and(
        eq(workoutSessions.programId, workoutPrograms.id),
        eq(workoutSessions.programVersion, workoutPrograms.version)
      )
    )
    .where(eq(workoutSessions.status, "completed"))
    .orderBy(desc(workoutSessions.completedAt))
    .limit(limit);

  return history;
}
