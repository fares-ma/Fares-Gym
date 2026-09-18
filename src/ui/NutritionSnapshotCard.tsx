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
  consumedCalories = 1450,
  targetCalories = 2200,
  proteinConsumed = 90,
  proteinTarget = 150,
  carbsConsumed = 180,
  carbsTarget = 250,
  fatConsumed = 40,
  fatTarget = 70,
  loggedMeals = 2,
  totalMeals = 3,
}) => {
  const caloriePercent = Math.min(
    100,
    Math.round((consumedCalories / targetCalories) * 100)
  );

  return (
    <div className="comic-card p-4 md:p-5 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-black text-[#F2EADF]">{ar.home.nutritionTitle}</h3>
        <Link
          href="/nutrition"
          className="text-xs font-bold text-[#9D969D] hover:text-[#D6AA63] transition-colors flex items-center gap-1"
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
              className="text-[#211C23]"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#7C1D38]"
              strokeDasharray={`${caloriePercent}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Flame className="w-4 h-4 text-[#D6AA63] mb-0.5" />
            <span className="text-sm font-black text-[#F2EADF] font-mono leading-none">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#9D969D] font-mono mt-0.5">
              / {targetCalories.toLocaleString()}
            </span>
            <span className="text-[8px] text-[#9D969D]/80">{ar.home.caloriesUnit}</span>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#9D969D] mb-1">
              <span>{ar.nutrition.protein}</span>
              <span className="font-mono text-[#F2EADF]">
                {proteinConsumed} / {proteinTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#211C23] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A83252] rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (proteinConsumed / proteinTarget) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#9D969D] mb-1">
              <span>{ar.nutrition.carbs}</span>
              <span className="font-mono text-[#F2EADF]">
                {carbsConsumed} / {carbsTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#211C23] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D6AA63] rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (carbsConsumed / carbsTarget) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#9D969D] mb-1">
              <span>{ar.nutrition.fats}</span>
              <span className="font-mono text-[#F2EADF]">
                {fatConsumed} / {fatTarget}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#211C23] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E4D4C8] rounded-full"
                style={{
                  width: `${Math.min(100, (fatConsumed / fatTarget) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#2B252E] flex items-center justify-between text-xs text-[#9D969D]">
        <div className="flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5 text-[#7C1D38]" />
          <span>{ar.home.loggedMeals}</span>
        </div>
        <span className="font-mono font-bold text-[#F2EADF]">
          {loggedMeals} / {totalMeals}
        </span>
      </div>
    </div>
  );
};
