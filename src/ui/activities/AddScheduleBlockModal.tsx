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
      setError("برجاء إدخال اسم النشاط");
      return;
    }

    if (startTime === endTime) {
      setError("وقت البداية والنهاية لا يمكن أن يكونا متطابقين");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="comic-card w-full max-w-md p-6 border border-[#2B252E] bg-[#1A151D] shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2B252E]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-[#D6AA63]">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#F2EADF]">
              {ar.activities.blockModal.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-400 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#9D969D] block">
              {ar.activities.blockModal.activityNameLabel} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={ar.activities.blockModal.activityNamePlaceholder}
              disabled={isPending}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-[#9D969D] block">
              {ar.activities.blockModal.dayLabel}
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110D13] border border-[#2B252E] text-xs text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
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
              <label className="text-xs font-bold text-[#9D969D] block">
                {ar.activities.blockModal.startTimeLabel}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm font-mono text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
              />
            </div>

            <div className="space-y-1 text-start">
              <label className="text-xs font-bold text-[#9D969D] block">
                {ar.activities.blockModal.endTimeLabel}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-sm font-mono text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-[#2B252E] text-xs font-bold text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23] transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D6AA63] hover:bg-[#C29650] text-[#110D13] font-black text-xs shadow-lg shadow-amber-950/30 transition-all disabled:opacity-50"
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
