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
    <div className="comic-card p-5 border border-[#2B252E] space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#211C23] text-[#D6AA63]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#F2EADF]">
              {ar.progress.recentPRsTitle}
            </h3>
            <p className="text-xs text-[#9D969D]">
              أعلى وزن وتكرار لكل تمرين بنظام المجموعات العاملة
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-[#9D969D]" />
          <input
            type="text"
            placeholder="بحث في التمارين..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141016] border border-[#2B252E] rounded-xl pr-9 pl-3 py-2 text-xs text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
          />
        </div>
      </div>

      {/* Grid of PR cards or empty state */}
      {filteredPRs.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2B252E] rounded-2xl bg-[#161218] p-6 space-y-2">
          <Dumbbell className="w-8 h-8 text-[#9D969D] mx-auto opacity-50" />
          <p className="text-xs text-[#9D969D]">
            {prs.length === 0 ? ar.progress.emptyPRs : "لا توجد نتائج مطابقة لبحثك."}
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
                className="comic-card p-4 bg-[#161218] border border-[#2B252E] hover:border-[#3D3342] transition-colors space-y-3"
              >
                {/* Exercise name & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#F2EADF] truncate max-w-[200px]">
                    {pr.exerciseName}
                  </span>
                  {pr.unitTag && (
                    <span className="comic-badge text-[10px] bg-[#211C23] text-[#D6AA63] border-[#D6AA63]/30">
                      الوحدة: {pr.unitTag}
                    </span>
                  )}
                </div>

                {/* PR Numbers highlight */}
                <div className="flex items-baseline justify-between bg-[#110D13] p-2.5 rounded-xl border border-[#231E26]">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-[#D6AA63] font-mono">
                      {pr.weight.rawWeight}
                    </span>
                    <span className="text-xs font-bold text-[#9D969D] mr-2">
                      × {pr.reps} عدات
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#9D969D] font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{achievedDateStr}</span>
                  </div>
                </div>

                {/* Objective Comparison string */}
                <div className="text-[11px] text-[#9D969D] flex items-center gap-1.5 pt-0.5">
                  <span className="text-[#34D399] font-bold">المقارنة:</span>
                  <span className="font-mono text-[#F2EADF]/90 truncate">
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
