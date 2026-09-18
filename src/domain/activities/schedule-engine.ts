import {
  ScheduleBlock,
  EnrichedScheduleBlock,
  BlockStatus,
  BlockDayContext,
} from "./types";

/**
 * Converts a "HH:MM" 24h string to minutes from midnight (0 - 1439).
 * Validates against exact HH:MM format with hours 00-23 and minutes 00-59.
 * Preserves empty-input fallback (returns 0), and throws RangeError for invalid values.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  if (!clean) return 0;

  const match = clean.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    throw new RangeError(`Invalid time format "${timeStr}". Expected HH:MM (00:00 to 23:59)`);
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

/**
 * Determines whether a time block is completed, currently active, or upcoming.
 * Accepts the block occurrence date or equivalent day context (e.g. isFromPrecedingDay flag),
 * rather than inferring the day solely from time values.
 */
export function computeBlockStatus(
  startMinutes: number,
  endMinutes: number,
  currentMinutes: number,
  dayContext: boolean | BlockDayContext = false
): { status: BlockStatus; remainingMinutes?: number } {
  const isOvernight = endMinutes < startMinutes;

  let isFromPrecedingDay = false;
  if (typeof dayContext === "boolean") {
    isFromPrecedingDay = dayContext;
  } else if (dayContext) {
    if (dayContext.isFromPrecedingDay !== undefined) {
      isFromPrecedingDay = dayContext.isFromPrecedingDay;
    } else if (dayContext.occurrenceDate && dayContext.currentDate) {
      isFromPrecedingDay = dayContext.occurrenceDate < dayContext.currentDate;
    }
  }

  if (isFromPrecedingDay) {
    // If block started on the preceding day, it must be an overnight block to reach today
    if (!isOvernight) {
      return { status: "completed" };
    }
    // An overnight block from yesterday ends today at endMinutes
    if (currentMinutes < endMinutes) {
      return {
        status: "current",
        remainingMinutes: endMinutes - currentMinutes,
      };
    }
    return { status: "completed" };
  }

  // Block is scheduled to start on the current day
  if (!isOvernight) {
    if (currentMinutes < startMinutes) {
      return { status: "upcoming" };
    }
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return {
        status: "current",
        remainingMinutes: endMinutes - currentMinutes,
      };
    }
    return { status: "completed" };
  }

  // Overnight block starting today (e.g. 22:00 -> 02:00)
  if (currentMinutes < startMinutes) {
    return { status: "upcoming" };
  }
  // Currently active on today's side of midnight
  return {
    status: "current",
    remainingMinutes: (24 * 60 - currentMinutes) + endMinutes,
  };
}

/**
 * Enriches and orders schedule blocks with real-time status relative to a specific time.
 */
export function enrichScheduleBlocks(
  blocks: ScheduleBlock[],
  now: Date = new Date()
): EnrichedScheduleBlock[] {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...blocks].sort((a, b) => {
    // Preceding day blocks ending this morning sort first
    if (a.isFromPrecedingDay && !b.isFromPrecedingDay) return -1;
    if (!a.isFromPrecedingDay && b.isFromPrecedingDay) return 1;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  return sorted.map((block) => {
    const startM = timeToMinutes(block.startTime);
    const endM = timeToMinutes(block.endTime);
    const { status, remainingMinutes } = computeBlockStatus(
      startM,
      endM,
      currentMinutes,
      {
        isFromPrecedingDay: block.isFromPrecedingDay ?? false,
        occurrenceDate: block.occurrenceDate,
      }
    );

    return {
      ...block,
      status,
      remainingMinutes,
    };
  });
}
