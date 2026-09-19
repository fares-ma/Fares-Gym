"use client";

import React, { useState, useTransition } from "react";
import { Scale, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { BodyWeightEntry } from "@/src/domain/progress/types";
import { LogBodyWeightModal } from "./LogBodyWeightModal";
import { deleteBodyWeightAction } from "@/src/server/progress-actions";
import { ar } from "@/i18n/ar";

interface BodyWeightSectionProps {
  entries: BodyWeightEntry[];
  onWeightLogged?: () => void;
}

export function BodyWeightSection({
  entries,
  onWeightLogged,
}: BodyWeightSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const previous = entries.length > 1 ? entries[entries.length - 2] : null;
  const diff = latest && previous ? +(latest.weightKg - previous.weightKg).toFixed(1) : null;

  const handleDelete = (id: string) => {
    if (!window.confirm(ar.progress.deleteWeightConfirm)) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await deleteBodyWeightAction(id);
        if (res.success) {
          onWeightLogged?.();
        } else {
          setError(res.error || ar.errors.generic);
        }
      } catch {
        setError(ar.errors.generic);
      }
    });
  };

  // Build SVG polyline points for chart if entries >= 2
  const chartPoints = React.useMemo(() => {
    if (entries.length < 2) return null;
    const weights = entries.map((e) => e.weightKg);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const range = maxW - minW || 1;

    const width = 500;
    const height = 140;
    const padding = 20;

    const points = entries.map((e, idx) => {
      const x = padding + (idx / (entries.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((e.weightKg - minW) / range) * (height - 2 * padding);
      return { x, y, weight: e.weightKg, date: e.date };
    });

    const pathString = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    return { points, pathString, width, height, minW: minW.toFixed(1), maxW: maxW.toFixed(1) };
  }, [entries]);

  return (
    <div className="comic-card p-5 border border-[#2A242E] bg-[#151318] space-y-4 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-start">
            <h3 className="text-base sm:text-lg font-black text-[#F1E9DD]">
              {ar.progress.bodyWeightTitle}
            </h3>
            {latest && (
              <p className="text-xs text-[#A7A0A6]">
                {ar.progress.latestMeasurement} <strong className="text-[#F1E9DD] font-mono">{latest.weightKg} {ar.progress.kgSuffix}</strong> ({latest.date})
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] text-xs font-black shadow-lg shadow-[#7A1735]/30 transition-all min-h-[44px] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{ar.progress.logWeightCTA}</span>
        </button>
      </div>

      {/* Main Content: Chart or Empty */}
      {entries.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2A242E] rounded-2xl bg-[#151318] p-6 space-y-2">
          <p className="text-xs text-[#A7A0A6]">
            {ar.progress.emptyWeightLogs}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Metrics highlight */}
          {latest && (
            <div className="flex items-center gap-4 bg-[#1D1920] p-3 rounded-xl border border-[#2A242E]">
              <div className="text-start">
                <span className="text-[11px] text-[#A7A0A6] block">{ar.progress.currentWeight}</span>
                <span className="text-2xl font-black text-[#F1E9DD] font-mono">
                  {latest.weightKg} <span className="text-xs font-bold text-[#C9A15A]">{ar.progress.kgSuffix}</span>
                </span>
              </div>
              {diff !== null && (
                <div className="border-e border-[#2A242E] pe-4 text-start">
                  <span className="text-[11px] text-[#A7A0A6] block">{ar.progress.diffFromPrevious}</span>
                  <div className="flex items-center gap-1">
                    {diff <= 0 ? (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                    )}
                    <span className={`text-sm font-bold font-mono ${diff <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {diff > 0 ? `+${diff}` : diff} {ar.progress.kgSuffix}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SVG Line Chart */}
          {chartPoints && (
            <div className="bg-[#110F14] p-3 rounded-xl border border-[#2A242E] overflow-hidden">
              <div className="flex items-center justify-between text-[10px] text-[#A7A0A6] font-mono mb-1">
                <span>{ar.progress.maxWeight} {chartPoints.maxW} {ar.progress.kgSuffix}</span>
                <span>{ar.progress.minWeight} {chartPoints.minW} {ar.progress.kgSuffix}</span>
              </div>
              <svg
                viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
                className="w-full h-32 stroke-[#C9A15A] fill-none"
              >
                {/* Horizontal Guide lines */}
                <line x1="20" y1="20" x2={chartPoints.width - 20} y2="20" stroke="#2A242E" strokeDasharray="3 3" />
                <line x1="20" y1={chartPoints.height / 2} x2={chartPoints.width - 20} y2={chartPoints.height / 2} stroke="#2A242E" strokeDasharray="3 3" />
                <line x1="20" y1={chartPoints.height - 20} x2={chartPoints.width - 20} y2={chartPoints.height - 20} stroke="#2A242E" strokeDasharray="3 3" />

                {/* Progress Path */}
                <path
                  d={chartPoints.pathString}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chartPoints.points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-[#7A1735] stroke-[#F1E9DD] stroke-2"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Recent Entries History List */}
          <div className="space-y-1.5 pt-2 text-start">
            <span className="text-xs font-bold text-[#F1E9DD] block">{ar.progress.recentMeasurements}</span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pe-1">
              {[...entries].reverse().slice(0, 5).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#1D1920] border border-[#2A242E] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#F1E9DD] font-bold text-sm">
                      {e.weightKg} {ar.progress.kgSuffix}
                    </span>
                    <span className="text-[11px] font-mono text-[#A7A0A6]">
                      {e.date}
                    </span>
                    {e.notes && (
                      <span className="text-[11px] text-[#A7A0A6]/70 truncate max-w-[150px]">
                        • {e.notes}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={isPending}
                    aria-label={ar.progress.deleteWeightAria.replace("{weight}", String(e.weightKg)).replace("{date}", e.date)}
                    className="text-[#A7A0A6] hover:text-rose-400 p-2 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Modal */}
      <LogBodyWeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWeightLogged={onWeightLogged}
      />
    </div>
  );
}
