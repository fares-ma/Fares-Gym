"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { ReminderItem } from "@/src/domain/activities/types";
import { toggleReminderAction } from "@/src/server/activities-actions";
import { ar } from "@/i18n/ar";

import { executeOptimisticListUpdate } from "@/src/lib/optimistic-helper";

interface RemindersCardProps {
  initialReminders?: ReminderItem[];
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  initialReminders = [],
}) => {
  const [items, setItems] = useState<ReminderItem[]>(initialReminders);

  const toggleReminder = async (id: string) => {
    const current = items.find((r) => r.id === id);
    if (!current) return;
    const nextVal = !current.isCompleted;

    await executeOptimisticListUpdate(
      items,
      setItems,
      id,
      (r) => ({ ...r, isCompleted: nextVal }),
      () => toggleReminderAction(id, nextVal)
    );
  };

  const pendingCount = items.filter((r) => !r.isCompleted).length;

  return (
    <div className="hub-card p-4 md:p-5 flex flex-col justify-between border border-[#2A242E]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A15A]" />
          <h3 className="text-base font-black text-[#F1E9DD]">{ar.home.remindersTitle}</h3>
        </div>
        <Link
          href="/activities"
          className="text-xs font-bold text-[#A7A0A6] hover:text-[#C9A15A] transition-colors flex items-center gap-1"
        >
          <span>{ar.home.remindersViewAll}</span>
          <span className="text-xs select-none">‹</span>
        </Link>
      </div>

      {/* Checklist items or empty state */}
      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#A7A0A6] my-auto bg-[#1D1920]/40 rounded-xl border border-[#2A242E]/50">
          {ar.home.remindersEmptyToday}
        </div>
      ) : (
        <div className="flex flex-col gap-2 my-auto">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              role="checkbox"
              aria-checked={item.isCompleted}
              tabIndex={0}
              onClick={() => toggleReminder(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleReminder(item.id);
                }
              }}
              className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#1D1920] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A15A]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${
                    item.isCompleted
                      ? "bg-[#7A1735] text-[#F1E9DD] border border-[#A83252] shadow-xs shadow-[#7A1735]"
                      : "border border-[#2A242E] bg-[#1D1920]"
                  }`}
                >
                  {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Title */}
                <span
                  className={`text-xs font-semibold truncate ${
                    item.isCompleted
                      ? "line-through text-[#6B646B]"
                      : "text-[#F1E9DD]"
                  }`}
                >
                  {item.text}
                </span>
              </div>

              {/* Time */}
              {item.dueTime && (
                <span className="text-[11px] font-mono text-[#C9A15A] shrink-0 font-semibold">
                  {item.dueTime}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#2A242E] flex items-center gap-2 text-xs text-[#A7A0A6]">
        <Bell className="w-3.5 h-3.5 text-[#C9A15A]" />
        <span>
          <strong className="text-[#F1E9DD] font-mono">{pendingCount}</strong>{" "}
          {ar.home.remindersPending}
        </span>
      </div>
    </div>
  );
};

