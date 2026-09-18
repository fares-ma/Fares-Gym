# Implementation Tasks: Phase 3 — Activities, Schedule Blocks & Reminders

**Feature**: Phase 3 — Activities (`specs/004-phase3-activities/spec.md`)  
**Implementation Plan**: `specs/004-phase3-activities/plan.md`

## Phase 1: Domain Foundation & Types
- [x] T001 Define domain types in `src/domain/activities/types.ts`
- [x] T002 Implement schedule engine (`timeToMinutes`, `computeBlockStatus`, `enrichScheduleBlocks`) in `src/domain/activities/schedule-engine.ts`
- [x] T003 Create dedicated unit tests in `src/domain/activities/__tests__/schedule-engine.test.ts`
- [x] T004 Add Arabic translations for Activities in `src/i18n/ar.ts`

## Phase 2: Server Layer (Queries & Actions)
- [x] T005 Implement `src/server/activities-queries.ts` (`getScheduleBlocksForDay`, `getAllReminders`, `getRecentNotes`, `getActivitiesSummary`)
- [x] T006 Implement `src/server/activities-actions.ts` (CRUD actions for schedule blocks, reminders, and notes)

## Phase 3: UI Components
- [x] T007 Build `ScheduleTimeline.tsx` with live time stepper and current activity highlight
- [x] T008 Build `AddScheduleBlockModal.tsx` for adding blocks
- [x] T009 Build `RemindersSection.tsx` with checkbox toggle and create modal
- [x] T010 Build `NotesSection.tsx` with fast note creation and deletion
- [x] T011 Build `ActivitiesView.tsx` client coordinator

## Phase 4: Page Integration & Verification
- [x] T012 Assemble full Activities page in `app/(app)/activities/page.tsx`
- [x] T013 Update `ScheduleStepper.tsx` and `RemindersCard.tsx` on Home dashboard (`app/(app)/page.tsx`) to consume live database data
- [x] T014 Run full domain test suite (`npm run test:domain`) and build check (`npm run build`)
