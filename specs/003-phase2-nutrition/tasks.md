# Implementation Tasks: Phase 2 — Nutrition & Daily Calories

**Feature**: Phase 2 — Nutrition (`specs/003-phase2-nutrition/spec.md`)  
**Implementation Plan**: `specs/003-phase2-nutrition/plan.md`

## Phase 1: Domain Foundation & Types
- [x] T001 Define domain types in `src/domain/nutrition/types.ts`
- [x] T002 Implement calculation engine (`calculateDailyTotals`, `calculateMacroProgress`, `calculateTDEE`) in `src/domain/nutrition/nutrition-engine.ts`
- [x] T003 Create comprehensive unit tests in `src/domain/nutrition/__tests__/nutrition-domain.test.ts`
- [x] T004 Add Arabic translations for Nutrition in `src/i18n/ar.ts`

## Phase 2: Server Layer (Queries & Actions)
- [x] T005 Implement `src/server/nutrition-queries.ts` (`getDailyNutrition`, `getNutritionTargets`)
- [x] T006 Implement `src/server/nutrition-actions.ts` (`logMealAction`, `deleteMealAction`, `updateNutritionTargetsAction`)

## Phase 3: UI Components
- [x] T007 Build `MacroProgressCards.tsx` displaying Calories, Protein, Carbs, and Fats with visual progress indicators
- [x] T008 Build `DateNavigator.tsx` for cycling through dates and picking specific days
- [x] T009 Build `MealList.tsx` and `MealItem.tsx` for listing and deleting logged meals
- [x] T010 Build `AddMealModal.tsx` for rapid meal entry
- [x] T011 Build `EditTargetsModal.tsx` for editing daily calorie and macro goals
- [x] T012 Build `TdeeCalculatorModal.tsx` for standard informational formula reference

## Phase 4: Page Integration & Verification
- [x] T013 Create `NutritionView.tsx` client orchestrator in `src/ui/nutrition/NutritionView.tsx`
- [x] T014 Assemble full Nutrition page in `app/(app)/nutrition/page.tsx`
- [x] T015 Connect Home dashboard's daily nutrition card in `app/(app)/page.tsx` to live nutrition data
- [x] T016 Run automated tests (`npm run test:domain`) and build verification (`npm run build`)
