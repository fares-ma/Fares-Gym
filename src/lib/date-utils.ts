/**
 * Timezone and Date Utilities for Fares Hub.
 * Enforces APP_TIMEZONE ("Africa/Cairo") invariance across all server queries, components, and actions.
 */

export const APP_TIMEZONE = process.env.APP_TIMEZONE || "Africa/Cairo";

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * strictly calculated in the user's configured timezone (APP_TIMEZONE / "Africa/Cairo").
 * Prevents UTC server mismatch where a server in UTC returns yesterday's or tomorrow's weekday.
 */
export function getUserWeekday(date: Date = new Date()): number {
  const shortName = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    weekday: "short",
  }).format(date);

  return WEEKDAY_MAP[shortName] ?? 0;
}

/**
 * Returns a Date object adjusted to the user's configured timezone.
 */
export function getUserNow(): Date {
  const formatted = new Date().toLocaleString("en-US", { timeZone: APP_TIMEZONE });
  return new Date(formatted);
}

/**
 * Returns today's calendar date string formatted as "YYYY-MM-DD" in the user's timezone.
 * Eliminates the midnight UTC mismatch where new Date().toISOString() returns yesterday's date.
 */
export function getUserTodayDateStr(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

/**
 * Converts any given Date instance to "YYYY-MM-DD" in the user's timezone.
 */
export function getUserDateStr(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

/**
 * Formats a date using Egyptian Arabic locale within APP_TIMEZONE.
 */
export function formatUserArabicDate(date: Date = new Date()): string {
  return date.toLocaleDateString("ar-EG", {
    timeZone: APP_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
