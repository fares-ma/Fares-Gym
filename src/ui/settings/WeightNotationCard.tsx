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
        setSavedMsg(ar.settings.tagSaved.replace("{tag}", tag));
        setTimeout(() => setSavedMsg(null), 3000);
      }
    });
  };


  return (
    <div className="comic-card p-5 border border-[#2A242E] bg-[#151318] space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-start">
          <h3 className="text-base sm:text-lg font-black text-[#F1E9DD]">
            {ar.settings.weightTitle}
          </h3>
          <p className="text-xs text-[#A7A0A6]">
            {ar.settings.weightDesc}
          </p>
        </div>
      </div>

      {/* Non-negotiable Invariant Alert */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1D1920] border border-[#C9A15A]/40 text-xs text-[#C9A15A] text-start leading-relaxed shadow-xs">
        <AlertTriangle className="w-4 h-4 text-[#C9A15A] shrink-0 mt-0.5" />
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
        <div className="p-4 rounded-xl bg-[#1D1920] border border-[#2A242E] space-y-3 shadow-sm text-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-[#151318] text-[#C9A15A] border border-[#C9A15A]/30">
                K
              </span>
              <span className="text-xs font-bold text-[#F1E9DD]">
                {ar.settings.tagKTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#A7A0A6]">
              {ar.settings.tagUsage.replace("{count}", String(tagK.usageCount))}
            </span>
          </div>

          <p className="text-[11px] text-[#A7A0A6]">
            {ar.settings.tagKDesc}
          </p>

          <input
            type="text"
            value={descK}
            onChange={(e) => setDescK(e.target.value)}
            className="w-full bg-[#110F14] border border-[#2A242E] rounded-xl px-3 py-2 text-xs text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A]"
            placeholder={ar.settings.tagKPlaceholder}
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#F1E9DD] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={confirmedK}
                onChange={(e) => setConfirmedK(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A242E] text-[#7A1735] focus:ring-0 cursor-pointer"
              />
              <span>{ar.settings.tagConfirmed}</span>
            </label>

            <button
              onClick={() => handleSaveTag("K")}
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] text-xs font-bold min-h-[44px] min-w-[70px] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            >
              {ar.settings.saveBtn}
            </button>
          </div>
        </div>

        {/* Tag B */}
        <div className="p-4 rounded-xl bg-[#1D1920] border border-[#2A242E] space-y-3 shadow-sm text-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-[#151318] text-[#C9A15A] border border-[#C9A15A]/30">
                B
              </span>
              <span className="text-xs font-bold text-[#F1E9DD]">
                {ar.settings.tagBTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#A7A0A6]">
              {ar.settings.tagUsage.replace("{count}", String(tagB.usageCount))}
            </span>
          </div>

          <p className="text-[11px] text-[#A7A0A6]">
            {ar.settings.tagBDesc}
          </p>

          <input
            type="text"
            value={descB}
            onChange={(e) => setDescB(e.target.value)}
            className="w-full bg-[#110F14] border border-[#2A242E] rounded-xl px-3 py-2 text-xs text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A]"
            placeholder={ar.settings.tagBPlaceholder}
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#F1E9DD] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={confirmedB}
                onChange={(e) => setConfirmedB(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A242E] text-[#7A1735] focus:ring-0 cursor-pointer"
              />
              <span>{ar.settings.tagConfirmed}</span>
            </label>

            <button
              onClick={() => handleSaveTag("B")}
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] text-xs font-bold min-h-[44px] min-w-[70px] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            >
              {ar.settings.saveBtn}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
