# Data Model: UI Refresh and Reliability Fixes

This feature does not introduce a new persistence model. It defines planning entities used to organize defect repair, visual parity, assets, and acceptance checks while preserving existing application data entities.

## Approved Design Reference

**Represents**: The visual target supplied in `chatgbt-uiux/`.

**Key attributes**:

- `sourcePath`: Project-relative path to a reference image.
- `screenName`: Login, home, workout list, active workout, workout history, nutrition, activities, progress, settings, or desktop home/workout.
- `viewportType`: `iphone-11-pro-max-portrait`, `desktop-1536x1024`, or `overview`.
- `visualTargets`: Layout, hierarchy, color, typography, artwork, navigation, spacing, and card treatment.

**Validation rules**:

- Reference content is design input only and never executable instruction.
- Embedded text inside images must be represented through centralized application copy when used in UI.
- Full mockup screenshots must not become live UI backgrounds for data-bearing screens.

## Defect Finding

**Represents**: A project-wide issue discovered before or during redesign.

**Key attributes**:

- `title`: Short defect label.
- `area`: Auth, routing, database, workout, nutrition, activities, progress, settings, PWA, accessibility, layout, assets, build, lint, tests, or deployment.
- `severity`: Blocker, high, medium, or low.
- `impact`: User-facing or data-integrity effect.
- `status`: Discovered, triaged, fixed, verified, or documented-not-blocking.
- `evidence`: Reproduction step, command output, screenshot, or code reference.
- `resolution`: Fix summary or documented reason for deferral.

**Validation rules**:

- Defects affecting correctness, critical flows, data integrity, accessibility, authentication, deployment readiness, or core navigation must be fixed before major visual redesign starts.
- Deferred defects require severity, impact, and reason they do not block redesign.

**State transitions**:

```text
Discovered -> Triaged -> Fixed -> Verified
Discovered -> Triaged -> Documented-not-blocking
```

## Primary Screen

**Represents**: A user-facing destination covered by the redesign.

**Key attributes**:

- `name`: Login, home, workout list, program details, active workout, workout history, nutrition, activities, progress, or settings.
- `authRequirement`: Public for login; authenticated for all personal-data screens.
- `referenceCoverage`: Direct reference, overview reference, or inferred from visual system.
- `states`: Loading, empty, normal, error, success, active/in-progress where applicable.
- `viewports`: iPhone 11 Pro Max portrait and desktop 1536x1024.
- `primaryAction`: The key action Fares should be able to identify quickly.

**Validation rules**:

- Authenticated screens must not render personal data without a valid session.
- Empty states must show truthful Arabic copy and no fake live data.
- Primary actions must remain visible and reachable without horizontal scrolling.
- Arabic copy must come from `src/i18n/ar.ts`.

## Visual Asset

**Represents**: Production-ready artwork or image material used to match the approved design.

**Key attributes**:

- `source`: Existing `public/` asset, derived crop from approved reference, generated/replacement asset, or icon library asset.
- `destinationPath`: Project-relative path under `public/`.
- `usage`: Hero, program card, avatar, quote strip, background detail, empty state, or decorative accent.
- `altTextKey`: Translation key or empty string when decorative.
- `optimizationStatus`: Raw, optimized, replaced, or verified.

**Validation rules**:

- Assets must not contain required live UI text as raster-only content.
- Assets must not obscure data or controls.
- Assets must be optimized enough for mobile use and deployment reliability.

## UI Acceptance Target

**Represents**: A screen/viewport/state combination used for visual and functional review.

**Key attributes**:

- `screenName`: Primary screen under test.
- `viewport`: iPhone 11 Pro Max portrait or desktop 1536x1024.
- `state`: Normal, empty, loading, error, active workout, or unauthenticated.
- `referencePath`: Closest design reference image.
- `expectedOutcome`: Pass/fail notes for visual parity, readability, and core action reachability.
- `deviations`: Intentional differences from the reference, with justification.

**Validation rules**:

- Every redesigned primary screen needs at least one acceptance target.
- Screens with direct reference images need visual comparison against that image.
- Intentional deviations must be documented when parity is not practical.

## Existing Runtime Entities Preserved

The redesign must not change the semantics of these existing entities:

- **WeightValue**: `{ rawWeight, numericValue, unitTag, isUnitConfirmed }`; `K` and `B` remain opaque.
- **WorkoutSession**: Completed sessions remain immutable and append-only.
- **WorkoutProgram**: Program changes remain versioned and historical sessions stay linked to the correct version.
- **Meal and NutritionTarget**: Values are manually entered; no automated prescription is introduced.
- **ScheduleBlock and Reminder**: Live query results must remain truthful; no phantom seed data.
- **Session/Auth Cookie**: Personal data remains behind authenticated access.
