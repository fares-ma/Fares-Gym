"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../data/db";
import { bodyMetrics } from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";

const BodyWeightSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine(
      (val) => {
        const [yearStr, monthStr, dayStr] = val.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        if (month < 1 || month > 12 || day < 1 || day > 31) return false;
        const d = new Date(Date.UTC(year, month - 1, day));
        return (
          d.getUTCFullYear() === year &&
          d.getUTCMonth() === month - 1 &&
          d.getUTCDate() === day
        );
      },
      { message: "Invalid calendar date" }
    ),
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
