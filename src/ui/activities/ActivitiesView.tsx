"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Bell, StickyNote, Plus } from "lucide-react";
import {
  EnrichedScheduleBlock,
  ReminderItem,
  QuickNote,
} from "@/src/domain/activities/types";
import { ScheduleTimeline } from "./ScheduleTimeline";
import { AddScheduleBlockModal } from "./AddScheduleBlockModal";
import { RemindersSection } from "./RemindersSection";
import { NotesSection } from "./NotesSection";
import { QuoteBanner } from "@/ui/QuoteBanner";
import { ar } from "@/src/i18n/ar";

interface ActivitiesViewProps {
  initialSchedule: EnrichedScheduleBlock[];
  initialReminders: ReminderItem[];
  initialNotes: QuickNote[];
}

export function ActivitiesView({
  initialSchedule,
  initialReminders,
  initialNotes,
}: ActivitiesViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"schedule" | "reminders" | "notes">("schedule");
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  const handleRefresh = () => {
    router.refresh();
  };

  const pendingRemindersCount = initialReminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header & Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1A151D] border border-[#2B252E]">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "schedule"
                  ? "bg-[#D6AA63] text-[#110D13] shadow-md shadow-amber-950/20"
                  : "text-[#9D969D] hover:text-[#F2EADF]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{ar.activities.scheduleTab}</span>
            </button>

            <button
              onClick={() => setActiveTab("reminders")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "reminders"
                  ? "bg-[#D6AA63] text-[#110D13] shadow-md shadow-amber-950/20"
                  : "text-[#9D969D] hover:text-[#F2EADF]"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{ar.activities.remindersTab}</span>
              {pendingRemindersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-mono">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "notes"
                  ? "bg-[#D6AA63] text-[#110D13] shadow-md shadow-amber-950/20"
                  : "text-[#9D969D] hover:text-[#F2EADF]"
              }`}
            >
              <StickyNote className="w-4 h-4" />
              <span>{ar.activities.notesTab}</span>
            </button>
          </div>

          {activeTab === "schedule" && (
            <button
              onClick={() => setIsAddBlockOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D6AA63] hover:bg-[#C29650] text-[#110D13] font-black text-xs shadow-md shadow-amber-950/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{ar.activities.addBlockCTA}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "schedule" && (
        <ScheduleTimeline
          blocks={initialSchedule}
          onBlockDeleted={handleRefresh}
        />
      )}

      {activeTab === "reminders" && (
        <RemindersSection
          reminders={initialReminders}
          onChanged={handleRefresh}
        />
      )}

      {activeTab === "notes" && (
        <NotesSection
          notes={initialNotes}
          onChanged={handleRefresh}
        />
      )}

      {/* Motivational Banner */}
      <QuoteBanner context="activities" tag="DISCIPLINE IS FREEDOM" />

      {/* Add Block Modal */}
      <AddScheduleBlockModal
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        onBlockAdded={handleRefresh}
      />
    </div>
  );
}
