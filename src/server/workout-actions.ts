"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "../data/db";
import {
  workoutSessions,
  performedSets,
  workoutPrograms,
  workoutProgramExercises,
  WeightValue,
} from "../data/schema";
import { eq, and, desc } from "drizzle-orm";
import { validateSession } from "./session";
import { parseWeight } from "../domain/workout/weight-parser";
import { calculateWarmupSets } from "../domain/workout/warmup-engine";

/**
 * Starts a new active workout session or resumes an existing in-progress one.
 */
export async function startWorkoutSessionAction(programId: string): Promise<{
  success: boolean;
  sessionId?: string;
  error?: string;
}> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    // 1. Check if there's already an active in-progress session
    const [existingSession] = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.status, "in_progress"))
      .orderBy(desc(workoutSessions.startedAt))
      .limit(1);

    if (existingSession) {
      return { success: true, sessionId: existingSession.id };
    }

    // 2. Fetch the program to lock its version
    const [program] = await db
      .select()
      .from(workoutPrograms)
      .where(eq(workoutPrograms.id, programId))
      .orderBy(desc(workoutPrograms.version))
      .limit(1);

    if (!program) {
      return { success: false, error: "Program not found" };
    }

    const sessionId = crypto.randomUUID();
    const startedAt = new Date();

    // 3. Create the workout_sessions record and initial sets in a single transaction
    await db.transaction(async (tx) => {
      await tx.insert(workoutSessions).values({
        id: sessionId,
        programId: program.id,
        programVersion: program.version,
        status: "in_progress",
        startedAt,
      });

      // 4. Fetch the program's exercise sequence
      const progExercises = await tx
        .select()
        .from(workoutProgramExercises)
        .where(
          and(
            eq(workoutProgramExercises.programId, program.id),
            eq(workoutProgramExercises.programVersion, program.version)
          )
        )
        .orderBy(workoutProgramExercises.orderIndex);

      // 5. Pre-populate set entries for each exercise
      const setsToInsert = [];
      for (const pe of progExercises) {
        const defaultWeight = (pe.defaultWeight as WeightValue) || {
          rawWeight: "0K",
          numericValue: 0,
          unitTag: "K",
          isUnitConfirmed: true,
        };

        // Heating sets
        const warmupSets = calculateWarmupSets(defaultWeight, pe.heating);
        let setCounter = 1;

        for (const ws of warmupSets) {
          setsToInsert.push({
            id: crypto.randomUUID(),
            sessionId,
            exerciseId: pe.exerciseId,
            setNumber: setCounter++,
            type: "heating",
            targetWeight: ws.weight,
            actualWeight: ws.weight,
            targetReps: ws.suggestedReps,
            actualReps: parseInt(ws.suggestedReps.split("-")[0], 10) || 6,
            completed: false,
            status: "pending",
            notes: null,
            timestamp: new Date(),
          });
        }

        // Working sets
        const workingTargetReps = parseInt(pe.targetReps.split("-")[0], 10) || 8;
        for (let w = 0; w < pe.workingSets; w++) {
          setsToInsert.push({
            id: crypto.randomUUID(),
            sessionId,
            exerciseId: pe.exerciseId,
            setNumber: setCounter++,
            type: "working",
            targetWeight: defaultWeight,
            actualWeight: defaultWeight,
            targetReps: pe.targetReps,
            actualReps: workingTargetReps,
            completed: false,
            status: "pending",
            notes: null,
            timestamp: new Date(),
          });
        }
      }

      if (setsToInsert.length > 0) {
        await tx.insert(performedSets).values(setsToInsert);
      }
    });

    revalidatePath("/workout");
    revalidatePath("/workout/active");
    return { success: true, sessionId };
  } catch (err: any) {
    console.error("Failed to start workout session:", err);
    return { success: false, error: err.message || "Failed to start session" };
  }
}

/**
 * Updates a specific set entry in an active workout session.
 */
export async function logSetEntryAction(input: {
  entryId: string;
  actualWeight: string;
  actualReps: number;
  isCompleted?: boolean;
  status?: "pending" | "completed" | "skipped";
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    // 1. Fetch entry to verify existence and get exercise/session info
    const [entry] = await db
      .select()
      .from(performedSets)
      .where(eq(performedSets.id, input.entryId))
      .limit(1);

    if (!entry) {
      return { success: false, error: "Set entry not found" };
    }

    // 2. Verify parent WorkoutSession has status in_progress
    const [parentSession] = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.id, entry.sessionId))
      .limit(1);

    if (!parentSession || parentSession.status !== "in_progress") {
      return {
        success: false,
        error: "Cannot modify sets in a completed or inactive session",
      };
    }

    // 3. Parse weight and validate unit tag against existing entries for this exercise
    const parsedWeight = parseWeight(input.actualWeight);

    if (parsedWeight.unitTag) {
      const exerciseEntries = await db
        .select({
          actualWeight: performedSets.actualWeight,
          targetWeight: performedSets.targetWeight,
        })
        .from(performedSets)
        .where(
          and(
            eq(performedSets.sessionId, entry.sessionId),
            eq(performedSets.exerciseId, entry.exerciseId)
          )
        );

      for (const ex of exerciseEntries) {
        const existingActualTag = (ex.actualWeight as WeightValue)?.unitTag;
        const existingTargetTag = (ex.targetWeight as WeightValue)?.unitTag;
        const existingTag = existingActualTag || existingTargetTag;

        if (existingTag && existingTag !== parsedWeight.unitTag) {
          // Rule: Unit tags "K" and "B" are opaque machine identifiers and must never be mixed with other tags
          if (
            parsedWeight.unitTag === "K" ||
            parsedWeight.unitTag === "B" ||
            existingTag === "K" ||
            existingTag === "B"
          ) {
            return {
              success: false,
              error: `Unit tag '${parsedWeight.unitTag}' cannot be mixed with existing tag '${existingTag}' for this exercise`,
            };
          }
        }
      }
    }

    const setStatus = input.status ?? (input.isCompleted ? "completed" : "pending");
    const isCompleted = setStatus === "completed" || input.isCompleted === true;

    await db
      .update(performedSets)
      .set({
        actualWeight: parsedWeight,
        actualReps: input.actualReps,
        completed: isCompleted,
        status: setStatus,
        notes: input.notes !== undefined ? input.notes : entry.notes,
        timestamp: new Date(),
      })
      .where(eq(performedSets.id, input.entryId));

    revalidatePath("/workout/active");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to log set entry:", err);
    return { success: false, error: err.message || "Failed to log set" };
  }
}

/**
 * Completes and locks a workout session as immutable history.
 */
export async function completeWorkoutSessionAction(
  sessionId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const [session] = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.id, sessionId))
      .limit(1);

    if (!session) return { success: false, error: "Session not found" };
    if (session.status !== "in_progress") {
      return { success: false, error: "Session is already completed or inactive" };
    }

    const completedAt = new Date();
    const durationSeconds = Math.round(
      (completedAt.getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    // Atomically filter by both sessionId and status "in_progress"
    const updatedRows = await db
      .update(workoutSessions)
      .set({
        status: "completed",
        completedAt,
        durationSeconds,
        notes: notes || null,
      })
      .where(
        and(
          eq(workoutSessions.id, sessionId),
          eq(workoutSessions.status, "in_progress")
        )
      )
      .returning({ id: workoutSessions.id });

    if (!updatedRows || updatedRows.length === 0) {
      return {
        success: false,
        error: "Failed to complete session: session was not in progress",
      };
    }

    revalidatePath("/workout");
    revalidatePath("/workout/history");
    revalidatePath("/workout/active");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to complete workout session:", err);
    return { success: false, error: err.message || "Failed to complete session" };
  }
}

/**
 * Abandons an in-progress workout session.
 */
export async function abandonWorkoutSessionAction(sessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db
      .update(workoutSessions)
      .set({
        status: "abandoned",
        completedAt: new Date(),
      })
      .where(
        and(
          eq(workoutSessions.id, sessionId),
          eq(workoutSessions.status, "in_progress")
        )
      );

    revalidatePath("/workout");
    revalidatePath("/workout/active");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to abandon workout session:", err);
    return { success: false, error: err.message || "Failed to abandon session" };
  }
}
