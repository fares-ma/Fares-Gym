export type BlockStatus = "completed" | "current" | "upcoming";

export interface ScheduleBlock {
  id: string;
  title: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Daily
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  occurrenceDate?: string; // YYYY-MM-DD
  isFromPrecedingDay?: boolean;
}

export interface BlockDayContext {
  isFromPrecedingDay?: boolean;
  occurrenceDate?: string;
  currentDate?: string;
}

export interface EnrichedScheduleBlock extends ScheduleBlock {
  status: BlockStatus;
  remainingMinutes?: number;
}

export interface ReminderItem {
  id: string;
  text: string;
  dueTime: string;
  isCompleted: boolean;
}

export interface QuickNote {
  id: string;
  content: string;
  createdAt: Date;
}
