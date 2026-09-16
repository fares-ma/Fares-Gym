# Implementation Plan: Phase 1 — Workout Tracking & Active Session

**Branch**: `002-phase1-workout` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-phase1-workout/spec.md`

## Summary

Implement the core Gym & Workout domain for Fares Hub:
1. Program catalog and dynamic schedule rotation engine (`Anterior A/B`, `Posterior A/B`).
2. Program details view with target sets, reps, rest, and opaque unit tags (`K`, `B`).
3. Pure domain logic (`src/domain/workout/`) for weight parsing, rotation calculation, and warm-up calculation.
4. Active Workout live logging UI with inline weight/reps adjustments, heating sets checklist, and working set logger.
5. Integrated rest countdown timer with audio/visual feedback.
6. Server Actions for starting, logging sets, and completing workout sessions into Neon PostgreSQL with immutable append-only history.
7. Egyptian Arabic RTL UI with full localized strings in `src/i18n/ar.ts`.

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode), Node.js 20+

**Primary Dependencies**: Next.js 15 (App Router, Server Actions), Tailwind CSS v4, Lucide React, Zod 3.24+

**Storage**: Neon Serverless PostgreSQL via Drizzle ORM (`drizzle-orm/neon-http`)

**Testing**: Unit tests for pure domain functions (`vitest` or Node test runner)

**Target Platform**: Web / Mobile PWA (responsive layout, mobile-first touch targets >= 44px)

**Project Type**: Next.js full-stack application (frontend + server actions)

**Performance Goals**: Active set logging response < 100ms; zero data loss on browser refresh.

**Constraints**:
- Weight unit tags `"K"` and `"B"` are opaque machine identifiers (never converted).
- Completed sessions are strictly append-only (immutable).
- Modifying a program bumps `version + 1`.
- Pure domain algorithms in `src/domain/workout/` with zero React dependencies.
- All UI strings in `src/i18n/ar.ts` (RTL layout using logical Tailwind properties).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status | Notes |
|---|---|---|---|
| I | Opaque Weight Units | PASS | Raw weight + unit tag preserved verbatim (`rawWeight`, `numericValue`, `unitTag`, `isUnitConfirmed`). |
| II | Immutable Completed Sessions | PASS | Completed sessions cannot be updated or deleted. |
| III | Program Versioning | PASS | Sessions reference `programId` and `programVersion`. Modifying program creates a new version. |
| IV | No Medical/Nutritional Advice | PASS | No automated prescription; all values come from user or seed data. |
| V | Explicit User Consent | PASS | All workout actions require explicit tap/button triggers. |
| VI | Neon Postgres Single Source of Truth | PASS | Drizzle ORM connected to Neon Postgres. |
| VII | Secrets in Env Only | PASS | Database credentials and secrets stay in `.env`. |
| VIII | Authenticated Endpoints Only | PASS | All workout actions and routes gated behind session cookie validation. |

## Project Structure

### Documentation (this feature)

```text
specs/002-phase1-workout/
├── spec.md                       # Feature specification
├── plan.md                       # Implementation plan (this file)
├── research.md                   # Research & technical decisions
├── data-model.md                 # Database schema & entity mappings
├── quickstart.md                 # Validation and run guide
├── checklists/
│   └── requirements.md           # Spec quality checklist
└── contracts/
    └── workout-contracts.md      # Server Actions and data contracts
```

### Source Code Architecture

```text
src/
├── domain/                       # PURE BUSINESS LOGIC (zero React dependencies)
│   └── workout/
│       ├── weight-parser.ts      # Parses "50K", "65k", "10B" into WeightValue
│       ├── rotation-engine.ts    # Determines "who's next" in 4-program cycle
│       └── warmup-engine.ts      # Calculates heating set suggestions
├── data/
│   ├── schema.ts                 # Drizzle pgTable definitions (already created)
│   └── db.ts                     # Neon Drizzle instance
├── server/
│   ├── workout-actions.ts        # Server Actions (startSession, logSet, completeSession)
│   └── workout-queries.ts        # Cached queries (getPrograms, getActiveSession, getHistory)
├── ui/
│   └── workout/
│       ├── ProgramCard.tsx       # Program summary card with next badge
│       ├── ExerciseItem.tsx      # Exercise target display row
│       ├── ActiveWorkoutView.tsx # Live logging screen
│       ├── SetEntryRow.tsx       # Inline set logger (weight, reps, status)
│       ├── RestTimer.tsx         # Integrated countdown timer
│       └── SessionHistoryCard.tsx# Read-only historical session viewer
└── i18n/
    └── ar.ts                     # Arabic UI strings dictionary

app/
└── (app)/
    └── workout/
        ├── page.tsx              # Main workout hub (programs + rotation + history tabs)
        ├── program/[id]/page.tsx # Program details view
        ├── active/page.tsx       # Active workout live session screen
        └── history/page.tsx      # Workout history list
```

## Structure Decision

Using the existing Next.js 15 unified directory layout:
- Domain logic isolated under `src/domain/workout/` for 100% testability.
- Server Actions under `src/server/` for secure data mutations.
- Reusable UI components under `src/ui/workout/`.
- App routes under `app/(app)/workout/`.
