# UI Acceptance Contract: UI Refresh and Reliability Fixes

This contract defines the review surface for planning and implementation. It is not a public API contract.

## Global Contract

- All personal-data screens require a valid authenticated session.
- Login is the only public app screen in scope.
- All Arabic UI text added or changed by this feature comes from `src/i18n/ar.ts`.
- Layout is RTL and uses logical start/end behavior.
- English exercise names remain readable inside Arabic UI.
- No screen may show fake live data when the database has no rows for that state.
- Completed workout sessions are displayed as read-only historical records.
- Optimistic UI changes revert cleanly on failed actions.
- Custom checklist-style controls are operable by touch and keyboard.
- Production screens use project-owned optimized assets, not full-page mockup screenshots as live UI.

## Primary Viewports

| Viewport | Purpose |
|----------|---------|
| iPhone 11 Pro Max portrait | Primary personal mobile acceptance target |
| 1536x1024 desktop | Primary desktop reference target |

## Screen Acceptance Matrix

| Screen | Mobile Target | Desktop Target | Required States | Reference |
|--------|---------------|----------------|-----------------|-----------|
| Login | iPhone 11 Pro Max portrait | 1536x1024 | normal, invalid credentials, loading | `chatgbt-uiux/pages/login-phone.png`, `login-website.png` |
| Home | iPhone 11 Pro Max portrait | 1536x1024 | normal, partial data, empty summaries, active workout | `home-phone.png`, `home-website.png` |
| Workout list | iPhone 11 Pro Max portrait | 1536x1024 | programs available, active session banner, empty/error | `workout-phone.png`, `workout-website.png` |
| Program details | iPhone 11 Pro Max portrait | inferred desktop parity | normal, loading/error, start action | `all-pages.png` |
| Active workout | iPhone 11 Pro Max portrait | inferred desktop parity | active session, set completion, rest timer, finish dialog | `all-pages.png` |
| Workout history | iPhone 11 Pro Max portrait | inferred desktop parity | empty, session list, read-only details | `all-pages.png` |
| Nutrition | iPhone 11 Pro Max portrait | inferred desktop parity | empty meals, meals logged, targets set/missing, add/edit dialog | `all-pages.png` |
| Activities | iPhone 11 Pro Max portrait | inferred desktop parity | empty day, scheduled day, reminders, notes/dialogs | `all-pages.png` |
| Progress | iPhone 11 Pro Max portrait | inferred desktop parity | no data, sufficient chart data, filters | `all-pages.png` |
| Settings | iPhone 11 Pro Max portrait | inferred desktop parity | normal, export/loading, logout flow | `all-pages.png` |

## Defect-First Gate

Before major visual redesign tasks begin:

1. Build, lint, and domain tests have been run or attempted.
2. Authentication route protection has been reviewed.
3. Core flows have been smoke-tested: login, home, workout start/resume, set completion, session finish/history, nutrition add/edit/delete, activities schedule/reminders, progress display, settings export/logout.
4. Known defects are fixed or documented as non-blocking with severity and impact.

## Visual Review Gate

For each redesigned primary screen:

1. Capture or inspect the screen at iPhone 11 Pro Max portrait.
2. Capture or inspect the screen at 1536x1024 desktop.
3. Compare against the closest approved reference for:
   - page hierarchy
   - spacing and density
   - card shape and border treatment
   - typography scale
   - burgundy/black/cream color balance
   - artwork placement
   - navigation active states
   - primary action prominence
4. Record any intentional deviations and the reason.

## Failure Conditions

A screen fails acceptance if any of the following are true:

- Personal data appears while unauthenticated.
- Main content overlaps, clips, or requires horizontal scrolling at a primary viewport.
- A primary action is hidden behind navigation or unsafe-area chrome.
- Empty states invent live user data.
- New Arabic copy is hardcoded in a component.
- Weight tags are converted or mixed.
- Completed sessions can be edited or deleted.
- Artwork prevents reading or interacting with real data.
