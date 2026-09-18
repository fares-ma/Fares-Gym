"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../data/db";
import { bodyMetrics } from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";

const BodyWeightSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  weightKg: z.number().positive("Weight must be greater than 0").max(300, "Invalid weight value"),
  notes: z.string().trim().max(250).optional().default(""),
});

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

    // Check if an entry exists for this date to upsert
    const existing = await db
      .select()
      .from(bodyMetrics)
      .where(eq(bodyMetrics.date, parsed.date));

    if (existing.length > 0) {
      await db
        .update(bodyMetrics)
        .set({
          weightKg: parsed.weightKg,
          notes: parsed.notes || null,
        })
        .where(eq(bodyMetrics.id, existing[0].id));
    } else {
      await db.insert(bodyMetrics).values({
        id: crypto.randomUUID(),
        date: parsed.date,
        weightKg: parsed.weightKg,
        notes: parsed.notes || null,
      });
    }

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
