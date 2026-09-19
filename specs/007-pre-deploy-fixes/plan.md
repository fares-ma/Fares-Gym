# Implementation Plan: Pre-Deploy Fixes & Production Hardening

**Branch**: `007-pre-deploy-fixes` | **Date**: 2026-09-18 | **Spec**: [specs/007-pre-deploy-fixes/spec.md](file:///c:/Users/Fares/Desktop/Gym/specs/007-pre-deploy-fixes/spec.md)

## Summary
Reconcile and resolve all critical defects, performance bottlenecks, and design inconsistencies identified across the independent Pre-Deploy Code Review by Codex and our comprehensive codebase audit. Key changes include:
1. Hardening authentication & session stability (fixing lag, false lockouts, and client redirects).
2. Generating and committing Drizzle database migrations and adding crucial PostgreSQL indexes.
3. Eliminating redundant DB queries and full-table scans on `/progress` and `/settings`.
4. Removing all hardcoded phantom seed data from dashboard views and fixing division-by-zero risks.
5. Lifting active workout set completion state to guarantee cross-exercise state persistence.
6. Implementing the required Program Versioning creation workflow (`version + 1`).
7. Generating true 1:1 square maskable PWA icons and fixing character face avatars.
8. Harmonizing macro tracking colors (Burgundy, Gold, Cream) across Home and Nutrition views.
9. Enforcing Cairo timezone invariance and resolving SSR/client React hydration mismatches.
10. Adding ESLint configuration for non-interactive CI/build execution and dependency synchronization.

---

## Technical Context

**Language/Version**: TypeScript 5.7.3 (Strict mode), Node.js 20+  
**Primary Dependencies**: Next.js 15.1.11, React 19, Drizzle ORM 0.39.1, `@neondatabase/serverless` 0.10.0, Tailwind CSS v4, Lucide React 0.475.0, Zod 3.24.1, bcryptjs 3.0.3  
**Storage**: Neon Serverless PostgreSQL (`drizzle-orm/neon-http`)  
**Testing**: Node test runner via `tsx --test` (Domain suites), TypeScript type-checking (`tsc --noEmit`), Next.js production build (`next build`), ESLint (`eslint`)  
**Target Platform**: Vercel Serverless (Hobby tier), mobile & desktop browsers, installable PWA  
**Project Type**: Single-user personal web application (Arabic RTL layout)  
**Performance Goals**: Page transitions under 300ms, initial load JS under 130 kB, zero redundant HTTP query roundtrips  
**Constraints**: Zero automated medical/fitness advice, opaque weight unit tags ("K" / "B") strictly preserved, completed sessions strictly immutable, single user only  

---

## Constitution Check

| Principle / Rule | Compliance Status | Mitigation in this Plan |
|---|---|---|
| **Weight Notation & Opaque Tags** | ✅ Compliant | Opaque unit tags ("K" and "B") preserved and kept segregated across charts. |
| **Completed Sessions are Immutable** | ✅ Compliant | Server actions enforce `status === 'in_progress'` prior to mutating set entries. |
| **Workout Program Versioning** | ⚠️ Incomplete | Plan implements `createWorkoutProgramVersionAction` creating `version + 1` on edits without altering historical sessions. |
| **No Automated Prescriptions** | ⚠️ Violated by defaults | Plan removes hardcoded fallback targets (1450 kcal, 90g protein, etc.) from `NutritionSnapshotCard`. |
| **Single Source of Truth** | ✅ Compliant | Neon Cloud PostgreSQL remains sole source of truth; production secrets validated at startup. |
| **Route Protection** | ✅ Compliant | Layout and server actions require active authenticated session. Regex added to middleware to close dot-path bypass. |
| **Timezone Invariance (`APP_TIMEZONE`)** | ⚠️ Partial issues | Plan fixes `toLocaleTimeString` missing Cairo timezone, removes `toISOString()` UTC reliance in `DateNavigator`, and aligns week streak calculation. |
| **Empty State Integrity (No Phantom Seed Data)** | ⚠️ Violated by defaults | Plan eliminates "Posterior A / 8 exercises" fallback in `HomePage` and fallback macro numbers in `NutritionSnapshotCard`. |

---

## Project Structure

```text
specs/007-pre-deploy-fixes/
├── spec.md
├── plan.md
└── tasks.md

src/
├── data/
│   ├── db.ts                          # Production fail-fast env checks
│   ├── schema.ts                      # Add indexes on foreign keys & dates
│   ├── migrations/                    # [NEW] Generated Drizzle migration SQL
│   └── seed.ts                        # Seed execution
├── domain/
│   ├── progress/
│   │   └── progress-engine.ts         # Saturday-aligned week streak math
│   └── workout/
│       └── types.ts
├── lib/
│   ├── date-utils.ts                  # Cairo-aware date math & formatting
│   ├── useRandomQuote.ts              # Deterministic quote rotation without hydration mismatch
│   └── validations.ts
├── server/
│   ├── env.ts                         # [NEW] Strict production environment schema & validator
│   ├── auth.ts                        # Rate limit cleanup & sanitized logs
│   ├── session.ts                     # Session expiry & sliding window
│   ├── workout-actions.ts             # Program versioning action (version + 1)
│   ├── workout-queries.ts             # Indexed queries
│   ├── progress-queries.ts            # Consolidated single-pass DB query
│   └── settings-queries.ts            # SQL aggregation for tag counts
└── ui/
    ├── MiniFares.tsx                  # Clean face avatars & top/bottom speech bubble
    ├── SpeechBubble.tsx               # Logical RTL tail properties
    ├── Sidebar.tsx                    # Fix active link matching (/workout vs /workout/history)
    ├── ThemeToggle.tsx                # Clear theme display component
    ├── NutritionSnapshotCard.tsx      # Zero-safe macro rendering without fake defaults
    ├── nutrition/
    │   ├── DateNavigator.tsx          # Cairo-safe calendar stepper
    │   ├── MacroProgressCards.tsx     # Unified Dark Comic colors (Burgundy/Gold/Cream)
    │   └── NutritionView.tsx          # Harmonize button colors (remove orange/purple)
    ├── progress/
    │   └── WorkoutVolumeChart.tsx     # Unit-tag segregated analytics
    └── workout/
        ├── ActiveWorkoutView.tsx      # Lifted set entries state
        └── SetEntryRow.tsx            # Responsive mobile layout
```
