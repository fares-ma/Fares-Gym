"use client";

import { useState, useTransition } from "react";
import { X, Calendar, Plus } from "lucide-react";
import { createScheduleBlockAction } from "@/src/server/activities-actions";
import { ar } from "@/src/i18n/ar";

interface AddScheduleBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlockAdded?: () => void;
}

export function AddScheduleBlockModal({
  isOpen,
  onClose,
  onBlockAdded,
}: AddScheduleBlockModalProps) {
  const [title, setTitle] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("7"); // default: Daily
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:30");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(ar.activities.blockModal.nameRequired);
      return;
    }

    if (startTime === endTime) {
      setError(ar.activities.blockModal.sameTimeError);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await createScheduleBlockAction({
        title: title.trim(),
        dayOfWeek: parseInt(dayOfWeek, 10),
        startTime,
        endTime,
      });

      if (res.success) {
        setTitle("");
        onBlockAdded?.();
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
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#F1E9DD]">
              {ar.activities.blockModal.title}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#A7A0A6] block">
              {ar.activities.blockModal.activityNameLabel} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={ar.activities.blockModal.activityNamePlaceholder}
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#A7A0A6] block">
              {ar.activities.blockModal.dayLabel}
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
            >
              <option value="7">{ar.activities.blockModal.allDays}</option>
              <option value="0">{ar.activities.days.sunday}</option>
              <option value="1">{ar.activities.days.monday}</option>
              <option value="2">{ar.activities.days.tuesday}</option>
              <option value="3">{ar.activities.days.wednesday}</option>
              <option value="4">{ar.activities.days.thursday}</option>
              <option value="5">{ar.activities.days.friday}</option>
              <option value="6">{ar.activities.days.saturday}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#A7A0A6] block">
                {ar.activities.blockModal.startTimeLabel}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#A7A0A6] block">
                {ar.activities.blockModal.endTimeLabel}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-sm font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A]"
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
              {ar.activities.blockModal.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isPending ? ar.activities.saving : ar.activities.blockModal.submitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
