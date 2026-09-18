# Implementation Plan: Phase 4 — Progress & Analytics

**Parent Feature**: `specs/005-phase4-progress/spec.md`  
**Target Architecture**: Next.js 15 App Router + Pure Domain Engine + Server Actions + Tremor / Recharts + Neon Postgres

---

## Architecture & Layers

1. **Domain Layer (`src/domain/progress/`)**:
   - `types.ts`: `ExercisePR`, `BodyWeightEntry`, `SessionVolumePoint`, `ConsistencyMetrics`.
   - `progress-engine.ts`:
     - `computeExercisePRs`: Derives all-time best working set for each exercise and tag.
     - `calculateSessionVolume`: Sums working sets volume without mixing incompatible tags.
     - `computeConsistencyMetrics`: Evaluates completed sessions streak, 30-day active days, and completion rate.
     - `formatPRComparison`: Returns strictly descriptive Arabic comparison text.
   - Dedicated unit tests in `src/domain/progress/__tests__/progress-engine.test.ts`.

2. **Localization Layer (`src/i18n/ar.ts`)**:
   - Comprehensive Arabic translations for progress metrics, PRs, body weight logs, empty states, and modal labels.

3. **Server Layer (`src/server/`)**:
   - `progress-queries.ts`:
     - `getProgressSummary()`: Consolidated data for the Progress dashboard.
     - `getBodyWeightHistory(limitDays?: number)`: Chronological weight entries.
     - `getExerciseHistoryForProgress(exerciseId: string)`: Historical sets for progression charts.
   - `progress-actions.ts`:
     - `logBodyWeightAction({ date, weightKg, notes })`: Upserts or inserts daily weight.
     - `deleteBodyWeightAction(id)`: Deletes a weight log.

4. **UI Layer (`src/ui/progress/` & `app/(app)/progress/page.tsx`)**:
   - `ProgressOverviewCard.tsx`: Consistency badge, total sessions, and streak.
   - `BodyWeightSection.tsx`: Weight progression line/area chart + log modal.
   - `ExercisePRsSection.tsx`: Personal best cards with tag preservation and previous comparison.
   - `WorkoutVolumeChart.tsx`: Volume per session chart.
   - `LogBodyWeightModal.tsx`: Dialog to record daily weight.
   - `ProgressView.tsx`: Client coordinator.
   - `app/(app)/progress/page.tsx`: Server page passing live Neon DB data.
