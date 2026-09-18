"use client";

import React, { useState, useTransition } from "react";
import { ShieldCheck, Check, AlertTriangle } from "lucide-react";
import { confirmUnitTagAction } from "@/src/server/settings-actions";
import { ar } from "@/i18n/ar";

interface WeightNotationCardProps {
  tagK: { confirmed: boolean; description: string; usageCount: number };
  tagB: { confirmed: boolean; description: string; usageCount: number };
}

export function WeightNotationCard({ tagK, tagB }: WeightNotationCardProps) {
  const [isPending, startTransition] = useTransition();

  const [descK, setDescK] = useState(tagK.description);
  const [confirmedK, setConfirmedK] = useState(tagK.confirmed);

  const [descB, setDescB] = useState(tagB.description);
  const [confirmedB, setConfirmedB] = useState(tagB.confirmed);

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSaveTag = (tag: "K" | "B") => {
    setSavedMsg(null);
    const desc = tag === "K" ? descK : descB;
    const confirmed = tag === "K" ? confirmedK : confirmedB;

    startTransition(async () => {
      const res = await confirmUnitTagAction({
        tag,
        description: desc,
        confirmed,
      });
      if (res.success) {
        setSavedMsg(`تم حفظ وتأكيد إعدادات المعرّف [${tag}] بنجاح`);
        setTimeout(() => setSavedMsg(null), 3000);
      }
    });
  };

  return (
    <div className="comic-card p-5 border border-[#2B252E] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#211C23] text-[#7C1D38]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#F2EADF]">
            {ar.settings.weightTitle}
          </h3>
          <p className="text-xs text-[#9D969D]">
            {ar.settings.weightDesc}
          </p>
        </div>
      </div>

      {/* Non-negotiable Invariant Alert */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>{ar.settings.tagRule}</span>
      </div>

      {/* Feedback */}
      {savedMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Tags Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Tag K */}
        <div className="p-4 rounded-xl bg-[#141016] border border-[#2B252E] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-[#2B252E] text-[#D6AA63]">
                K
              </span>
              <span className="text-xs font-bold text-[#F2EADF]">
                {ar.settings.tagKTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#9D969D]">
              استخدم في {tagK.usageCount} مجاميع
            </span>
          </div>

          <p className="text-[11px] text-[#9D969D]">
            {ar.settings.tagKDesc}
          </p>

          <input
            type="text"
            value={descK}
            onChange={(e) => setDescK(e.target.value)}
            className="w-full bg-[#110D13] border border-[#2B252E] rounded-lg px-3 py-1.5 text-xs text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
            placeholder="وصف المعرّف (مثل: Pin stack)"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#F2EADF] cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedK}
                onChange={(e) => setConfirmedK(e.target.checked)}
                className="rounded border-[#2B252E] text-[#7C1D38] focus:ring-0"
              />
              <span>{ar.settings.tagConfirmed}</span>
            </label>

            <button
              onClick={() => handleSaveTag("K")}
              disabled={isPending}
              className="comic-btn-primary px-3 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              حفظ
            </button>
          </div>
        </div>

        {/* Tag B */}
        <div className="p-4 rounded-xl bg-[#141016] border border-[#2B252E] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-[#2B252E] text-[#D6AA63]">
                B
              </span>
              <span className="text-xs font-bold text-[#F2EADF]">
                {ar.settings.tagBTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#9D969D]">
              استخدم في {tagB.usageCount} مجاميع
            </span>
          </div>

          <p className="text-[11px] text-[#9D969D]">
            {ar.settings.tagBDesc}
          </p>

          <input
            type="text"
            value={descB}
            onChange={(e) => setDescB(e.target.value)}
            className="w-full bg-[#110D13] border border-[#2B252E] rounded-lg px-3 py-1.5 text-xs text-[#F2EADF] focus:outline-none focus:border-[#D6AA63]"
            placeholder="وصف المعرّف (مثل: Block stack)"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#F2EADF] cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedB}
                onChange={(e) => setConfirmedB(e.target.checked)}
                className="rounded border-[#2B252E] text-[#7C1D38] focus:ring-0"
              />
              <span>{ar.settings.tagConfirmed}</span>
            </label>

            <button
              onClick={() => handleSaveTag("B")}
              disabled={isPending}
              className="comic-btn-primary px-3 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
