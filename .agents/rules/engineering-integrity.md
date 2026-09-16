# Engineering & Domain Integrity Rules

This document establishes strict engineering patterns and guardrails derived from code reviews to prevent regressions across all phases.

---

## 1. Secrets & Credentials
- **Zero Plaintext Secrets in Docs/Code**: Never hardcode actual passwords, API tokens, or connection strings in Markdown documentation, quickstart guides, comments, or source code.
- **Reference .env**: Always refer to credentials via `.env` variable names (e.g. `USER_PASSWORD`, `DATABASE_URL`).

---

## 2. Database Integrity & Transactions
- **Atomic Multi-Row Operations**: Any multi-step record creation (e.g. creating a `workout_session` and populating default `performed_sets`) MUST be enclosed in a database transaction (`db.transaction(async (tx) => { ... })`).
- **Composite Key Versioning**: Tables that support immutable versioning (e.g. `workout_programs` keyed by `(id, version)`) must be queried and joined on both `(id, version)` across history, relations, and details.
- **Atomic State Transitions**: When transitioning record lifecycle status (e.g. `in_progress` -> `completed`), atomically filter by both `id` and current status `in_progress`. Always verify affected rows (e.g., via `.returning()`) and reject the mutation if zero rows matched.
- **Child Record Guards**: Mutations on child records (e.g. updating a set in `performed_sets`) must explicitly verify that the parent record (`workout_sessions`) is in `in_progress` status. Completed sessions are strictly immutable.

---

## 3. Domain Rules & Unit Tag Enforcement
- **Opaque Tags "K" and "B"**:
  - Are gym-specific pin/stack numbers, never convert them to kg or lbs.
  - Never mix "K" or "B" with any other unit tag for the same exercise within a session.
  - Reject any mutation that attempts to introduce a mixed unit tag on an exercise that already has a designated tag.
- **Single Source of Domain Truth**: Never duplicate parsing or calculation logic (e.g. `parseWeight`). Always import directly from `src/domain/`.
- **Robust Regex**: Numeric parsers must strictly validate decimal points (e.g. `^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]*)$`), rejecting malformed values like `1.2.3` or `.`.

---

## 4. UI & Localization Standards
- **Context-Specific Localization**: Always use contextually appropriate localization tokens from `src/i18n/ar.ts`. Never reuse unrelated tokens (e.g. `ar.auth.loggingIn` for workout save buttons).
- **Defensive UI Inputs**: Always sanitize and clamp user number inputs (e.g. `Math.max(1, parseInt(e.target.value, 10) || 1)` for reps) to prevent NaN or invalid states.
- **Resource Lifecycle Management**: Any browser resources (e.g. Web Audio `AudioContext`, intervals, timers) must be cleanly closed and cleared on completion or unmount to avoid memory leaks.
