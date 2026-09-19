# Tasks: UI Refresh and Reliability Fixes

**Input**: Design documents from `/specs/008-ui-refresh-bugfixes/`
**Prerequisites**: [plan.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/plan.md), [spec.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/spec.md), [research.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/research.md), [data-model.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/data-model.md), [contracts/ui-acceptance-contract.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/contracts/ui-acceptance-contract.md), [quickstart.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/quickstart.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`, `[US5]`)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js application**: `app/`, `src/`, `public/` at repository root
- **Domain logic**: `src/domain/` (pure TypeScript functions with zero React dependencies)
- **UI Components**: `src/ui/`
- **Translations**: `src/i18n/ar.ts`
- **Design references (read-only)**: `chatgbt-uiux/`
- **Production assets**: `public/ui/` and `public/character/`

---

## Phase 1: Setup (Shared Infrastructure & Design Tokens)

**Purpose**: Prepare visual asset pipelines, verify directory structures, align editorial dark design tokens, and centralize Arabic copy before code changes.

- [X] T001 Initialize production asset directories in [public/ui/](file:///c:/Users/Fares/Desktop/Gym/public/ui) and [public/character/](file:///c:/Users/Fares/Desktop/Gym/public/character)
- [X] T002 Extract and prepare optimized character, icon, and card assets from [chatgbt-uiux/pages/](file:///c:/Users/Fares/Desktop/Gym/chatgbt-uiux/pages) and [chatgbt-uiux/fares-faces/](file:///c:/Users/Fares/Desktop/Gym/chatgbt-uiux/fares-faces) into [public/ui/](file:///c:/Users/Fares/Desktop/Gym/public/ui) and [public/character/](file:///c:/Users/Fares/Desktop/Gym/public/character)
- [X] T003 [P] Audit and align Editorial Dark palette tokens and CSS variables in [src/lib/design-tokens.ts](file:///c:/Users/Fares/Desktop/Gym/src/lib/design-tokens.ts) and [app/globals.css](file:///c:/Users/Fares/Desktop/Gym/app/globals.css) (70% dark neutrals `#0D0C0F`/`#151318`, 20% burgundy `#7A1735`/`#4A1024`, 10% cream `#F1E9DD`)
- [X] T004 [P] Centralize all new Arabic UI localization keys for refreshed screens, dialogs, empty states, and error messages in [src/i18n/ar.ts](file:///c:/Users/Fares/Desktop/Gym/src/i18n/ar.ts)

---

## Phase 2: Foundational (Blocking Prerequisites - Whole-Project Defect Discovery & Critical Fixes)

**Purpose**: Core infrastructure, whole-project defect audit, route authentication verification, and critical fixes that MUST be complete before ANY visual redesign can begin.

**⚠️ CRITICAL**: Enforces FR-021, SC-010, and the Defect-First Gate. No user story visual redesign work can begin until this phase is complete and verified.

- [X] T005 Execute baseline defect audit by running `npm run lint`, `npm run test:domain`, and `npm run build` from repository root, capturing all warnings and failures
- [X] T006 [P] Audit and enforce authentication session guards across all personal-data route handlers and server actions in [src/server/auth.ts](file:///c:/Users/Fares/Desktop/Gym/src/server/auth.ts) and [app/(app)/layout.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/layout.tsx)
- [X] T007 [P] Smoke test critical server actions across workout, nutrition, activities, progress, and settings in [src/server/](file:///c:/Users/Fares/Desktop/Gym/src/server) to verify error resilience and data flow
- [X] T008 Initialize the whole-project defect tracking register in [specs/008-ui-refresh-bugfixes/defect-log.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/defect-log.md) recording findings, severity, impact, and triage status
- [X] T009 [P] Verify immutable completed workout session safeguards in [src/server/workout-actions.ts](file:///c:/Users/Fares/Desktop/Gym/src/server/workout-actions.ts) ensuring completed sessions cannot be edited or deleted

**Checkpoint**: Foundation ready and baseline defects triaged/repaired — user story implementation can now begin.

---

## Phase 3: User Story 1 - Match the Approved Visual Direction (Priority: P1) 🎯 MVP

**Goal**: Establish the core visual shell, layout tokens, responsive navigation (sidebar/bottom nav/header), and redesigned login screen to near pixel-perfect parity with `login-phone.png` and `login-website.png` at iPhone 11 Pro Max portrait and 1536x1024 desktop.

**Independent Test**: Open `/login` and main app shell on iPhone 11 Pro Max portrait and 1536x1024 desktop; verify color balance, typography, card borders, active navigation states, and responsive behavior against design references.

### Implementation for User Story 1

- [X] T010 [P] [US1] Redesign login page in [app/(auth)/login/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(auth)/login/page.tsx) to match `chatgbt-uiux/pages/login-phone.png` (mobile) and `login-website.png` (desktop) with branding, slogan, inputs, and error states
- [X] T011 [P] [US1] Redesign desktop sidebar and header navigation in [src/ui/Sidebar.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/Sidebar.tsx) matching `chatgbt-uiux/pages/home-website.png` and `workout-website.png` with active states and grouped navigation
- [X] T012 [P] [US1] Redesign mobile bottom navigation bar in [src/ui/BottomNav.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/BottomNav.tsx) matching `chatgbt-uiux/pages/home-phone.png` and `workout-phone.png` with active indicators and safe-area support
- [X] T013 [US1] Update top-level application shell and viewport layout container in [app/(app)/layout.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/layout.tsx) integrating the redesigned desktop sidebar and mobile bottom nav
- [X] T014 [P] [US1] Refactor shared card primitives and containers in [src/ui/ComicCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/ComicCard.tsx) to match the approved editorial dark styling with burgundy glow and cream text
- [X] T015 [P] [US1] Refactor character illustration and quote banner presentation in [src/ui/QuoteBanner.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/QuoteBanner.tsx) and [src/ui/MiniFares.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/MiniFares.tsx) using optimized character assets in [public/character/](file:///c:/Users/Fares/Desktop/Gym/public/character)

**Checkpoint**: At this point, User Story 1 (Visual Direction, Shell & Login) is fully functional and testable independently as MVP.

---

## Phase 4: User Story 2 - Improve the Daily Home Experience (Priority: P1)

**Goal**: Transform the home screen into a daily command center showing today's workout mission, nutrition status, task/reminder checklist, schedule preview, and motivational quotes to near pixel-perfect parity with `home-phone.png` and `home-website.png`.

**Independent Test**: Open `/` with normal data, empty data, and active workout; confirm mission card start/resume behavior, nutrition macro meters, schedule timeline, checklist interaction, and truthful Arabic empty states.

### Implementation for User Story 2

- [X] T016 [US2] Update home queries in [src/server/home-queries.ts](file:///c:/Users/Fares/Desktop/Gym/src/server/home-queries.ts) to supply structured daily mission state (next workout vs active session resume), nutrition snapshot, schedule blocks, and reminders
- [X] T017 [US2] Redesign the Hero Workout Mission Card in [app/(app)/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/page.tsx) with active session resume banner, program title, duration, start action, and character art
- [X] T018 [P] [US2] Redesign the Daily Nutrition Snapshot card in [src/ui/NutritionSnapshotCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/NutritionSnapshotCard.tsx) displaying consumed vs target calories, macro bars, and quick navigation
- [X] T019 [P] [US2] Redesign the Daily Schedule preview stepper in [src/ui/ScheduleStepper.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/ScheduleStepper.tsx) displaying timeline blocks with start/end times and current time indicator
- [X] T020 [P] [US2] Redesign the Reminders & Checklist card in [src/ui/RemindersCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/RemindersCard.tsx) with interactive checkboxes, priority tags, and empty state
- [X] T021 [US2] Implement truthful Arabic empty states in [app/(app)/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/page.tsx) when no workout, nutrition, or schedule items exist without injecting phantom data

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Make Workout Screens Match the Reference (Priority: P1)

**Goal**: Bring the workout program list, program details, active workout view, rest timer, and workout history to near pixel-perfect parity with `workout-phone.png`, `workout-website.png`, and `all-pages.png` while strictly preserving data integrity rules (opaque weight tags, immutable completed sessions, versioned programs).

**Independent Test**: Navigate `/workout`, open program details, start or resume an active workout, log sets with opaque unit tags, run rest timer, finish workout, and view completed session in `/workout/history`.

### Implementation for User Story 3

- [X] T022 [P] [US3] Redesign Workout Program cards in [src/ui/workout/ProgramCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/ProgramCard.tsx) with program order badge, muscle focus, exercise count, duration range, next-up badge, and start button
- [X] T023 [US3] Redesign Workout hub page in [app/(app)/workout/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/workout/page.tsx) (mobile and desktop layout) displaying program cards, active workout banner, and quick history link
- [X] T024 [P] [US3] Redesign Program Details page in [app/(app)/workout/program/[id]/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/workout/program/[id]/page.tsx) and exercise list items in [src/ui/workout/ExerciseItem.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/ExerciseItem.tsx) with target sets/reps and rest ranges
- [X] T025 [US3] Redesign Active Workout tracking view in [src/ui/workout/ActiveWorkoutView.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/ActiveWorkoutView.tsx) with exercise stepper, previous/next navigation, rest timer integration, and finish dialog
- [X] T026 [P] [US3] Redesign Set Entry rows in [src/ui/workout/SetEntryRow.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/SetEntryRow.tsx) with mobile-optimized tap targets (48px inputs, 44px check buttons), rawWeight display, and opaque tag indicators
- [X] T027 [P] [US3] Redesign Rest Timer component in [src/ui/workout/RestTimer.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/RestTimer.tsx) with countdown circle, preset duration increments (+30s/-30s), and sound/vibrate trigger
- [X] T028 [P] [US3] Redesign Session History view in [app/(app)/workout/history/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/workout/history/page.tsx) and history cards in [src/ui/workout/SessionHistoryCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/workout/SessionHistoryCard.tsx) rendering completed sessions as strictly read-only append-only records

**Checkpoint**: At this point, User Stories 1, 2, and 3 are functional and visually aligned with the design references.

---

## Phase 6: User Story 4 - Polish Supporting Sections (Priority: P2)

**Goal**: Align Nutrition, Activities, Progress, and Settings screens with the approved editorial dark design language and layout hierarchy from `all-pages.png`.

**Independent Test**: Navigate through `/nutrition`, `/activities`, `/progress`, and `/settings` on iPhone 11 Pro Max portrait and 1536x1024 desktop; test adding meals, managing schedule/reminders, viewing analytics charts, and triggering settings actions.

### Implementation for User Story 4

- [X] T029 [P] [US4] Redesign Nutrition main view in [src/ui/nutrition/NutritionView.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/NutritionView.tsx) and [app/(app)/nutrition/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/nutrition/page.tsx) with date navigator and macro summary header
- [X] T030 [P] [US4] Redesign Macro Progress cards and Meal List in [src/ui/nutrition/MacroProgressCards.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/MacroProgressCards.tsx) and [src/ui/nutrition/MealList.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/MealList.tsx) with meal logging affordances
- [X] T031 [P] [US4] Redesign Nutrition Modals in [src/ui/nutrition/AddMealModal.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/AddMealModal.tsx), [src/ui/nutrition/EditTargetsModal.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/EditTargetsModal.tsx), and [src/ui/nutrition/TdeeCalculatorModal.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/nutrition/TdeeCalculatorModal.tsx) with dark palette, RTL layout, and explicit disclaimer that TDEE formula is an editable suggestion
- [X] T032 [P] [US4] Redesign Activities & Schedule view in [src/ui/activities/ActivitiesView.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/activities/ActivitiesView.tsx) and [app/(app)/activities/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/activities/page.tsx) with day timeline in [src/ui/activities/ScheduleTimeline.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/activities/ScheduleTimeline.tsx) and overnight block support
- [X] T033 [P] [US4] Redesign Reminders & Notes sections in [src/ui/activities/RemindersSection.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/activities/RemindersSection.tsx) and [src/ui/activities/NotesSection.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/activities/NotesSection.tsx) with clear category tags and empty state messaging
- [X] T034 [P] [US4] Redesign Progress & Analytics view in [src/ui/progress/ProgressView.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/progress/ProgressView.tsx) and [app/(app)/progress/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/progress/page.tsx) with volume charts in [src/ui/progress/WorkoutVolumeChart.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/progress/WorkoutVolumeChart.tsx) and PR showcase in [src/ui/progress/ExercisePRsSection.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/progress/ExercisePRsSection.tsx)
- [X] T035 [P] [US4] Redesign Body Weight tracking and modal in [src/ui/progress/BodyWeightSection.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/progress/BodyWeightSection.tsx) and [src/ui/progress/LogBodyWeightModal.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/progress/LogBodyWeightModal.tsx)
- [X] T036 [P] [US4] Redesign Settings view in [src/ui/settings/SettingsView.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/settings/SettingsView.tsx) and [app/(app)/settings/page.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/settings/page.tsx) with grouped cards ([BackupExportCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/settings/BackupExportCard.tsx), [SystemInfoCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/settings/SystemInfoCard.tsx), [WeightNotationCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/settings/WeightNotationCard.tsx))

**Checkpoint**: At this point, all primary screens across the hub match the visual language.

---

## Phase 7: User Story 5 - Fix Existing Defects and Preserve Trust (Priority: P2)

**Goal**: Ensure whole-project reliability, failure resilience, accessible keyboard/touch interactions, error boundaries, optimistic state reversion, and resolution of all discovered project defects.

**Independent Test**: Simulate network errors during mutations, verify optimistic rollbacks, test full keyboard navigation on checklist and modal controls, verify no server crash on corrupted data, and ensure defect log verification passes.

### Implementation for User Story 5

- [X] T037 [P] [US5] Implement unified optimistic update and rollback helper in [src/lib/optimistic-helper.ts](file:///c:/Users/Fares/Desktop/Gym/src/lib/optimistic-helper.ts) to cleanly revert UI state on server action rejection
- [X] T038 [P] [US5] Implement keyboard accessibility (`role="checkbox"`, `aria-checked`, `tabIndex={0}`, `Enter`/`Space` handlers) in [src/ui/RemindersCard.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/RemindersCard.tsx) and [src/ui/activities/RemindersSection.tsx](file:///c:/Users/Fares/Desktop/Gym/src/ui/activities/RemindersSection.tsx)
- [X] T039 [P] [US5] Add resilient error boundary components and loading skeletons in [app/(app)/loading.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/loading.tsx) and [app/(app)/error.tsx](file:///c:/Users/Fares/Desktop/Gym/app/(app)/error.tsx) displaying friendly Arabic error messages with retry actions
- [X] T040 [P] [US5] Enforce strict timezone invariance (`process.env.APP_TIMEZONE || "Africa/Cairo"`) across date utility calculations in [src/lib/date-utils.ts](file:///c:/Users/Fares/Desktop/Gym/src/lib/date-utils.ts) and server queries in [src/server/activities-queries.ts](file:///c:/Users/Fares/Desktop/Gym/src/server/activities-queries.ts)
- [X] T041 [P] [US5] Validate immutable session guard in [src/server/workout-actions.ts](file:///c:/Users/Fares/Desktop/Gym/src/server/workout-actions.ts) rejecting any update/delete mutations targeting sessions with status `completed`
- [X] T042 [US5] Resolve all logged defect findings and document resolution verification in [specs/008-ui-refresh-bugfixes/defect-log.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/defect-log.md)

**Checkpoint**: All user stories and defect repairs are complete and verified.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cross-viewport visual review, asset performance optimization, quickstart validation, and documentation.

- [X] T043 [P] Optimize and compress all production assets in [public/ui/](file:///c:/Users/Fares/Desktop/Gym/public/ui) and [public/character/](file:///c:/Users/Fares/Desktop/Gym/public/character)
- [X] T044 Execute visual regression review comparing all primary screens against reference images at iPhone 11 Pro Max portrait and 1536x1024 desktop, logging results in [specs/008-ui-refresh-bugfixes/visual-review.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/visual-review.md)
- [X] T045 Run full domain test suite (`npm run test:domain`) in [src/domain/](file:///c:/Users/Fares/Desktop/Gym/src/domain) and ESLint check (`npm run lint`) to confirm zero regressions
- [X] T046 Run production build validation (`npm run build`) in repository root ensuring serverless compatibility
- [X] T047 Run manual verification walkthrough following all steps in [specs/008-ui-refresh-bugfixes/quickstart.md](file:///c:/Users/Fares/Desktop/Gym/specs/008-ui-refresh-bugfixes/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories (FR-021 Defect-First Gate)**
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Core visual shell and login (MVP)
  - User Story 2 (P1): Home daily command center (depends on US1 shell)
  - User Story 3 (P1): Workout system (depends on US1 shell)
  - User Story 4 (P2): Supporting sections (depends on US1 shell)
  - User Story 5 (P2): Reliability, failure resilience, and defect resolution verification
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after US1 - Integrates with shared shell and cards
- **User Story 3 (P1)**: Can start after US1 - Integrates with shared shell and workout cards
- **User Story 4 (P2)**: Can start after US1 - Integrates with shared shell and cards
- **User Story 5 (P2)**: Can run across/after stories to guarantee cross-cutting resilience and defect verification

### Within Each User Story

- Design tokens and copy before layout changes
- Shell navigation before subpage integration
- Card primitives before composite screens
- Optimistic helpers and error boundaries before production testing
- Story verified before declaring phase complete

### Parallel Opportunities

- All Setup tasks marked `[P]` (T003, T004) can run in parallel
- Foundational tasks marked `[P]` (T006, T007, T009) can run in parallel
- Within US1: T010 (login), T011 (sidebar), T012 (bottom nav), T014 (card primitives), T015 (character art) can run in parallel
- Within US2: T018 (nutrition snapshot), T019 (schedule stepper), T020 (reminders card) can run in parallel
- Within US3: T022 (program card), T024 (program details), T026 (set entry row), T027 (rest timer), T028 (history) can run in parallel
- Within US4: T029, T030, T031, T032, T033, T034, T035, T036 can run in parallel across their respective component files
- Within US5: T037, T038, T039, T040, T041 can run in parallel across their respective files
- Polish task T043 can run in parallel with visual review preparation

---

## Parallel Execution Examples

### User Story 1 (Shell & Foundation)
```bash
# Redesign independent navigation & primitives in parallel:
Task: "Redesign login page in app/(auth)/login/page.tsx"
Task: "Redesign desktop sidebar in src/ui/Sidebar.tsx"
Task: "Redesign mobile bottom nav in src/ui/BottomNav.tsx"
Task: "Refactor card primitives in src/ui/ComicCard.tsx"
Task: "Refactor character banner in src/ui/QuoteBanner.tsx"
```

### User Story 2 (Home Screen Components)
```bash
# Redesign home section cards in parallel:
Task: "Redesign nutrition snapshot in src/ui/NutritionSnapshotCard.tsx"
Task: "Redesign schedule stepper in src/ui/ScheduleStepper.tsx"
Task: "Redesign reminders card in src/ui/RemindersCard.tsx"
```

### User Story 3 (Workout Components)
```bash
# Redesign workout components in parallel:
Task: "Redesign program cards in src/ui/workout/ProgramCard.tsx"
Task: "Redesign set entry rows in src/ui/workout/SetEntryRow.tsx"
Task: "Redesign rest timer in src/ui/workout/RestTimer.tsx"
Task: "Redesign session history in src/ui/workout/SessionHistoryCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (assets, tokens, i18n copy)
2. Complete Phase 2: Foundational (baseline defect audit, route protection, defect register) — **CRITICAL: Defect-First Gate**
3. Complete Phase 3: User Story 1 (Login, Sidebar, BottomNav, Shell Layout)
4. **STOP and VALIDATE**: Verify login and shell navigation on iPhone 11 Pro Max portrait and 1536x1024 desktop independently
5. Demo/checkpoint MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Defect baseline cleared, foundation solid
2. Add User Story 1 → Shell & Login ready (MVP!)
3. Add User Story 2 → Home Command Center refreshed → Validate daily dashboard
4. Add User Story 3 → Workout System refreshed → Validate gym tracking & opaque units
5. Add User Story 4 → Supporting sections refreshed (Nutrition, Activities, Progress, Settings)
6. Add User Story 5 → Error boundaries, keyboard accessibility, optimistic rollback, defect log cleared
7. Complete Polish → Visual regression review, build/test validation, quickstart checklist executed

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for full traceability
- Each user story is independently completable and testable
- All tasks strictly follow the `- [ ] [TaskID] [P?] [Story?] Description with file path` format
- Invariants strictly preserved: Opaque weight tags (`K`/`B`), immutable completed sessions, program versioning, no automated medical/nutrition prescriptions, Egyptian Arabic RTL with centralized strings in `src/i18n/ar.ts`
