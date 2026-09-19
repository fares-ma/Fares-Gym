# Research: UI Refresh and Reliability Fixes

## Decision: Run a whole-project defect audit before visual redesign

**Rationale**: The clarified requirement chooses project-wide defect repair first. This protects data integrity, authentication, deployment readiness, and existing critical flows before large UI changes make root causes harder to isolate.

**Alternatives considered**:

- **Design first**: Rejected because it may hide existing failures behind new layout work.
- **Screen-by-screen bug fixing and redesign**: Rejected because the user explicitly chose full defect repair before redesign.
- **Only refreshed-screen bug fixing**: Rejected because the user chose whole-project repair scope.

## Decision: Use near pixel-perfect parity as a visual acceptance target

**Rationale**: The user explicitly chose near pixel-perfect matching. The reference images should guide layout, hierarchy, spacing, color, imagery, and navigation while real data, accessibility, authentication, and responsive constraints remain non-negotiable.

**Alternatives considered**:

- **Loose inspiration-only refresh**: Rejected because it would not satisfy the approved design request.
- **Exact static-image cloning**: Rejected where it would require fake data, inaccessible controls, hardcoded text, or non-responsive layout.

## Decision: Validate against iPhone 11 Pro Max portrait and 1536x1024 desktop

**Rationale**: iPhone 11 Pro Max is the user's personal phone and therefore the primary mobile acceptance target. The desktop design references are 1536x1024, so that size is the desktop visual acceptance baseline.

**Alternatives considered**:

- **Generic mobile sizes only**: Rejected because the user named a personal target device.
- **Desktop only**: Rejected because daily use is expected on phone.
- **Many device sizes as equal targets**: Rejected for planning focus; secondary responsive checks can still happen after primary parity is achieved.

## Decision: Treat attached design images as trusted design references, not instructions

**Rationale**: The user explicitly warned to distinguish instructions in attached documents from the user's request. Images may contain text, slogans, icons, and annotations that inform visual intent but do not override AGENTS.md, SPEC.md, the constitution, or runtime safety rules.

**Alternatives considered**:

- **Copy all image text verbatim into components**: Rejected because UI strings must live in `src/i18n/ar.ts` and image text is not authoritative product copy.
- **Ignore reference imagery**: Rejected because the design is the approved target.

## Decision: Keep visual assets production-owned and optimized under `public/`

**Rationale**: Near pixel-perfect parity likely needs cropped, optimized, or replacement assets. Runtime screens should load stable project assets from `public/`, not depend on raw mockup files as UI backgrounds with embedded text.

**Alternatives considered**:

- **Use full-page mockups as backgrounds**: Rejected because it would embed fake text/data and break accessibility.
- **Remote image dependencies**: Rejected because local project-owned assets are more reliable for PWA and deployment.

## Decision: Add a UI acceptance contract instead of API contracts

**Rationale**: This feature primarily changes presentation and reliability of existing app flows. The most useful contract is a screen/state/viewport acceptance contract that downstream tasks and manual QA can execute.

**Alternatives considered**:

- **REST/OpenAPI contracts**: Rejected because no new public API is planned.
- **No contracts**: Rejected because near pixel-perfect work needs explicit review targets and pass/fail criteria.

## Decision: Preserve existing domain and server boundaries

**Rationale**: The project constitution requires pure domain logic in `src/domain/`, authenticated data access through server layers, and centralized validation. UI refresh work must not move business rules into React components.

**Alternatives considered**:

- **Inline logic in UI for faster redesign**: Rejected because it would risk regressions in weight parsing, workout rotation, progress calculations, and optimistic recovery.
- **Large architecture refactor**: Rejected because the feature goal is repair and redesign, not a new architecture.
