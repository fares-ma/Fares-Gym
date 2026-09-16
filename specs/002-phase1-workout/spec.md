# Feature Specification: Phase 1 — Workout Tracking & Active Session

**Feature Branch**: `002-phase1-workout`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Phase 1 from Roadmap: Workout catalog inspection, 4 programs rotation ('who's up next'), program details, active workout logging, warm-up engine, rest timer, and immutable append-only session history."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Programs & Scheduled Rotation (Priority: P1)

Fares opens the Workout tab. He sees the four predefined workout programs:
- `Anterior A`
- `Posterior A`
- `Anterior B`
- `Posterior B`

The system clearly highlights the **next program in rotation** based on the most recently completed workout session. Each program card displays its name, target exercise count, last completed date, and a prominent action button to start or preview the workout.

**Why this priority**: Answers the core user question: "What workout am I doing today?" and provides the gateway to all gym tracking.

**Independent Test**: Can be tested by navigating to `/workout`, observing the list of 4 programs with the active one highlighted, and clicking on any program to see its details.

**Acceptance Scenarios**:
1. **Given** no workout sessions have been logged yet, **When** Fares views the Workout tab, **Then** `Anterior A` is recommended as the starting program.
2. **Given** the last completed session was `Anterior A`, **When** Fares views the Workout tab, **Then** `Posterior A` is marked as the next scheduled workout.
3. **Given** the last completed session was `Posterior B`, **When** Fares views the Workout tab, **Then** the rotation wraps around to `Anterior A`.
4. **Given** Fares wants to do a different program out of order, **When** he selects any non-scheduled program card, **Then** he can view its exercises and start an ad-hoc session.

---

### User Story 2 - Program Exercise Details View (Priority: P1)

Fares taps on a workout program to inspect its contents. He sees the ordered sequence of exercises with:
- Exercise display name
- Target heating / warm-up sets (e.g., `1-2`)
- Target working sets (e.g., `1` or `2`)
- Target reps range (e.g., `6-8`, `8-12`)
- Target rest interval (e.g., `3-5` min)
- Target weight notation with opaque unit tags (e.g., `50K`, `65k`, `200k`, `10B`)

**Why this priority**: Fares needs to review the exercise routine, equipment settings, and planned weights before starting his session.

**Independent Test**: Can be tested by viewing `/workout/program/[id]`, verifying that all exercises and target metrics match `gym-data.json`.

**Acceptance Scenarios**:
1. **Given** Fares opens `Anterior A`, **When** the page renders, **Then** he sees DB Shoulder Press, Cable Hip Adduction, Hack Squat, Lat Pulldown Crunches, Leg Extension, and Cable Lateral Raises with their configured targets.
2. **Given** an exercise has an opaque tag like `50K`, **When** displayed, **Then** the `K` suffix is preserved verbatim and never auto-converted to kilograms or pounds.

---

### User Story 3 - Active Workout Session Logging (Priority: P1)

Fares clicks **"Start Workout"**. A dedicated, high-contrast, distraction-free Active Workout screen opens.
The screen shows:
- Current active exercise with its target weight and reps
- Heating sets checklist and working sets logger
- Inputs for actual weight and actual reps performed, pre-filled with target suggestions
- A **"Complete Set"** button for each set
- Status badges: `Pending`, `Completed`, `Skipped`
- Navigation buttons to proceed to the next exercise or return to a previous one
- An **"End Workout"** summary button

**Why this priority**: The live logging interface is used directly at the gym under physical strain; it must be fast, responsive, and seamless with minimum taps required.

**Independent Test**: Can be tested by launching an active workout, checking off sets with customized weight/reps, and finishing the exercise sequence.

**Acceptance Scenarios**:
1. **Given** an active workout is started, **When** Fares completes a working set of `50K x 8`, **Then** the set is marked completed with a visual checkmark and actual timestamp.
2. **Given** Fares needs to adjust the weight or reps performed on the fly, **When** he changes `50K` to `52.5K` and `8` reps to `7`, **Then** the edited values are immediately saved.
3. **Given** Fares finishes all exercises, **When** he taps "Finish Workout", **Then** the session transitions to completed status.

---

### User Story 4 - Integrated Rest Timer (Priority: P2)

When Fares marks a working set as completed, an integrated rest countdown timer automatically activates based on the exercise's target rest specification (e.g., 3 minutes).
The timer displays remaining minutes and seconds, provides quick `+30s` / `-30s` adjusters, and gives a visual / subtle audio cue when rest time expires. Fares can dismiss or skip the timer at any time.

**Why this priority**: Optimizes recovery time between heavy sets without needing to switch to a separate stopwatch app.

**Independent Test**: Can be tested by completing a set, observing the countdown start, adjusting time with `+30s`, and letting it count down to completion.

**Acceptance Scenarios**:
1. **Given** a set with target rest `3-5` min is completed, **When** the user marks it done, **Then** a timer defaults to the lower bound (e.g., 3:00) and begins counting down.
2. **Given** the timer is running, **When** Fares taps `+30s`, **Then** 30 seconds are added to the countdown.
3. **Given** the timer reaches 00:00, **When** time expires, **Then** a distinct notification cue triggers and the next set is emphasized.

---

### User Story 5 - Immutable Session History (Priority: P2)

Fares wants to see his past gym logs. He opens the Workout History tab. He sees a reverse-chronological list of all completed sessions showing date, program name, total duration, and completed volume. Tapping a session reveals full set-by-set details. Completed sessions cannot be edited or deleted.

**Why this priority**: Preserves accurate training records and progress over time.

**Independent Test**: Can be tested by completing a workout and verifying that it appears in `/workout/history` as read-only.

**Acceptance Scenarios**:
1. **Given** a workout was completed, **When** Fares views Workout History, **Then** the session appears with date, duration, exercises performed, and actual sets logged.
2. **Given** a completed session, **When** inspected, **Then** no delete or inline edit buttons exist (strictly append-only).

---

### Edge Cases

- **Accidental Tab Closure or Refresh**: Active workout session state must be saved continuously in the database (or locally synchronized) so Fares can refresh the browser or reopen the tab and immediately resume an in-progress session.
- **Skipping an Exercise**: If equipment is occupied or an injury occurs, Fares can skip an exercise with an optional note without failing the entire session.
- **Incomplete Sessions**: If a session is left in `in_progress` status for more than 24 hours, the system prompts Fares whether to finalize it or discard the abandoned draft.
- **Opaque Units with Typos**: If a user enters an unfamiliar unit tag, the parser prompts for confirmation rather than guessing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the four standard workout programs (`Anterior A`, `Posterior A`, `Anterior B`, `Posterior B`) in their defined rotation sequence.
- **FR-002**: System MUST dynamically compute and highlight the next program in rotation based on the most recent completed session.
- **FR-003**: System MUST display the complete exercise catalog and program details including targets for heating sets, working sets, reps, rest, and weights.
- **FR-004**: System MUST store and treat weight unit tags `"K"` and `"B"` as opaque machine identifiers, never converting them to standard units.
- **FR-005**: System MUST allow launching an active workout session tied to a specific program version.
- **FR-006**: System MUST persist session set entries (heating and working) with planned vs actual weight, reps, RPE/status, and completed timestamp.
- **FR-007**: System MUST provide an automatic rest countdown timer upon completing a working set, with audible/visual alerts and manual adjustment controls.
- **FR-008**: System MUST support resuming an in-progress workout session across page refreshes or device reconnection.
- **FR-009**: System MUST permanently lock completed workout sessions as immutable append-only history records.
- **FR-010**: System MUST render all user interface text in Egyptian Arabic (RTL layout) using `src/i18n/ar.ts`, while preserving exercise names in English.

### Key Entities *(data definitions)*

- **Exercise**: Reference definition of a movement (`id`, `displayName`, `aliases`, `tutorialUrl`, `personalNotes`).
- **WorkoutProgram**: Routine container (`id`, `name`, `version`, `orderIndex`, `isActive`, `rotationOrder`).
- **WorkoutSession**: A single training session (`id`, `programId`, `programVersion`, `startedAt`, `completedAt`, `status`, `notes`).
- **WorkoutSetEntry**: Individual set logged within a session (`id`, `sessionId`, `exerciseId`, `setNumber`, `setType`, `targetWeight`, `actualWeight`, `targetReps`, `actualReps`, `restSeconds`, `isCompleted`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fares can open the Workout page and determine today's scheduled program in less than 3 seconds.
- **SC-002**: Starting an active workout and logging a completed set requires no more than 2 taps.
- **SC-003**: In-progress workout data is preserved with zero data loss upon abrupt page reload or connection loss.
- **SC-004**: 100% of historical completed sessions remain permanently immutable.
- **SC-005**: All UI screens render with native RTL layout and zero English text leakage outside of exercise titles.

## Assumptions

- Fares exercises according to the 4-day rotation defined in `gym-data.json`.
- The exercise database seeded in Phase 0 contains all 27 standard movements.
- Exercise names are standard English fitness terminology understood by the user.
- The web app runs on modern mobile and desktop browsers supporting the Web Audio API (for rest timer chime) and Web Storage / Server Actions.
