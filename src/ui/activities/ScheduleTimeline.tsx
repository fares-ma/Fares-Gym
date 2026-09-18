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
      <div className="comic-card p-8 border border-dashed border-[#2B252E] text-center space-y-3 bg-[#161218]">
        <div className="w-12 h-12 rounded-2xl bg-[#211C23] text-[#D6AA63] mx-auto flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-[#9D969D] max-w-sm mx-auto leading-relaxed">
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

        return (
          <div
            key={block.occurrenceId || block.id}
            className={`comic-card p-4 border transition-all flex items-center justify-between gap-3 ${
              isCurrent
                ? "bg-gradient-to-r from-[#2B1D12] via-[#21171A] to-[#1A151D] border-[#D6AA63] shadow-lg shadow-amber-950/20"
                : isCompleted
                ? "bg-[#141016]/60 border-[#221D25] opacity-75"
                : "bg-[#1A151D] border-[#2B252E] hover:border-[#3B3240]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Icon badge */}
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  isCurrent
                    ? "bg-[#D6AA63] text-[#110D13] shadow-md shadow-amber-900/30"
                    : isCompleted
                    ? "bg-[#211C23] text-[#9D969D]"
                    : "bg-[#211C23] text-[#D6AA63]"
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
                        ? "text-[#F2EADF] font-black text-base"
                        : isCompleted
                        ? "text-[#9D969D] line-through"
                        : "text-[#F2EADF]"
                    }`}
                  >
                    {block.title}
                  </h4>

                  {isCurrent && (
                    <span className="comic-badge text-[10px] bg-[#D6AA63] text-[#110D13] font-black animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{ar.activities.currentActivity}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#9D969D]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{block.startTime} - {block.endTime}</span>
                  </span>

                  {isCurrent && block.remainingMinutes !== undefined && (
                    <span className="text-[#D6AA63] font-bold">
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
                className="p-2 rounded-xl text-[#9D969D] hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-40"
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
