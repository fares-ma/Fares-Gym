# Implementation Plan: UI Refresh and Reliability Fixes

**Branch**: `[008-ui-refresh-bugfixes]` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-ui-refresh-bugfixes/spec.md`

## Summary

Deliver a reliability-first refresh of Fares Hub: audit and fix known defects across the whole project before beginning the major visual redesign, then rebuild the primary authenticated screens and login screen to near pixel-perfect parity with the approved `chatgbt-uiux` references. Acceptance is centered on the user's real devices and references: iPhone 11 Pro Max portrait and 1536x1024 desktop. The implementation will preserve the current single-user data model, authentication boundary, Arabic RTL interface, domain invariants, and real-data behavior.

## Technical Context

**Language/Version**: TypeScript 5.7.3 with strict mode, React 19, Next.js 15.1.11 App Router

**Primary Dependencies**: Next.js, React, Tailwind CSS v4, Drizzle ORM, Neon Serverless PostgreSQL driver, Zod, bcryptjs, lucide-react, clsx, tailwind-merge, sharp

**Storage**: Neon Serverless PostgreSQL via Drizzle ORM; project-owned static and character assets under `public/`

**Testing**: ESLint for `app/` and `src/`; Node/tsx domain tests via `npm run test:domain`; production build via `npm run build`; browser visual validation at iPhone 11 Pro Max portrait and 1536x1024 desktop

**Target Platform**: Vercel-hosted single-user PWA for authenticated desktop and mobile web use, with iPhone 11 Pro Max as the primary personal mobile target

**Project Type**: Single Next.js web application with integrated frontend, server actions, route protection, Drizzle data access, and pure domain modules

**Performance Goals**: Primary screens remain responsive on mobile; first useful screen content appears without layout shifts that hide primary actions; optimized image assets avoid visibly delayed or broken hero/card artwork during normal network conditions

**Constraints**: No hardcoded Arabic UI copy outside `src/i18n/ar.ts`; no demo or phantom live data; data-bearing screens/actions stay authenticated; completed workout sessions remain immutable; workout program history remains versioned; weight unit tags remain opaque; no medical, nutrition, or training prescriptions are introduced

**Scale/Scope**: Single-user personal hub covering login, home, workout list, program details, active workout, workout history, nutrition, activities, progress, settings, shared shell/navigation, static visual assets, and whole-project defect repair before redesign

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Opaque Weight Units**: PASS. The feature does not change weight storage or calculations; any workout UI work must display `rawWeight` and keep tag separation intact.
- **Immutable Completed Sessions**: PASS. The plan requires history to remain append-only and completed sessions not to be edited or deleted.
- **Program Versioning**: PASS. Redesign may expose program details but must not alter versioning rules or retroactively modify session history.
- **No Medical / Nutritional Advice**: PASS. Nutrition redesign is presentation-only for manually entered meals and targets.
- **Explicit User Consent**: PASS. The feature introduces no background persistence of user-authored notes or AI memory.
- **Neon Postgres Source of Truth + Mandatory Backup**: PASS. Plan follows the current constitution and treats old SQLite text in `SPEC.md` as superseded.
- **Secrets in Environment Variables Only**: PASS. No secret handling changes are planned except defect fixes if audit finds violations.
- **Authenticated Endpoints Only**: PASS. Auth boundary validation is part of the defect-first phase.
- **Stack Constraints**: PASS. The existing Next.js/Tailwind/Drizzle/Neon architecture remains in place.
- **Development Workflow**: PASS. Work is phased, starts with defect repair, and ends with validation and manual test guidance.
- **Language & RTL**: PASS. All new user-visible Arabic strings must be centralized in `src/i18n/ar.ts` and rendered RTL.

No constitution violations are expected.

## Project Structure

### Documentation (this feature)

```text
specs/008-ui-refresh-bugfixes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-acceptance-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── (auth)/login/page.tsx
├── (app)/layout.tsx
├── (app)/page.tsx
├── (app)/workout/
├── (app)/nutrition/
├── (app)/activities/
├── (app)/progress/
├── (app)/settings/
├── globals.css
└── layout.tsx

src/
├── domain/
├── server/
├── data/
├── i18n/ar.ts
├── lib/
│   └── design-tokens.ts
└── ui/
    ├── workout/
    ├── nutrition/
    ├── activities/
    ├── progress/
    ├── settings/
    └── shared visual shell/components

public/
├── character/
└── ui/design-reference-derived assets

chatgbt-uiux/
├── pages/
└── fares-faces/
```

**Structure Decision**: Use the existing single Next.js app structure. Keep shared visual primitives in `src/ui/` and domain logic in `src/domain/`. Treat `chatgbt-uiux/` as read-only design reference input; production-ready derived or optimized assets belong under `public/`.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design & Contracts

See [data-model.md](./data-model.md), [contracts/ui-acceptance-contract.md](./contracts/ui-acceptance-contract.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- **Opaque Weight Units**: PASS. Data model and UI contract explicitly preserve raw opaque tags.
- **Immutable Completed Sessions**: PASS. Workout history acceptance requires read-only completed records.
- **Program Versioning**: PASS. Program detail redesign is presentation-only unless a later feature explicitly handles editing with version creation.
- **No Medical / Nutritional Advice**: PASS. Nutrition cards and calculators must remain manually applied and clearly non-prescriptive.
- **Explicit User Consent**: PASS. No automatic personal note or memory persistence is introduced.
- **Neon Postgres Source of Truth + Mandatory Backup**: PASS. No alternate live data store is introduced.
- **Secrets in Environment Variables Only**: PASS. Defect audit includes secret leakage checks.
- **Authenticated Endpoints Only**: PASS. UI acceptance contract includes auth gating checks.
- **Stack Constraints**: PASS. No stack change is proposed.
- **Development Workflow**: PASS. Defect-first phase precedes major visual redesign, with manual validation scripts documented.
- **Language & RTL**: PASS. UI acceptance contract requires centralized Arabic strings and RTL review.

## Complexity Tracking

No constitution violations require justification.
