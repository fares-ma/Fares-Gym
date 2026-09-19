"use client";

import { useState, useTransition } from "react";
import { X, Utensils, Plus } from "lucide-react";
import { logMealAction } from "@/src/server/nutrition-actions";
import { ar } from "@/src/i18n/ar";

interface AddMealModalProps {
  isOpen: boolean;
  date: string;
  onClose: () => void;
  onMealAdded?: () => void;
}

export function AddMealModal({ isOpen, date, onClose, onMealAdded }: AddMealModalProps) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(ar.nutrition.addMealModal.nameRequired);
      return;
    }
    const calNum = parseInt(calories, 10);
    if (isNaN(calNum) || calNum <= 0) {
      setError(ar.nutrition.addMealModal.caloriesRequired);
      return;
    }


    setError(null);
    startTransition(async () => {
      const res = await logMealAction({
        date,
        name: name.trim(),
        calories: calNum,
        proteinGrams: parseFloat(protein) || 0,
        carbsGrams: parseFloat(carbs) || 0,
        fatsGrams: parseFloat(fats) || 0,
      });

      if (res.success) {
        setName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFats("");
        onMealAdded?.();
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
            <span className="p-2 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#F1E9DD]">
              {ar.nutrition.addMealModal.title}
            </h2>
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
            <label className="text-xs font-bold text-[#A7A0A6] block">
              {ar.nutrition.addMealModal.nameLabel} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={ar.nutrition.addMealModal.namePlaceholder}
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A] transition-colors"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#C9A15A] block">
              {ar.nutrition.addMealModal.caloriesLabel} *
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="550"
              min="1"
              max="9999"
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A] transition-colors"
            />
          </div>

          {/* 3 Macro Inputs */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="space-y-1 text-start">
              <label className="text-[11px] font-bold text-[#A83252] block truncate">
                {ar.nutrition.addMealModal.proteinLabel}
              </label>
              <input
                type="number"
                step="0.5"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="40"
                min="0"
                max="999"
                disabled={isPending}
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs font-mono text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#A83252]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-[11px] font-bold text-[#C9A15A] block truncate">
                {ar.nutrition.addMealModal.carbsLabel}
              </label>
              <input
                type="number"
                step="0.5"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="60"
                min="0"
                max="999"
                disabled={isPending}
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs font-mono text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-[11px] font-bold text-[#34D399] block truncate">
                {ar.nutrition.addMealModal.fatsLabel}
              </label>
              <input
                type="number"
                step="0.5"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="15"
                min="0"
                max="999"
                disabled={isPending}
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs font-mono text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#34D399]"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-[#2A242E] bg-[#1D1920] text-xs font-bold text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A] transition-colors min-h-[44px] cursor-pointer"
            >
              {ar.nutrition.addMealModal.cancelBtn}
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isPending
                  ? ar.nutrition.addMealModal.saving
                  : ar.nutrition.addMealModal.submitBtn}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
