import { ExerciseTarget } from "@/domain/workout/types";
import { formatWeight } from "@/domain/workout/weight-parser";
import { ar } from "@/i18n/ar";
import { Flame, Dumbbell, Clock, Repeat } from "lucide-react";

interface ExerciseItemProps {
  exercise: ExerciseTarget;
  index: number;
}

export function ExerciseItem({ exercise, index }: ExerciseItemProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <div className="hub-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#2A242E] hover:border-[#7A1735]/50 transition-all">
      {/* Exercise info */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#1D1920] border border-[#2A242E] text-[#C9A15A] flex items-center justify-center font-black font-mono text-sm shrink-0">
          {formattedIndex}
        </div>
        <div>
          <h4 className="text-base font-black text-[#F1E9DD] tracking-tight">
            {exercise.displayName}
          </h4>
          <p className="text-xs text-[#A7A0A6] mt-1 flex items-center gap-1.5 flex-wrap">
            <span>{ar.workout.details.weightTarget}</span>
            <span className="font-black text-[#C9A15A] font-mono text-xs bg-[#1D1920] px-2.5 py-0.5 rounded-lg border border-[#2A242E]">
              {formatWeight(exercise.defaultWeight)}
            </span>
          </p>
        </div>
      </div>

      {/* Target Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {exercise.heatingRule !== "0" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D1920] text-[#F1E9DD] border border-[#4A1024] font-bold">
            <Flame className="w-3.5 h-3.5 text-[#C9A15A]" />
            <span>
              {ar.workout.details.heatingTarget} {exercise.heatingRule}
            </span>
          </span>
        )}

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D1920] text-[#F1E9DD] border border-[#2A242E] font-bold">
          <Dumbbell className="w-3.5 h-3.5 text-[#A83252]" />
          <span>
            {ar.workout.details.workingTarget} {exercise.workingSets}
          </span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D1920] text-[#F1E9DD] border border-[#2A242E] font-bold">
          <Repeat className="w-3.5 h-3.5 text-[#C9A15A]" />
          <span>
            {ar.workout.details.repsTarget} {exercise.targetReps}
          </span>
        </span>

        {exercise.targetRest !== "-" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D1920] text-[#A7A0A6] border border-[#2A242E] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#A7A0A6]" />
            <span>
              {exercise.targetRest} {ar.workout.details.minutes}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

