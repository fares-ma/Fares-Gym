import { ExerciseTarget } from "@/src/domain/workout/types";
import { formatWeight } from "@/src/domain/workout/weight-parser";
import { ar } from "@/src/i18n/ar";
import { Flame, Dumbbell, Clock, Repeat } from "lucide-react";

interface ExerciseItemProps {
  exercise: ExerciseTarget;
  index: number;
}

export function ExerciseItem({ exercise, index }: ExerciseItemProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Exercise info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-100">{exercise.displayName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {ar.workout.details.weightTarget}{" "}
            <span className="font-bold text-indigo-400 font-mono text-sm">
              {formatWeight(exercise.defaultWeight)}
            </span>
          </p>
        </div>
      </div>

      {/* Target Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {exercise.heatingRule !== "0" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>
              {ar.workout.details.heatingTarget} {exercise.heatingRule}
            </span>
          </span>
        )}

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>
            {ar.workout.details.workingTarget} {exercise.workingSets}
          </span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
          <Repeat className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {ar.workout.details.repsTarget} {exercise.targetReps}
          </span>
        </span>

        {exercise.targetRest !== "-" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {exercise.targetRest} {ar.workout.details.minutes}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
