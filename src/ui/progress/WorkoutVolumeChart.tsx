"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { SessionVolumePoint } from "@/src/domain/progress/types";
import { ar } from "@/i18n/ar";

interface WorkoutVolumeChartProps {
  volumes: SessionVolumePoint[];
}

export function WorkoutVolumeChart({ volumes }: WorkoutVolumeChartProps) {
  const recentVolumes = volumes.slice(-10); // Last 10 sessions
  const maxVolume = Math.max(...recentVolumes.map((v) => v.totalVolume), 1);

  return (
    <div className="comic-card p-5 border border-[#2A242E] bg-[#151318] space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2.5 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div className="text-start">
          <h3 className="text-base sm:text-lg font-black text-[#F1E9DD]">
            {ar.progress.volumeTitle}
          </h3>
          <p className="text-xs text-[#A7A0A6]">
            {ar.progress.volumeSubtitle}
          </p>
        </div>
      </div>

      {/* Chart bars or empty state */}
      {recentVolumes.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2A242E] rounded-2xl bg-[#151318] p-6 space-y-2">
          <p className="text-xs text-[#A7A0A6]">
            {ar.progress.emptyVolume}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {recentVolumes.map((v) => {
            const percentage = Math.max(8, Math.round((v.totalVolume / maxVolume) * 100));

            return (
              <div key={`${v.sessionId}-${v.unitTag}`} className="space-y-1 text-start">
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#F1E9DD]">{v.programName}</span>
                    {v.unitTag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1D1920] font-mono text-[#C9A15A] font-bold border border-[#C9A15A]/30">
                        [{v.unitTag}]
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-[#A7A0A6]">({v.date})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-[#A7A0A6]">
                      {v.workingSetsCount} {ar.progress.setsSuffix}
                    </span>

                    <strong className="text-sm font-black text-[#C9A15A]">
                      {v.totalVolume.toLocaleString()}{v.unitTag ? ` [${v.unitTag}]` : ""}
                    </strong>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-[#110F14] h-3 rounded-full overflow-hidden border border-[#2A242E]">
                  <div
                    className="h-full bg-gradient-to-l from-[#C9A15A] to-[#7A1735] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
