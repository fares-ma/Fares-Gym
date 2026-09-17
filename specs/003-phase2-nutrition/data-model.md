# Data Model: Phase 2 — Nutrition & Daily Calories

All tables are defined in PostgreSQL via Drizzle ORM in `src/data/schema.ts` and provisioned on Neon.

## Entities & Relationships

### 1. `nutrition_targets`
Target snapshots configured manually by Fares. Supports historical auditing via `effectiveDate`.
- `id` (text, primary key): UUID v4 or nanoid
- `effectiveDate` (text, not null): Date formatted as `YYYY-MM-DD` from which these targets apply
- `targetCalories` (integer, not null): Daily calorie target in kcal (e.g. 2400)
- `targetProtein` (real, not null): Daily protein target in grams (e.g. 170.0)
- `targetCarbs` (real, not null): Daily carbohydrate target in grams (e.g. 250.0)
- `targetFats` (real, not null): Daily fat target in grams (e.g. 65.0)

**Lookup Rule**: To determine the active target for any given calendar date `D`:
```sql
SELECT * FROM nutrition_targets
WHERE effective_date <= D
ORDER BY effective_date DESC
LIMIT 1;
```

---

### 2. `meals`
Individual food entries logged by Fares.
- `id` (text, primary key): UUID v4 or nanoid
- `date` (text, not null): Calendar day formatted as `YYYY-MM-DD`
- `name` (text, not null): Description of the meal (e.g. "فطار الشوفان وسكوب واي")
- `calories` (integer, not null): Energy in kcal
- `proteinGrams` (real, not null): Protein in grams
- `carbsGrams` (real, not null): Carbohydrates in grams
- `fatsGrams` (real, not null): Fats in grams
- `loggedAt` (timestamp, not null): Exact timestamp when the meal was logged

**Lookup Rule**: To retrieve all meals for date `D`:
```sql
SELECT * FROM meals
WHERE date = D
ORDER BY logged_at DESC;
```

---

## Invariants & Validation Rules

1. **Non-Negative Values**:
   - `calories >= 0`
   - `proteinGrams >= 0`
   - `carbsGrams >= 0`
   - `fatsGrams >= 0`
   - Zod schemas must enforce non-negative numbers before database insertion.

2. **Calorie Macro Alignment (Informational)**:
   - Theoretical calories from macros: `(protein * 4) + (carbs * 4) + (fats * 9)`.
   - The user-entered calories value is the authoritative number (packaged foods often round values).

3. **Session Authentication**:
   - Mutation actions (`logMeal`, `deleteMeal`, `updateTargets`) require an active authenticated session.
