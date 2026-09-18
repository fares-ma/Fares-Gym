import {
  ExercisePR,
  SessionVolumePoint,
  ConsistencyMetrics,
  PerformedSetRecord,
} from "./types";

/**
 * Computes all-time personal records (PRs) per exercise and per opaque unit tag.
 * Strict Invariant: Only completed working sets are considered.
 * Tag Invariant: Weights with different unit tags (e.g. "K" vs "B") are never mixed or compared.
 * Ties are broken by higher reps.
 */
export function computeExercisePRs(
  sets: PerformedSetRecord[],
  exerciseNames: Record<string, string> = {}
): ExercisePR[] {
  // 1. Filter valid completed working sets
  const validSets = sets.filter(
    (s) =>
      s.type === "working" &&
      s.status === "completed" &&
      s.actualWeight &&
      s.actualWeight.numericValue > 0 &&
      s.actualReps !== null &&
      s.actualReps > 0
  );

  // 2. Sort chronologically so we can track previous PR progression
  validSets.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by composite key: exerciseId + "::" + unitTag
  const prTracker: Record<
    string,
    {
      current: ExercisePR;
      previous?: {
        weight: ExercisePR["weight"];
        reps: number;
        achievedAt: Date;
      };
    }
  > = {};

  for (const set of validSets) {
    const weight = set.actualWeight!;
    const reps = set.actualReps!;
    const tag = weight.unitTag || "";
    const groupKey = `${set.exerciseId}::${tag}`;
    const date = new Date(set.timestamp);
    const exerciseName =
      exerciseNames[set.exerciseId] || set.exerciseName || set.exerciseId;

    const existing = prTracker[groupKey];

    if (!existing) {
      prTracker[groupKey] = {
        current: {
          exerciseId: set.exerciseId,
          exerciseName,
          unitTag: tag,
          weight,
          reps,
          achievedAt: date,
        },
      };
    } else {
      const curr = existing.current;
      const isHigherWeight = weight.numericValue > curr.weight.numericValue;
      const isSameWeightMoreReps =
        weight.numericValue === curr.weight.numericValue && reps > curr.reps;

      if (isHigherWeight || isSameWeightMoreReps) {
        existing.previous = {
          weight: curr.weight,
          reps: curr.reps,
          achievedAt: curr.achievedAt,
        };
        existing.current = {
          exerciseId: set.exerciseId,
          exerciseName,
          unitTag: tag,
          weight,
          reps,
          achievedAt: date,
          previousPR: existing.previous,
        };
      }
    }
  }

  // Return list of PRs sorted alphabetically by exercise name
  return Object.values(prTracker)
    .map((item) => item.current)
    .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
}

/**
 * Calculates total volume for a completed session: sum of (weight * reps) for working sets.
 * When unitTag is specified, only sets matching that unitTag are accumulated to preserve opaque tag separation.
 */
export function calculateSessionVolume(
  sets: PerformedSetRecord[],
  unitTag?: string
): number {
  return sets
    .filter(
      (s) =>
        s.type === "working" &&
        s.status === "completed" &&
        s.actualWeight &&
        s.actualReps &&
        (unitTag === undefined || (s.actualWeight.unitTag || "") === unitTag)
    )
    .reduce((total, s) => {
      return total + (s.actualWeight!.numericValue * s.actualReps!);
    }, 0);
}

/**
 * Computes consistency metrics including total sessions, active days in the last 30 days,
 * and current weekly streak.
 */
export function computeConsistencyMetrics(
  sessions: { completedAt: Date | null; status: string }[],
  now: Date = new Date()
): ConsistencyMetrics {
  const completed = sessions.filter(
    (s) => s.status === "completed" && s.completedAt !== null
  );

  const totalCompletedSessions = completed.length;

  // Active days in last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const activeDaysSet = new Set<string>();

  for (const s of completed) {
    const d = new Date(s.completedAt!);
    if (d >= thirtyDaysAgo && d <= now) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      activeDaysSet.add(key);
    }
  }

  const last30DaysActiveCount = activeDaysSet.size;
  const last30DaysRate = Math.min(100, Math.round((last30DaysActiveCount / 30) * 100));

  // Current streak weeks (weeks with at least one completed session going backwards)
  let currentStreakWeeks = 0;
  if (completed.length > 0) {
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const getWeekIndex = (date: Date) => Math.floor(date.getTime() / msInWeek);
    const currentWeekIdx = getWeekIndex(now);

    const weeksWithSessions = new Set(
      completed.map((s) => getWeekIndex(new Date(s.completedAt!)))
    );

    // If current week or immediately preceding week has a session, count streak backwards
    let checkWeek = weeksWithSessions.has(currentWeekIdx)
      ? currentWeekIdx
      : currentWeekIdx - 1;

    while (weeksWithSessions.has(checkWeek)) {
      currentStreakWeeks++;
      checkWeek--;
    }
  }

  return {
    totalCompletedSessions,
    currentStreakWeeks,
    last30DaysActiveCount,
    last30DaysRate,
  };
}

/**
 * Formats an objective descriptive text for personal record comparison.
 * Invariant: Never produces subjective praise or medical claims.
 */
export function formatPRComparison(pr: ExercisePR): string {
  if (!pr.previousPR) {
    return "أول رقم قياسي مسجل";
  }

  const prev = pr.previousPR;
  return `${pr.weight.rawWeight} × ${pr.reps} مقابل ${prev.weight.rawWeight} × ${prev.reps}`;
}
