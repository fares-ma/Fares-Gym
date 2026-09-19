import React from "react";
import Link from "next/link";
import { Dumbbell, Laptop, Utensils, Coffee, BookOpen, Check } from "lucide-react";
import { EnrichedScheduleBlock } from "@/src/domain/activities/types";
import { ar } from "@/i18n/ar";

interface ScheduleStepperProps {
  blocks?: EnrichedScheduleBlock[];
}

function getIcon(title: string, isCurrent: boolean) {
  const t = title.toLowerCase();
  const iconClass = isCurrent ? "w-5 h-5 text-[#F1E9DD]" : "w-4 h-4 text-[#A7A0A6]";

  if (t.includes("جيم") || t.includes("تمرين") || t.includes("gym")) {
    return <Dumbbell className={iconClass} />;
  }
  if (t.includes("مذاكرة") || t.includes("study") || t.includes("شغل") || t.includes("work")) {
    return <Laptop className={iconClass} />;
  }
  if (t.includes("غداء") || t.includes("فطار") || t.includes("أكل")) {
    return <Utensils className={iconClass} />;
  }
  if (t.includes("راحة") || t.includes("قهوة") || t.includes("rest")) {
    return <Coffee className={iconClass} />;
  }
  return <BookOpen className={iconClass} />;
}

export const ScheduleStepper: React.FC<ScheduleStepperProps> = ({ blocks = [] }) => {
  return (
    <div className="hub-card p-4 md:p-5 flex flex-col gap-3.5 border border-[#2A242E]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A15A]" />
          <h3 className="text-base font-black text-[#F1E9DD]">
            {ar.home.scheduleTitle}
          </h3>
        </div>
        <Link
          href="/activities"
          className="text-xs font-bold text-[#A7A0A6] hover:text-[#C9A15A] transition-colors flex items-center gap-1"
        >
          <span>{ar.home.scheduleViewAll}</span>
          <span className="text-xs select-none">‹</span>
        </Link>
      </div>

      {/* Stepper horizontal row or empty state */}
      {blocks.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#A7A0A6] bg-[#1D1920]/40 rounded-xl border border-[#2A242E]/50">
          {ar.home.scheduleEmptyToday}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 no-scrollbar">
          {blocks.map((item) => {
            const isCurrent = item.status === "current";
            const isCompleted = item.status === "completed";

            return (
              <div
                key={item.occurrenceId || item.id}
                className="flex-1 min-w-[68px] flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-150 ${
                    isCurrent
                      ? "bg-[#7A1735] border-2 border-[#A83252] shadow-lg shadow-[#7A1735]/40 scale-105"
                      : isCompleted
                      ? "bg-[#1D1920] border border-[#2A242E]"
                      : "bg-[#151318] border border-[#2A242E]/70 opacity-75"
                  }`}
                >
                  {getIcon(item.title, isCurrent)}
                  {isCompleted && (
                    <div className="absolute -bottom-0.5 -end-0.5 w-4 h-4 rounded-full bg-[#34D399] flex items-center justify-center text-[#0D0C0F]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs mt-2 font-bold truncate max-w-[72px] ${
                    isCurrent ? "text-[#F1E9DD]" : "text-[#A7A0A6]"
                  }`}
                >
                  {item.title}
                </span>

                {/* Time */}
                <span className="text-[11px] font-mono text-[#A7A0A6]/80 mt-0.5">
                  {item.startTime}
                </span>

                {/* Subtitle / Countdown */}
                {isCurrent && item.remainingMinutes !== undefined ? (
                  <span className="text-[10px] font-bold text-[#C9A15A] mt-0.5 whitespace-nowrap animate-pulse font-latin">
                    {ar.activities.remainingMinutesShort.replace("{mins}", String(item.remainingMinutes))}
                  </span>
                ) : isCompleted ? (
                  <span className="text-[10px] text-[#34D399] mt-0.5">✓</span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

