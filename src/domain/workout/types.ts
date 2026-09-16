/**
 * Pure domain types for workout tracking in Fares Hub.
 * Zero React or external framework dependencies.
 */

export interface WeightValue {
  rawWeight: string; // e.g. "50K", "65k", "200k", "10B", "25"
  numericValue: number; // e.g. 50
  unitTag: string; // "K" | "B" | "kg" | "lbs"
  isUnitConfirmed: boolean;
}

export interface ExerciseTarget {
  id: string; // programExercise id
  exerciseId: string;
  displayName: string;
  orderIndex: number;
  heatingRule: string; // e.g. "1-2", "0"
  workingSets: number; // e.g. 1, 2
  targetReps: string; // e.g. "6-8", "6-10"
  targetRest: string; // e.g. "3-5", "-"
  defaultWeight: WeightValue;
}

export interface ProgramSummary {
  id: string; // "anterior_a"
  name: string; // "Anterior A"
  version: number;
  orderIndex: number;
  isActive: boolean;
  exerciseCount: number;
  isNextScheduled: boolean;
  lastCompletedAt: Date | null;
}

export type SetType = "heating" | "working";

export type SetStatus = "pending" | "completed" | "skipped";

export interface LoggedSet {
  id?: number;
  setNumber: number;
  setType: SetType;
  targetWeight: WeightValue;
  actualWeight: WeightValue;
  targetReps: string;
  actualReps: number;
  restSeconds?: number;
  status: SetStatus;
  completedAt?: Date | null;
}

export interface ExerciseSessionState {
  exerciseId: string;
  displayName: string;
  orderIndex: number;
  targetRest: string;
  heatingSets: LoggedSet[];
  workingSets: LoggedSet[];
}
