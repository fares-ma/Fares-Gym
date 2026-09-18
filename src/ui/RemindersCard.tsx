"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { ReminderItem } from "@/src/domain/activities/types";
import { toggleReminderAction } from "@/src/server/activities-actions";

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

    const revert = () => {
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isCompleted: !nextVal } : r))
      );
    };

    // Optimistic UI update
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: nextVal } : r))
    );

    try {
      const res = await toggleReminderAction(id, nextVal);
      if (!res.success) {
        revert();
      }
    } catch {
      revert();
    }
  };

  const pendingCount = items.filter((r) => !r.isCompleted).length;

  return (
    <div className="comic-card p-4 md:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-black text-[#F2EADF]">التذكيرات</h3>
        <Link
          href="/activities"
          className="text-xs font-bold text-[#9D969D] hover:text-[#D6AA63] transition-colors flex items-center gap-1"
        >
          <span>عرض الكل</span>
          <span className="text-xs select-none">‹</span>
        </Link>
      </div>

      {/* Checklist items or empty state */}
      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#9D969D] my-auto">
          لا توجد تذكيرات مسجلة اليوم
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 my-auto">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => toggleReminder(item.id)}
              className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[#211C23]/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                    item.isCompleted
                      ? "bg-[#7C1D38] text-[#F2EADF] border border-[#A83252]"
                      : "border border-[#3D3542] bg-[#18151B]"
                  }`}
                >
                  {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Title */}
                <span
                  className={`text-xs font-semibold truncate ${
                    item.isCompleted
                      ? "line-through text-[#9D969D]/60"
                      : "text-[#F2EADF]"
                  }`}
                >
                  {item.text}
                </span>
              </div>

              {/* Time */}
              {item.dueTime && (
                <span className="text-[11px] font-mono text-[#9D969D] shrink-0">
                  {item.dueTime}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#2B252E] flex items-center gap-2 text-xs text-[#9D969D]">
        <Bell className="w-3.5 h-3.5 text-[#D6AA63]" />
        <span>
          <strong className="text-[#F2EADF] font-mono">{pendingCount}</strong>{" "}
          تذكيرات متبقية
        </span>
      </div>
    </div>
  );
};
