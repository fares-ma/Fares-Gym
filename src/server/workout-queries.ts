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
  // 1. Fetch active programs sorted by orderIndex
  const allPrograms = await db
    .select()
    .from(workoutPrograms)
    .where(eq(workoutPrograms.isActive, true));

  const sortedPrograms = [...allPrograms].sort((a, b) => a.orderIndex - b.orderIndex);

  // 2. Fetch the most recently completed session to determine rotation
  const [lastCompletedSession] = await db
    .select({
      programId: workoutSessions.programId,
      completedAt: workoutSessions.completedAt,
    })
    .from(workoutSessions)
    .where(eq(workoutSessions.status, "completed"))
    .orderBy(desc(workoutSessions.completedAt))
    .limit(1);

  const nextProgramId = getNextProgramId(
    sortedPrograms.map((p) => ({ id: p.id, orderIndex: p.orderIndex })),
    lastCompletedSession?.programId
  );

  // 3. For each program, get exercise count and last completion date
  const programSummaries: ProgramSummary[] = await Promise.all(
    sortedPrograms.map(async (prog) => {
      // Count exercises
      const progExercises = await db
        .select({ id: workoutProgramExercises.id })
        .from(workoutProgramExercises)
        .where(
          and(
            eq(workoutProgramExercises.programId, prog.id),
            eq(workoutProgramExercises.programVersion, prog.version)
          )
        );

      // Get last completed date for this specific program
      const [lastDone] = await db
        .select({ completedAt: workoutSessions.completedAt })
        .from(workoutSessions)
        .where(
          and(
            eq(workoutSessions.programId, prog.id),
            eq(workoutSessions.status, "completed")
          )
        )
        .orderBy(desc(workoutSessions.completedAt))
        .limit(1);

      return {
        id: prog.id,
        name: prog.name,
        version: prog.version,
        orderIndex: prog.orderIndex,
        isActive: prog.isActive ?? true,
        exerciseCount: progExercises.length,
        isNextScheduled: prog.id === nextProgramId,
        lastCompletedAt: lastDone?.completedAt ? new Date(lastDone.completedAt) : null,
      };
    })
  );

  return {
    programs: programSummaries,
    nextProgramId,
  };
}

/**
 * Fetches details for a single workout program including all exercises in order.
 */
export async function getProgramDetails(programId: string): Promise<{
  program: typeof workoutPrograms.$inferSelect;
  exercises: ExerciseTarget[];
} | null> {
  const [program] = await db
    .select()
    .from(workoutPrograms)
    .where(eq(workoutPrograms.id, programId))
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

  // Fetch program info
  const details = await getProgramDetails(activeSession.programId);
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
    .innerJoin(workoutPrograms, eq(workoutSessions.programId, workoutPrograms.id))
    .where(eq(workoutSessions.status, "completed"))
    .orderBy(desc(workoutSessions.completedAt))
    .limit(limit);

  return history;
}
