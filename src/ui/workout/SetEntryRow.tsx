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
      className={`rounded-2xl p-3 sm:p-3.5 border transition-all flex items-center justify-between gap-2.5 ${
        isCompleted
          ? "bg-[#151318] border-[#34D399]/60 shadow-xs"
          : isHeating
          ? "bg-[#151318] border-[#C9A15A]/30"
          : "bg-[#151318] border-[#2A242E] hover:border-[#7A1735]/50"
      }`}
    >
      {/* Set Label */}
      <div className="flex items-center gap-2.5 min-w-[85px]">
        {isHeating ? (
          <span className="p-2 rounded-xl bg-[#1D1920] text-[#C9A15A] border border-[#C9A15A]/30">
            <Flame className="w-4 h-4" />
          </span>
        ) : (
          <span className="p-2 rounded-xl bg-[#1D1920] text-[#A83252] border border-[#7A1735]/40">
            <Dumbbell className="w-4 h-4" />
          </span>
        )}
        <div className="text-right">
          <span className="text-xs font-black text-[#F1E9DD] block">
            {ar.workout.active.setNumber.replace("{num}", String(setNumber))}
          </span>
          <span className="text-[11px] text-[#A7A0A6] font-mono font-semibold">
            {formatWeight(targetWeight)}
          </span>
        </div>
      </div>

      {/* Inputs for weight & reps (48px gym tap target) */}
      <div className="flex items-center gap-2 flex-1 justify-center max-w-[210px]">
        {/* Weight input */}
        <div className="flex-1">
          <input
            type="text"
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
            disabled={isCompleted || isPending}
            placeholder={ar.workout.active.weightPlaceholder}
            className="w-full h-12 bg-[#1D1920] border border-[#2A242E] rounded-xl px-2 text-center text-sm font-mono font-black text-[#F1E9DD] focus:outline-none focus:border-[#A83252] focus:ring-1 focus:ring-[#A83252] disabled:opacity-70 transition-colors"
          />
        </div>

        <span className="text-[#A7A0A6] text-xs font-bold font-latin">×</span>

        {/* Reps input */}
        <div className="w-16">
          <input
            type="number"
            value={reps}
            onChange={(e) =>
              setReps(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            disabled={isCompleted || isPending}
            min={1}
            max={99}
            className="w-full h-12 bg-[#1D1920] border border-[#2A242E] rounded-xl px-2 text-center text-sm font-mono font-black text-[#F1E9DD] focus:outline-none focus:border-[#A83252] focus:ring-1 focus:ring-[#A83252] disabled:opacity-70 transition-colors"
          />
        </div>
      </div>

      {/* Complete Button (44px min tap target) */}
      <button
        onClick={handleToggleComplete}
        disabled={isPending}
        className={`flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[48px] py-2.5 px-3 sm:px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
          isCompleted
            ? "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/40 hover:bg-[#34D399]/25"
            : isHeating
            ? "hub-btn-secondary"
            : "hub-btn-primary"
        } disabled:opacity-50 min-w-[90px]`}
      >
        <Check
          className={`w-4 h-4 ${isCompleted ? "text-[#34D399]" : ""}`}
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

