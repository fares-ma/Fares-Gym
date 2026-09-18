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
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141016] border border-[#2B252E] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#7C1D38] text-[#F2EADF] shadow-sm"
              : "text-[#9D969D] hover:text-[#F2EADF]"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{ar.progress.tabs.all}</span>
        </button>

        <button
          onClick={() => setActiveTab("prs")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "prs"
              ? "bg-[#7C1D38] text-[#F2EADF] shadow-sm"
              : "text-[#9D969D] hover:text-[#F2EADF]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{ar.progress.tabs.prs} ({prs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("weight")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "weight"
              ? "bg-[#7C1D38] text-[#F2EADF] shadow-sm"
              : "text-[#9D969D] hover:text-[#F2EADF]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{ar.progress.tabs.weight} ({bodyWeights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("volume")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "volume"
              ? "bg-[#7C1D38] text-[#F2EADF] shadow-sm"
              : "text-[#9D969D] hover:text-[#F2EADF]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
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
