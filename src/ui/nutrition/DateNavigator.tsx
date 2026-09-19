"use client";

import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { ar } from "@/i18n/ar";

interface DateNavigatorProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

function getCairoTodayString(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }
}

function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export function DateNavigator({ currentDate, onDateChange }: DateNavigatorProps) {
  const today = getCairoTodayString();

  const handlePrevDay = () => {
    onDateChange(addDaysToDateString(currentDate, -1));
  };

  const handleNextDay = () => {
    onDateChange(addDaysToDateString(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(today);
  };

  // Format date in Arabic using Cairo timezone
  const formattedDate = new Date(currentDate + "T12:00:00").toLocaleDateString(
    "ar-EG",
    {
      timeZone: "Africa/Cairo",
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const isToday = currentDate === today;

  return (
    <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#1D1920] border border-[#2A242E] shadow-sm">
      {/* Right side in RTL = Previous day */}
      <button
        onClick={handlePrevDay}
        className="p-2 rounded-xl text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        title={ar.nutrition.dateNav.prevDay}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <label className="relative flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-[#25202A] transition-colors">
          <CalendarIcon className="w-4 h-4 text-[#C9A15A]" />
          <span className="text-xs sm:text-sm font-bold text-[#F1E9DD]">
            {formattedDate}
          </span>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </label>

        {!isToday && (
          <button
            onClick={handleToday}
            className="comic-badge text-[10px] px-2.5 py-1 bg-[#25202A] text-[#C9A15A] border border-[#C9A15A]/30 hover:bg-[#2E2734] transition-all cursor-pointer"
          >
            {ar.nutrition.dateNav.today}
          </button>
        )}
      </div>

      {/* Left side in RTL = Next day */}
      <button
        onClick={handleNextDay}
        className="p-2 rounded-xl text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        title={ar.nutrition.dateNav.nextDay}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
