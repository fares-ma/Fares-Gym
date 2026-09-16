# Research & Technical Decisions: Phase 1 — Workout Tracking

## Technical Unknowns & Solutions

### 1. Weight Notation Parsing & Opaque Tags
- **Context**: Gym machines have arbitrary tags like `50K`, `65k`, `10B`, or simple numbers like `20`.
- **Decision**: Implement a pure function `parseWeight(raw: string): WeightValue`.
  - Extracts numeric magnitude: `50.5`
  - Normalizes unit tags: `"K"` (uppercase) or `"B"` (uppercase) or `"kg"` / `"lbs"`
  - Sets `isUnitConfirmed: true` if tag is recognized (`K`, `B`, `kg`, `lbs`), `false` otherwise.
- **Rationale**: Strict compliance with Constitution Principle I. Eliminates ambiguities while preserving machine plate pin numbers verbatim.

### 2. Program Rotation Engine ("Who's Next?")
- **Context**: Programs rotate in sequence: `Anterior A` -> `Posterior A` -> `Anterior B` -> `Posterior B` -> wrap around.
- **Decision**: Implement `calculateNextProgram(programs: WorkoutProgram[], lastCompletedSession?: WorkoutSession): string`.
  - Sorts programs by `orderIndex`.
  - Finds the index of the program used in `lastCompletedSession`.
  - Returns `(currentIndex + 1) % programs.length`.
  - If no prior session exists, defaults to the program with `orderIndex === 1` (`Anterior A`).
- **Rationale**: Fully deterministic, pure function, easily tested against all edge cases.

### 3. Active Workout State & Session Recovery
- **Context**: What if the user closes the browser or loses connection mid-workout?
- **Decision**:
  - A session is created in the database with status `in_progress`.
  - Each completed set is committed immediately via Server Action `logWorkoutSetAction`.
  - On the client, `localStorage` maintains a lightweight backup of active inputs.
  - When navigating to `/workout/active` or the Workout page, the app checks for any session with `status === 'in_progress'` and presents a "Resume Workout" banner.
- **Rationale**: Zero data loss guarantee (SC-003) under gym conditions.

### 4. Rest Timer Architecture
- **Context**: Needs countdown with sound cue without heavy external libraries.
- **Decision**:
  - React hook `useRestTimer` using standard `setInterval` and `Date.now()` delta calculations to avoid timer drift when the tab is backgrounded.
  - Web Audio API synthesizer chime (short pleasant beep via `AudioContext.createOscillator()`), with fallback to visual pulse.
  - Quick adjustment buttons (`+30s`, `-30s`, `Skip`).
- **Rationale**: Zero dependency, instant loading, works seamlessly on mobile Safari and Chrome.
