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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="comic-card w-full max-w-lg p-6 border border-[#2B252E] bg-[#1A151D] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2B252E]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Calculator className="w-5 h-5" />
            </span>
            <div className="text-start">
              <h2 className="text-base sm:text-lg font-black text-[#F2EADF]">
                {ar.nutrition.tdeeModal.title}
              </h2>
              <p className="text-[11px] text-[#9D969D]">
                {ar.nutrition.tdeeModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#211C23] border border-[#2B252E] text-[11px] text-[#9D969D] text-start leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#D6AA63] shrink-0 mt-0.5" />
          <span>{ar.nutrition.tdeeModal.disclaimer}</span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#9D969D] block">
                {ar.nutrition.tdeeModal.weightLabel}
              </label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm font-mono text-[#F2EADF] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#9D969D] block">
                {ar.nutrition.tdeeModal.heightLabel}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm font-mono text-[#F2EADF] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#9D969D] block">
                {ar.nutrition.tdeeModal.ageLabel}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm font-mono text-[#F2EADF] focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#9D969D] block">
              {ar.nutrition.tdeeModal.activityLabel}
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110D13] border border-[#2B252E] text-xs text-[#F2EADF] focus:outline-none focus:border-purple-500"
            >
              <option value="1.2">{ar.nutrition.tdeeModal.activitySedentary}</option>
              <option value="1.375">{ar.nutrition.tdeeModal.activityLight}</option>
              <option value="1.55">{ar.nutrition.tdeeModal.activityModerate}</option>
              <option value="1.725">{ar.nutrition.tdeeModal.activityHeavy}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{ar.nutrition.tdeeModal.calculateBtn}</span>
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className="p-4 rounded-2xl bg-[#110D13] border border-[#2B252E] space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-3 text-start">
              <div className="p-3 rounded-xl bg-[#1A151D] border border-[#2B252E]">
                <span className="text-[11px] text-[#9D969D] block">
                  {ar.nutrition.tdeeModal.estimatedBmr}
                </span>
                <span className="text-lg font-black text-[#F2EADF] font-mono">
                  {result.bmr.toLocaleString()} kcal
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#1A151D] border border-orange-500/30">
                <span className="text-[11px] text-orange-400 block font-bold">
                  {ar.nutrition.tdeeModal.estimatedTdee}
                </span>
                <span className="text-lg font-black text-orange-300 font-mono">
                  {result.tdee.toLocaleString()} kcal
                </span>
              </div>
            </div>

            {/* Suggested Macro Splits */}
            <div className="space-y-1.5 text-start">
              <span className="text-xs font-bold text-[#F2EADF] block">
                {ar.nutrition.tdeeModal.suggestedSplit}
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs">
                  <span className="block font-bold">{result.suggestedProteinGrams}g</span>
                  <span className="text-[10px] text-[#9D969D]">{ar.nutrition.protein}</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-amber-300 text-xs">
                  <span className="block font-bold">{result.suggestedCarbsGrams}g</span>
                  <span className="text-[10px] text-[#9D969D]">{ar.nutrition.carbs}</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/20 text-sky-300 text-xs">
                  <span className="block font-bold">{result.suggestedFatsGrams}g</span>
                  <span className="text-[10px] text-[#9D969D]">{ar.nutrition.fats}</span>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            <button
              onClick={handleApplyAsTargets}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#D6AA63] hover:bg-[#C29650] text-[#110D13] font-black text-xs shadow-lg shadow-amber-950/30 transition-all disabled:opacity-50"
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
