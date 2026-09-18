"use client";

import React, { useState, useTransition } from "react";
import { X, Scale } from "lucide-react";
import { ar } from "@/i18n/ar";
import { logBodyWeightAction } from "@/src/server/progress-actions";

interface LogBodyWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightLogged?: () => void;
}

function getLocalTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function LogBodyWeightModal({
  isOpen,
  onClose,
  onWeightLogged,
}: LogBodyWeightModalProps) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(getLocalTodayDate);
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDate(getLocalTodayDate());
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError(ar.progress.weightModal.weightRequired);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await logBodyWeightAction({
          date,
          weightKg: parsedWeight,
          notes: notes.trim(),
        });

        if (res.success) {
          setWeightKg("");
          setNotes("");
          onWeightLogged?.();
          onClose();
        } else {
          setError(res.error || ar.errors.generic);
        }
      } catch {
        setError(ar.errors.generic);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="comic-card w-full max-w-md p-5 md:p-6 bg-[#18151B] border border-[#2B252E] space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B252E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#211C23] text-[#D6AA63]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#F2EADF]">
                {ar.progress.weightModal.title}
              </h3>
              <p className="text-xs text-[#9D969D]">
                {ar.progress.weightModal.subtitle}
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

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F2EADF]">
              {ar.progress.weightModal.dateLabel}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#110D13] border border-[#2B252E] rounded-xl px-3.5 py-2.5 text-sm text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F2EADF]">
              {ar.progress.weightModal.weightLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required
                placeholder="78.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-[#110D13] border border-[#2B252E] rounded-xl px-3.5 py-2.5 text-sm text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
              />
              <span className="absolute end-3 top-2.5 text-xs text-[#9D969D] font-mono select-none">
                {ar.progress.kgSuffix}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F2EADF]">
              {ar.progress.weightModal.notesLabel}
            </label>
            <input
              type="text"
              placeholder={ar.progress.weightModal.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#110D13] border border-[#2B252E] rounded-xl px-3.5 py-2.5 text-sm text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#9D969D] hover:bg-[#211C23] transition-colors"
            >
              {ar.progress.weightModal.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="comic-btn-primary px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[#7C1D38]/30 cursor-pointer disabled:opacity-50"
            >
              {isPending
                ? ar.progress.weightModal.saving
                : ar.progress.weightModal.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
