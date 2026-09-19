"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../data/db";
import { bodyMetrics } from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";

import { BodyWeightSchema } from "./schemas";

/**
 * Records or updates a daily body weight entry.
 */
export async function logBodyWeightAction(input: {
  date: string;
  weightKg: number;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = BodyWeightSchema.parse(input);

    // Atomic upsert with conflict handling on unique date
    await db
      .insert(bodyMetrics)
      .values({
        id: crypto.randomUUID(),
        date: parsed.date,
        weightKg: parsed.weightKg,
        notes: parsed.notes || null,
      })
      .onConflictDoUpdate({
        target: bodyMetrics.date,
        set: {
          weightKg: parsed.weightKg,
          notes: parsed.notes || null,
        },
      });

    revalidatePath("/progress");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record weight";
    return { success: false, error: message };
  }
}

/**
 * Deletes a body weight log by ID.
 */
export async function deleteBodyWeightAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(bodyMetrics).where(eq(bodyMetrics.id, id));
    revalidatePath("/progress");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete weight log";
    return { success: false, error: message };
  }
}
