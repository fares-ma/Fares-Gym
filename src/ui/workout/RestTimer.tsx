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
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="comic-card-accent p-4 shadow-2xl shadow-black/80 text-[#F2EADF] bg-[#18151B]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="comic-badge text-[10px] bg-[#7C1D38] text-[#F2EADF] border-none">
              REST & RECOVERY
            </span>
            <span className="font-black text-xs text-[#D6AA63]">
              {ar.workout.timer.title}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="text-[#9D969D] hover:text-[#F2EADF] p-1 rounded-lg hover:bg-[#211C23] transition-colors cursor-pointer"
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
            <div className="text-4xl font-black tracking-wider font-mono text-[#F2EADF] drop-shadow">
              {formattedTime}
            </div>
            <p className="text-[11px] text-[#9D969D] font-medium mt-0.5">
              خد نفسك واشرب مية 💧
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#211C23] h-2 rounded-full overflow-hidden my-2 border border-[#2B252E]">
          <div
            className="bg-gradient-to-r from-[#7C1D38] via-[#A83252] to-[#D6AA63] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTime(30)}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#211C23] hover:bg-[#2B252E] text-[#F2EADF] border border-[#362E3B] transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 text-[#D6AA63]" />
              <span>{ar.workout.timer.add30s}</span>
            </button>

            <button
              onClick={() => onAddTime(-30)}
              disabled={secondsRemaining <= 30}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#211C23] hover:bg-[#2B252E] text-[#F2EADF] border border-[#362E3B] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-3 h-3 text-[#D6AA63]" />
              <span>{ar.workout.timer.sub30s}</span>
            </button>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-bold text-[#9D969D] hover:text-[#D6AA63] transition-colors cursor-pointer"
          >
            {ar.workout.timer.skipTimer}
          </button>
        </div>
      </div>
    </div>
  );
}
