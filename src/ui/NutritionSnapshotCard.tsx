import React from "react";
import Link from "next/link";
import { Flame, Utensils } from "lucide-react";
import { ar } from "@/i18n/ar";

interface NutritionSnapshotCardProps {
  consumedCalories?: number;
  targetCalories?: number;
  proteinConsumed?: number;
  proteinTarget?: number;
  carbsConsumed?: number;
  carbsTarget?: number;
  fatConsumed?: number;
  fatTarget?: number;
  loggedMeals?: number;
  totalMeals?: number;
}

export const NutritionSnapshotCard: React.FC<NutritionSnapshotCardProps> = ({
  consumedCalories = 0,
  targetCalories = 0,
  proteinConsumed = 0,
  proteinTarget = 0,
  carbsConsumed = 0,
  carbsTarget = 0,
  fatConsumed = 0,
  fatTarget = 0,
  loggedMeals = 0,
  totalMeals = 0,
}) => {
  const caloriePercent =
    targetCalories > 0
      ? Math.min(100, Math.round((consumedCalories / targetCalories) * 100))
      : 0;

  return (
    <div className="hub-card p-4 md:p-5 flex flex-col justify-between border border-[#2A242E]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A15A]" />
          <h3 className="text-base font-black text-[#F1E9DD]">{ar.home.nutritionTitle}</h3>
        </div>
        <Link
          href="/nutrition"
          className="text-xs font-bold text-[#A7A0A6] hover:text-[#C9A15A] transition-colors flex items-center gap-1"
        >
          <span>{ar.home.nutritionViewDetails}</span>
          <span className="text-xs select-none">‹</span>
        </Link>
      </div>

      {/* Main Content: Ring + Bars */}
      <div className="flex items-center gap-4 my-auto">
        {/* Calorie Progress Ring (SVG) */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#1D1920]"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#7A1735]"
              strokeDasharray={`${caloriePercent}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Flame className="w-4 h-4 text-[#C9A15A] mb-0.5" />
            <span className="text-sm font-black text-[#F1E9DD] font-mono leading-none">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#A7A0A6] font-mono mt-0.5">
              / {targetCalories.toLocaleString()}
            </span>
            <span className="text-[8px] text-[#A7A0A6]/70">{ar.home.caloriesUnit}</span>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#A7A0A6] mb-1">
              <span>{ar.nutrition.protein}</span>
              <span className="font-mono text-[#F1E9DD]">
                {proteinConsumed} / {proteinTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1D1920] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A83252] rounded-full transition-all duration-300"
                style={{
                  width: `${proteinTarget > 0 ? Math.min(100, (proteinConsumed / proteinTarget) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#A7A0A6] mb-1">
              <span>{ar.nutrition.carbs}</span>
              <span className="font-mono text-[#F1E9DD]">
                {carbsConsumed} / {carbsTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1D1920] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A15A] rounded-full transition-all duration-300"
                style={{
                  width: `${carbsTarget > 0 ? Math.min(100, (carbsConsumed / carbsTarget) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#A7A0A6] mb-1">
              <span>{ar.nutrition.fats}</span>
              <span className="font-mono text-[#F1E9DD]">
                {fatConsumed} / {fatTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1D1920] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E4D4C8] rounded-full transition-all duration-300"
                style={{
                  width: `${fatTarget > 0 ? Math.min(100, (fatConsumed / fatTarget) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#2A242E] flex items-center justify-between text-xs text-[#A7A0A6]">
        <div className="flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5 text-[#C9A15A]" />
          <span>{ar.home.loggedMeals}</span>
        </div>
        <span className="font-mono font-bold text-[#F1E9DD]">
          {loggedMeals} {totalMeals > 0 ? `/ ${totalMeals}` : ""}
        </span>
      </div>
    </div>
  );
};

