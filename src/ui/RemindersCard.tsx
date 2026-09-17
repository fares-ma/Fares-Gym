"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";

interface ReminderItem {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
}

export const RemindersCard: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: "1", title: "مراجعة SQL", time: "10:00", completed: false },
    { id: "2", title: "تحضير شنطة الجيم", time: "16:00", completed: false },
    { id: "3", title: "شرب الماء (2 لتر)", completed: true },
    { id: "4", title: "مراجعة الملاحظات", time: "22:00", completed: false },
  ]);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const pendingCount = reminders.filter((r) => !r.completed).length;

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

      {/* Checklist items */}
      <div className="flex flex-col gap-2.5 my-auto">
        {reminders.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleReminder(item.id)}
            className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[#211C23]/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Checkbox */}
              <div
                className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                  item.completed
                    ? "bg-[#7C1D38] text-[#F2EADF] border border-[#A83252]"
                    : "border border-[#3D3542] bg-[#18151B]"
                }`}
              >
                {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Title */}
              <span
                className={`text-xs font-semibold truncate ${
                  item.completed
                    ? "line-through text-[#9D969D]/60"
                    : "text-[#F2EADF]"
                }`}
              >
                {item.title}
              </span>
            </div>

            {/* Time */}
            {item.time && (
              <span className="text-[11px] font-mono text-[#9D969D] shrink-0">
                {item.time}
              </span>
            )}
          </div>
        ))}
      </div>

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
