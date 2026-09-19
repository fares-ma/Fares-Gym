# Tasks: Pre-Deploy Fixes & Production Hardening

**Input**: Design documents from `/specs/007-pre-deploy-fixes/`  
**Prerequisites**: `spec.md`, `plan.md`  
**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`
- `[P]`: Can run in parallel (different files, no shared dependencies)
- `[Story]`: User story mapping (US1 = Auth, US2 = Data Truth, US3 = Performance, US4 = Design/PWA, US5 = Timezone/Versioning)

---

## Phase 1: Setup & Tooling Hygiene

**Purpose**: Dependency alignment, non-interactive linting, and production environment fail-fast validation.

- [ ] T001 Synchronize and verify Next.js package version consistency (`package.json` and `node_modules`).
- [ ] T002 [P] Create ESLint configuration (`eslint.config.mjs`) compatible with Next.js 15, ensure non-interactive `npm run lint` exits 0, and re-enable linting in `next.config.ts`.
- [ ] T003 [P] Create `src/server/env.ts` with strict Zod validation that fails fast at startup in production if `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, or `ADMIN_USERNAME` are missing or default.

---

## Phase 2: Database & Migrations Foundation

**Purpose**: Schema indexes, foreign keys, and repeatable Drizzle migrations.

- [ ] T004 Add PostgreSQL indexes in `src/data/schema.ts` on `performed_sets(session_id)`, `performed_sets(exercise_id)`, `workout_sessions(status, completed_at)`, and `meals(date)`.
- [ ] T005 Run `npm run db:generate` to produce tracked SQL migration files under `src/data/migrations`.

---

## Phase 3: User Story 1 - Instant & Reliable Authentication (Priority: P1)

**Goal**: Fix login lag, false rate-limit lockouts, cookie/redirect delays, and sanitize logs.

- [ ] T006 [US1] Sanitize auth error logging in `src/server/auth.ts` (remove password hash length/prefix logs in production).
- [ ] T007 [US1] Add periodic retention/purge for stale rows in `login_attempts` to avoid table bloating and fix shared-IP false lockouts in `src/server/auth.ts`.
- [ ] T008 [US1] Update `app/(auth)/login/page.tsx` to eliminate the arbitrary 500ms `setTimeout(window.location.href)` delay, replacing it with immediate client router navigation.
- [ ] T009 [P] [US1] Tighten `middleware.ts` path exclusion regex so `pathname.includes(".")` does not allow arbitrary path bypasses.

---

## Phase 4: User Story 2 - Accurate Data Presentation & Zero Phantom Data (Priority: P1)

**Goal**: Eliminate all hardcoded demo numbers and ensure active workout state never resets.

- [ ] T010 [US2] Remove hardcoded fallback demo values (`1450`, `2200`, `90`, `180`, `40`, `2`) from `src/ui/NutritionSnapshotCard.tsx`, support genuine 0 and empty states, and guard against division by zero (`NaN%`).
- [ ] T011 [US2] Remove phantom fallback (`let nextProgramName = "Posterior A"; let exerciseCount = 8;`) from `app/(app)/page.tsx` and render a dedicated empty state if no programs exist.
- [ ] T012 [US2] Lift active set entries state into `src/ui/workout/ActiveWorkoutView.tsx` with callbacks to `SetEntryRow.tsx` to guarantee completed sets and weights persist across exercise navigation.

---

## Phase 5: User Story 3 - High-Performance Navigation on Vercel (Priority: P1)

**Goal**: Cut redundant server queries and eliminate in-memory table scans.

- [ ] T013 [US3] Refactor `src/server/progress-queries.ts` (`getProgressSummary`) to fetch completed sessions and performed sets in a single unified pass, eliminating 3 duplicate full-table scans.
- [ ] T014 [US3] Optimize `src/server/settings-queries.ts` (`getAppSettingsSummary`) to count opaque tags via SQL aggregation instead of streaming all performed set rows into Node memory.
- [ ] T015 [US3] Replace silent empty-data swallowing in `progress-queries.ts` and `page.tsx` with structured error handling.

---

## Phase 6: User Story 4 - Consistent Comic Theme, Design Tokens & Clean PWA Icons (Priority: P2)

**Goal**: Unify macro tracking colors, fix sidebar active highlight, and generate true 1:1 PWA icons.

- [ ] T016 [US4] Unify macro tracking colors across `src/ui/nutrition/MacroProgressCards.tsx` to match the Dark Comic theme (Burgundy `#A83252`, Gold `#D6AA63`, Cream `#E4D4C8`) and remove out-of-palette orange/purple buttons.
- [ ] T017 [US4] Fix active link matching in `src/ui/Sidebar.tsx` so `/workout` is not active when viewing `/workout/history`.
- [ ] T018 [US4] Generate square 1:1 maskable PWA icons (192×192 and 512×512) for `public/manifest.json` from the avatar asset to prevent mobile home-screen distortion.
- [ ] T019 [US4] Fix character face assets (`character/faces/sleepy.png` and `character/faces/surprised.png`) to be true headshots rather than full-body poses.
- [ ] T020 [US4] Add support for `top` and `bottom` directions in `src/ui/MiniFares.tsx` and use logical RTL properties (`end-6`) in `src/ui/SpeechBubble.tsx`.

---

## Phase 7: User Story 5 - True Timezone & Program Versioning Invariants (Priority: P2)

**Goal**: Cairo-aligned time calculations and non-destructive program versioning.

- [ ] T021 [US5] Implement `createWorkoutProgramVersionAction` in `src/server/workout-actions.ts` to clone and save a program with `version + 1` while preserving previous version links for historical sessions.
- [ ] T022 [US5] Fix `src/lib/useRandomQuote.ts` to use deterministic UTC/Cairo hours, eliminating React hydration mismatches.
- [ ] T023 [US5] Fix `src/ui/nutrition/DateNavigator.tsx` to use Cairo-local date math instead of UTC `toISOString()`.
- [ ] T024 [US5] Fix `app/(app)/workout/page.tsx` start time formatting by passing explicit `timeZone: "Africa/Cairo"`.
- [ ] T025 [US5] Fix weekly streak calculation in `src/domain/progress/progress-engine.ts` to align with Egyptian calendar weeks (Saturday to Friday).
- [ ] T026 [US5] Centralize remaining hardcoded English strings into `src/i18n/ar.ts` (login button, today's mission, secure entry).

---

## Phase 8: Final Deployment Gate & Verification

**Purpose**: End-to-end quality validation prior to Vercel deployment.

- [ ] T027 Run `npm run test:domain` (all 35+ unit tests pass).
- [ ] T028 Run `npx tsc --noEmit` (clean TypeScript compilation).
- [ ] T029 Run `npm run lint` (clean ESLint pass with zero warnings/errors).
- [ ] T030 Run `npm run build` (Next.js production build succeeds with linting enabled).
- [ ] T031 Verify login flow, dashboard loading, and workout logging end-to-end.
