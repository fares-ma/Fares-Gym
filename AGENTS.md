# Fares Hub — Agent Operational Rules

Read `SPEC.md` for full project requirements. This file contains the mandatory operational rules that must be enforced at all times.

## Project Overview
A personal single-user web hub for Fares (no multi-tenancy, no public accounts, no social features).
Tracks:
- Gym Workouts (programs, active sessions, history, progress)
- Nutrition & Daily Calories
- Schedule, Activities & Reminders
- Long-term Progress Metrics

## Technical Stack
- **Framework**: Next.js 15 (App Router) + Strict TypeScript
- **Styling & UI**: Tailwind CSS v4 + shadcn/ui design tokens + Tremor for analytics charts
- **Database & ORM**: Neon Serverless PostgreSQL + Drizzle ORM (`@neondatabase/serverless` + `drizzle-orm/neon-http`)
- **Validation**: Zod for all inputs and schemas
- **Authentication**: Custom lightweight session-based auth: `bcryptjs` hashing + HTTP-only signed session cookie. (Single user: `fares`)
- **Hosting**: Vercel (Hobby tier, free serverless deployment with automated GitHub integration)
- **PWA**: Installable web application with offline-friendly static caching

## Strict Data Integrity Rules (Non-Negotiable)
1. **Weight Notation & Opaque Tags**:
   - Every weight is stored as a structured object: `{ rawWeight: string, numericValue: number, unitTag: string, isUnitConfirmed: boolean }`.
   - Unit tags `"K"` and `"B"` are **opaque machine identifiers** (gym-specific pin/stack notations). They must NEVER be converted to kg/lbs or mixed in calculations/charts with other tags for the same exercise.
2. **Completed Sessions are Immutable**:
   - Once a `WorkoutSession` status is `completed`, it cannot be altered or deleted.
   - History is strictly **append-only**. Any correction is recorded as a new audit entry, never an in-place overwrite.
3. **Workout Program Versioning**:
   - Any modification to an existing `WorkoutProgram` creates a new version (`version + 1`).
   - Historical sessions remain linked to the exact program version in effect when the session occurred. Modifying a program never rewrites session history.
4. **No Automated Medical or Fitness Prescriptions**:
   - Never generate or auto-apply calorie goals, macro targets, or medical/training advice without manual input from Fares.
   - Any TDEE/calorie calculators must be presented only as editable standard formulas, never auto-enforced.
5. **Single Source of Truth**:
   - Neon Cloud PostgreSQL is the sole source of truth.
   - Database secrets and keys must stay in environment variables only (`.env`). Never commit secrets to Git.
6. **Route Protection**:
   - Every app screen and API route dealing with user data must sit behind session authentication.

## Development Protocols
- **Phased Delivery**: Work strictly phase-by-phase following the Roadmap in `SPEC.md`. Complete and verify one phase before beginning the next.
- **Pre-Code Communication**: Before creating or modifying files, list what will be touched and why.
- **Domain Logic Separation**: Pure domain algorithms (weight parser, warm-up engine, program rotation, progress math) reside in `src/domain/` as pure TypeScript functions with zero React dependencies and dedicated unit tests.
- **User Interface Language**: The web application UI is Egyptian Arabic (RTL layout using logical start/end properties). Exercise names remain in English. All UI strings reside in `src/i18n/ar.ts` (no hardcoded Arabic text inside UI components).
- **Documentation & Spec Language**: All technical specs, plans, tasks, architecture docs, and code comments are written in clear, structured English to ensure clean formatting and readability across all IDEs and tools.
