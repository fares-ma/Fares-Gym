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
      <div className="comic-card p-5 sm:p-6 border border-[#2B252E] bg-gradient-to-br from-[#1F1922] to-[#161218] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9D969D]">
                {ar.nutrition.calories}
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#F2EADF] font-mono">
                {calories.consumed.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#9D969D] font-mono">
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
                      ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {calories.isSurplus
                    ? `+${(calories.consumed - calories.target).toLocaleString()} ${ar.nutrition.surplus}`
                    : `${calories.remaining.toLocaleString()} ${ar.nutrition.remaining}`}
                </span>
                <span className="text-xs font-mono text-[#9D969D]">
                  {calories.percentage}% {ar.nutrition.target}
                </span>
              </>
            ) : (
              <span className="comic-badge text-xs px-3 py-1 font-bold bg-[#211C23] text-[#D6AA63] border border-[#D6AA63]/30">
                {ar.nutrition.noTargetsSet || "لم يتم تحديد أهداف بعد"}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-[#110D13] rounded-full h-3.5 overflow-hidden p-0.5 border border-[#2B252E]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              calories.isSurplus
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-orange-500 to-emerald-400"
            }`}
            style={{ width: `${hasTarget ? Math.min(100, calories.percentage) : 0}%` }}
          />
        </div>
      </div>

      {/* 3 Macro Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Protein Card */}
        <div className="comic-card p-4 border border-[#2B252E] bg-[#1A151D] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                <Beef className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F2EADF]">
                {ar.nutrition.protein}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {hasTarget ? `${protein.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F2EADF]">
                {protein.consumed}
              </span>
              <span className="text-xs text-[#9D969D]">
                / {hasTarget ? `${protein.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#9D969D] block mt-0.5">
              {hasTarget
                ? (protein.isSurplus
                    ? `+${Math.round((protein.consumed - protein.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${protein.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110D13] rounded-full h-2 overflow-hidden border border-[#2B252E]">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, protein.percentage) : 0}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="comic-card p-4 border border-[#2B252E] bg-[#1A151D] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                <Wheat className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F2EADF]">
                {ar.nutrition.carbs}
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {hasTarget ? `${carbs.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F2EADF]">
                {carbs.consumed}
              </span>
              <span className="text-xs text-[#9D969D]">
                / {hasTarget ? `${carbs.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#9D969D] block mt-0.5">
              {hasTarget
                ? (carbs.isSurplus
                    ? `+${Math.round((carbs.consumed - carbs.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${carbs.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110D13] rounded-full h-2 overflow-hidden border border-[#2B252E]">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, carbs.percentage) : 0}%` }}
            />
          </div>
        </div>

        {/* Fats Card */}
        <div className="comic-card p-4 border border-[#2B252E] bg-[#1A151D] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-sky-500/10 text-sky-400">
                <Droplet className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#F2EADF]">
                {ar.nutrition.fats}
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-400 font-bold">
              {hasTarget ? `${fats.percentage}%` : "—"}
            </span>
          </div>

          <div className="text-start">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-black text-[#F2EADF]">
                {fats.consumed}
              </span>
              <span className="text-xs text-[#9D969D]">
                / {hasTarget ? `${fats.target} ${ar.nutrition.grams}` : "—"}
              </span>
            </div>
            <span className="text-[10px] text-[#9D969D] block mt-0.5">
              {hasTarget
                ? (fats.isSurplus
                    ? `+${Math.round((fats.consumed - fats.target) * 10) / 10} ${ar.nutrition.surplus}`
                    : `${fats.remaining} ${ar.nutrition.remaining}`)
                : "—"}
            </span>
          </div>

          <div className="w-full bg-[#110D13] rounded-full h-2 overflow-hidden border border-[#2B252E]">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${hasTarget ? Math.min(100, fats.percentage) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
