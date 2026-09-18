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

const DEFAULT_BLOCKS: ScheduleBlock[] = [
  { id: "def-1", title: "مذاكرة مركزة", dayOfWeek: 7, startTime: "13:00", endTime: "15:00" },
  { id: "def-2", title: "وجبة الغداء", dayOfWeek: 7, startTime: "15:00", endTime: "16:00" },
  { id: "def-3", title: "الجيم والتمرين", dayOfWeek: 7, startTime: "17:00", endTime: "18:30" },
  { id: "def-4", title: "راحة واستشفاء", dayOfWeek: 7, startTime: "19:00", endTime: "20:30" },
  { id: "def-5", title: "مراجعة اليوم وتخطيط الغد", dayOfWeek: 7, startTime: "22:00", endTime: "23:00" },
];

/**
 * Retrieves schedule blocks active on a specific day of week (0-6) or 7 (daily),
 * including overnight blocks from the preceding weekday that spill over into today.
 */
export async function getScheduleBlocksForDay(
  dayOfWeek: number
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

  let sourceBlocks: ScheduleBlock[];

  if (rows.length === 0) {
    sourceBlocks = DEFAULT_BLOCKS;
  } else {
    // 1. Blocks originating on the current day (dayOfWeek or daily 7)
    const currentDayBlocks: ScheduleBlock[] = rows
      .filter((b) => b.dayOfWeek === dayOfWeek || b.dayOfWeek === 7)
      .map((b) => ({
        id: b.id,
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
        id: `${b.id}-prev`,
        title: b.title,
        dayOfWeek: b.dayOfWeek,
        startTime: b.startTime,
        endTime: b.endTime,
        isFromPrecedingDay: true,
      }));

    sourceBlocks = [...precedingOvernightBlocks, ...currentDayBlocks];
  }

  return enrichScheduleBlocks(sourceBlocks);
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
 * High-level helper returning full activities dashboard state for today.
 */
export async function getActivitiesSummary(): Promise<{
  schedule: EnrichedScheduleBlock[];
  reminders: ReminderItem[];
  notes: QuickNote[];
}> {
  const currentDayOfWeek = new Date().getDay();

  const [schedule, rems, noteList] = await Promise.all([
    getScheduleBlocksForDay(currentDayOfWeek),
    getAllReminders(),
    getRecentNotes(30),
  ]);

  return {
    schedule,
    reminders: rems,
    notes: noteList,
  };
}
