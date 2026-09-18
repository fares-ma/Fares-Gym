# Data Model: Phase 3 — Activities, Schedule Blocks & Reminders

All tables are defined in PostgreSQL via Drizzle ORM in `src/data/schema.ts` and provisioned on Neon.

## Entities & Relationships

### 1. `schedule_blocks`
Recurring time blocks mapping Fares's daily schedule.
- `id` (text, primary key): UUID v4 or nanoid
- `title` (text, not null): Activity name (e.g. "الجيم", "مذاكرة", "غداء", "راحة")
- `dayOfWeek` (integer, not null): 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday (or 7 = Daily)
- `startTime` (text, not null): 24-hour time format e.g. `"17:00"`
- `endTime` (text, not null): 24-hour time format e.g. `"18:30"`

**Query**:
```sql
-- Selects blocks scheduled for today (day_of_week or daily 7)
-- and overnight blocks from preceding day ((day_of_week + 6) % 7 or daily 7) where end_time < start_time
SELECT * FROM schedule_blocks
WHERE (day_of_week = :current_day OR day_of_week = 7)
   OR ((day_of_week = :prev_day OR day_of_week = 7) AND end_time < start_time)
ORDER BY start_time ASC;
```
*Note*: Preceding-weekday overnight occurrences are preserved with `isFromPrecedingDay: true` (and unique occurrence identity) so status calculation evaluates them against the previous day context rather than confusing them with current-day evening blocks.

---

### 2. `reminders`
Actionable checklist tasks.
- `id` (text, primary key): UUID v4 or nanoid
- `text` (text, not null): Task description e.g. `"تحضير شنطة الجيم"`
- `dueTime` (text, not null): e.g. `"16:00"` or `""`
- `isCompleted` (boolean, default false): Completion toggle state

**Query**:
```sql
SELECT * FROM reminders
ORDER BY is_completed ASC, due_time ASC;
```

---

### 3. `notes`
Quick text scratchpad for Fares.
- `id` (text, primary key): UUID v4 or nanoid
- `content` (text, not null): Plain text note body
- `createdAt` (timestamp, mode: "date", not null): Creation timestamp

**Query**:
```sql
SELECT * FROM notes
ORDER BY created_at DESC
LIMIT 50;
```
