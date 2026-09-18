import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ar } from "@/i18n/ar";
import { getUserNow } from "./date-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a time-aware greeting in Egyptian Arabic respecting the configured timezone.
 */
export function getTimeAwareGreeting(): string {
  const hour = getUserNow().getHours();
  if (hour >= 5 && hour < 12) {
    return ar.home.greetings.morning;
  } else if (hour >= 12 && hour < 17) {
    return ar.home.greetings.afternoon;
  } else {
    return ar.home.greetings.evening;
  }
}

