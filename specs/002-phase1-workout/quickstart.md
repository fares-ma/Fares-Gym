# Quickstart & Verification Guide: Phase 1 — Workout Tracking

This guide documents the end-to-end verification steps for testing Phase 1 in the browser.

## Prerequisites
- Node.js dependencies installed (`npm install`).
- Database seeded with 27 exercises and 4 programs (`npm run db:seed`).
- Local development server running (`npm run dev`).

## Verification Scenarios

### Scenario 1: Verify Program List & Rotation Highlight
1. Open browser to `http://localhost:3000/login` and log in with your configured username (`fares`) and password from `.env`.
2. Click on the **Workout** tab from the sidebar or bottom navigation (`/workout`).
3. **Expected Outcome**:
   - Four programs appear: `Anterior A`, `Posterior A`, `Anterior B`, `Posterior B`.
   - The first program (`Anterior A`) is clearly marked with a green badge **"التمرين القادم"** (Next Workout).
   - Each card displays exercise count and a button to view details or start the workout.

### Scenario 2: Program Details Inspection
1. Click on **Anterior A**.
2. **Expected Outcome**:
   - The exercise table renders: DB Shoulder Press, Cable Hip Adduction, Hack Squat, Lat Pulldown Crunches, Leg Extension, Cable Lateral Raises.
   - Opaque unit tags are displayed accurately (e.g. `50K`, `65k`, `200k`).
   - Suffixes are preserved without unwanted conversion.

### Scenario 3: Live Active Workout Session & Rest Timer
1. Tap **"ابدأ التمرين الآن"** (Start Workout Now).
2. The Active Workout screen opens (`/workout/active`).
3. For the first exercise, mark heating sets done, then tap **"إتمام المجموعة"** (Complete Set) on working set 1.
4. **Expected Outcome**:
   - The set updates with a checkmark.
   - The **Rest Timer** immediately pops up and counts down from 3:00.
   - Tapping `+30 ثانية` adds 30 seconds to the timer.
   - Tapping `تخطي` skips the timer and returns focus to the next set.

### Scenario 4: Session Completion & History Immutability
1. Complete all sets or click **"إنهاء التمرين"** (Finish Workout).
2. Confirm completion.
3. Open the **Workout History** tab (`/workout/history`).
4. **Expected Outcome**:
   - The completed session appears at the top of the history list with date, duration, and sets logged.
   - Clicking on the session displays set details in read-only mode with zero edit or delete buttons.
