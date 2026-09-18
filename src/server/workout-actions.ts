"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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

export const startWorkoutSessionSchema = z.object({
  programId: z.string().trim().min(1, "معرف البرنامج مطلوب"),
});

export const logSetEntrySchema = z.object({
  entryId: z.string().trim().min(1, "معرف المجموعة مطلوب"),
  actualWeight: z.string().trim().min(1, "الوزن مطلوب"),
  actualReps: z.number().int().min(0, "العدات يجب أن تكون 0 أو أكثر"),
  isCompleted: z.boolean().optional(),
  status: z.enum(["pending", "completed", "skipped"]).optional(),
  notes: z.string().optional().nullable(),
});

export const completeWorkoutSessionSchema = z.object({
  sessionId: z.string().trim().min(1, "معرف الجلسة مطلوب"),
  notes: z.string().optional().nullable(),
});

export const abandonWorkoutSessionSchema = z.object({
  sessionId: z.string().trim().min(1, "معرف الجلسة مطلوب"),
});

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

  const parsed = startWorkoutSessionSchema.safeParse({ programId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }
  const validProgramId = parsed.data.programId;

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
      .where(eq(workoutPrograms.id, validProgramId))
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

  const parsed = logSetEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }
  const validated = parsed.data;

  try {
    const parsedWeight = parseWeight(validated.actualWeight);
    const setStatus = validated.status ?? (validated.isCompleted ? "completed" : "pending");
    const isCompleted = setStatus === "completed";

    await db.transaction(async (tx) => {
      // 1. Fetch entry to verify existence and get exercise/session info
      const [entry] = await tx
        .select()
        .from(performedSets)
        .where(eq(performedSets.id, validated.entryId))
        .limit(1);

      if (!entry) {
        throw new Error("Set entry not found");
      }

      // 2. Verify parent WorkoutSession has status in_progress atomically
      const [parentSession] = await tx
        .select()
        .from(workoutSessions)
        .where(
          and(
            eq(workoutSessions.id, entry.sessionId),
            eq(workoutSessions.status, "in_progress")
          )
        )
        .limit(1);

      if (!parentSession) {
        throw new Error("Cannot modify sets in a completed or inactive session");
      }

      // 3. Validate unit tag against existing entries for this exercise
      if (parsedWeight.unitTag) {
        const exerciseEntries = await tx
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
              throw new Error(
                `Unit tag '${parsedWeight.unitTag}' cannot be mixed with existing tag '${existingTag}' for this exercise`
              );
            }
          }
        }
      }

      // 4. Update the set entry atomically
      await tx
        .update(performedSets)
        .set({
          actualWeight: parsedWeight,
          actualReps: validated.actualReps,
          completed: isCompleted,
          status: setStatus,
          notes: validated.notes !== undefined ? (validated.notes ?? null) : entry.notes,
          timestamp: new Date(),
        })
        .where(eq(performedSets.id, validated.entryId));
    });

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

  const parsed = completeWorkoutSessionSchema.safeParse({ sessionId, notes });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }
  const { sessionId: validSessionId, notes: validNotes } = parsed.data;

  try {
    const [session] = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.id, validSessionId))
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
        notes: validNotes || null,
      })
      .where(
        and(
          eq(workoutSessions.id, validSessionId),
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

  const parsed = abandonWorkoutSessionSchema.safeParse({ sessionId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
  }
  const validSessionId = parsed.data.sessionId;

  try {
    await db
      .update(workoutSessions)
      .set({
        status: "abandoned",
        completedAt: new Date(),
      })
      .where(
        and(
          eq(workoutSessions.id, validSessionId),
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
