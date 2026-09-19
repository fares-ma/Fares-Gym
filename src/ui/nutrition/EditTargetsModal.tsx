"use client";

import { useState, useTransition } from "react";
import { X, Target, Check } from "lucide-react";
import { NutritionTarget } from "@/src/domain/nutrition/types";
import { updateNutritionTargetsAction } from "@/src/server/nutrition-actions";
import { ar } from "@/src/i18n/ar";

interface EditTargetsModalProps {
  isOpen: boolean;
  currentTarget: NutritionTarget | null;
  date: string;
  onClose: () => void;
  onTargetsUpdated?: () => void;
}

export function EditTargetsModal({
  isOpen,
  currentTarget,
  date,
  onClose,
  onTargetsUpdated,
}: EditTargetsModalProps) {
  const [calories, setCalories] = useState(currentTarget ? String(currentTarget.targetCalories) : "");
  const [protein, setProtein] = useState(currentTarget ? String(currentTarget.targetProtein) : "");
  const [carbs, setCarbs] = useState(currentTarget ? String(currentTarget.targetCarbs) : "");
  const [fats, setFats] = useState(currentTarget ? String(currentTarget.targetFats) : "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = parseInt(calories, 10);
    const p = parseFloat(protein);
    const c = parseFloat(carbs);
    const f = parseFloat(fats);

    if (isNaN(cal) || cal <= 0) {
      setError(ar.nutrition.editTargetsModal.caloriesRequired);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await updateNutritionTargetsAction({
        effectiveDate: date,
        targetCalories: cal,
        targetProtein: isNaN(p) ? 0 : p,
        targetCarbs: isNaN(c) ? 0 : c,
        targetFats: isNaN(f) ? 0 : f,
      });

      if (res.success) {
        onTargetsUpdated?.();
        onClose();
      } else {
        setError(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="comic-card w-full max-w-md p-6 border border-[#2A242E] bg-[#151318] shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A242E]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#C9A15A]/20 text-[#C9A15A] border border-[#C9A15A]/30">
              <Target className="w-5 h-5" />
            </span>
            <div className="text-start">
              <h2 className="text-base sm:text-lg font-black text-[#F1E9DD]">
                {ar.nutrition.editTargetsModal.title}
              </h2>
              <p className="text-[11px] text-[#A7A0A6]">
                {ar.nutrition.editTargetsModal.subtitle}
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

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 font-bold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#C9A15A] block">
              {ar.nutrition.editTargetsModal.caloriesLabel}
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min="500"
              max="10000"
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#A83252] block">
              {ar.nutrition.editTargetsModal.proteinLabel}
            </label>
            <input
              type="number"
              step="1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              min="0"
              max="999"
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#A83252]"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#C9A15A] block">
              {ar.nutrition.editTargetsModal.carbsLabel}
            </label>
            <input
              type="number"
              step="1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              min="0"
              max="999"
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#34D399] block">
              {ar.nutrition.editTargetsModal.fatsLabel}
            </label>
            <input
              type="number"
              step="1"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              min="0"
              max="999"
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#34D399]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-[#2A242E] bg-[#1D1920] text-xs font-bold text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A] transition-colors min-h-[44px] cursor-pointer"
            >
              {ar.nutrition.editTargetsModal.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C9A15A] hover:bg-[#B88F48] text-[#110F14] font-black text-xs shadow-lg shadow-[#C9A15A]/20 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {isPending
                  ? ar.nutrition.editTargetsModal.saving
                  : ar.nutrition.editTargetsModal.submitBtn}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
