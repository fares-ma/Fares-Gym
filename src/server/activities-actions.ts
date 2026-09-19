"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../data/db";
import { scheduleBlocks, reminders, notes } from "../data/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "./session";

import { ScheduleBlockSchema, ReminderSchema, NoteSchema } from "./schemas";

/**
 * Creates a new recurring or daily schedule block.
 */
export async function createScheduleBlockAction(input: {
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = ScheduleBlockSchema.parse(input);

    await db.insert(scheduleBlocks).values({
      id: crypto.randomUUID(),
      title: parsed.title,
      dayOfWeek: parsed.dayOfWeek,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
    });

    revalidatePath("/activities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to create schedule block:", err);
    return { success: false, error: err.message || "Failed to create block" };
  }
}

/**
 * Deletes a schedule block.
 */
export async function deleteScheduleBlockAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(scheduleBlocks).where(eq(scheduleBlocks.id, id));

    revalidatePath("/activities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete schedule block:", err);
    return { success: false, error: err.message || "Failed to delete block" };
  }
}

/**
 * Creates a new task reminder.
 */
export async function createReminderAction(input: {
  text: string;
  dueTime?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = ReminderSchema.parse(input);

    await db.insert(reminders).values({
      id: crypto.randomUUID(),
      text: parsed.text,
      dueTime: parsed.dueTime || "",
      isCompleted: false,
    });

    revalidatePath("/activities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to create reminder:", err);
    return { success: false, error: err.message || "Failed to create reminder" };
  }
}

/**
 * Toggles the completion status of a reminder.
 */
export async function toggleReminderAction(
  id: string,
  isCompleted: boolean
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db
      .update(reminders)
      .set({ isCompleted })
      .where(eq(reminders.id, id));

    revalidatePath("/activities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle reminder:", err);
    return { success: false, error: err.message || "Failed to update reminder" };
  }
}

/**
 * Deletes a reminder.
 */
export async function deleteReminderAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(reminders).where(eq(reminders.id, id));

    revalidatePath("/activities");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete reminder:", err);
    return { success: false, error: err.message || "Failed to delete reminder" };
  }
}

/**
 * Saves a quick text note.
 */
export async function createNoteAction(
  content: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    const parsed = NoteSchema.parse({ content });

    await db.insert(notes).values({
      id: crypto.randomUUID(),
      content: parsed.content,
      createdAt: new Date(),
    });

    revalidatePath("/activities");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save note:", err);
    return { success: false, error: err.message || "Failed to save note" };
  }
}

/**
 * Deletes a note.
 */
export async function deleteNoteAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthed = await validateSession();
  if (!isAuthed) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(notes).where(eq(notes.id, id));

    revalidatePath("/activities");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete note:", err);
    return { success: false, error: err.message || "Failed to delete note" };
  }
}
