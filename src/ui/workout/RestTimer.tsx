"use client";

import { ar } from "@/src/i18n/ar";
import { Clock, Plus, Minus, X } from "lucide-react";

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
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progressPercent = totalSeconds > 0
    ? Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100))
    : 100;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500/50 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 text-slate-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-indigo-300">{ar.workout.timer.title}</span>
          </div>

          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title={ar.workout.timer.skipTimer}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Countdown Display */}
        <div className="text-center py-2">
          <span className="text-4xl font-black tracking-wider font-mono text-white drop-shadow">
            {formattedTime}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTime(30)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{ar.workout.timer.add30s}</span>
            </button>

            <button
              onClick={() => onAddTime(-30)}
              disabled={secondsRemaining <= 30}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>{ar.workout.timer.sub30s}</span>
            </button>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            {ar.workout.timer.skipTimer}
          </button>
        </div>
      </div>
    </div>
  );
}
