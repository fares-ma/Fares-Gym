"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, Check, Plus, Trash2, Clock } from "lucide-react";
import { ReminderItem } from "@/src/domain/activities/types";
import {
  createReminderAction,
  toggleReminderAction,
  deleteReminderAction,
} from "@/src/server/activities-actions";
import { executeOptimisticListUpdate } from "@/src/lib/optimistic-helper";
import { ar } from "@/src/i18n/ar";

interface RemindersSectionProps {
  reminders: ReminderItem[];
  onChanged?: () => void;
}

export function RemindersSection({ reminders, onChanged }: RemindersSectionProps) {
  const [items, setItems] = useState<ReminderItem[]>(reminders);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(reminders);
  }, [reminders]);

  const handleToggle = async (id: string, current: boolean) => {
    await executeOptimisticListUpdate(
      items,
      setItems,
      id,
      (r) => ({ ...r, isCompleted: !current }),
      async () => {
        const res = await toggleReminderAction(id, !current);
        if (res.success) {
          onChanged?.();
        }
        return res;
      },
      (error) => alert(error || ar.errors.generic)
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(ar.activities.deleteConfirm)) return;

    const previousItems = [...items];
    setItems((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await deleteReminderAction(id);
      if (res.success) {
        onChanged?.();
      } else {
        setItems(previousItems);
        alert(res.error || ar.errors.generic);
      }
    } catch {
      setItems(previousItems);
      alert(ar.errors.generic);
    }
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
        className="comic-card p-3 sm:p-4 border border-[#2A242E] bg-[#151318] flex items-center gap-2 shadow-sm"
      >
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={ar.activities.reminderModal.textPlaceholder}
          disabled={isPending}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs sm:text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A] min-h-[44px]"
        />

        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          disabled={isPending}
          className="w-24 px-2 py-2 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs font-mono text-[#F1E9DD] focus:outline-none focus:border-[#C9A15A] min-h-[44px]"
        />

        <button
          type="submit"
          disabled={isPending || !newText.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all disabled:opacity-40 shrink-0 min-h-[44px] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{ar.activities.addReminderCTA}</span>
        </button>
      </form>

      {/* Reminders List */}
      {items.length === 0 ? (
        <div className="comic-card p-8 border border-dashed border-[#2A242E] text-center space-y-3 bg-[#151318]">
          <div className="w-12 h-12 rounded-2xl bg-[#1D1920] text-[#C9A15A] mx-auto flex items-center justify-center border border-[#2A242E]">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-[#A7A0A6] max-w-sm mx-auto leading-relaxed">
            {ar.activities.emptyReminders}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`comic-card p-3 border transition-all flex items-center justify-between gap-3 shadow-sm ${
                item.isCompleted
                  ? "bg-[#110F14]/60 border-[#221C26] opacity-70"
                  : "bg-[#151318] border-[#2A242E] hover:border-[#3D3342]"
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
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A15A] rounded-lg p-1"
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    item.isCompleted
                      ? "bg-emerald-600 text-white border border-emerald-500"
                      : "border border-[#3D3542] bg-[#110F14] hover:border-[#C9A15A]/50"
                  }`}
                >
                  {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="text-start min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-bold block truncate ${
                      item.isCompleted ? "text-[#A7A0A6] line-through" : "text-[#F1E9DD]"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.dueTime && (
                  <span className="text-[11px] font-mono text-[#A7A0A6] flex items-center gap-1 bg-[#1D1920] px-2 py-0.5 rounded-md border border-[#2A242E]">
                    <Clock className="w-3 h-3 text-[#C9A15A]" />
                    {item.dueTime}
                  </span>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg text-[#A7A0A6] hover:text-red-400 hover:bg-red-950/30 transition-all disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
