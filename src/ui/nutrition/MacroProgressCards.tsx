"use client";

import { Flame, Beef, Wheat, Droplet } from "lucide-react";
import { DailyNutritionSummary } from "@/src/domain/nutrition/types";
import { ar } from "@/src/i18n/ar";

interface MacroProgressCardsProps {
  summary: DailyNutritionSummary;
}

export function MacroProgressCards({ summary }: MacroProgressCardsProps) {
  const { calories, protein, carbs, fats } = summary;
  const hasTarget = Boolean(summary.target && calories.target > 0);

  return (
    <div className="space-y-4">
      {/* Calories Hero Card */}
      <div className="comic-card p-5 sm:p-6 border border-[#2A242E] bg-gradient-to-br from-[#1D1920] via-[#17141A] to-[#120F15] relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7A0A6]">
                {ar.nutrition.calories}
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#F1E9DD] font-mono tracking-tight">
                {calories.consumed.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#A7A0A6] font-mono">
                {hasTarget
                  ? `/ ${calories.target.toLocaleString()} ${ar.nutrition.kcal}`
                  : `/ —`}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
            {hasTarget ? (
              <>
                <span
                  className={`comic-badge text-xs px-3 py-1 font-bold ${
                    calories.isSurplus
                      ? "bg-[#4A1024] text-[#F1E9DD] border border-[#7A1735]"
                      : "bg-[#1D1920] text-[#C9A15A] border border-[#C9A15A]/30"
                  }`}
                >
                  {calories.isSurplus
                    ? `+${(calories.consumed - calories.target).toLocaleString()} ${ar.nutrition.surplus}`
                    : `${calories.remaining.toLocaleString()} ${ar.nutrition.remaining}`}
                </span>
                <span className="text-xs font-mono text-[#A7A0A6]">
                  {calories.percentage}% {ar.nutrition.target}
                </span>
              </>
            ) : (
              <span className="comic-badge text-xs px-3 py-1 font-bold bg-[#1D1920] text-[#C9A15A] border border-[#C9A15A]/30">
                {ar.nutrition.noTargetsSet || "لم يتم تحديد أهداف بعد"}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-[#110F14] rounded-full h-3.5 overflow-hidden p-0.5 border border-[#2A242E]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              calories.isSurplus
                ? "bg-gradient-to-r from-[#7A1735] to-[#EF4444]"
                : "bg-gradient-to-r from-[#7A1735] to-[#C9A15A]"
            }`}
            style={{ width: `${hasTarget ? Math.min(100, calories.percentage) : 0}%` }}
          />
        </div>
      </div>

      {/* 3 Macro Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Protein Card */}
        <div className="comic-card p-4 border border-[#2A242E] bg-[#151318] hover:border-[#3D3342] transition-colors flex flex-col justify-between gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-[#7A1735]/20 text-[#A83252] border border-[#7A1735]/30">
                <Beef className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F1E9DD]">
                {ar.nutrition.protein}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A83252] font-bold">
              {hasTarget ? `${protein.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F1E9DD]">
                {protein.consumed}
              </span>
              <span className="text-xs text-[#A7A0A6]">
                / {hasTarget ? `${protein.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#A7A0A6] block mt-0.5">
              {hasTarget
                ? (protein.isSurplus
                    ? `+${Math.round((protein.consumed - protein.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${protein.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110F14] rounded-full h-2 overflow-hidden border border-[#2A242E]">
            <div
              className="h-full bg-gradient-to-r from-[#7A1735] to-[#A83252] rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, protein.percentage) : 0}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="comic-card p-4 border border-[#2A242E] bg-[#151318] hover:border-[#3D3342] transition-colors flex flex-col justify-between gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-[#C9A15A]/20 text-[#C9A15A] border border-[#C9A15A]/30">
                <Wheat className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F1E9DD]">
                {ar.nutrition.carbs}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#C9A15A] font-bold">
              {hasTarget ? `${carbs.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F1E9DD]">
                {carbs.consumed}
              </span>
              <span className="text-xs text-[#A7A0A6]">
                / {hasTarget ? `${carbs.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#A7A0A6] block mt-0.5">
              {hasTarget
                ? (carbs.isSurplus
                    ? `+${Math.round((carbs.consumed - carbs.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${carbs.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110F14] rounded-full h-2 overflow-hidden border border-[#2A242E]">
            <div
              className="h-full bg-gradient-to-r from-[#9E7B3B] to-[#C9A15A] rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, carbs.percentage) : 0}%` }}
            />
          </div>
        </div>

        {/* Fats Card */}
        <div className="comic-card p-4 border border-[#2A242E] bg-[#151318] hover:border-[#3D3342] transition-colors flex flex-col justify-between gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">
                <Droplet className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F1E9DD]">
                {ar.nutrition.fats}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#34D399] font-bold">
              {hasTarget ? `${fats.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F1E9DD]">
                {fats.consumed}
              </span>
              <span className="text-xs text-[#A7A0A6]">
                / {hasTarget ? `${fats.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#A7A0A6] block mt-0.5">
              {hasTarget
                ? (fats.isSurplus
                    ? `+${Math.round((fats.consumed - fats.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${fats.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110F14] rounded-full h-2 overflow-hidden border border-[#2A242E]">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, fats.percentage) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
