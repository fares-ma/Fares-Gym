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
    <div className="comic-card p-5 border border-[#2B252E] space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#211C23] text-[#D6AA63]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#F2EADF]">
              {ar.progress.bodyWeightTitle}
            </h3>
            {latest && (
              <p className="text-xs text-[#9D969D]">
                آخر قياس: <strong className="text-[#F2EADF] font-mono">{latest.weightKg} كجم</strong> ({latest.date})
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 comic-btn-primary px-3.5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{ar.progress.logWeightCTA}</span>
        </button>
      </div>

      {/* Main Content: Chart or Empty */}
      {entries.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[#2B252E] rounded-2xl bg-[#161218] p-6 space-y-2">
          <p className="text-xs text-[#9D969D]">
            {ar.progress.emptyWeightLogs}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Metrics highlight */}
          {latest && (
            <div className="flex items-center gap-4 bg-[#141016] p-3 rounded-xl border border-[#2B252E]">
              <div>
                <span className="text-[11px] text-[#9D969D] block">الوزن الحالي</span>
                <span className="text-2xl font-black text-[#F2EADF] font-mono">
                  {latest.weightKg} <span className="text-xs font-bold text-[#D6AA63]">كجم</span>
                </span>
              </div>
              {diff !== null && (
                <div className="border-r border-[#2B252E] pr-4">
                  <span className="text-[11px] text-[#9D969D] block">الفارق عن السابق</span>
                  <div className="flex items-center gap-1">
                    {diff <= 0 ? (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                    )}
                    <span className={`text-sm font-bold font-mono ${diff <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {diff > 0 ? `+${diff}` : diff} كجم
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SVG Line Chart */}
          {chartPoints && (
            <div className="bg-[#120E15] p-3 rounded-xl border border-[#2B252E] overflow-hidden">
              <div className="flex items-center justify-between text-[10px] text-[#9D969D] font-mono mb-1">
                <span>الحد الأقصى: {chartPoints.maxW} كجم</span>
                <span>الحد الأدنى: {chartPoints.minW} كجم</span>
              </div>
              <svg
                viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
                className="w-full h-32 stroke-[#D6AA63] fill-none"
              >
                {/* Horizontal Guide lines */}
                <line x1="20" y1="20" x2={chartPoints.width - 20} y2="20" stroke="#2B252E" strokeDasharray="3 3" />
                <line x1="20" y1={chartPoints.height / 2} x2={chartPoints.width - 20} y2={chartPoints.height / 2} stroke="#2B252E" strokeDasharray="3 3" />
                <line x1="20" y1={chartPoints.height - 20} x2={chartPoints.width - 20} y2={chartPoints.height - 20} stroke="#2B252E" strokeDasharray="3 3" />

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
                    className="fill-[#7C1D38] stroke-[#F2EADF] stroke-2"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Recent Entries History List */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-[#F2EADF] block">سجل القياسات الأخيرة</span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {[...entries].reverse().slice(0, 5).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#18131A] border border-[#2B252E] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#F2EADF] font-bold text-sm">
                      {e.weightKg} كجم
                    </span>
                    <span className="text-[11px] font-mono text-[#9D969D]">
                      {e.date}
                    </span>
                    {e.notes && (
                      <span className="text-[11px] text-[#9D969D]/70 truncate max-w-[150px]">
                        • {e.notes}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={isPending}
                    aria-label={`حذف قياس ${e.weightKg} كجم بتاريخ ${e.date}`}
                    className="text-[#9D969D] hover:text-rose-400 p-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
