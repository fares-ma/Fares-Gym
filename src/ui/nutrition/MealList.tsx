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
      <div className="comic-card p-8 border border-dashed border-[#2B252E] text-center space-y-3 bg-[#161218]">
        <div className="w-12 h-12 rounded-2xl bg-[#211C23] text-[#D6AA63] mx-auto flex items-center justify-center">
          <Utensils className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-[#9D969D] max-w-sm mx-auto leading-relaxed">
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
            className="comic-card p-3.5 sm:p-4 border border-[#2B252E] bg-[#1A151D] hover:border-[#3B3240] transition-all flex items-center justify-between gap-3"
          >
            {/* Meal info & macros */}
            <div className="space-y-1.5 text-start flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#F2EADF] truncate">
                  {meal.name}
                </span>
                <span className="text-[11px] font-mono text-[#9D969D] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeStr}
                </span>
              </div>

              {/* Macro chips */}
              <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                  {meal.proteinGrams}g P
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                  {meal.carbsGrams}g C
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/20">
                  {meal.fatsGrams}g F
                </span>
              </div>
            </div>

            {/* Calories & Delete Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-end">
                <span className="text-base sm:text-lg font-black font-mono text-[#F2EADF]">
                  {meal.calories}
                </span>
                <span className="text-[10px] text-[#9D969D] block font-mono">
                  {ar.nutrition.kcal}
                </span>
              </div>

              <button
                onClick={() => handleDelete(meal.id)}
                disabled={isPending}
                className="p-2 rounded-xl text-[#9D969D] hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-40"
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
