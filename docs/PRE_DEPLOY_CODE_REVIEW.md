# Fares Hub Pre-Deploy Code Review

Date: 2026-09-18
Reviewer: Codex
Project path: `C:\Users\Fares\Desktop\Gym`

## Purpose

This document captures a full pre-deployment code review of Fares Hub so another AI agent can fix the issues without needing to rediscover them from scratch.

The review focused on:

- Deployment readiness
- Performance and reliability
- Data integrity and domain invariants
- Authentication and route protection
- UI, RTL, colors, and visual consistency
- PWA/offline claims
- Consistency with `AGENTS.md` and `SPEC.md`

## Verification Run

Commands run during review:

```powershell
npm run test:domain
npx tsc --noEmit
npm run build
npm run lint
npm ls next
```

Results:

- `npm run test:domain`: passed, 35/35 tests.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run lint`: failed because `next lint` opened an interactive ESLint setup prompt.
- `npm ls next`: failed with an invalid installed package state. `package.json` requires `next@15.1.11`, while `node_modules` had `next@15.1.7`.

## Executive Summary

The app is close, but it should not be deployed as production until the P0/P1 issues below are fixed.

The strongest parts are:

- Domain tests are present and passing for workouts, nutrition, activities, and progress.
- The production build succeeds.
- Server actions generally validate sessions before mutating data.
- Completed workout sessions are protected from normal set mutation because set updates verify the parent session is still `in_progress`.
- Opaque weight tags are respected in key PR logic.

The riskiest parts are:

- No generated Drizzle migrations are present.
- Linting is not usable in CI and is disabled during builds.
- Dependency install state is inconsistent.
- PWA is claimed as ready but service worker/offline caching is missing.
- The home page can show hardcoded fallback workout data if database queries fail.
- Program versioning is required by the project rules but not implemented as an editing workflow.
- Some date handling still uses UTC/client-local `toISOString()` instead of the configured app timezone.

## Priority Legend

- P0: Must fix before deployment.
- P1: Strongly recommended before real use/deployment.
- P2: Important polish or correctness issue, can follow P0/P1 if needed.
- P3: Nice-to-have cleanup.

---

## P0 Findings

### 1. Missing Drizzle migrations

Files:

- `drizzle.config.ts`
- `src/data/schema.ts`
- Expected output: `src/data/migrations`

Evidence:

- `drizzle.config.ts` configures:

```ts
out: "./src/data/migrations"
```

- No migration files were present/tracked under `src/data/migrations`.

Risk:

On Neon/Vercel deployment, there is no reliable, repeatable schema creation path. A fresh database may not have the expected tables, constraints, or indexes.

Recommended fix:

1. Run:

```powershell
npm run db:generate
```

2. Review generated SQL.
3. Commit the migration files.
4. Add deployment instructions for applying migrations before or during deploy.
5. Prefer a non-destructive migration flow for production; do not rely only on `db:push`.

Acceptance criteria:

- `src/data/migrations` contains generated SQL and Drizzle metadata.
- A fresh Neon database can be migrated from empty to working state.
- Seed script can run after migrations.

---

### 2. Lint command is not CI-safe and build ignores lint

Files:

- `package.json`
- `next.config.ts`

Evidence:

- `package.json`:

```json
"lint": "next lint"
```

- Running `npm run lint` opened an interactive setup prompt and exited unsuccessfully.
- `next.config.ts` contains:

```ts
eslint: {
  ignoreDuringBuilds: true,
}
```

Risk:

Lint errors, accessibility problems, unused code, and unsafe patterns can reach production unnoticed. A deployment pipeline cannot trust `npm run lint`.

Recommended fix:

1. Add a real ESLint configuration compatible with Next 15.
2. Replace `next lint` if needed, since recent Next versions moved away from that flow.
3. Make `npm run lint` non-interactive.
4. Remove `ignoreDuringBuilds: true` once lint is stable.

Example direction:

```powershell
npm install -D eslint eslint-config-next
```

Then create `eslint.config.mjs` or the project-standard equivalent.

Acceptance criteria:

- `npm run lint` runs non-interactively.
- `npm run lint` exits 0 on clean code and non-zero on violations.
- `npm run build` no longer suppresses lint unless there is a documented temporary reason.

---

### 3. Next dependency mismatch

Files:

- `package.json`
- `package-lock.json`
- `node_modules`

Evidence:

- `package.json` requires:

```json
"next": "15.1.11"
```

- `npm ls next` reported installed `next@15.1.7 invalid`.
- `npm run build` output also showed Next `15.1.7`, not `15.1.11`.

Risk:

Local verification is not testing the exact package version declared in source control. Vercel may install from the lockfile and behave differently from the local machine.

Recommended fix:

1. Run a clean install:

```powershell
npm ci
```

2. If it fails, reconcile `package.json` and `package-lock.json`.
3. Verify:

```powershell
npm ls next
npm run build
```

Acceptance criteria:

- `npm ls next` exits 0.
- Installed Next version matches `package.json` and `package-lock.json`.
- Build output shows the expected Next version.

---

## P1 Findings

### 4. Home page uses hardcoded fallback workout data when DB query fails

File:

- `app/(app)/page.tsx`

Evidence:

The page initializes:

```ts
let nextProgramName = "Posterior A";
let exerciseCount = 8;
```

Then catches query errors silently:

```ts
} catch {
  // Graceful fallback if database is loading/seeding
}
```

Risk:

This violates the project rule: no phantom seed/demo data in live query results. If the database is down, the dashboard can show a believable but false workout mission.

Recommended fix:

1. Replace hardcoded workout defaults with explicit `null` state.
2. Render one of:
   - Arabic empty state if the DB is connected but no programs exist.
   - Arabic error state if the query fails.
   - Loading/skeleton where appropriate.
3. Log server-side query failures with enough context, but do not show fake data.

Acceptance criteria:

- If workout query fails, no fake workout program appears.
- If programs table is empty, UI shows a real empty state.
- If data exists, UI renders actual next program.

---

### 5. Program versioning is required but editing/version creation is not implemented

Files:

- `AGENTS.md`
- `SPEC.md`
- `src/data/schema.ts`
- `src/server/workout-actions.ts`
- `app/(app)/workout/program/[id]/page.tsx`
- `app/(app)/settings/page.tsx`

Evidence:

Project rules require:

- Any modification to a `WorkoutProgram` creates `version + 1`.
- Historical sessions remain linked to the exact program version.
- Settings should allow editing programs.

Current implementation:

- Schema supports `(id, version)`.
- Sessions store `programId` and `programVersion`.
- There is no UI/action for editing a program and creating a new version.

Risk:

The app cannot safely update workout programs according to its own non-negotiable rules. Users may need to edit seed data manually, which risks corrupting history.

Recommended fix:

1. Add a program edit UI, likely under Settings or Program Details.
2. Add a server action such as `createWorkoutProgramVersionAction`.
3. On edit:
   - Read latest active version.
   - Insert new `workout_programs` row with `version + 1`.
   - Insert new `workout_program_exercises` rows.
   - Do not mutate old rows.
   - Optionally mark previous version inactive only if query logic still correctly selects latest active version.
4. Show a diff before saving:
   - Added/removed exercises
   - Reordered exercises
   - Changed weight/reps/sets/heating/rest
5. Add domain or integration tests for version creation.

Acceptance criteria:

- Editing a program never updates historical versions in place.
- Old sessions still join to their original program version.
- Workout list uses latest active version.
- Tests prove old session history remains intact after an edit.

---

### 6. PWA is claimed as ready but service worker/offline caching is missing

Files:

- `public/manifest.json`
- `app/layout.tsx`
- `src/ui/settings/SystemInfoCard.tsx`
- `next.config.ts`

Evidence:

- Manifest exists and is referenced in layout.
- No `serviceWorker`, `sw.js`, `next-pwa`, Workbox, or cache registration found.
- Settings displays `PWA READY`.

Risk:

The UI claims functionality that does not exist. Installability may be partial, and offline static caching is not implemented despite project requirements.

Recommended fix:

Choose one:

Option A: Implement PWA properly.

- Add service worker generation or manual `sw.js`.
- Cache static assets.
- Decide and document read-only offline fallback behavior.
- Register the service worker safely from a client component.
- Test installability and offline behavior in browser devtools.

Option B: Be honest in UI for now.

- Change `PWA READY` to something like Arabic "Manifest configured" or "PWA partially configured".
- Remove offline/install-complete claims until service worker exists.

Acceptance criteria:

- Either offline caching is actually implemented, or the UI no longer claims PWA readiness.
- Browser Application panel shows service worker and cache when PWA is enabled.

---

### 7. Timezone bug in nutrition date navigation

File:

- `src/ui/nutrition/DateNavigator.tsx`

Evidence:

The component uses:

```ts
const today = new Date().toISOString().split("T")[0];
```

And date changes are also based on `toISOString()`.

Risk:

`toISOString()` uses UTC. Around midnight in `Africa/Cairo`, the selected "today", previous day, or next day can be wrong relative to the app timezone.

Recommended fix:

1. Avoid `toISOString()` for user-facing calendar dates.
2. Use a local date string helper on client, or pass `today` from the server using `getUserTodayDateStr()`.
3. For date math, parse `YYYY-MM-DD` as calendar parts, not as UTC Date where possible.

Suggested helper:

```ts
function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
```

Acceptance criteria:

- At Cairo local time after midnight while UTC is previous day, the app still shows the correct local date.
- Previous/next buttons move exactly one calendar day in the app timezone.

---

### 8. Active workout set completion state can become visually stale

Files:

- `src/ui/workout/ActiveWorkoutView.tsx`
- `src/ui/workout/SetEntryRow.tsx`
- `src/server/workout-actions.ts`

Evidence:

`ActiveWorkoutView` filters from immutable `initialEntries`:

```ts
const currentEntries = initialEntries.filter(...)
```

`SetEntryRow` owns completion state locally:

```ts
const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
```

Risk:

After completing a set, navigating between exercises can remount rows from old props. UI may show a saved set as incomplete until a refresh. This is dangerous in a workout logging app.

Recommended fix:

1. Lift entries state into `ActiveWorkoutView`.
2. Pass update callbacks to `SetEntryRow`.
3. On successful `logSetEntryAction`, update parent state.
4. Optionally call `router.refresh()` after successful save if server truth is preferred.
5. Add optimistic update with unified revert on failure.

Acceptance criteria:

- Complete a set, move to another exercise, return: completion remains visible.
- Failed server save reverts UI.
- Refresh still reflects server state.

---

### 9. Database schema lacks foreign keys and check constraints

File:

- `src/data/schema.ts`

Evidence:

Many references are plain text:

```ts
programId: text("program_id").notNull()
sessionId: text("session_id").notNull()
exerciseId: text("exercise_id").notNull()
targetProgramId: text("target_program_id")
```

Statuses and types are also plain text:

```ts
status: text("status").notNull().default("in_progress")
type: text("type").notNull()
```

Risk:

Invalid references or invalid status/type values can enter the database if a bug, manual script, or partial migration writes bad data.

Recommended fix:

1. Add Drizzle foreign key references where supported.
2. Add indexes for frequent query paths:
   - `workout_sessions.status`
   - `workout_sessions.completed_at`
   - `performed_sets.session_id`
   - `performed_sets.exercise_id`
   - `meals.date`
   - `nutrition_targets.effective_date`
   - `schedule_blocks.day_of_week`
3. Add check constraints for:
   - workout session status
   - performed set type/status
   - valid day of week
   - valid time string if practical at DB level
4. Generate and review migrations.

Acceptance criteria:

- Invalid `sessionId`, `exerciseId`, and `programId` cannot be inserted.
- Invalid statuses cannot be inserted.
- Common dashboard queries remain fast as data grows.

---

### 10. Environment validation should fail fast in production

Files:

- `src/data/db.ts`
- `src/server/session.ts`
- `src/server/auth.ts`
- `.env.example`

Evidence:

`db.ts` falls back to:

```ts
"postgresql://placeholder:placeholder@localhost:5432/placeholder"
```

`session.ts` falls back to:

```ts
"default_secret_fares_hub_min32chars_for_ci_and_dev"
```

Risk:

The app can build successfully but fail at runtime, or worse, run in production with an unsafe default session secret.

Recommended fix:

1. Add `src/server/env.ts` using Zod or direct checks.
2. In production, require:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `APP_TIMEZONE`
3. Allow test/dev defaults only under explicit `NODE_ENV !== "production"`.
4. Validate `SESSION_SECRET` length.
5. Validate `ADMIN_PASSWORD_HASH` is not the placeholder.

Acceptance criteria:

- Missing production env vars crash startup with a clear error.
- No production path uses default session secrets.

---

## P2 Findings

### 11. Workout volume chart aggregates opaque tags too broadly

Files:

- `src/server/progress-queries.ts`
- `src/domain/progress/progress-engine.ts`
- `src/ui/progress/WorkoutVolumeChart.tsx`

Evidence:

Volume history groups sets by only `unitTag`:

```ts
const tag = s.actualWeight?.unitTag || "";
setsByTag[tag].push(s);
```

Risk:

`K` is opaque and can mean different machine stacks for different exercises. Aggregating all `K` working sets in a whole session produces a number that may not be meaningful.

Recommended fix:

Choose a clear product rule:

Option A: Display session volume only for standard units like `kg`/`lbs`, and show opaque machine tags as separate per-exercise charts.

Option B: Group volume by `exerciseId + unitTag`, not only `unitTag`.

Option C: Keep session volume but label it clearly as "raw same-tag sum, not cross-exercise comparable".

Acceptance criteria:

- Opaque `K` from different exercises is never presented as a single comparable training volume without warning.
- Progress charts explain or separate opaque units.

---

### 12. UI contains hardcoded English strings outside `ar.ts`

Files/examples:

- `app/(auth)/login/page.tsx`
- `app/(app)/page.tsx`
- `app/(app)/workout/page.tsx`
- `src/ui/settings/SystemInfoCard.tsx`
- `src/ui/Sidebar.tsx`
- `src/ui/nutrition/NutritionView.tsx`
- `src/ui/progress/ProgressView.tsx`

Examples found:

- `SECURE ENTRY`
- `TODAY'S MISSION`
- `START WORKOUT`
- `LET'S GO!`
- `WORKOUT HUB`
- `4-DAY CYCLE`
- `ONLINE`
- `PWA READY`
- `FUEL YOUR ENGINE`
- `NO EXCUSES.`

Risk:

Project rule says Arabic UI strings should live in `src/i18n/ar.ts`. Hardcoded strings make translation and consistency harder.

Recommended fix:

1. Move all user-visible strings into `src/i18n/ar.ts`.
2. Decide whether small brand/motto strings intentionally remain English.
3. If English slogans are intentional, still store them in `ar.ts` for central control.

Acceptance criteria:

- `rg` for common literal English slogans in UI files returns no hardcoded user-facing strings outside i18n.

---

### 13. Theme toggle is visual only

Files:

- `src/ui/ThemeToggle.tsx`
- `app/layout.tsx`
- `src/i18n/ar.ts`

Evidence:

`app/layout.tsx` always sets:

```tsx
<html lang="ar" dir="rtl" className="dark">
```

`ThemeToggle` renders a static badge and does not toggle anything.

Risk:

Settings implies theme management, but users cannot actually switch themes. This is a UX inconsistency.

Recommended fix:

Choose one:

Option A: Implement theme switching.

- Add light theme CSS variables.
- Use a client theme provider or cookie-based server theme.
- Persist preference.

Option B: Rename UI to be explicit.

- Treat it as "current theme" not "toggle".
- Remove light-mode labels until implemented.

Acceptance criteria:

- Either the theme actually changes, or UI no longer implies it can.

---

### 14. Settings backup timestamp uses timezone-adjusted Date then serializes as UTC

File:

- `src/server/settings-actions.ts`

Evidence:

```ts
const now = getUserNow();
const isoDate = now.toISOString().split("T")[0];
const timestampStr = now.toISOString();
```

Risk:

`getUserNow()` returns a Date object derived from a timezone-formatted string. Calling `toISOString()` converts that object again to UTC. Backup filenames/timestamps may be confusing or shifted.

Recommended fix:

1. Use `getUserTodayDateStr()` for filename dates.
2. Store `exportedAtUtc` as `new Date().toISOString()`.
3. Optionally store `exportedAtLocalDate` and `timezone` separately.

Acceptance criteria:

- Backup filename date matches app timezone.
- Metadata clearly distinguishes UTC timestamp from local app date.

---

### 15. Progress charts do not use Tremor despite stack requirement

Files:

- `package.json`
- `src/ui/progress/WorkoutVolumeChart.tsx`
- `src/ui/progress/BodyWeightSection.tsx`

Evidence:

- No `@tremor/*` or `recharts` dependency found.
- Charts are implemented manually via bars/SVG.

Risk:

Not a functional blocker, but it diverges from the stated stack and may limit analytics polish, accessibility, and maintainability.

Recommended fix:

Choose one:

Option A: Install and use Tremor/Recharts for progress charts.

Option B: Update the project spec to say custom lightweight charts are intentional.

Acceptance criteria:

- Stack documentation matches actual implementation.
- Chart components are accessible and handle empty/small datasets well.

---

### 16. Visual system is cohesive but code diverges from mockup and has potential responsive issues

Files:

- `docs/mobile-ui-mockup.png`
- `src/ui/MiniFares.tsx`
- `src/ui/workout/SetEntryRow.tsx`
- `app/globals.css`

Observations:

- The mockup is visually strong: dark comic identity, clear hierarchy, good contrast.
- Actual code uses many hardcoded colors instead of tokens.
- Character assets have widely different aspect ratios but are forced into square containers.
- `SetEntryRow` has tight fixed widths:
  - `min-w-[85px]`
  - `max-w-[200px]`
  - `w-14`

Risk:

Long Arabic labels, large weight strings, or small mobile widths can cause cramped layouts. Character poses may look inconsistently scaled.

Recommended fix:

1. Audit on mobile widths 360px, 390px, 430px.
2. Normalize character asset presentation with per-pose fit classes or aspect-aware containers.
3. Reduce hardcoded colors by using CSS variables/classes.
4. For set rows, allow wrapping or a two-line mobile layout:
   - label row
   - inputs row
   - action row

Acceptance criteria:

- No text overlap on 360px mobile.
- Weight input supports realistic values like `102.5K`.
- Character art appears consistently sized across key pages.

---

### 17. Some query functions silently return empty data on error

Files:

- `src/server/progress-queries.ts`
- `src/server/settings-queries.ts`
- `app/(app)/page.tsx`

Evidence:

Several catch blocks log and return empty arrays/default summaries. The home page catch silently falls back.

Risk:

Real infrastructure or query errors can look like "no data yet", which makes debugging deployment issues hard.

Recommended fix:

1. Use explicit error states for page-level failures.
2. Reserve empty arrays for genuine empty database results.
3. Consider returning a discriminated union:

```ts
type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

Acceptance criteria:

- Database failure is visually distinguishable from empty state.
- Server logs contain useful error context.

---

## Security Review Notes

Good:

- Mutating server actions generally call `validateSession()`.
- Middleware redirects unauthenticated users.
- App layout validates the session against DB, not just cookie existence.
- Cookies are HTTP-only and Secure in production.
- `.env` is ignored by git.

Needs work:

- Production env vars should fail fast.
- Do not log password hash prefix in production. `src/server/auth.ts` logs hash length and prefix on password failure. Remove or guard behind non-production.
- Middleware only checks cookie presence, not DB validity. This is acceptable because layout/actions validate DB session, but be careful if future API routes are added outside layout/action patterns.

Recommended security tasks:

1. Add production env validation.
2. Remove sensitive auth debug logs.
3. Add tests for revoked/expired session behavior.
4. Ensure every future API route calls `validateSession()` directly.

---

## Performance Review Notes

Current status:

- First Load JS is around 121-128 kB on major pages, acceptable for this stage.
- Build output is clean.
- Server-rendered pages query Neon directly.

Potential improvements:

1. Add DB indexes before data grows.
2. Avoid fetching all `performed_sets` for progress if data becomes large; paginate or aggregate by query.
3. `getAppSettingsSummary()` reads all performed set weights to count K/B usage. This is fine now, but should eventually be a DB-side count or a materialized summary.
4. Use proper charts or virtualized lists if history grows.

---

## Suggested Fix Order for Another AI

### Phase A: Deployment Hygiene

1. Fix dependency mismatch with clean install.
2. Add ESLint config and make `npm run lint` non-interactive.
3. Re-enable lint during build.
4. Generate and commit Drizzle migrations.
5. Add production env validation.

Validation:

```powershell
npm ci
npm ls next
npm run lint
npx tsc --noEmit
npm run test:domain
npm run build
```

### Phase B: Data Truth and Domain Safety

1. Remove phantom fallback data from home page.
2. Implement program editing/versioning workflow.
3. Add DB foreign keys/check constraints/indexes.
4. Fix active workout parent state.
5. Fix timezone date handling in `DateNavigator` and backup export metadata.

Validation:

- Manual test: DB down or empty DB does not show fake workout data.
- Manual test: complete set, move exercises, return, state remains correct.
- Unit/integration test: program edit creates new version and old session remains tied to old version.

### Phase C: PWA and UI Honesty

1. Either implement service worker/offline caching or remove "PWA READY" claim.
2. Move hardcoded UI strings into `ar.ts`.
3. Decide whether ThemeToggle should become real or be renamed as static current-theme display.
4. Audit mobile layouts and character scaling.

Validation:

- Browser Application panel confirms service worker/cache if PWA is implemented.
- Mobile 360px/390px visual check has no overlap.
- `rg` confirms user-visible strings are centralized.

### Phase D: Progress Analytics

1. Decide volume semantics for opaque machine tags.
2. Update charts to avoid misleading aggregation.
3. Either adopt Tremor/Recharts or update docs to reflect custom charts.

Validation:

- Progress views never imply comparison between incompatible opaque machine units.

---

## Final Deployment Gate

Before deploying, the fixing AI should provide this final checklist:

```powershell
npm ci
npm run lint
npx tsc --noEmit
npm run test:domain
npm run build
npm run db:generate # only if schema changed, then verify no unexpected diff
```

Manual browser checks:

- Login page renders.
- Home page renders actual DB data or clear empty/error state.
- Start workout.
- Complete a set.
- Navigate between exercises and verify set state persists.
- Complete session.
- Verify history is append-only.
- Add meal.
- Change nutrition date around app timezone expectations.
- Add schedule block including overnight block.
- Export backup.
- Check Settings does not overclaim PWA/theme features.

Do not deploy until all P0 and P1 items are resolved or explicitly accepted with a written reason.
