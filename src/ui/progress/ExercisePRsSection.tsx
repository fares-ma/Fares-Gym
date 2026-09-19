"use client";

import React, { useState } from "react";
import { Dumbbell, Search, Award, Calendar } from "lucide-react";
import { ExercisePR } from "@/src/domain/progress/types";
import { formatPRComparison } from "@/src/domain/progress/progress-engine";
import { ar } from "@/i18n/ar";

interface ExercisePRsSectionProps {
  prs: ExercisePR[];
}

export function ExercisePRsSection({ prs }: ExercisePRsSectionProps) {
  const [search, setSearch] = useState("");

  const filteredPRs = prs.filter((pr) =>
    pr.exerciseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="comic-card p-5 border border-[#2A242E] bg-[#151318] space-y-4 shadow-sm">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-start">
            <h3 className="text-base sm:text-lg font-black text-[#F1E9DD]">
              {ar.progress.recentPRsTitle}
            </h3>
            <p className="text-xs text-[#A7A0A6]">
              {ar.progress.prsSubtitle}
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute end-3 top-3 text-[#A7A0A6]" />
          <input
            type="text"
            placeholder={ar.progress.searchExercisesPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#110F14] border border-[#2A242E] rounded-xl pe-9 ps-3 py-2 text-xs text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A]"
          />
        </div>
      </div>

      {/* Grid of PR cards or empty state */}
      {filteredPRs.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2A242E] rounded-2xl bg-[#151318] p-6 space-y-2">
          <Dumbbell className="w-8 h-8 text-[#A7A0A6] mx-auto opacity-50" />
          <p className="text-xs text-[#A7A0A6]">
            {prs.length === 0 ? ar.progress.emptyPRs : ar.progress.noMatchingPRs}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPRs.map((pr) => {
            const comparisonText = formatPRComparison(pr);
            const achievedDateStr = new Date(pr.achievedAt).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={`${pr.exerciseId}::${pr.unitTag}`}
                className="comic-card p-4 bg-[#1D1920] border border-[#2A242E] hover:border-[#3D3342] transition-colors space-y-3 shadow-sm"
              >
                {/* Exercise name & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#F1E9DD] truncate max-w-[200px]">
                    {pr.exerciseName}
                  </span>
                  {pr.unitTag && (
                    <span className="comic-badge text-[10px] bg-[#151318] text-[#C9A15A] border border-[#C9A15A]/30">
                      {ar.progress.unitTagBadge} {pr.unitTag}
                    </span>
                  )}
                </div>

                {/* PR Numbers highlight */}
                <div className="flex items-baseline justify-between bg-[#110F14] p-2.5 rounded-xl border border-[#2A242E]">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-[#C9A15A] font-mono">
                      {pr.weight.rawWeight}
                    </span>
                    <span className="text-xs font-bold text-[#A7A0A6] me-2">
                      × {pr.reps} {ar.progress.repsSuffix}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#A7A0A6] font-mono">
                    <Calendar className="w-3 h-3 text-[#C9A15A]" />
                    <span>{achievedDateStr}</span>
                  </div>
                </div>

                {/* Objective Comparison string */}
                <div className="text-[11px] text-[#A7A0A6] flex items-center gap-1.5 pt-0.5 text-start">
                  <span className="text-[#34D399] font-bold">{ar.progress.comparisonLabel}</span>
                  <span className="font-mono text-[#F1E9DD]/90 truncate">
                    {comparisonText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
