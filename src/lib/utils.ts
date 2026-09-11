import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a time-aware greeting in Egyptian Arabic.
 */
export function getTimeAwareGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "صباح الفل يا فارس ☀️";
  } else if (hour >= 12 && hour < 17) {
    return "مساء الخير يا بطل 💪";
  } else {
    return "مساء النور يا كابتن 🌙";
  }
}
