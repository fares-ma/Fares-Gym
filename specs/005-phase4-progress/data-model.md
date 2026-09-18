# Data Model: Phase 4 — Progress & Analytics

All entities reside in Neon PostgreSQL and are defined via Drizzle ORM in `src/data/schema.ts`.

## 1. `body_metrics`
Tracks body weight over time.
- `id` (text, primary key): UUID v4 or nanoid
- `date` (text, not null): Calendar date `YYYY-MM-DD`
- `weightKg` (real): Body weight in kg e.g. `78.5`
- `notes` (text): Optional context e.g. "بعد الاستيقاظ مباشرة"

## 2. `progress_snapshots`
Optional pre-aggregated performance snapshots.
- `id` (text, primary key)
- `date` (text, not null)
- `exerciseId` (text, not null)
- `maxWeight` (jsonb): Structured `WeightValue`
- `volume` (real, not null)

## 3. Existing Historical Tables Utilized
- `workout_sessions`: status, started_at, completed_at, duration_seconds
- `performed_sets`: session_id, exercise_id, set_number, type ('heating' | 'working'), actual_reps, actual_weight, completed, status ('completed')
- `exercises`: id, display_name, aliases
