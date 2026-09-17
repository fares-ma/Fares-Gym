"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, Laptop, Utensils, Coffee, BookOpen, Check } from "lucide-react";

interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming";
  subtitle?: string;
}

export const ScheduleStepper: React.FC = () => {
  const scheduleItems: ScheduleItem[] = [
    {
      id: "gym",
      time: "17:00",
      label: "الجيم",
      icon: <Dumbbell className="w-5 h-5 text-[#F2EADF]" />,
      status: "current",
      subtitle: "بعد 42 دقيقة",
    },
    {
      id: "study",
      time: "13:00",
      label: "مذاكرة",
      icon: <Laptop className="w-4 h-4 text-[#9D969D]" />,
      status: "completed",
    },
    {
      id: "lunch",
      time: "15:00",
      label: "غداء",
      icon: <Utensils className="w-4 h-4 text-[#9D969D]" />,
      status: "completed",
    },
    {
      id: "rest",
      time: "19:00",
      label: "راحة",
      icon: <Coffee className="w-4 h-4 text-[#9D969D]" />,
      status: "upcoming",
    },
    {
      id: "review",
      time: "22:00",
      label: "مراجعة",
      icon: <BookOpen className="w-4 h-4 text-[#9D969D]" />,
      status: "upcoming",
    },
  ];

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

      {/* Stepper horizontal row */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 no-scrollbar">
        {scheduleItems.map((item) => {
          const isCurrent = item.status === "current";
          const isCompleted = item.status === "completed";

          return (
            <div
              key={item.id}
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
                {item.icon}
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
                {item.label}
              </span>

              {/* Time */}
              <span className="text-[11px] font-mono text-[#9D969D]/80">
                {item.time}
              </span>

              {/* Subtitle / Countdown */}
              {item.subtitle ? (
                <span className="text-[10px] font-bold text-[#A83252] mt-0.5 whitespace-nowrap animate-pulse">
                  {item.subtitle}
                </span>
              ) : isCompleted ? (
                <span className="text-[10px] text-[#34D399] mt-0.5">✓</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
