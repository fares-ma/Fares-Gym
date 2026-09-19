"use client";

import { ar } from "@/i18n/ar";
import { Plus, Minus, X } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";

interface RestTimerProps {
  secondsRemaining: number;
  totalSeconds: number;
  onAddTime: (seconds: number) => void;
  onSkip: () => void;
}

export function RestTimer({
  secondsRemaining,
  totalSeconds,
  onAddTime,
  onSkip,
}: RestTimerProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const progressPercent =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100)
        )
      : 100;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-3 md:inset-x-auto md:end-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="hub-card-accent p-4.5 shadow-2xl shadow-black/80 text-[#F1E9DD] border border-[#7A1735]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="hub-badge-burgundy text-[10px] font-latin">
              REST & RECOVERY
            </span>
            <span className="font-black text-xs text-[#C9A15A]">
              {ar.workout.timer.title}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="text-[#A7A0A6] hover:text-[#F1E9DD] p-1.5 rounded-lg hover:bg-[#1D1920] transition-colors cursor-pointer"
            title={ar.workout.timer.skipTimer}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Sitting character + Big Countdown */}
        <div className="flex items-center justify-between gap-4 py-2 px-1">
          {/* Mini Fares sitting on bench breathing */}
          <div className="shrink-0 flex items-center justify-center">
            <MiniFares
              pose="rest-timer-sitting"
              size="md"
              animate="breathe"
              alt="Mini Fares Resting"
            />
          </div>

          {/* Time Display */}
          <div className="flex-1 text-center">
            <div className="text-4xl font-black tracking-wider font-mono text-[#F1E9DD] drop-shadow">
              {formattedTime}
            </div>
            <p className="text-[11px] text-[#A7A0A6] font-medium mt-0.5">
              {ar.workout.timer.restTip}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1D1920] h-2 rounded-full overflow-hidden my-2 border border-[#2A242E]">
          <div
            className="bg-gradient-to-r from-[#7A1735] via-[#A83252] to-[#C9A15A] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTime(30)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#1D1920] hover:bg-[#26202A] text-[#F1E9DD] border border-[#2A242E] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A15A]" />
              <span>{ar.workout.timer.add30s}</span>
            </button>

            <button
              onClick={() => onAddTime(-30)}
              disabled={secondsRemaining <= 30}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#1D1920] hover:bg-[#26202A] text-[#F1E9DD] border border-[#2A242E] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-[#C9A15A]" />
              <span>{ar.workout.timer.sub30s}</span>
            </button>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-bold text-[#A7A0A6] hover:text-[#C9A15A] transition-colors cursor-pointer px-2 py-1"
          >
            {ar.workout.timer.skipTimer}
          </button>
        </div>
      </div>
    </div>
  );
}

