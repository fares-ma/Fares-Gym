# Feature Specification: Phase 3 — Activities, Schedule Blocks & Reminders

**Feature Branch**: `specs/004-phase3-activities`  
**Status**: Ready for Implementation  
**Created**: 2026-09-17  
**Parent Document**: `SPEC.md` (Section 8, Section 13)

---

## 1. Overview & Business Value

A personal daily routine and schedule coordination hub for Fares.
It answers the daily question: **"What should I be doing right now?"** by providing:
1. **Schedule Blocks**: Structured recurring daily blocks (Gym, Study, Work, Meals, Rest) mapped to days of the week (`dayOfWeek`: 0–6) with precise start/end times.
2. **Dynamic Schedule Stepper**: Real-time identification of the active current block, upcoming blocks, and elapsed blocks based on the user's current clock.
3. **Daily Reminders Checklist**: Quick-entry checklist for personal tasks with due times and one-click completion toggles.
4. **Quick Notes**: A lightweight, frictionless scratchpad for logging fleeting ideas, workout thoughts, and daily notes.

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: View Real-Time Schedule Stepper (P1)
- **Given** Fares opens the Activities page (`/activities`) or the Home dashboard (`/`)
- **When** the page renders at any current local time (e.g. 17:15 on Thursday)
- **Then** the timeline highlights the currently active block (e.g. "الجيم" 17:00 - 18:30) with a "النشاط الحالي" badge
- **And** prior blocks are styled as completed, and later blocks are marked as upcoming.

### Scenario 2: Create and Manage Schedule Blocks (P1)
- **Given** Fares wants to customize his daily routine
- **When** he clicks "إضافة بلوك زمني" (Add Schedule Block)
- **Then** a modal opens with:
  - اسم النشاط (Title, e.g. "مذاكرة مركزة")
  - يوم الأسبوع (Day of week: 0–6 or Every Day)
  - وقت البدء (Start Time, e.g. "13:00")
  - وقت الانتهاء (End Time, e.g. "15:00")
- **When** he submits, the block is saved to `schedule_blocks` and reflects immediately on the timeline.

### Scenario 3: Daily Reminders Checklist (P1)
- **Given** Fares has daily tasks (e.g. "تحضير شنطة الجيم", "مراجعة كود")
- **When** he clicks the checkbox next to a reminder
- **Then** the completion state toggles atomically (`isCompleted: true/false`) and updates the counter
- **When** he clicks "تذكير جديد", he can enter text and optional time to append a new item.

### Scenario 4: Fast Quick Notes (P2)
- **Given** Fares wants to jot down a quick idea or adjustment
- **When** he types into the notes input and presses Save / Enter
- **Then** a new note is persisted in `notes` with an automated timestamp (`createdAt`)
- **And** appears at the top of the notes feed with a quick delete button.

---

## 3. Functional Requirements

1. **Schedule Blocks**:
   - `schedule_blocks` stores `id`, `title`, `dayOfWeek` (0=Sunday to 6=Saturday), `startTime` ("HH:MM"), `endTime` ("HH:MM").
   - Ordering by `startTime asc`.
   - Engine calculates status (`completed`, `current`, `upcoming`) relative to `now`.

2. **Reminders**:
   - `reminders` stores `id`, `text`, `dueTime`, `isCompleted`.
   - Toggling status executes via authenticated Server Action.

3. **Notes**:
   - `notes` stores `id`, `content`, `createdAt`.
   - Reverse chronological order.

4. **Home Integration**:
   - Both `ScheduleStepper` and `RemindersCard` on the Home page (`/`) load live data from database.
