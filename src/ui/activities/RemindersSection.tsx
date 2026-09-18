"use client";

import { useState, useTransition } from "react";
import { Bell, Check, Plus, Trash2, Clock } from "lucide-react";
import { ReminderItem } from "@/src/domain/activities/types";
import {
  createReminderAction,
  toggleReminderAction,
  deleteReminderAction,
} from "@/src/server/activities-actions";
import { ar } from "@/src/i18n/ar";

interface RemindersSectionProps {
  reminders: ReminderItem[];
  onChanged?: () => void;
}

export function RemindersSection({ reminders, onChanged }: RemindersSectionProps) {
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleReminderAction(id, !current);
      if (res.success) {
        onChanged?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(ar.activities.deleteConfirm)) return;

    startTransition(async () => {
      const res = await deleteReminderAction(id);
      if (res.success) {
        onChanged?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    startTransition(async () => {
      const res = await createReminderAction({
        text: newText.trim(),
        dueTime: newTime || undefined,
      });

      if (res.success) {
        setNewText("");
        setNewTime("");
        onChanged?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Add Form */}
      <form
        onSubmit={handleAdd}
        className="comic-card p-3 sm:p-4 border border-[#2B252E] bg-[#1A151D] flex items-center gap-2"
      >
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={ar.activities.reminderModal.textPlaceholder}
          disabled={isPending}
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-xs sm:text-sm text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
        />

        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          disabled={isPending}
          className="w-24 px-2 py-2 rounded-xl bg-[#110D13] border border-[#2B252E] text-xs font-mono text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
        />

        <button
          type="submit"
          disabled={isPending || !newText.trim()}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-950/30 transition-all disabled:opacity-40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{ar.activities.addReminderCTA}</span>
        </button>
      </form>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="comic-card p-8 border border-dashed border-[#2B252E] text-center space-y-3 bg-[#161218]">
          <div className="w-12 h-12 rounded-2xl bg-[#211C23] text-orange-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-[#9D969D] max-w-sm mx-auto leading-relaxed">
            {ar.activities.emptyReminders}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`comic-card p-3 border transition-all flex items-center justify-between gap-3 ${
                item.isCompleted
                  ? "bg-[#141016]/60 border-[#221D25] opacity-70"
                  : "bg-[#1A151D] border-[#2B252E] hover:border-[#3B3240]"
              }`}
            >
              <div
                role="checkbox"
                aria-checked={item.isCompleted}
                tabIndex={0}
                onClick={() => handleToggle(item.id, item.isCompleted)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle(item.id, item.isCompleted);
                  }
                }}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D6AA63] rounded-lg"
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    item.isCompleted
                      ? "bg-emerald-600 text-white border border-emerald-500"
                      : "border border-[#3D3542] bg-[#110D13] hover:border-emerald-500/50"
                  }`}
                >
                  {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="text-start min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-bold block truncate ${
                      item.isCompleted ? "text-[#9D969D] line-through" : "text-[#F2EADF]"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.dueTime && (
                  <span className="text-[11px] font-mono text-[#9D969D] flex items-center gap-1 bg-[#211C23] px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {item.dueTime}
                  </span>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-lg text-[#9D969D] hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-40"
                  title={ar.activities.deleteReminderTooltip}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
