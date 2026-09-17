# Feature Specification: Phase 2 — Nutrition & Daily Calories

**Feature Branch**: `specs/003-phase2-nutrition`  
**Status**: Ready for Implementation  
**Created**: 2026-09-17  
**Parent Document**: `SPEC.md` (Section 8, Section 13)

---

## 1. Overview & Business Value

A personal daily nutrition and macro-tracking engine designed exclusively for Fares.
The engine enables rapid manual logging of meals, real-time calculation of daily caloric and macronutrient totals (protein, carbohydrates, fats), and visual tracking against manually-set targets.

### Core Philosophy & Invariant Compliance:
- **Strict Manual Control (Constitution Principle IV)**: The system NEVER auto-assigns, generates, or enforces calorie goals, macro distributions, or dietary advice. All targets are entered by Fares. Any reference calculators (e.g. TDEE) act as standard informational formulas requiring explicit confirmation before updating targets.
- **Append-Only Daily Entries**: Meals are logged against specific calendar dates (`YYYY-MM-DD`). Prior days retain their logged history and the targets that were active on that date.
- **Fast Frictionless Logging**: Fares can record a meal in under 10 seconds on mobile or desktop.

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: Set and Update Daily Macro & Calorie Targets (P1)
- **Given** Fares visits the Nutrition page (`/nutrition`)
- **When** he clicks "تعديل الأهداف" (Edit Targets)
- **Then** a modal opens displaying his current daily targets (Calories, Protein in grams, Carbs in grams, Fats in grams)
- **When** he adjusts the values (e.g. 2400 kcal, 170g Protein, 250g Carbs, 65g Fats) and saves
- **Then** a new target snapshot is created with the current effective date
- **And** the progress rings and remaining values immediately update.

### Scenario 2: Quick Manual Meal Logging (P1)
- **Given** Fares is on the Nutrition page for today
- **When** he taps "تسجيل وجبة" (Log Meal)
- **Then** a dialog appears with inputs:
  - اسم الوجبة (Meal Name, e.g. "فطار الشوفان وسكوب واي")
  - السعرات (Calories in kcal, required)
  - البروتين (Protein in grams, optional / defaults to 0)
  - الكارب (Carbohydrates in grams, optional / defaults to 0)
  - الدهون (Fats in grams, optional / defaults to 0)
- **When** he submits the form
- **Then** the meal is saved with timestamp and associated with the selected date
- **And** the daily progress indicators (Calories, Protein, Carbs, Fats) instantly increment.

### Scenario 3: Real-Time Macro Progress Visualization (P1)
- **Given** Fares has logged meals for the day
- **Then** the nutrition header displays:
  - **السعرات (Calories)**: Consumed vs Target, Remaining or Surplus, percentage progress bar/ring.
  - **البروتين (Protein)**: Consumed vs Target (highlighted as primary metric for muscle recovery).
  - **الكربوهيدرات (Carbs)**: Consumed vs Target.
  - **الدهون (Fats)**: Consumed vs Target.
- **When** consumed calories exceed the target, the indicator shifts to a clear warning color without blocking logging.

### Scenario 4: Review and Delete Past Meals (P2)
- **Given** Fares wants to remove an accidental meal entry
- **When** he clicks the delete icon next to a meal in the daily list
- **Then** a confirmation prompt is shown
- **When** confirmed, the meal is removed and daily totals recalculate automatically.

### Scenario 5: Day Navigation (Today, Yesterday, Date Picker) (P2)
- **Given** Fares wants to review what he ate yesterday or log a missed late-night meal
- **When** he uses the date navigator buttons (`< أمس`, `اليوم >`, or date picker)
- **Then** the page loads the meals and targets applicable for that specific date.

### Scenario 6: Informational TDEE Calculator (P3)
- **Given** Fares wants to estimate his maintenance calories based on standard formulas (Mifflin-St Jeor)
- **When** he opens the "حاسبة السعرات التقديرية" tool and enters weight, height, age, and activity factor
- **Then** the estimated maintenance and macro splits are shown as an editable recommendation
- **And** the values are NOT saved to his active targets unless he explicitly clicks "تطبيق كأهدافي الحالية".

---

## 3. Functional Requirements

1. **Target Management**:
   - Store targets in `nutrition_targets` keyed by `id` with `effectiveDate` (`YYYY-MM-DD`).
   - The query for any given date must fetch the most recent target whose `effectiveDate <= selectedDate`.
   - If no target exists in the database, provide sensible default placeholders (e.g. 2000 kcal, 150g P, 200g C, 60g F) in edit mode without forcing them until saved.

2. **Meal Operations**:
   - Store meals in `meals` with `id`, `date` (`YYYY-MM-DD`), `name`, `calories`, `proteinGrams`, `carbsGrams`, `fatsGrams`, and `loggedAt`.
   - Meals can be queried by date in reverse chronological order (`loggedAt desc`).
   - Deletion must require authenticated session.

3. **Domain Engine Calculations**:
   - `calculateDailyTotals(meals: Meal[])`: Returns `{ totalCalories, totalProtein, totalCarbs, totalFats }`.
   - `calculateNutritionProgress(consumed, target)`: Returns `{ percentage, remaining, isSurplus }`.
   - `calculateTDEE(weightKg, heightCm, age, activityMultiplier)`: Pure informational calculation.

4. **Security & Data Integrity**:
   - All server actions require valid session authentication (`validateSession()`).
   - Numbers must be strictly sanitized and clamped (no negative calories or negative grams).

---

## 4. Success Criteria

- Meal creation is executed and reflected on screen in < 500ms.
- 100% of domain math calculations are covered by automated unit tests.
- UI strictly conforms to Egyptian Arabic RTL layout and uses tokens from `src/i18n/ar.ts`.
- Zero automated prescription or enforcement of nutritional advice occurs.
