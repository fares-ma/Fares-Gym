# Data Model: Phase 1 — Workout Tracking

All tables are defined in PostgreSQL via Drizzle ORM (`src/data/schema.ts`) and already provisioned on Neon.

## Entities & Relationships

### 1. `exercises`
Catalog of movements. Seeded with 27 standard exercises from `gym-data.json`.
- `id` (text, primary key): e.g. `"db_shoulder_press"`
- `displayName` (text, not null): e.g. `"DB Shoulder Press"`
- `aliases` (jsonb, string array): Alternative search tokens e.g. `["Shoulder Press"]`
- `tutorialUrl` (text, optional): Video or GIF guide link
- `personalNotes` (text, optional): Equipment setup notes

### 2. `workout_programs`
Template routines (Anterior A, Posterior A, Anterior B, Posterior B).
- `id` (text, primary key): e.g. `"anterior_a"`
- `name` (text, not null): e.g. `"Anterior A"`
- `version` (integer, default 1): Program revision number
- `orderIndex` (integer, default 0): Rotation priority (1, 2, 3, 4)
- `isActive` (boolean, default true): Active state
- `daysPerWeek` (integer, default 4)
- `rotationOrder` (jsonb, string array): Ordered list of `exerciseId`s
- `createdAt` / `updatedAt` (timestamp)

### 3. `workout_program_exercises`
Configuration of an exercise within a specific program version.
- `id` (serial, primary key)
- `programId` (text, references `workout_programs.id`)
- `programVersion` (integer, not null)
- `exerciseId` (text, references `exercises.id`)
- `orderIndex` (integer, not null)
- `heatingRule` (text): Target heating sets e.g. `"1-2"`
- `workingSets` (integer): Target working sets e.g. `1` or `2`
- `targetReps` (text): e.g. `"6-8"`
- `targetRest` (text): e.g. `"3-5"`
- `targetWeight` (jsonb / WeightValue): `{ rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true }`

### 4. `workout_sessions`
A training instance performed by Fares.
- `id` (text, primary key): UUID v4 or nanoid
- `programId` (text, references `workout_programs.id`)
- `programVersion` (integer, not null)
- `startedAt` (timestamp, not null)
- `completedAt` (timestamp, null while in-progress)
- `status` (text): `"in_progress"` | `"completed"` | `"abandoned"`
- `notes` (text, optional)
- `durationSeconds` (integer, computed at completion)

### 5. `workout_set_entries`
Logged sets for a session.
- `id` (serial, primary key)
- `sessionId` (text, references `workout_sessions.id`)
- `exerciseId` (text, references `exercises.id`)
- `setNumber` (integer, 1-indexed)
- `setType` (text): `"heating"` | `"working"`
- `targetWeight` (jsonb / WeightValue)
- `actualWeight` (jsonb / WeightValue)
- `targetReps` (integer)
- `actualReps` (integer)
- `rpe` (real, optional rating of perceived exertion)
- `restSeconds` (integer, actual rest taken)
- `isCompleted` (boolean, default false)
- `completedAt` (timestamp)

## State Lifecycle: WorkoutSession

```text
[ Not Started ]
       │
       ▼ (startWorkoutAction)
[ IN_PROGRESS ] ──(cancel / timeout > 24h)──► [ ABANDONED ]
       │
       ▼ (completeWorkoutAction)
[ COMPLETED ] (Permanently Immutable — Append-only)
```
