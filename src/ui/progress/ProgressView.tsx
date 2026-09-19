"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConsistencyMetrics,
  BodyWeightEntry,
  ExercisePR,
  SessionVolumePoint,
} from "@/src/domain/progress/types";
import { ProgressOverviewCard } from "./ProgressOverviewCard";
import { BodyWeightSection } from "./BodyWeightSection";
import { ExercisePRsSection } from "./ExercisePRsSection";
import { WorkoutVolumeChart } from "./WorkoutVolumeChart";
import { QuoteBanner } from "@/ui/QuoteBanner";
import { Award, Scale, BarChart3, LayoutGrid } from "lucide-react";
import { ar } from "@/i18n/ar";


interface ProgressViewProps {
  consistency: ConsistencyMetrics;
  bodyWeights: BodyWeightEntry[];
  prs: ExercisePR[];
  volumes: SessionVolumePoint[];
}

type TabType = "all" | "prs" | "weight" | "volume";

export function ProgressView({
  consistency,
  bodyWeights,
  prs,
  volumes,
}: ProgressViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* 1. Consistency & Streaks Overview Hero Card */}
      <ProgressOverviewCard metrics={consistency} />

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1D1920] border border-[#2A242E] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
            activeTab === "all"
              ? "bg-[#7A1735] text-[#F1E9DD] font-black shadow-md shadow-[#7A1735]/30"
              : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-[#C9A15A]" />
          <span>{ar.progress.tabs.all}</span>
        </button>

        <button
          onClick={() => setActiveTab("prs")}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
            activeTab === "prs"
              ? "bg-[#7A1735] text-[#F1E9DD] font-black shadow-md shadow-[#7A1735]/30"
              : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
          }`}
        >
          <Award className="w-4 h-4 text-[#C9A15A]" />
          <span>{ar.progress.tabs.prs} ({prs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("weight")}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
            activeTab === "weight"
              ? "bg-[#7A1735] text-[#F1E9DD] font-black shadow-md shadow-[#7A1735]/30"
              : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
          }`}
        >
          <Scale className="w-4 h-4 text-[#C9A15A]" />
          <span>{ar.progress.tabs.weight} ({bodyWeights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("volume")}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
            activeTab === "volume"
              ? "bg-[#7A1735] text-[#F1E9DD] font-black shadow-md shadow-[#7A1735]/30"
              : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#25202A]"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#C9A15A]" />
          <span>{ar.progress.tabs.volume}</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="space-y-6">
        {(activeTab === "all" || activeTab === "prs") && (
          <ExercisePRsSection prs={prs} />
        )}

        {(activeTab === "all" || activeTab === "weight") && (
          <BodyWeightSection
            entries={bodyWeights}
            onWeightLogged={handleRefresh}
          />
        )}

        {(activeTab === "all" || activeTab === "volume") && (
          <WorkoutVolumeChart volumes={volumes} />
        )}
      </div>

      {/* 4. Motivational Quote Banner */}
      <QuoteBanner context="progress" tag="NO EXCUSES." />
    </div>
  );
}
