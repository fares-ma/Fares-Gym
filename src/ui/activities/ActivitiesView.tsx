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
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1D1920] border border-[#2A242E]">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                activeTab === "schedule"
                  ? "bg-[#C9A15A] text-[#110F14] font-black shadow-md shadow-[#C9A15A]/20"
                  : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{ar.activities.scheduleTab}</span>
            </button>

            <button
              onClick={() => setActiveTab("reminders")}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                activeTab === "reminders"
                  ? "bg-[#C9A15A] text-[#110F14] font-black shadow-md shadow-[#C9A15A]/20"
                  : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{ar.activities.remindersTab}</span>
              {pendingRemindersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#7A1735] text-[#F1E9DD] text-[10px] font-mono font-bold">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                activeTab === "notes"
                  ? "bg-[#C9A15A] text-[#110F14] font-black shadow-md shadow-[#C9A15A]/20"
                  : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
              }`}
            >
              <StickyNote className="w-4 h-4" />
              <span>{ar.activities.notesTab}</span>
            </button>
          </div>

          {activeTab === "schedule" && (
            <button
              onClick={() => setIsAddBlockOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all min-h-[44px] cursor-pointer"
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
