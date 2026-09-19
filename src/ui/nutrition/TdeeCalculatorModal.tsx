"use client";

import { useState, useTransition } from "react";
import { X, Calculator, Sparkles, Check, AlertCircle } from "lucide-react";
import { calculateTDEE } from "@/src/domain/nutrition/nutrition-engine";
import { TdeeCalculationResult } from "@/src/domain/nutrition/types";
import { updateNutritionTargetsAction } from "@/src/server/nutrition-actions";
import { ar } from "@/src/i18n/ar";

interface TdeeCalculatorModalProps {
  isOpen: boolean;
  date: string;
  onClose: () => void;
  onTargetsApplied?: () => void;
}

export function TdeeCalculatorModal({
  isOpen,
  date,
  onClose,
  onTargetsApplied,
}: TdeeCalculatorModalProps) {
  const [weight, setWeight] = useState("80");
  const [height, setHeight] = useState("178");
  const [age, setAge] = useState("25");
  const [activity, setActivity] = useState("1.55");
  const [result, setResult] = useState<TdeeCalculationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    const act = parseFloat(activity);

    if (w > 0 && h > 0 && a > 0 && act > 0) {
      const res = calculateTDEE({
        weightKg: w,
        heightCm: h,
        age: a,
        activityMultiplier: act,
      });
      setResult(res);
    }
  };

  const handleApplyAsTargets = () => {
    if (!result) return;

    startTransition(async () => {
      const res = await updateNutritionTargetsAction({
        effectiveDate: date,
        targetCalories: result.tdee,
        targetProtein: result.suggestedProteinGrams,
        targetCarbs: result.suggestedCarbsGrams,
        targetFats: result.suggestedFatsGrams,
      });

      if (res.success) {
        onTargetsApplied?.();
        onClose();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="comic-card w-full max-w-lg p-6 border border-[#2A242E] bg-[#151318] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A242E]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
              <Calculator className="w-5 h-5" />
            </span>
            <div className="text-start">
              <h2 className="text-base sm:text-lg font-black text-[#F1E9DD]">
                {ar.nutrition.tdeeModal.title}
              </h2>
              <p className="text-[11px] text-[#A7A0A6]">
                {ar.nutrition.tdeeModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#1D1920] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Notice - Strict Rule Non-negotiable: formula is editable suggestion only */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1D1920] border border-[#C9A15A]/30 text-xs text-[#C9A15A] text-start leading-relaxed shadow-xs">
          <AlertCircle className="w-4 h-4 text-[#C9A15A] shrink-0 mt-0.5" />
          <span>{ar.nutrition.tdeeModal.disclaimer}</span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#A7A0A6] block">
                {ar.nutrition.tdeeModal.weightLabel}
              </label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#A7A0A6] block">
                {ar.nutrition.tdeeModal.heightLabel}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#A7A0A6] block">
                {ar.nutrition.tdeeModal.ageLabel}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#A7A0A6] block">
              {ar.nutrition.tdeeModal.activityLabel}
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
            >
              <option value="1.2">{ar.nutrition.tdeeModal.activitySedentary}</option>
              <option value="1.375">{ar.nutrition.tdeeModal.activityLight}</option>
              <option value="1.55">{ar.nutrition.tdeeModal.activityModerate}</option>
              <option value="1.725">{ar.nutrition.tdeeModal.activityHeavy}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all min-h-[44px] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C9A15A]" />
            <span>{ar.nutrition.tdeeModal.calculateBtn}</span>
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className="p-4 rounded-2xl bg-[#110F14] border border-[#2A242E] space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-3 text-start">
              <div className="p-3 rounded-xl bg-[#151318] border border-[#2A242E]">
                <span className="text-[11px] text-[#A7A0A6] block">
                  {ar.nutrition.tdeeModal.estimatedBmr}
                </span>
                <span className="text-lg font-black text-[#F1E9DD] font-mono">
                  {result.bmr.toLocaleString()} kcal
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#151318] border border-[#C9A15A]/40">
                <span className="text-[11px] text-[#C9A15A] block font-bold">
                  {ar.nutrition.tdeeModal.estimatedTdee}
                </span>
                <span className="text-lg font-black text-[#C9A15A] font-mono">
                  {result.tdee.toLocaleString()} kcal
                </span>
              </div>
            </div>

            {/* Suggested Macro Splits */}
            <div className="space-y-1.5 text-start">
              <span className="text-xs font-bold text-[#F1E9DD] block">
                {ar.nutrition.tdeeModal.suggestedSplit}
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-[#7A1735]/15 border border-[#7A1735]/30 text-[#A83252] text-xs">
                  <span className="block font-bold">{result.suggestedProteinGrams}g</span>
                  <span className="text-[10px] text-[#A7A0A6]">{ar.nutrition.protein}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#C9A15A]/15 border border-[#C9A15A]/30 text-[#C9A15A] text-xs">
                  <span className="block font-bold">{result.suggestedCarbsGrams}g</span>
                  <span className="text-[10px] text-[#A7A0A6]">{ar.nutrition.carbs}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-xs">
                  <span className="block font-bold">{result.suggestedFatsGrams}g</span>
                  <span className="text-[10px] text-[#A7A0A6]">{ar.nutrition.fats}</span>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            <button
              onClick={handleApplyAsTargets}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#C9A15A] hover:bg-[#B88F48] text-[#110F14] font-black text-xs shadow-lg shadow-[#C9A15A]/20 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {isPending ? ar.nutrition.tdeeModal.applying : ar.nutrition.tdeeModal.applyAsTargetsBtn}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
