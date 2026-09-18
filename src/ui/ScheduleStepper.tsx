"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, Laptop, Utensils, Coffee, BookOpen, Check } from "lucide-react";
import { EnrichedScheduleBlock } from "@/src/domain/activities/types";

interface ScheduleStepperProps {
  blocks?: EnrichedScheduleBlock[];
}

function getIcon(title: string, isCurrent: boolean) {
  const t = title.toLowerCase();
  const iconClass = isCurrent ? "w-5 h-5 text-[#F2EADF]" : "w-4 h-4 text-[#9D969D]";

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
    <div className="comic-card p-4 md:p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-black text-[#F2EADF]">
          الجدول الحالي
        </h3>
        <Link
          href="/activities"
          className="text-xs font-bold text-[#9D969D] hover:text-[#D6AA63] transition-colors flex items-center gap-1"
        >
          <span>عرض الجدول الكامل</span>
          <span className="text-xs select-none">‹</span>
        </Link>
      </div>

      {/* Stepper horizontal row or empty state */}
      {blocks.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#9D969D]">
          لا توجد فترات مجدولة لليوم
        </div>
      ) : (
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 no-scrollbar">
          {blocks.map((item) => {
            const isCurrent = item.status === "current";
            const isCompleted = item.status === "completed";

            return (
              <div
                key={item.occurrenceId || item.id}
                className="flex-1 min-w-[62px] flex flex-col items-center text-center group cursor-pointer"
              >
              {/* Icon Container */}
              <div
                className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-150 ${
                  isCurrent
                    ? "bg-[#7C1D38] border-2 border-[#A83252] shadow-lg shadow-[#7C1D38]/30 scale-105"
                    : isCompleted
                    ? "bg-[#211C23] border border-[#2B252E]"
                    : "bg-[#18151B] border border-[#2B252E]/60 opacity-60"
                }`}
              >
                {getIcon(item.title, isCurrent)}
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#34D399] flex items-center justify-center text-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1.5 font-bold truncate max-w-[64px] ${
                  isCurrent ? "text-[#F2EADF]" : "text-[#9D969D]"
                }`}
              >
                {item.title}
              </span>

              {/* Time */}
              <span className="text-[11px] font-mono text-[#9D969D]/80">
                {item.startTime}
              </span>

              {/* Subtitle / Countdown */}
              {isCurrent && item.remainingMinutes !== undefined ? (
                <span className="text-[10px] font-bold text-[#A83252] mt-0.5 whitespace-nowrap animate-pulse">
                  متبقي {item.remainingMinutes} د
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
