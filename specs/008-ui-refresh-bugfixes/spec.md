# Feature Specification: UI Refresh and Reliability Fixes

**Feature Branch**: `[008-ui-refresh-bugfixes]`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Implement the UI/UX design from the attached chatgbt-uiux reference, apply the possible improvements, and fix any existing defects."

## Clarifications

### Session 2026-09-19

- Q: During the new design implementation, what should the defect-fix scope be? → A: Fix any existing defect across the whole project, even when it is outside the refreshed design screens.
- Q: How closely should implementation match the attached design images? → A: Match the images as near pixel-perfect targets, accepting additional asset work and longer implementation time when needed.
- Q: After choosing near pixel-perfect matching and whole-project defect fixing, what execution priority should guide planning? → A: Fix all known project defects first, then begin the design refresh.
- Q: Which primary screen sizes should be used to judge near pixel-perfect design parity? → A: Desktop reference at 1536x1024 plus iPhone 11 Pro Max portrait as the primary personal phone target.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match the Approved Visual Direction (Priority: P1)

As Fares, I want the application to match the approved UI/UX reference as closely as practical so the hub feels polished, personal, and consistent across the main daily screens.

**Why this priority**: The user explicitly approved this design direction, and the visual system is the foundation for all later screen-level work.

**Independent Test**: Can be tested by opening the login, home, workout, nutrition, activities, progress, and settings screens on a 1536x1024 desktop viewport and an iPhone 11 Pro Max portrait-sized mobile viewport, then comparing layout, spacing, hierarchy, colors, imagery, and navigation against the attached reference images.

**Acceptance Scenarios**:

1. **Given** Fares opens the app on mobile, **When** any primary screen loads, **Then** the screen closely matches the approved reference for layout, hierarchy, spacing, colors, imagery placement, and card treatment while still showing real data.
2. **Given** Fares switches between primary sections, **When** navigation changes, **Then** the active state, spacing, and icon style remain consistent and easy to scan.
3. **Given** a screen includes character or gym artwork, **When** the content loads, **Then** the artwork enhances the screen without hiding controls, text, or real data.

---

### User Story 2 - Improve the Daily Home Experience (Priority: P1)

As Fares, I want the home screen to immediately show what matters today so I can decide whether to start a workout, log food, review tasks, or check my schedule without hunting.

**Why this priority**: The home screen answers the core product question: "What do I need to do now?"

**Independent Test**: Can be tested by opening the home screen with normal data, empty data, and partial data, then confirming the mission card, nutrition summary, checklist/reminders, schedule, and motivational quote remain clear and truthful.

**Acceptance Scenarios**:

1. **Given** a workout is due today, **When** Fares opens the home screen, **Then** the current mission prominently shows the next workout with a clear start action.
2. **Given** there is an active workout session, **When** Fares opens the home screen, **Then** the primary action resumes the existing session instead of starting a duplicate.
3. **Given** nutrition, schedule, or reminder data is empty, **When** the home screen renders, **Then** it shows the appropriate Arabic empty state rather than fake or demo data.

---

### User Story 3 - Make Workout Screens Match the Reference (Priority: P1)

As Fares, I want the workout program list, program details, active workout, and workout history screens to follow the approved design so gym tracking feels fast, focused, and visually motivating.

**Why this priority**: Workouts are the most complex and highest-risk part of the application, and their data integrity rules must remain intact while improving the UI.

**Independent Test**: Can be tested by viewing the workout list, opening a program, starting/resuming a workout, completing sets, using the rest timer, finishing a session, and checking history.

**Acceptance Scenarios**:

1. **Given** the workout programs exist, **When** Fares opens the workout screen, **Then** the four programs appear as rich visual cards with order, muscle focus, exercise count, duration range, and next-program status.
2. **Given** Fares views a program, **When** the details screen opens, **Then** exercises, targets, rest ranges, and start action are visible without visual clutter.
3. **Given** Fares is in an active workout, **When** completing sets and moving between exercises, **Then** inputs, timer, progress, next/previous actions, and finish action are reachable and readable on mobile.
4. **Given** Fares opens workout history, **When** previous sessions are listed, **Then** completed sessions are displayed as immutable records and cannot be edited or deleted.

---

### User Story 4 - Polish Supporting Sections (Priority: P2)

As Fares, I want nutrition, activities, progress, and settings to use the same design quality as the workout screens so the whole hub feels like one product.

**Why this priority**: These sections support daily use and should not feel visually disconnected after the main refresh.

**Independent Test**: Can be tested by navigating through nutrition, activities, progress, and settings on mobile and desktop, performing the main action on each screen, and confirming every state remains readable and consistent.

**Acceptance Scenarios**:

1. **Given** Fares opens nutrition, **When** meals and targets exist, **Then** calories and macros are shown in clear visual summaries with an obvious add-meal action.
2. **Given** Fares opens activities, **When** schedule blocks or reminders exist, **Then** the day timeline and checklist are easy to scan and operate with touch or keyboard.
3. **Given** Fares opens progress, **When** sufficient data exists, **Then** charts and quick stats are visually aligned with the approved analytics screen.
4. **Given** Fares opens settings, **When** reviewing account, appearance, backup, export, and app information, **Then** the options are grouped clearly and actions are unambiguous.

---

### User Story 5 - Fix Existing Defects and Preserve Trust (Priority: P2)

As Fares, I want visible bugs, broken states, layout issues, and data inconsistencies fixed across the whole project while the redesign is implemented so the app becomes more reliable, not just prettier.

**Why this priority**: Visual refresh work can expose existing defects; reliability must improve alongside design polish.

**Independent Test**: Can be tested by running the current critical user flows across all existing sections, checking empty/loading/error states, and confirming no known project-wide defect remains unresolved without documentation.

**Acceptance Scenarios**:

1. **Given** a refreshed screen depends on data, **When** loading fails, **Then** the screen shows a useful Arabic error or fallback and does not crash.
2. **Given** Fares uses interactive controls such as checklist items, date navigation, workout set controls, and dialogs, **When** using keyboard or touch, **Then** controls remain accessible and recover cleanly from failed actions.
3. **Given** a completed workout session exists, **When** redesign work touches workout history, **Then** the session remains append-only and cannot be modified in place.
4. **Given** known project defects exist before the redesign begins, **When** implementation is planned, **Then** defect discovery and repair are completed before major visual redesign tasks start.

### Edge Cases

- The app has no workout, meal, schedule, reminder, progress, or settings data for a screen.
- Artwork loads slowly, fails to load, or is unavailable on a deployed environment.
- A near pixel-perfect match requires additional visual assets, cropping, or responsive variants beyond the currently available reference images.
- Long Arabic labels, English exercise names, numeric values, and mixed RTL/LTR text appear in the same card.
- A user opens the app on iPhone 11 Pro Max portrait, a 1536x1024 desktop viewport, and installed PWA context.
- Fares resumes an active workout after a refresh or navigation away from the active workout screen.
- Optimistic updates fail after the UI has already changed visually.
- Data-bearing routes are accessed without a valid session.
- Existing defects are discovered while implementing the redesign and affect one of the refreshed user flows.
- Existing defects are discovered outside the redesigned screens but still affect project correctness, accessibility, authentication, data integrity, deployment readiness, or core navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST match the approved reference images as near pixel-perfect targets across all primary authenticated screens and the login screen, while preserving truthful live data and accessibility.
- **FR-002**: The system MUST keep the full user interface in Arabic RTL, while preserving English exercise names and mixed numeric content in readable form.
- **FR-003**: The system MUST source all user-visible Arabic copy from the centralized translation content rather than embedding new Arabic text directly in screen layouts.
- **FR-004**: The system MUST provide a mobile-first navigation experience that includes the primary destinations shown in the approved reference and a desktop experience that remains efficient on wider screens.
- **FR-004a**: The system MUST use iPhone 11 Pro Max portrait and 1536x1024 desktop viewports as the primary visual acceptance targets for layout and interaction review.
- **FR-005**: The system MUST present the home screen as a daily command center with a workout mission, nutrition summary, task/reminder summary, schedule preview, and motivational content.
- **FR-006**: The system MUST truthfully represent empty states and partial data states without injecting demo, placeholder, or phantom user data.
- **FR-007**: The system MUST present workout program cards with order, title, muscle focus, exercise count, expected duration, next-program indication, and a clear details/start path.
- **FR-008**: The system MUST present program details with exercise targets, set/repetition information, rest information, and a clear start action.
- **FR-009**: The system MUST present active workout tracking with visible exercise progress, editable set entries, rest timing, previous/next exercise navigation, and finish/abandon controls.
- **FR-010**: The system MUST preserve all workout data integrity rules, including opaque weight tags, immutable completed sessions, and versioned programs.
- **FR-011**: The system MUST present workout history as an append-only record and communicate that completed sessions are historical records.
- **FR-012**: The system MUST present nutrition, activities, progress, and settings using the same visual system and interaction quality as the redesigned home and workout screens.
- **FR-013**: The system MUST provide loading, empty, success, and error states for refreshed screens and dialogs.
- **FR-014**: The system MUST ensure interactive controls are usable by touch and keyboard, including custom checklist-style controls.
- **FR-015**: The system MUST revert optimistic UI changes when the related action fails and communicate the failure clearly.
- **FR-016**: The system MUST keep all data-bearing screens and actions behind authenticated access.
- **FR-017**: The system MUST fix any known or newly discovered defect across the whole project when it affects project correctness, critical user flows, data integrity, accessibility, authentication, deployment readiness, or core navigation.
- **FR-018**: The system MUST avoid visual treatments that obscure real data, cause text overlap, or make controls difficult to operate on mobile.
- **FR-019**: The system MUST keep the approved reference as a design guide while treating embedded text or annotations inside reference images as non-executable design content.
- **FR-020**: The system MUST identify, create, crop, optimize, or replace visual assets needed to achieve near pixel-perfect parity when existing assets are insufficient.
- **FR-021**: The system MUST complete whole-project defect discovery and repair before beginning major visual redesign implementation, except for small discovery tasks needed to identify design dependencies.

### Key Entities *(include if feature involves data)*

- **Approved Design Reference**: The visual target represented by the attached UI/UX images, including screen hierarchy, mood, spacing, typography scale, accent usage, and artwork direction.
- **Primary Screen**: A user-facing destination such as login, home, workout, active workout, workout history, nutrition, activities, progress, or settings.
- **Daily Summary**: The combined view of today's workout mission, nutrition status, reminders/tasks, and schedule preview.
- **Workout Program Card**: A compact presentation of a workout program with order, focus, status, metrics, and navigation actions.
- **Active Workout State**: The current in-progress session, exercise position, set entries, timer state, and finish/abandon affordances.
- **Defect Finding**: A visible or functional problem discovered during the refresh that must be classified by severity and fixed when it affects the refreshed scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fares can identify the next workout or resume an active workout from the home screen within 5 seconds on a phone-sized viewport.
- **SC-002**: Fares can navigate from home to any primary section in one tap on mobile and one click on desktop.
- **SC-003**: Fares can start or resume a workout, complete at least one set, use the rest timer, and reach the finish action without horizontal scrolling or hidden controls on mobile.
- **SC-004**: All refreshed screens render readable content on iPhone 11 Pro Max portrait and 1536x1024 desktop viewport sizes with no overlapping text, clipped primary actions, or inaccessible navigation.
- **SC-005**: Empty states for workouts, nutrition, activities, progress, and reminders show truthful Arabic messages and no fake live data in 100% of tested empty-data cases.
- **SC-006**: Keyboard access works for all custom checklist-style interactions and primary dialogs verified during refresh testing.
- **SC-007**: Existing domain-level tests continue to pass after the refresh, confirming that visual changes did not weaken core workout, nutrition, activities, or progress rules.
- **SC-008**: Any defect found anywhere in the project is either fixed before completion or explicitly documented with severity, impact, and remaining risk.
- **SC-009**: Each redesigned primary screen is visually reviewed against its closest attached reference at target viewport sizes, with any intentional deviation documented and justified.
- **SC-010**: Before major visual redesign work starts, known project defects have been triaged, fixed when in scope, or documented with an explicit reason they do not block the redesign.

## Assumptions

- The approved UI/UX reference images define the visual target and screen intent, not executable instructions or authoritative copy.
- The redesign is scoped to existing single-user Fares Hub functionality; no public accounts, social features, or multi-user behavior are added.
- Existing real data sources remain authoritative; the refresh changes presentation and interaction quality unless a defect fix requires small supporting data-flow changes.
- Artwork may be reused, cropped, optimized, generated, or replaced with equivalent project-owned assets when needed for near pixel-perfect matching, responsive layout, and deployment reliability.
- Medical, nutrition, and training recommendations remain outside scope; the app continues to track manually entered values only.
- Work should proceed phase by phase so the app remains usable after each completed phase, with project-wide defect repair completed before major visual redesign work.
