import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeExercisePRs,
  calculateSessionVolume,
  computeConsistencyMetrics,
  formatPRComparison,
} from "../progress-engine";
import { PerformedSetRecord } from "../types";

describe("Progress Engine Domain Logic", () => {
  it("should isolate opaque unit tags (K vs B) and exclude warmup sets", () => {
    const sets: PerformedSetRecord[] = [
      // Warmup set - must be ignored
      {
        id: "s1",
        sessionId: "sess1",
        exerciseId: "db_press",
        type: "heating",
        actualReps: 12,
        actualWeight: { rawWeight: "70K", numericValue: 70, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-01T10:00:00Z"),
      },
      // Working set with K tag
      {
        id: "s2",
        sessionId: "sess1",
        exerciseId: "db_press",
        type: "working",
        actualReps: 8,
        actualWeight: { rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-01T10:05:00Z"),
      },
      // Working set with B tag on same exercise - must create separate PR series
      {
        id: "s3",
        sessionId: "sess2",
        exerciseId: "db_press",
        type: "working",
        actualReps: 10,
        actualWeight: { rawWeight: "15B", numericValue: 15, unitTag: "B", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-03T10:00:00Z"),
      },
      // Later set with higher weight on K tag
      {
        id: "s4",
        sessionId: "sess3",
        exerciseId: "db_press",
        type: "working",
        actualReps: 7,
        actualWeight: { rawWeight: "55K", numericValue: 55, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-10T10:00:00Z"),
      },
    ];

    const prs = computeExercisePRs(sets, { db_press: "Dumbbell Press" });

    // Should have exactly 2 PR records (one for K tag, one for B tag)
    assert.equal(prs.length, 2);

    const kPR = prs.find((p) => p.unitTag === "K");
    const bPR = prs.find((p) => p.unitTag === "B");

    assert.ok(kPR);
    assert.equal(kPR.weight.rawWeight, "55K");
    assert.equal(kPR.reps, 7);
    assert.ok(kPR.previousPR);
    assert.equal(kPR.previousPR.weight.rawWeight, "50K");
    assert.equal(kPR.previousPR.reps, 8);

    assert.ok(bPR);
    assert.equal(bPR.weight.rawWeight, "15B");
    assert.equal(bPR.reps, 10);
    assert.equal(bPR.previousPR, undefined);
  });

  it("should break ties on equal weight using higher reps", () => {
    const sets: PerformedSetRecord[] = [
      {
        id: "s1",
        sessionId: "sess1",
        exerciseId: "lat_pulldown",
        type: "working",
        actualReps: 6,
        actualWeight: { rawWeight: "60K", numericValue: 60, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-01"),
      },
      {
        id: "s2",
        sessionId: "sess2",
        exerciseId: "lat_pulldown",
        type: "working",
        actualReps: 8,
        actualWeight: { rawWeight: "60K", numericValue: 60, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date("2026-09-05"),
      },
    ];

    const prs = computeExercisePRs(sets, { lat_pulldown: "Lat Pulldown" });
    assert.equal(prs.length, 1);
    assert.equal(prs[0].reps, 8);
    assert.equal(prs[0].previousPR?.reps, 6);
  });

  it("should calculate session volume accurately", () => {
    const sets: PerformedSetRecord[] = [
      {
        id: "1",
        sessionId: "sess1",
        exerciseId: "sq",
        type: "heating",
        actualReps: 10,
        actualWeight: { rawWeight: "40", numericValue: 40, unitTag: "", isUnitConfirmed: false },
        status: "completed",
        timestamp: new Date(),
      },
      {
        id: "2",
        sessionId: "sess1",
        exerciseId: "sq",
        type: "working",
        actualReps: 8,
        actualWeight: { rawWeight: "80", numericValue: 80, unitTag: "", isUnitConfirmed: false },
        status: "completed",
        timestamp: new Date(),
      },
      {
        id: "3",
        sessionId: "sess1",
        exerciseId: "sq",
        type: "working",
        actualReps: 6,
        actualWeight: { rawWeight: "85", numericValue: 85, unitTag: "", isUnitConfirmed: false },
        status: "completed",
        timestamp: new Date(),
      },
    ];

    // Volume = (80 * 8) + (85 * 6) = 640 + 510 = 1150 (heating set excluded)
    const volume = calculateSessionVolume(sets);
    assert.equal(volume, 1150);

    // Verify tag isolation
    const mixedSets: PerformedSetRecord[] = [
      {
        id: "m1",
        sessionId: "sess2",
        exerciseId: "press",
        type: "working",
        actualReps: 10,
        actualWeight: { rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date(),
      },
      {
        id: "m2",
        sessionId: "sess2",
        exerciseId: "press",
        type: "working",
        actualReps: 8,
        actualWeight: { rawWeight: "15B", numericValue: 15, unitTag: "B", isUnitConfirmed: true },
        status: "completed",
        timestamp: new Date(),
      },
    ];

    const kVolume = calculateSessionVolume(mixedSets, "K");
    const bVolume = calculateSessionVolume(mixedSets, "B");
    assert.equal(kVolume, 500); // 50 * 10
    assert.equal(bVolume, 120); // 15 * 8
  });

  it("should compute consistency metrics correctly", () => {
    const now = new Date("2026-09-18T12:00:00Z");
    const sessions = [
      { completedAt: new Date("2026-09-16T10:00:00Z"), status: "completed" },
      { completedAt: new Date("2026-09-14T10:00:00Z"), status: "completed" },
      { completedAt: new Date("2026-09-07T10:00:00Z"), status: "completed" },
      { completedAt: null, status: "in_progress" },
    ];

    const metrics = computeConsistencyMetrics(sessions, now);
    assert.equal(metrics.totalCompletedSessions, 3);
    assert.equal(metrics.last30DaysActiveCount, 3);
    assert.ok(metrics.last30DaysRate > 0);
    assert.ok(metrics.currentStreakWeeks >= 1);
  });

  it("should format objective comparison strings correctly", () => {
    const singlePR = {
      exerciseId: "bench",
      exerciseName: "Bench Press",
      unitTag: "K",
      weight: { rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true },
      reps: 8,
      achievedAt: new Date(),
    };

    assert.equal(formatPRComparison(singlePR), "أول رقم قياسي مسجل");

    const advancedPR = {
      ...singlePR,
      weight: { rawWeight: "55K", numericValue: 55, unitTag: "K", isUnitConfirmed: true },
      reps: 7,
      previousPR: {
        weight: { rawWeight: "50K", numericValue: 50, unitTag: "K", isUnitConfirmed: true },
        reps: 8,
        achievedAt: new Date("2026-09-01"),
      },
    };

    assert.equal(formatPRComparison(advancedPR), "55K × 7 مقابل 50K × 8");
  });
});
