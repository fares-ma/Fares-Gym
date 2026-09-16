"use client";

import { useState, useTransition } from "react";
import { formatWeight } from "@/src/domain/workout/weight-parser";
import { WeightValue } from "@/src/domain/workout/types";
import { ar } from "@/src/i18n/ar";
import { logSetEntryAction } from "@/src/server/workout-actions";
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
      className={`rounded-xl p-3 sm:p-4 border transition-all flex items-center justify-between gap-3 ${
        isCompleted
          ? "bg-emerald-950/20 border-emerald-500/40"
          : isHeating
          ? "bg-slate-900/40 border-amber-500/20"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Set Label */}
      <div className="flex items-center gap-2 min-w-[90px]">
        {isHeating ? (
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </span>
        ) : (
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Dumbbell className="w-4 h-4" />
          </span>
        )}
        <div className="text-right">
          <span className="text-xs font-bold text-slate-200 block">
            {ar.workout.active.setNumber.replace("{num}", String(setNumber))}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {formatWeight(targetWeight)}
          </span>
        </div>
      </div>

      {/* Editable Inputs */}
      <div className="flex items-center gap-2 flex-1 justify-center max-w-[200px]">
        {/* Weight input */}
        <div className="flex-1">
          <input
            type="text"
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
            disabled={isCompleted || isPending}
            placeholder={ar.workout.active.weightPlaceholder}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg py-1.5 px-2.5 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500 disabled:opacity-75"
          />
        </div>

        <span className="text-slate-500 text-xs font-bold">×</span>

        {/* Reps input */}
        <div className="w-14">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
            disabled={isCompleted || isPending}
            min={1}
            max={99}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg py-1.5 px-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500 disabled:opacity-75"
          />
        </div>
      </div>

      {/* Complete Set Action Button */}
      <button
        onClick={handleToggleComplete}
        disabled={isPending}
        className={`flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all ${
          isCompleted
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
            : isHeating
            ? "bg-amber-600 hover:bg-amber-500 text-white"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30"
        } disabled:opacity-50 min-w-[85px]`}
      >
        <Check className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-400" : ""}`} />
        <span>{isCompleted ? ar.workout.active.setCompleted : ar.workout.active.completeSetBtn}</span>
      </button>
    </div>
  );
}
