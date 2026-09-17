# Implementation Plan: Phase 2 — Nutrition & Daily Calories

**Parent Feature**: `specs/003-phase2-nutrition/spec.md`  
**Target Architecture**: Next.js 15 App Router + Server Actions + Pure TypeScript Domain Layer + Neon Postgres + Drizzle ORM

---

## Technical Stack & Architecture

- **Domain Layer (`src/domain/nutrition/`)**:
  - Pure functions, 0 React dependencies, 100% unit-tested with Node `--test`.
  - Calculations for daily totals, remaining amounts, percentage completions, and TDEE reference formulas.
- **Data Access & Mutations (`src/server/`)**:
  - `nutrition-queries.ts`: Cached and direct queries for daily meals, active targets, and 7-day compliance overview.
  - `nutrition-actions.ts`: Authenticated Server Actions for meal logging, meal deletion, and target adjustments.
- **UI & Presentation (`src/ui/nutrition/` & `app/(app)/nutrition/`)**:
  - Pure RTL layout using Tailwind CSS logical properties (`ms-`, `me-`, `text-start`, `text-end`).
  - Egyptian Arabic copy exclusively loaded from `src/i18n/ar.ts`.
  - Tremor or custom SVG progress rings/bars styled with dark-mode aesthetic tokens.

---

## File Changes Overview

### Domain Layer (New)
- `src/domain/nutrition/types.ts`: Domain models (`MealEntry`, `NutritionTarget`, `DailyNutritionSummary`, `MacroProgress`).
- `src/domain/nutrition/nutrition-engine.ts`: Domain logic:
  - `calculateDailyTotals(meals: MealEntry[])`
  - `calculateMacroProgress(consumed: number, target: number)`
  - `calculateTDEE(weightKg, heightCm, age, activityFactor)`
- `src/domain/nutrition/__tests__/nutrition-domain.test.ts`: Automated tests for all edge cases (zero targets, zero meals, surplus).

### Localization
- `src/i18n/ar.ts`: Add comprehensive `nutrition` dictionary (macros, labels, buttons, dialog titles, placeholders, validations).

### Server Layer
- `src/server/nutrition-queries.ts`:
  - `getDailyNutrition(dateStr: string)`: Fetches meals and active target for the date, returning a complete `DailyNutritionSummary`.
  - `getNutritionTargets(dateStr: string)`: Fetches the target snapshot effective on that date.
- `src/server/nutrition-actions.ts`:
  - `logMealAction(input)`: Validates input with Zod, inserts meal into `meals`, revalidates paths.
  - `deleteMealAction(mealId)`: Removes meal from `meals`, revalidates paths.
  - `updateNutritionTargetsAction(input)`: Inserts new target into `nutrition_targets`, revalidates paths.

### UI Layer
- `src/ui/nutrition/MacroProgressCards.tsx`: Main cards displaying calories and macro rings/bars.
- `src/ui/nutrition/MealList.tsx`: Chronological list of meals with macro tags and delete actions.
- `src/ui/nutrition/AddMealModal.tsx`: Fast modal dialog for adding meals with inline validation.
- `src/ui/nutrition/EditTargetsModal.tsx`: Dialog for manually modifying daily calorie and macro goals.
- `src/ui/nutrition/TdeeCalculatorModal.tsx`: Informational formula calculator with "Apply as targets" confirmation.
- `src/ui/nutrition/DateNavigator.tsx`: Easy navigation between days.
- `src/ui/nutrition/NutritionView.tsx`: Client view orchestrator.
- `app/(app)/nutrition/page.tsx`: Server component providing initial data.
- `app/(app)/page.tsx`: Connect the home screen's "التغذية اليوم" section to live data.

---

## Verification Plan

1. **Domain Tests**:
   - Run `npx tsx --test src/domain/nutrition/__tests__/*.test.ts`
   - Test empty meals, exact match, surplus calories, TDEE edge cases.
2. **Production Build**:
   - Run `npm run build` to verify 0 TypeScript errors and successful Next.js route bundling.
3. **End-to-End User Flow**:
   - Set targets -> log breakfast meal -> check progress bars update -> log lunch -> delete meal -> verify totals decrement.
