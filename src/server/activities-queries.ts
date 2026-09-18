import { db } from "../data/db";
import { scheduleBlocks, reminders, notes } from "../data/schema";
import { eq, or, desc, asc } from "drizzle-orm";
import {
  ScheduleBlock,
  EnrichedScheduleBlock,
  ReminderItem,
  QuickNote,
} from "../domain/activities/types";
import { enrichScheduleBlocks } from "../domain/activities/schedule-engine";

/**
 * Retrieves schedule blocks active on a specific day of week (0-6) or 7 (daily),
 * including overnight blocks from the preceding weekday that spill over into today.
 */
export async function getScheduleBlocksForDay(
  dayOfWeek: number,
  now?: Date
): Promise<EnrichedScheduleBlock[]> {
  const prevDay = (dayOfWeek + 6) % 7;

  const rows = await db
    .select()
    .from(scheduleBlocks)
    .where(
      or(
        eq(scheduleBlocks.dayOfWeek, dayOfWeek),
        eq(scheduleBlocks.dayOfWeek, prevDay),
        eq(scheduleBlocks.dayOfWeek, 7)
      )
    );

  if (rows.length === 0) {
    return [];
  }

  // 1. Blocks originating on the current day (dayOfWeek or daily 7)
  const currentDayBlocks: ScheduleBlock[] = rows
    .filter((b) => b.dayOfWeek === dayOfWeek || b.dayOfWeek === 7)
    .map((b) => ({
      id: b.id,
      occurrenceId: b.id,
      title: b.title,
      dayOfWeek: b.dayOfWeek,
      startTime: b.startTime,
      endTime: b.endTime,
      isFromPrecedingDay: false,
    }));

  // 2. Overnight blocks originating from preceding weekday that spill over into today
  const precedingOvernightBlocks: ScheduleBlock[] = rows
    .filter(
      (b) =>
        (b.dayOfWeek === prevDay || b.dayOfWeek === 7) &&
        b.endTime < b.startTime
    )
    .map((b) => ({
      id: b.id,
      occurrenceId: `${b.id}-prev`,
      title: b.title,
      dayOfWeek: b.dayOfWeek,
      startTime: b.startTime,
      endTime: b.endTime,
      isFromPrecedingDay: true,
    }));

  const sourceBlocks = [...precedingOvernightBlocks, ...currentDayBlocks];
  return enrichScheduleBlocks(sourceBlocks, now);
}

/**
 * Retrieves all reminders ordered by pending state first, then due time.
 */
export async function getAllReminders(): Promise<ReminderItem[]> {
  const rows = await db
    .select()
    .from(reminders)
    .orderBy(asc(reminders.isCompleted), asc(reminders.dueTime));

  return rows.map((r) => ({
    id: r.id,
    text: r.text,
    dueTime: r.dueTime,
    isCompleted: r.isCompleted ?? false,
  }));
}

/**
 * Retrieves recent quick notes in reverse chronological order.
 */
export async function getRecentNotes(limit = 30): Promise<QuickNote[]> {
  const rows = await db
    .select()
    .from(notes)
    .orderBy(desc(notes.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    createdAt: new Date(r.createdAt),
  }));
}

/**
 * Helper to get the current timestamp in the user's configured time zone (defaults to Africa/Cairo).
 */
export function getUserNow(): Date {
  const timeZone = process.env.APP_TIMEZONE || "Africa/Cairo";
  return new Date(new Date().toLocaleString("en-US", { timeZone }));
}

/**
 * High-level helper returning full activities dashboard state for today.
 */
export async function getActivitiesSummary(): Promise<{
  schedule: EnrichedScheduleBlock[];
  reminders: ReminderItem[];
  notes: QuickNote[];
}> {
  const now = getUserNow();
  const currentDayOfWeek = now.getDay();

  const [schedule, rems, noteList] = await Promise.all([
    getScheduleBlocksForDay(currentDayOfWeek, now),
    getAllReminders(),
    getRecentNotes(30),
  ]);

  return {
    schedule,
    reminders: rems,
    notes: noteList,
  };
}
