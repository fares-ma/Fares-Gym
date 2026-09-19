"use client";

import React from "react";
import { Flame, Trophy, CalendarCheck, TrendingUp } from "lucide-react";
import { ConsistencyMetrics } from "@/src/domain/progress/types";
import { MiniFares } from "@/ui/MiniFares";
import { ar } from "@/i18n/ar";

interface ProgressOverviewCardProps {
  metrics: ConsistencyMetrics;
}

export function ProgressOverviewCard({ metrics }: ProgressOverviewCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#7A1735] bg-gradient-to-br from-[#2A101A] via-[#1D1219] to-[#120E15] p-5 sm:p-6 shadow-xl">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#7A1735]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
        {/* Left / Content side */}
        <div className="flex-1 space-y-4 text-start w-full sm:w-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="comic-badge text-[10px] bg-[#7A1735] text-[#F1E9DD] font-bold">
                {ar.progress.consistencyTitle}
              </span>
              <span className="text-[10px] text-[#C9A15A] font-mono font-bold uppercase tracking-wider">
                DISCIPLINE & STREAK
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F1E9DD] mt-1">
              {ar.progress.consistencySubtitle}
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
            {/* Total Sessions */}
            <div className="comic-card p-3 bg-[#151318]/90 border border-[#2A242E] flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#251928] text-[#C9A15A] flex items-center justify-center mb-1 border border-[#2A242E]">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-2xl font-black text-[#F1E9DD] font-mono">
                {metrics.totalCompletedSessions}
              </span>
              <span className="text-[10px] text-[#A7A0A6] font-medium leading-tight">
                {ar.progress.totalSessions}
              </span>
            </div>

            {/* Streak */}
            <div className="comic-card p-3 bg-[#151318]/90 border border-[#2A242E] flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#251928] text-[#E0537A] flex items-center justify-center mb-1 border border-[#2A242E]">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-2xl font-black text-[#F1E9DD] font-mono">
                {metrics.currentStreakWeeks}{" "}
                <span className="text-xs font-bold text-[#A7A0A6]">
                  {ar.progress.weeksSuffix}
                </span>
              </span>
              <span className="text-[10px] text-[#A7A0A6] font-medium leading-tight">
                {ar.progress.currentStreak}
              </span>
            </div>

            {/* 30-Day Activity Rate */}
            <div className="comic-card p-3 bg-[#151318]/90 border border-[#2A242E] flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#251928] text-[#34D399] flex items-center justify-center mb-1 border border-[#2A242E]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-2xl font-black text-[#34D399] font-mono">
                {metrics.last30DaysActiveCount}{" "}
                <span className="text-[11px] text-[#A7A0A6]">{ar.progress.daysSuffix}</span>
              </span>

              <span className="text-[10px] text-[#A7A0A6] font-medium leading-tight">
                {ar.progress.activeDaysMonth} ({metrics.last30DaysRate}%)
              </span>
            </div>
          </div>
        </div>

        {/* Character Illustration */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-36 h-36 sm:w-44 sm:h-44 relative">
            <MiniFares
              pose="trophy"
              size="lg"
              animate="breathe"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
