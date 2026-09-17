"use client";

import { useState, useTransition } from "react";
import { formatWeight } from "@/domain/workout/weight-parser";
import { WeightValue } from "@/domain/workout/types";
import { ar } from "@/i18n/ar";
import { logSetEntryAction } from "@/server/workout-actions";
import { Check, Flame, Dumbbell } from "lucide-react";

interface SetEntryRowProps {
  entryId: string;
  setNumber: number;
  setType: "heating" | "working";
  targetWeight: WeightValue;
  initialActualWeight: WeightValue;
  initialActualReps: number;
  initialIsCompleted: boolean;
  onSetCompleted: (isWorking: boolean) => void;
}

export function SetEntryRow({
  entryId,
  setNumber,
  setType,
  targetWeight,
  initialActualWeight,
  initialActualReps,
  initialIsCompleted,
  onSetCompleted,
}: SetEntryRowProps) {
  const [weightStr, setWeightStr] = useState(
    initialActualWeight.rawWeight || targetWeight.rawWeight || ""
  );
  const [reps, setReps] = useState(initialActualReps || 8);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggleComplete = () => {
    const nextCompleted = !isCompleted;
    setIsCompleted(nextCompleted);

    startTransition(async () => {
      const res = await logSetEntryAction({
        entryId,
        actualWeight: weightStr,
        actualReps: reps,
        isCompleted: nextCompleted,
      });

      if (!res.success) {
        setIsCompleted(!nextCompleted); // revert on error
        alert(res.error || ar.errors.generic);
      } else if (nextCompleted) {
        onSetCompleted(setType === "working");
      }
    });
  };

  const isHeating = setType === "heating";

  return (
    <div
      className={`rounded-xl p-3 sm:p-3.5 border transition-all flex items-center justify-between gap-2.5 ${
        isCompleted
          ? "bg-[#18151B] border-[#34D399]/60 shadow-sm"
          : isHeating
          ? "bg-[#18151B] border-[#D6AA63]/30"
          : "bg-[#18151B] border-[#2B252E] hover:border-[#7C1D38]/50"
      }`}
    >
      {/* Set Label */}
      <div className="flex items-center gap-2 min-w-[85px]">
        {isHeating ? (
          <span className="p-1.5 rounded-lg bg-[#211C23] text-[#D6AA63] border border-[#D6AA63]/30">
            <Flame className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="p-1.5 rounded-lg bg-[#211C23] text-[#7C1D38] border border-[#7C1D38]/40">
            <Dumbbell className="w-3.5 h-3.5" />
          </span>
        )}
        <div className="text-right">
          <span className="text-xs font-black text-[#F2EADF] block">
            {ar.workout.active.setNumber.replace("{num}", String(setNumber))}
          </span>
          <span className="text-[10px] text-[#9D969D] font-mono">
            {formatWeight(targetWeight)}
          </span>
        </div>
      </div>

      {/* Inputs for weight & reps */}
      <div className="flex items-center gap-2 flex-1 justify-center max-w-[200px]">
        {/* Weight input */}
        <div className="flex-1">
          <input
            type="text"
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
            disabled={isCompleted || isPending}
            placeholder={ar.workout.active.weightPlaceholder}
            className="w-full bg-[#211C23] border border-[#362E3B] rounded-lg py-2 px-2 text-center text-sm font-mono font-black text-[#F2EADF] focus:outline-none focus:border-[#7C1D38] disabled:opacity-75"
          />
        </div>

        <span className="text-[#9D969D] text-xs font-bold">×</span>

        {/* Reps input */}
        <div className="w-14">
          <input
            type="number"
            value={reps}
            onChange={(e) =>
              setReps(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            disabled={isCompleted || isPending}
            min={1}
            max={99}
            className="w-full bg-[#211C23] border border-[#362E3B] rounded-lg py-2 px-2 text-center text-sm font-mono font-black text-[#F2EADF] focus:outline-none focus:border-[#7C1D38] disabled:opacity-75"
          />
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleToggleComplete}
        disabled={isPending}
        className={`flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
          isCompleted
            ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 hover:bg-[#34D399]/30"
            : isHeating
            ? "comic-btn-secondary"
            : "comic-btn-primary"
        } disabled:opacity-50 min-w-[85px]`}
      >
        <Check
          className={`w-3.5 h-3.5 ${isCompleted ? "text-[#34D399]" : ""}`}
        />
        <span>
          {isCompleted
            ? ar.workout.active.setCompleted
            : ar.workout.active.completeSetBtn}
        </span>
      </button>
    </div>
  );
}
