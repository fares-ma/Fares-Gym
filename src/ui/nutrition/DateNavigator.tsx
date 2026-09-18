"use client";

import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { ar } from "@/i18n/ar";

interface DateNavigatorProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

export function DateNavigator({ currentDate, onDateChange }: DateNavigatorProps) {
  const today = new Date().toISOString().split("T")[0];

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    onDateChange(today);
  };

  // Format date in Arabic
  const formattedDate = new Date(currentDate + "T00:00:00").toLocaleDateString(
    "ar-EG",
    {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const isToday = currentDate === today;

  return (
    <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#1A151D] border border-[#2B252E]">
      {/* Right side in RTL = Previous day */}
      <button
        onClick={handlePrevDay}
        className="p-2 rounded-xl text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23] transition-colors"
        title={ar.nutrition.dateNav.prevDay}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <label className="relative flex items-center gap-1.5 cursor-pointer">
          <CalendarIcon className="w-4 h-4 text-[#D6AA63]" />
          <span className="text-xs sm:text-sm font-bold text-[#F2EADF]">
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
            className="comic-badge text-[10px] px-2 py-0.5 bg-[#211C23] text-[#D6AA63] hover:bg-[#2B252E] transition-all"
          >
            {ar.nutrition.dateNav.today}
          </button>
        )}
      </div>

      {/* Left side in RTL = Next day */}
      <button
        onClick={handleNextDay}
        className="p-2 rounded-xl text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23] transition-colors"
        title={ar.nutrition.dateNav.nextDay}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
