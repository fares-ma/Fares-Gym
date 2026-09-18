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
    <div className="comic-card p-5 border border-[#2B252E] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-[#211C23] text-[#7C1D38]">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#F2EADF]">
            {ar.progress.volumeTitle}
          </h3>
          <p className="text-xs text-[#9D969D]">
            إجمالي الحجم التدريبي (الوزن × العداد للمجموعات العاملة)
          </p>
        </div>
      </div>

      {/* Chart bars or empty state */}
      {recentVolumes.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2B252E] rounded-2xl bg-[#161218] p-6 space-y-2">
          <p className="text-xs text-[#9D969D]">
            {ar.progress.emptyVolume}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {recentVolumes.map((v) => {
            const percentage = Math.max(8, Math.round((v.totalVolume / maxVolume) * 100));

            return (
              <div key={`${v.sessionId}-${v.unitTag}`} className="space-y-1">
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F2EADF]">{v.programName}</span>
                    {v.unitTag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2B252E] font-mono text-[#D6AA63] font-bold">
                        [{v.unitTag}]
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-[#9D969D]">({v.date})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-[#9D969D]">
                      {v.workingSetsCount} مجموعات
                    </span>
                    <strong className="text-sm font-black text-[#D6AA63]">
                      {v.totalVolume.toLocaleString()}{v.unitTag ? ` [${v.unitTag}]` : ""}
                    </strong>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-[#110D13] h-3 rounded-full overflow-hidden border border-[#231E26]">
                  <div
                    className="h-full bg-gradient-to-l from-[#D6AA63] to-[#7C1D38] rounded-full transition-all duration-300"
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
