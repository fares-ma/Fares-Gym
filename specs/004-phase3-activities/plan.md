# Implementation Plan: Phase 3 — Activities, Schedule Blocks & Reminders

**Parent Feature**: `specs/004-phase3-activities/spec.md`  
**Target Architecture**: Next.js 15 App Router + Server Actions + Pure Domain Engine + Neon Postgres

---

## Architecture & Layers

1. **Domain Layer (`src/domain/activities/`)**:
   - `types.ts`: TypeScript interfaces (`ScheduleBlock`, `EnrichedScheduleBlock`, `ReminderItem`, `QuickNote`).
   - `schedule-engine.ts`: Pure functions:
     - `computeBlockStatus(block: ScheduleBlock, currentMinutes: number)`: Determines `completed`, `current`, or `upcoming`.
     - `timeToMinutes(timeStr: string)`: Parses `"17:30"` -> `1050`.
     - `enrichScheduleBlocks(blocks: ScheduleBlock[], currentTime?: Date)`: Sorts and assigns statuses.
   - Unit tests: `src/domain/activities/__tests__/schedule-engine.test.ts`.

2. **Localization (`src/i18n/ar.ts`)**:
   - Comprehensive `activities` section for all labels, days of the week, buttons, and modals.

3. **Server Layer (`src/server/`)**:
   - `activities-queries.ts`:
     - `getScheduleBlocksForDay(dayOfWeek: number)`
     - `getAllReminders()`
     - `getRecentNotes(limit?: number)`
     - `getActivitiesSummary()`
   - `activities-actions.ts`:
     - `createScheduleBlockAction`
     - `deleteScheduleBlockAction`
     - `createReminderAction`
     - `toggleReminderAction`
     - `deleteReminderAction`
     - `createNoteAction`
     - `deleteNoteAction`

4. **UI Layer (`src/ui/activities/` & `app/(app)/`)**:
   - `ScheduleTimeline.tsx`: Visual timeline for today's blocks with live status indicator.
   - `AddScheduleBlockModal.tsx`: Dialog to add a new recurring schedule block (selected weekday 0-6 or daily 7).
   - `RemindersSection.tsx`: Interactive reminders checklist with instant optimistic toggle and create modal.
   - `NotesSection.tsx`: Quick notes feed with fast input.
   - `ActivitiesView.tsx`: Main client coordinator.
   - `app/(app)/activities/page.tsx`: Full activities page.
   - Updates to `app/(app)/page.tsx`, `ScheduleStepper.tsx`, and `RemindersCard.tsx` to consume live database rows.
