"use client";

import { useTransition } from "react";
import { Trash2, Clock, Utensils } from "lucide-react";
import { MealEntry } from "@/src/domain/nutrition/types";
import { deleteMealAction } from "@/src/server/nutrition-actions";
import { ar } from "@/src/i18n/ar";

interface MealListProps {
  meals: MealEntry[];
  onMealDeleted?: () => void;
}

export function MealList({ meals, onMealDeleted }: MealListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (mealId: string) => {
    if (!window.confirm(ar.nutrition.confirmDeleteMeal)) return;

    startTransition(async () => {
      const res = await deleteMealAction(mealId);
      if (res.success) {
        onMealDeleted?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  if (meals.length === 0) {
    return (
      <div className="comic-card p-8 border border-dashed border-[#2A242E] text-center space-y-3 bg-[#151318]">
        <div className="w-12 h-12 rounded-2xl bg-[#1D1920] text-[#C9A15A] mx-auto flex items-center justify-center border border-[#2A242E]">
          <Utensils className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-[#A7A0A6] max-w-sm mx-auto leading-relaxed">
          {ar.nutrition.emptyMeals}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {meals.map((meal) => {
        const timeStr = new Date(meal.loggedAt).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={meal.id}
            className="comic-card p-3.5 sm:p-4 border border-[#2A242E] bg-[#151318] hover:border-[#3D3342] transition-all flex items-center justify-between gap-3 shadow-sm"
          >
            {/* Meal info & macros */}
            <div className="space-y-1.5 text-start flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#F1E9DD] truncate">
                  {meal.name}
                </span>
                <span className="text-[11px] font-mono text-[#A7A0A6] flex items-center gap-1 bg-[#1D1920] px-2 py-0.5 rounded-md border border-[#2A242E]">
                  <Clock className="w-3 h-3 text-[#C9A15A]" />
                  {timeStr}
                </span>
              </div>

              {/* Macro chips */}
              <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-[#7A1735]/15 text-[#A83252] font-semibold border border-[#7A1735]/30">
                  {meal.proteinGrams}g P
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#C9A15A]/15 text-[#C9A15A] font-semibold border border-[#C9A15A]/30">
                  {meal.carbsGrams}g C
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#34D399]/15 text-[#34D399] font-semibold border border-[#34D399]/30">
                  {meal.fatsGrams}g F
                </span>
              </div>
            </div>

            {/* Calories & Delete Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-end">
                <span className="text-base sm:text-lg font-black font-mono text-[#F1E9DD]">
                  {meal.calories}
                </span>
                <span className="text-[10px] text-[#A7A0A6] block font-mono">
                  {ar.nutrition.kcal}
                </span>
              </div>

              <button
                onClick={() => handleDelete(meal.id)}
                disabled={isPending}
                className="p-2 rounded-xl text-[#A7A0A6] hover:text-red-400 hover:bg-red-950/30 transition-all disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title={ar.nutrition.deleteMeal}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
