"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Target, Calculator, Utensils } from "lucide-react";
import { DailyNutritionSummary } from "@/src/domain/nutrition/types";
import { MacroProgressCards } from "./MacroProgressCards";
import { DateNavigator } from "./DateNavigator";
import { MealList } from "./MealList";
import { AddMealModal } from "./AddMealModal";
import { EditTargetsModal } from "./EditTargetsModal";
import { TdeeCalculatorModal } from "./TdeeCalculatorModal";
import { QuoteBanner } from "@/ui/QuoteBanner";
import { ar } from "@/src/i18n/ar";

interface NutritionViewProps {
  initialSummary: DailyNutritionSummary;
}

export function NutritionView({ initialSummary }: NutritionViewProps) {
  const router = useRouter();
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isEditTargetsOpen, setIsEditTargetsOpen] = useState(false);
  const [isTdeeOpen, setIsTdeeOpen] = useState(false);

  const handleDateChange = (newDate: string) => {
    router.push(`/nutrition?date=${newDate}`);
  };

  const handleDataChanged = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Controls: Date Navigator & Action Buttons */}
      <div className="space-y-3">
        <DateNavigator
          currentDate={initialSummary.date}
          onDateChange={handleDateChange}
        />

        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditTargetsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#2B252E] bg-[#1A151D] hover:bg-[#211C23] text-xs font-bold text-[#F2EADF] transition-all"
            >
              <Target className="w-4 h-4 text-[#D6AA63]" />
              <span>{ar.nutrition.editTargetsCTA}</span>
            </button>

            <button
              onClick={() => setIsTdeeOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#2B252E] bg-[#1A151D] hover:bg-[#211C23] text-xs font-bold text-[#9D969D] hover:text-[#F2EADF] transition-all"
            >
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>{ar.nutrition.tdeeCalculatorCTA}</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddMealOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{ar.nutrition.logMealCTA}</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <MacroProgressCards summary={initialSummary} />

      {/* Meals List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <Utensils className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-[#F2EADF]">
              {ar.nutrition.mealsTitle} ({initialSummary.meals.length})
            </h3>
          </div>
        </div>

        <MealList
          meals={initialSummary.meals}
          onMealDeleted={handleDataChanged}
        />
      </div>

      {/* Motivational Banner */}
      <QuoteBanner context="nutrition" tag="FUEL YOUR ENGINE" />

      {/* Modals */}
      <AddMealModal
        isOpen={isAddMealOpen}
        date={initialSummary.date}
        onClose={() => setIsAddMealOpen(false)}
        onMealAdded={handleDataChanged}
      />

      <EditTargetsModal
        isOpen={isEditTargetsOpen}
        currentTarget={initialSummary.target}
        date={initialSummary.date}
        onClose={() => setIsEditTargetsOpen(false)}
        onTargetsUpdated={handleDataChanged}
      />

      <TdeeCalculatorModal
        isOpen={isTdeeOpen}
        date={initialSummary.date}
        onClose={() => setIsTdeeOpen(false)}
        onTargetsApplied={handleDataChanged}
      />
    </div>
  );
}
