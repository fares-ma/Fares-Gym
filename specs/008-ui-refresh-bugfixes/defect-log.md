# Defect Tracking Register: UI Refresh and Reliability Fixes

**Feature Branch**: `008-ui-refresh-bugfixes`  
**Last Updated**: 2026-09-19  
**Status**: Complete & Verified (Phase 7: User Story 5 complete)

---

## Defect Summary

| Defect ID | Area | Severity | Status | Summary | Resolution Summary |
|:---|:---|:---:|:---:|:---|:---|
| **DEF-001** | Build / Tooling | Blocker | **Verified & Closed** | SWC binary error on Windows (`next-swc.win32-x64-msvc.node` DLL load failed) | Reinstalled clean `@next/swc-win32-x64-msvc@15.1.9` and `@next/swc-wasm-nodejs@15.1.9` |
| **DEF-002** | Server / Settings | High | **Verified & Closed** | TypeScript compilation error: missing `getUserTodayDateStr` import in `settings-actions.ts` | Imported `getUserTodayDateStr` directly from `src/lib/date-utils.ts` |
| **DEF-003** | Server / Settings | High | **Verified & Closed** | TypeScript compilation error: undefined variable `timestampStr` on line 109 of `settings-actions.ts` | Corrected variable reference to `utcTimestampStr` |
| **DEF-004** | Server / Validation | Medium | **Verified & Closed** | Validation schemas in `nutrition-actions.ts`, `activities-actions.ts`, and `progress-actions.ts` were private | Exported all module schemas to allow testing, client validation, and smoke verification |
| **DEF-005** | Documentation / Tasks | Low | **Verified & Closed** | `tasks.md` referenced `workout-mutations.ts` instead of `workout-actions.ts` | Corrected file reference in `tasks.md` |
| **DEF-006** | Next.js Server Actions | High | **Verified & Closed** | Next.js 15 compilation error: Server Actions must be async functions when exporting Zod schemas from `"use server"` files | Centralized all validation schemas into dedicated `src/server/schemas.ts` without `"use server"` directive |

---

## Detailed Defect Findings & Resolutions

### DEF-001: Corrupted / Incompatible Native SWC Binary on Windows
- **Discovered**: During baseline `npm run build` execution.
- **Severity**: Blocker.
- **Impact**: Prevented production build, failing immediately with `Failed to load SWC binary for win32/x64`.
- **Root Cause**: Corrupted/partial native DLL binary in `node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node` causing `ERR_DLOPEN_FAILED` under Node.js 24 on Windows.
- **Resolution**: Removed corrupted module and cleanly installed `@next/swc-win32-x64-msvc@15.1.9` alongside `@next/swc-wasm-nodejs@15.1.9` fallback.
- **Verification**: `npm run build` compiled and completed successfully (Exit Code 0). Verified across Phases 2 through 7.

---

### DEF-002: Missing Date Utility Import in Settings Backup Action
- **Discovered**: During TypeScript type checking in `next build`.
- **Severity**: High.
- **Impact**: `src/server/settings-actions.ts` could not compile; JSON backup export action would throw at runtime when generating date filenames.
- **Root Cause**: `getUserTodayDateStr` was referenced on line 73 but was neither imported nor defined in the file.
- **Resolution**: Added `getUserTodayDateStr` import from `src/lib/date-utils.ts`.
- **Verification**: Type checker passed in `next build`. Verified in Phase 2 and regression checked in Phase 6/7.

---

### DEF-003: Typo in Backup Timestamp Database Insertion
- **Discovered**: During TypeScript type checking in `next build`.
- **Severity**: High.
- **Impact**: `src/server/settings-actions.ts` failed compilation on line 109 (`value: timestampStr`).
- **Root Cause**: Typo using undeclared variable `timestampStr` instead of declared `utcTimestampStr`.
- **Resolution**: Replaced `timestampStr` with `utcTimestampStr`.
- **Verification**: Type checker passed in `next build`. Verified in Phase 2 and regression checked in Phase 6/7.

---

### DEF-004: Unexported Server Action Validation Schemas
- **Discovered**: During Phase 2 server smoke testing.
- **Severity**: Medium.
- **Impact**: Input validation schemas could not be tested or reused in unit tests or forms.
- **Root Cause**: Schemas declared with `const` without `export`.
- **Resolution**: Exported schemas; subsequent DEF-006 centralized them in `schemas.ts`.
- **Verification**: Verified via `scripts/smoke-test-server.ts`. Re-verified during Phase 7 audits.

---

### DEF-005: Task File Path Inconsistency
- **Discovered**: During Phase 2 audit of workout mutations.
- **Severity**: Low.
- **Impact**: Inaccurate task path for automated tooling.
- **Root Cause**: Tasks T009 and T041 named the file `workout-mutations.ts` when it is actually `workout-actions.ts`.
- **Resolution**: Updated `tasks.md` to reference `src/server/workout-actions.ts`.
- **Verification**: File verified to exist and contain all mutation actions and immutability guards.

---

### DEF-006: Non-Async Function Exports in "use server" Files
- **Discovered**: During Phase 3 `next build` execution.
- **Severity**: High.
- **Impact**: Next.js 15 App Router failed compilation with `Server Actions must be async functions` for exported Zod schemas with synchronous `.refine()` functions.
- **Root Cause**: Exporting constants/objects from files marked `"use server"` violates the Server Actions specification.
- **Resolution**: Created dedicated `src/server/schemas.ts` for all validation schemas; action files now strictly export async server actions.
- **Verification**: `next build` passed with zero errors (Exit Code 0) continuously across Phases 3, 4, 5, 6, and 7.

---

## Phase 7 Reliability & Guard Verification
- **T037 (Optimistic Rollback)**: Implemented in `src/lib/optimistic-helper.ts` providing automated UI state reversion on server action rejection or network exception.
- **T038 (Keyboard Accessibility)**: Verified `role="checkbox"`, `aria-checked`, `tabIndex={0}`, and `onKeyDown` (`Enter`/`Space`) in `src/ui/RemindersCard.tsx` and `src/ui/activities/RemindersSection.tsx` with high-contrast focus rings.
- **T039 (Error Boundary)**: Resilient App Router boundary `app/(app)/error.tsx` with friendly Egyptian Arabic copy and retry action, and synchronized loading skeletons in `app/(app)/loading.tsx`.
- **T040 (Timezone Invariance)**: Invariant timezone handling enforced via `getUserWeekday` and `getUserTodayDateStr` in `src/lib/date-utils.ts` and `src/server/activities-queries.ts` adhering to `APP_TIMEZONE` (`Africa/Cairo`).
- **T041 (Immutable Completed Sessions)**: Explicit guards enforced in `src/server/workout-actions.ts` (`logSetEntryAction`, `completeWorkoutSessionAction`, `abandonWorkoutSessionAction`) strictly rejecting mutations on completed sessions.
