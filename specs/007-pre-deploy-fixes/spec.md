# Feature Specification: Pre-Deploy Fixes & Production Hardening

**Feature Branch**: `007-pre-deploy-fixes`  
**Created**: 2026-09-18  
**Status**: Draft  
**Input**: Comprehensive Code Review & Codex Pre-Deploy Audit reconciliation to resolve all deployment, performance, design, image, and reliability bugs for Vercel production readiness.

## User Scenarios & Testing

### User Story 1 - Instant & Reliable Authentication (Priority: P1)
As Fares, when I open Fares Hub on desktop or mobile and enter my credentials, I want to authenticate instantly without hanging, infinite loading, false rate-limit lockouts, or redirect loops, so that I can immediately access my personal dashboard.

**Why this priority**: Authentication is the gatekeeper of the entire private hub. If login hangs or locks out Fares due to rate-limit or session issues, the entire app is unusable.

**Independent Test**:
Can be fully tested by submitting correct credentials on the login screen, verifying immediate session establishment, cookie storage, fast redirect to home, and testing multiple requests without false rate limiting.

**Acceptance Scenarios**:
1. **Given** valid credentials, **When** Fares clicks "دخول", **Then** the session is created and the user is redirected to the home dashboard within 1 second.
2. **Given** an invalid attempt, **When** incorrect credentials are submitted, **Then** an explicit Arabic error message is displayed, and failed attempts are cleared upon subsequent successful login.
3. **Given** an expired session, **When** visiting any protected route, **Then** the user is redirected cleanly to `/login` without infinite redirect loops.

---

### User Story 2 - Accurate Data Presentation & Zero Phantom Data (Priority: P1)
As Fares, when I open the home dashboard, workout hub, or nutrition tracker, I want all displayed values to strictly reflect my real logged data (or clear Arabic empty states if nothing has been recorded today), so that I am never misled by hardcoded demo numbers or phantom targets.

**Why this priority**: Violating data integrity with fake calories (1450 kcal) or default programs when the database is empty destroys trust and breaks the foundational project invariant (*Empty State Integrity*).

**Independent Test**:
Can be fully tested on a fresh day or empty database: the home dashboard displays real 0/empty counters and dedicated empty-state messages instead of hardcoded numbers like 1450 kcal or 90g protein.

**Acceptance Scenarios**:
1. **Given** zero logged meals for today, **When** viewing the home dashboard or nutrition page, **Then** calories consumed shows 0 and macro bars show 0%, with zero division-by-zero (`NaN%`) errors.
2. **Given** an empty programs database, **When** viewing the home page, **Then** a clean empty state is shown instead of falling back to "Posterior A".
3. **Given** an active workout session, **When** marking a set completed, switching to another exercise and returning, **Then** the set remains marked as completed without resetting visually.

---

### User Story 3 - High-Performance, Lag-Free Navigation on Vercel (Priority: P1)
As Fares, when I navigate between Dashboard, Workouts, Nutrition, Activities, and Progress on Vercel, I want pages to load smoothly under 500ms without lag, freezing, or multiple redundant database roundtrips.

**Why this priority**: Vercel serverless functions incur high latency when sequential unindexed queries and duplicate table scans are performed across Neon PostgreSQL over HTTP.

**Independent Test**:
Can be tested by measuring page load times and verifying that `/progress` executes single consolidated queries rather than scanning `performed_sets` multiple times.

**Acceptance Scenarios**:
1. **Given** historical workout sessions, **When** navigating to `/progress`, **Then** data is loaded in a single parallel query phase without duplicate scans of `performed_sets`.
2. **Given** active workouts, **When** searching sets or sessions, **Then** database queries use PostgreSQL indexes rather than sequential table scans.
3. **Given** settings page, **When** loading system diagnostics, **Then** tag counts are computed via database aggregation instead of streaming all historical sets into JavaScript memory.

---

### User Story 4 - Consistent Comic Theme, Design Tokens & Clean PWA Icons (Priority: P2)
As Fares, when using the app on mobile and desktop, I want the visual identity to look premium and consistent (Burgundy, Gold, Cream dark comic palette) across all pages, with properly scaled character art and undistorted PWA home-screen icons.

**Why this priority**: Visual inconsistencies (like green/orange/blue macro bars on Nutrition vs Burgundy/Gold on Home, or stretched rectangular PWA icons on mobile) degrade user experience.

**Independent Test**:
Can be tested on mobile viewport (360px-390px) and home-screen install: icons are crisp and 1:1 square, macro color tokens are unified, and the sidebar accurately highlights only the current active link.

**Acceptance Scenarios**:
1. **Given** macro tracking, **When** viewing protein, carbs, and fats on both Home and Nutrition pages, **Then** both pages use the exact same unified color system.
2. **Given** navigation in the sidebar, **When** viewing `/workout/history`, **Then** only "سجل التمارين" is highlighted, not both "التمارين" and "سجل التمارين".
3. **Given** PWA manifest and character avatars, **When** installing on mobile or viewing avatar circles, **Then** avatars are properly framed square images and face poses contain only the head/face rather than shrunken full bodies.

---

### User Story 5 - True Timezone & Program Versioning Invariants (Priority: P2)
As Fares, when I log workouts, view quotes, or edit workout programs, I want Cairo timezone (`Africa/Cairo`) to govern all day boundaries and streak calculations, and any program modification to create a new version without altering past workout history.

**Why this priority**: Required by non-negotiable project invariants in `AGENTS.md` (Timezone Invariance & Program Versioning).

**Independent Test**:
Can be tested by modifying a program and verifying that completed historical sessions retain their original version, and verifying that quote rotation and calendar dates do not suffer from hydration mismatches.

**Acceptance Scenarios**:
1. **Given** any program edit, **When** saved, **Then** a new program version (`version + 1`) is created and past completed sessions still point to the previous version.
2. **Given** hydration on client, **When** loading quote banners, **Then** server and client render identical quotes with zero React hydration warnings.
3. **Given** weekly streak metrics, **When** calculated, **Then** weeks are evaluated according to Cairo local calendar weeks (Saturday to Friday) rather than arbitrary Unix epoch Thursday boundaries.

---

## Edge Cases

- **Cold Start & Database Latency**: How does the app behave if Neon PostgreSQL is waking up from a cold suspend? Explicit loading/error boundaries must inform the user rather than showing phantom default data.
- **Midnight Boundary in Cairo**: What happens between 00:00 and 03:00 Cairo time when UTC is still the previous calendar day? Calendar helpers must strictly resolve to Cairo date strings.
- **Zero Target Division**: What happens when a user has not yet set nutrition targets? Calculations must return 0% progress rather than `NaN%` or `Infinity`.
- **Duplicate Poses / Faces**: How does `MiniFares` behave if a missing face or pose is requested? It must safely fallback to a valid default without broken image icons.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide deterministic database migrations in `src/data/migrations` executable via `npm run db:generate` and `npm run db:push`.
- **FR-002**: System MUST add PostgreSQL indexes on `performed_sets(session_id)`, `performed_sets(exercise_id)`, `workout_sessions(status, completed_at)`, and `meals(date)`.
- **FR-003**: System MUST fail fast at startup in production if essential environment variables (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, `ADMIN_USERNAME`) are missing or using placeholder values.
- **FR-004**: System MUST eliminate all hardcoded fallback demo numbers in `NutritionSnapshotCard` and `HomePage`, strictly displaying 0 or dedicated empty states.
- **FR-005**: System MUST lift set entry state in `ActiveWorkoutView` to ensure set completion and weight adjustments persist when switching between exercises.
- **FR-006**: System MUST optimize `/progress` server queries by eliminating duplicate table scans and fetching sessions and performed sets in a unified single pass.
- **FR-007**: System MUST replace full-table in-memory scanning in `getAppSettingsSummary` with efficient SQL aggregations.
- **FR-008**: System MUST support creating a new workout program version (`version + 1`) when modifying an existing program, preserving all historical sessions linked to earlier versions.
- **FR-009**: System MUST generate square 1:1 maskable PWA icons (192×192 and 512×512) and fix facial character assets (`sleepy.png`, `surprised.png`) to be true facial headshots.
- **FR-010**: System MUST harmonize macro colors (Burgundy, Gold, Cream) across Home and Nutrition views.
- **FR-011**: System MUST fix `useRandomQuote` to ensure zero hydration mismatches between SSR and client.
- **FR-012**: System MUST configure non-interactive ESLint for Next 15 and ensure `npm run lint` and `npm run build` pass cleanly.
- **FR-013**: System MUST correct the active item matching in `Sidebar.tsx` so sub-paths do not highlight parent items concurrently.
- **FR-014**: System MUST localize remaining hardcoded English UI strings into `src/i18n/ar.ts`.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of automated tests pass (`npm run test:domain`, `npx tsc --noEmit`, `npm run lint`, `npm run build`).
- **SC-002**: Zero hardcoded phantom data appears when loading the app with empty database tables.
- **SC-003**: Total server queries on `/progress` reduced from 7 queries with 3 full-table scans to 3 targeted indexed queries.
- **SC-004**: Zero React hydration mismatch errors in browser console on initial page load.
- **SC-005**: PWA icons render without distortion or cropping warnings on mobile devices.
- **SC-006**: Login completes in under 1 second without hanging or false rate-limit lockouts.
