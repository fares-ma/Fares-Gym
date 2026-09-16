# Interface Contracts: Phase 1 — Workout Tracking

These contracts define the Server Actions and domain interfaces for Phase 1.

## Domain Types (`src/domain/workout/types.ts`)

```typescript
export interface WeightValue {
  rawWeight: string;
  numericValue: number;
  unitTag: string; // "K" | "B" | "kg" | "lbs"
  isUnitConfirmed: boolean;
}

export interface ExerciseTarget {
  exerciseId: string;
  displayName: string;
  orderIndex: number;
  heatingRule: string;
  workingSets: number;
  targetReps: string;
  targetRest: string;
  targetWeight: WeightValue;
}

export interface ProgramWithRotation {
  id: string;
  name: string;
  version: number;
  orderIndex: number;
  exercisesCount: number;
  lastCompletedDate: string | null;
  isNextScheduled: boolean;
}
```

## Server Actions (`src/server/workout-actions.ts`)

### 1. `startWorkoutSession(programId: string): Promise<{ success: boolean; sessionId?: string; error?: string }>`
- Creates a new `workout_sessions` row with `status: 'in_progress'` and `startedAt: new Date()`.
- Pre-populates default `workout_set_entries` based on the program's exercise targets.
- Returns the generated `sessionId`.

### 2. `logSetEntry(input: LogSetInput): Promise<{ success: boolean; entryId?: number; error?: string }>`
- Updates an existing set entry with `actualWeight`, `actualReps`, and marks `isCompleted: true`.
- Automatically timestamps `completedAt`.

### 3. `completeWorkoutSession(sessionId: string, notes?: string): Promise<{ success: boolean; error?: string }>`
- Calculates `durationSeconds = now - startedAt`.
- Updates session `status: 'completed'` and `completedAt: new Date()`.
- Locks session against future modifications.

### 4. `abandonWorkoutSession(sessionId: string): Promise<{ success: boolean; error?: string }>`
- Marks session as `status: 'abandoned'`.
