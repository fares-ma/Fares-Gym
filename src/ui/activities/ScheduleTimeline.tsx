"use client";

import { useTransition } from "react";
import {
  Dumbbell,
  Laptop,
  Utensils,
  Coffee,
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
} from "lucide-react";
import { EnrichedScheduleBlock } from "@/src/domain/activities/types";
import { deleteScheduleBlockAction } from "@/src/server/activities-actions";
import { ar } from "@/src/i18n/ar";

interface ScheduleTimelineProps {
  blocks: EnrichedScheduleBlock[];
  onBlockDeleted?: () => void;
}

function getIconForActivity(title: string) {
  const t = title.toLowerCase();
  if (t.includes("جيم") || t.includes("تمرين") || t.includes("gym")) {
    return <Dumbbell className="w-5 h-5" />;
  }
  if (t.includes("مذاكرة") || t.includes("study") || t.includes("شغل") || t.includes("work")) {
    return <Laptop className="w-5 h-5" />;
  }
  if (t.includes("غداء") || t.includes("فطار") || t.includes("عشاء") || t.includes("أكل")) {
    return <Utensils className="w-5 h-5" />;
  }
  if (t.includes("راحة") || t.includes("قهوة") || t.includes("rest")) {
    return <Coffee className="w-5 h-5" />;
  }
  return <BookOpen className="w-5 h-5" />;
}

export function ScheduleTimeline({ blocks, onBlockDeleted }: ScheduleTimelineProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!window.confirm(ar.activities.deleteConfirm)) return;

    startTransition(async () => {
      const res = await deleteScheduleBlockAction(id);
      if (res.success) {
        onBlockDeleted?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  if (blocks.length === 0) {
    return (
      <div className="comic-card p-8 border border-dashed border-[#2A242E] text-center space-y-3 bg-[#151318]">
        <div className="w-12 h-12 rounded-2xl bg-[#1D1920] text-[#C9A15A] mx-auto flex items-center justify-center border border-[#2A242E]">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-[#A7A0A6] max-w-sm mx-auto leading-relaxed">
          {ar.activities.emptySchedule}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        const isCurrent = block.status === "current";
        const isCompleted = block.status === "completed";
        const isOvernight = block.endTime < block.startTime;

        return (
          <div
            key={block.occurrenceId || block.id}
            className={`comic-card p-4 border transition-all flex items-center justify-between gap-3 shadow-sm ${
              isCurrent
                ? "bg-gradient-to-r from-[#2A151D] via-[#1D1920] to-[#151318] border-[#C9A15A] shadow-md shadow-[#C9A15A]/10"
                : isCompleted
                ? "bg-[#110F14]/70 border-[#221C26] opacity-70"
                : "bg-[#151318] border-[#2A242E] hover:border-[#3D3342]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Icon badge */}
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  isCurrent
                    ? "bg-[#C9A15A] text-[#110F14] shadow-md shadow-[#C9A15A]/30"
                    : isCompleted
                    ? "bg-[#1D1920] text-[#A7A0A6] border border-[#2A242E]"
                    : "bg-[#1D1920] text-[#C9A15A] border border-[#2A242E]"
                }`}
              >
                {getIconForActivity(block.title)}
              </div>

              {/* Title & Time */}
              <div className="text-start space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`font-bold text-sm truncate ${
                      isCurrent
                        ? "text-[#F1E9DD] font-black text-base"
                        : isCompleted
                        ? "text-[#A7A0A6] line-through"
                        : "text-[#F1E9DD]"
                    }`}
                  >
                    {block.title}
                  </h4>

                  {isCurrent && (
                    <span className="comic-badge text-[10px] bg-[#C9A15A] text-[#110F14] font-black animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{ar.activities.currentActivity}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#A7A0A6] flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C9A15A]" />
                    <span>
                      {block.startTime} - {block.endTime}
                    </span>
                    {isOvernight && (
                      <span className="text-[10px] text-[#C9A15A] font-bold px-1.5 py-0.5 bg-[#1D1920] border border-[#2A242E] rounded">
                        (+1)
                      </span>
                    )}
                  </span>

                  {isCurrent && block.remainingMinutes !== undefined && (
                    <span className="text-[#C9A15A] font-bold">
                      ({ar.activities.remainingTime.replace("{mins}", String(block.remainingMinutes))})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0">
              <button
                onClick={() => handleDelete(block.id)}
                disabled={isPending}
                className="p-2 rounded-xl text-[#A7A0A6] hover:text-red-400 hover:bg-red-950/30 transition-all disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title={ar.activities.deleteBlockTooltip}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
