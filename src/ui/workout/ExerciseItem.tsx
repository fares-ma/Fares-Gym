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
    <div className="comic-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#2B252E] hover:border-[#7C1D38]/50">
      {/* Exercise info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#211C23] border border-[#362E3B] text-[#D6AA63] flex items-center justify-center font-black font-mono text-sm">
          {formattedIndex}
        </div>
        <div>
          <h4 className="text-base font-black text-[#F2EADF]">
            {exercise.displayName}
          </h4>
          <p className="text-xs text-[#9D969D] mt-0.5">
            {ar.workout.details.weightTarget}{" "}
            <span className="font-black text-[#D6AA63] font-mono text-sm bg-[#211C23] px-2 py-0.5 rounded-md border border-[#362E3B]">
              {formatWeight(exercise.defaultWeight)}
            </span>
          </p>
        </div>
      </div>

      {/* Target Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {exercise.heatingRule !== "0" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#211C23] text-[#E0537A] border border-[#7C1D38]/30 font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>
              {ar.workout.details.heatingTarget} {exercise.heatingRule}
            </span>
          </span>
        )}

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#211C23] text-[#F2EADF] border border-[#362E3B] font-bold">
          <Dumbbell className="w-3.5 h-3.5 text-[#7C1D38]" />
          <span>
            {ar.workout.details.workingTarget} {exercise.workingSets}
          </span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#211C23] text-[#F2EADF] border border-[#362E3B] font-bold">
          <Repeat className="w-3.5 h-3.5 text-[#D6AA63]" />
          <span>
            {ar.workout.details.repsTarget} {exercise.targetReps}
          </span>
        </span>

        {exercise.targetRest !== "-" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#211C23] text-[#9D969D] border border-[#362E3B] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {exercise.targetRest} {ar.workout.details.minutes}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
