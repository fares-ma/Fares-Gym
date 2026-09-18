import { WeightValue } from "../workout/types";

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  unitTag: string; // "K" | "B" | "" | etc.
  weight: WeightValue;
  reps: number;
  achievedAt: Date;
  previousPR?: {
    weight: WeightValue;
    reps: number;
    achievedAt: Date;
  };
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  notes?: string | null;
}

export interface SessionVolumePoint {
  sessionId: string;
  date: string; // YYYY-MM-DD
  programName: string;
  unitTag: string; // "K" | "B" | ""
  totalVolume: number;
  workingSetsCount: number;
}

export interface ConsistencyMetrics {
  totalCompletedSessions: number;
  currentStreakWeeks: number;
  last30DaysActiveCount: number;
  last30DaysRate: number; // percentage (0 - 100)
}

export interface PerformedSetRecord {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName?: string;
  type: string; // "heating" | "working"
  actualReps: number | null;
  actualWeight: WeightValue | null;
  status: string; // "completed" | "skipped" | "pending"
  timestamp: Date;
}
