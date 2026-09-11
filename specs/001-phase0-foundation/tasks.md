# Tasks: Phase 0 — Foundation

**Input**: Design documents from `/specs/001-phase0-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 15 project (App Router) with Tailwind CSS v4 in `/` (root)
- [X] T002 [P] Configure standard `shadcn/ui` components setup and `lucide-react`
- [X] T003 [P] Add `tremor` for future chart readiness in `tailwind.config.ts` (if v4 config needs adjustments)
- [X] T004 Install validation and auth dependencies (`zod`, `argon2`)

---

## Phase 2: Foundational (Blocking Prerequisites) - User Story 3 (DB Init)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Install `better-sqlite3`, `drizzle-orm`, and `drizzle-kit`
- [X] T006 Create DB connection in `src/data/db.ts`
- [X] T007 [US3] Create Drizzle schema for `sessions` and `app_settings` in `src/data/schema.ts`
- [X] T008 [US3] Create `drizzle.config.ts` for migrations and DB setup
- [X] T009 Add `db:push` and `db:generate` scripts to `package.json`

**Checkpoint**: Foundation ready - DB setup works, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Login (Priority: P1) 🎯 MVP

**Goal**: Secure, custom session-cookie based authentication using Argon2.

**Independent Test**: User can log in with correct env-based credentials, session persists, rate limits apply, and invalid attempts show errors.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create validation schemas in `src/lib/validations.ts` for login form
- [X] T011 [P] [US1] Create password hashing and verification utilities using argon2 in `src/server/hash.ts`
- [X] T012 [US1] Create Session management functions (create, validate, destroy) in `src/server/session.ts`
- [X] T013 [US1] Create Server Actions for login and logout in `src/server/auth-actions.ts`
- [X] T014 [US1] Implement Auth Middleware to protect routes in `src/middleware.ts`
- [X] T015 [US1] Build the Login UI page in `app/(auth)/login/page.tsx`
- [X] T016 [US1] Implement rate limiting for failed login attempts (in-memory or DB)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (Login flow works end-to-end)

---

## Phase 4: User Story 2 - App Shell with RTL Layout (Priority: P1)

**Goal**: Establish the RTL layout, Sidebar/Bottom nav, and dark/light theme persistence.

**Independent Test**: Layout renders correctly in RTL across desktop/mobile, theme toggles and persists, Arabic text is used.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create centralized Egyptian Arabic localization file in `src/i18n/ar.ts`
- [X] T018 [P] [US2] Create theme toggle and persistence logic (AppSettings DB or cookies) in `src/lib/theme.ts`
- [X] T019 [P] [US2] Create Sidebar component for desktop in `src/ui/Sidebar.tsx`
- [X] T020 [P] [US2] Create Bottom Nav component for mobile in `src/ui/BottomNav.tsx`
- [X] T021 [US2] Update `app/layout.tsx` to set `dir="rtl"` and inject basic theme providers
- [X] T022 [US2] Create the authenticated layout shell `app/(app)/layout.tsx` tying Sidebar and Bottom Nav

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Layout adapts to screen size.

---

## Phase 5: User Story 4 - Home Page Placeholder (Priority: P2)

**Goal**: Display time-aware greeting and structural placeholders for future features.

**Independent Test**: Greeting says "صباح الخير" or "مساء الخير" based on time. Placeholder cards render correctly.

### Implementation for User Story 4

- [X] T023 [P] [US4] Create time-aware greeting utility function in `src/lib/utils.ts`
- [X] T024 [US4] Create Home page UI with greeting in `app/(app)/page.tsx`
- [X] T025 [US4] Add placeholder cards (Gym, Nutrition, Activities) using shadcn Card components in `app/(app)/page.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T026 Code cleanup and strict type verification (`tsc --noEmit`)
- [X] T027 Run quickstart.md validation scenarios to ensure 100% compliance
- [X] T028 Ensure no hardcoded English strings exist in UI components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (Auth) must be done first so Layout (US2) and Home (US4) can be accessed behind the auth wall.

### Parallel Opportunities

- DB setup (T005-T009) can run immediately after Next.js initialization.
- Auth utilities (schemas, hashing) can be built in parallel.
- UI components (Sidebar, BottomNav) can be built in parallel with backend logic.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Auth)
4. **STOP and VALIDATE**: Test User Story 1 independently (Login flow)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Auth (US1) → Test independently
3. Add Layout Shell (US2) → Test independently
4. Add Home Placeholder (US4) → Test independently
