# Implementation Tasks: Phase 1 — Workout Tracking & Active Session

**Feature**: Phase 1 — Workout Tracking (`specs/002-phase1-workout/spec.md`)
**Implementation Plan**: `specs/002-phase1-workout/plan.md`

## Phase 1: Setup & Project Preparation

- [x] T001 Initialize domain directory structure at `src/domain/workout/`
- [x] T002 [P] Define domain TypeScript types and interfaces in `src/domain/workout/types.ts`
- [x] T003 [P] Add Workout Arabic localization strings (RTL labels, exercises, set statuses) to `src/i18n/ar.ts`

## Phase 2: Foundational Domain Logic (Blocking Prerequisites)

- [x] T004 Implement weight notation parser preserving opaque tags (`K`, `B`) in `src/domain/workout/weight-parser.ts`
- [x] T005 Implement 4-program schedule rotation engine ("who's next") in `src/domain/workout/rotation-engine.ts`
- [x] T006 Implement heating/warm-up set calculator in `src/domain/workout/warmup-engine.ts`
- [x] T007 Create unit tests for pure domain logic in `src/domain/workout/__tests__/workout-domain.test.ts`
- [x] T008 Implement cached database query helpers (getPrograms, getProgramById, getLastCompletedSession) in `src/server/workout-queries.ts`

## Phase 3: User Story 1 - View Programs & Scheduled Rotation (Priority: P1)

- [x] T009 [US1] Create reusable `ProgramCard` component with "Next Workout" badge in `src/ui/workout/ProgramCard.tsx`
- [x] T010 [US1] Assemble main Workout view displaying the 4 programs with rotation status in `app/(app)/workout/page.tsx`

## Phase 4: User Story 2 - Program Exercise Details View (Priority: P1)

- [x] T011 [US2] Create `ExerciseItem` component displaying target sets, reps, rest, and opaque weight in `src/ui/workout/ExerciseItem.tsx`
- [x] T012 [US2] Build program details inspection page in `app/(app)/workout/program/[id]/page.tsx`

## Phase 5: User Story 3 - Active Workout Live Session Logging (Priority: P1)

- [x] T013 [US3] Implement Server Actions (`startWorkoutSession`, `logSetEntry`, `completeWorkoutSession`, `abandonWorkoutSession`) in `src/server/workout-actions.ts`
- [x] T014 [US3] Create `SetEntryRow` component for inline weight/reps adjustments and status marking in `src/ui/workout/SetEntryRow.tsx`
- [x] T015 [US3] Create `ActiveWorkoutView` container managing exercise progression and set checklists in `src/ui/workout/ActiveWorkoutView.tsx`
- [x] T016 [US3] Build live active workout page route with session recovery in `app/(app)/workout/active/page.tsx`

## Phase 6: User Story 4 - Integrated Rest Timer (Priority: P2)

- [x] T017 [US4] Implement `useRestTimer` hook with drift prevention and Web Audio chime cue in `src/ui/workout/useRestTimer.ts`
- [x] T018 [US4] Create `RestTimer` overlay component with `+30s`, `-30s`, and `Skip` controls in `src/ui/workout/RestTimer.tsx`
- [x] T019 [US4] Integrate `RestTimer` into `ActiveWorkoutView` to trigger upon working set completion in `src/ui/workout/ActiveWorkoutView.tsx`

## Phase 7: User Story 5 - Immutable Session History (Priority: P2)

- [x] T020 [US5] Implement historical session query and formatters in `src/server/workout-queries.ts`
- [x] T021 [US5] Create `SessionHistoryCard` read-only summary card in `src/ui/workout/SessionHistoryCard.tsx`
- [x] T022 [US5] Build Workout History page displaying append-only logs in `app/(app)/workout/history/page.tsx`

## Phase 8: Polish & Cross-Cutting Concerns

- [x] T023 Verify RTL layout, touch targets (>= 44px), and Egyptian Arabic micro-copy across all workout screens
- [x] T024 Run full test suite (`npm run build` and domain tests) and verify end-to-end quickstart scenarios from `specs/002-phase1-workout/quickstart.md`

## Dependencies & Execution Graph

```text
Setup (T001-T003)
      │
      ▼
Foundational Domain Logic (T004-T008)
      │
      ├───────────────────────┐
      ▼                       ▼
US1: Programs & Rotation    US2: Program Details
   (T009-T010)                 (T011-T012)
      │                       │
      └───────────┬───────────┘
                  ▼
         US3: Active Workout Logging
               (T013-T016)
                  │
                  ├────────────────────────┐
                  ▼                        ▼
         US4: Rest Timer         US5: History View
           (T017-T019)              (T020-T022)
                  │                        │
                  └───────────┬────────────┘
                              ▼
                   Polish & Verification (T023-T024)
```
