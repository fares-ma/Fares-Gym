# Quickstart: UI Refresh and Reliability Fixes

This guide validates the feature plan before and during implementation.

## Prerequisites

- Repository root: `C:\Users\Fares\Desktop\Gym`
- Environment variables configured for the existing Neon database and session auth.
- Dependencies installed with `npm install`.
- Seed or real data available for workout, nutrition, activities, progress, and settings checks where possible.

## Baseline Defect Audit

Run from the repository root:

```powershell
npm run lint
npm run test:domain
npm run build
```

Expected outcome:

- Any failure is recorded as a defect finding.
- Defects affecting correctness, authentication, data integrity, accessibility, deployment readiness, or core navigation are fixed before major redesign work starts.
- Non-blocking defects are documented with severity, impact, and reason for deferral.

## Local App Run

```powershell
npm run dev
```

Open the app in a browser and validate:

- Unauthenticated access to personal-data routes redirects to login.
- Login succeeds with valid configured credentials.
- Login failure shows a useful Arabic error without crashing.

## Primary Mobile Visual Validation

Use an iPhone 11 Pro Max portrait-sized viewport.

Validate these screens:

- Login against `chatgbt-uiux/pages/login-phone.png`
- Home against `chatgbt-uiux/pages/home-phone.png`
- Workout list against `chatgbt-uiux/pages/workout-phone.png`
- Program details, active workout, workout history, nutrition, activities, progress, and settings against the matching panels in `chatgbt-uiux/pages/all-pages.png`

Expected outcome:

- Near pixel-perfect parity for hierarchy, spacing, colors, imagery, card treatment, navigation, and primary actions.
- No horizontal scrolling.
- No overlapping text.
- Bottom navigation does not hide primary controls.
- PWA/safe-area behavior remains usable.

## Primary Desktop Visual Validation

Use a 1536x1024 viewport.

Validate these screens:

- Home against `chatgbt-uiux/pages/home-website.png`
- Workout list against `chatgbt-uiux/pages/workout-website.png`
- Login against `chatgbt-uiux/pages/login-website.png`
- Other screens against the shared visual system and mobile references.

Expected outcome:

- Desktop layout uses the approved sidebar/topbar visual language.
- Screen density remains dashboard-like and scannable.
- Artwork supports the layout without hiding real data.

## Critical Flow Validation

Perform these user flows:

1. Log in, then log out.
2. Open home with normal data and identify the next workout or active session within 5 seconds.
3. Start or resume a workout.
4. Complete at least one set and verify rest timer behavior.
5. Finish a workout and confirm it appears in history as read-only.
6. Add, edit target values for, and delete a nutrition meal where the existing app supports it.
7. Add or interact with an activity schedule block/reminder and verify optimistic failure recovery where applicable.
8. Open progress with insufficient and sufficient data states when available.
9. Export backup or trigger settings actions where currently supported.

Expected outcome:

- Existing domain tests still pass after UI changes.
- No fake live data appears in empty states.
- No completed session can be modified in place.
- Weight values display raw tags without conversion or cross-tag mixing.

## Documentation Output

During implementation, record:

- Fixed defect list with severity and verification method.
- Asset changes and source/destination paths.
- Intentional visual deviations from reference images.
- Manual validation notes for iPhone 11 Pro Max portrait and 1536x1024 desktop.
