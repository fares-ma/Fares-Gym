"use client";

import React, { useTransition } from "react";
import { Database, Smartphone, Moon, Shield, LogOut } from "lucide-react";
import { ThemeToggle } from "@/ui/ThemeToggle";
import { logoutAction } from "@/src/server/settings-actions";
import { ar } from "@/i18n/ar";

interface SystemInfoCardProps {
  dbStatus: "connected" | "error";
}

export function SystemInfoCard({ dbStatus }: SystemInfoCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    if (!window.confirm(ar.settings.confirmLogout)) return;
    startTransition(async () => {
      await logoutAction();
    });
  };


  return (
    <div className="space-y-3">
      {/* Theme Card */}
      <div className="comic-card p-4 flex items-center justify-between border-[#2A242E] bg-[#151318] shadow-sm">
        <div className="flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-xl bg-[#7A1735]/20 text-[#C9A15A] border border-[#7A1735]/30">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F1E9DD]">
              {ar.settings.themeTitle}
            </h4>
            <p className="text-[11px] text-[#A7A0A6]">
              {ar.settings.themeDesc}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Database Connection */}
      <div className="comic-card p-4 flex items-center justify-between border-[#2A242E] bg-[#151318] shadow-sm">
        <div className="flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F1E9DD]">
              {ar.settings.databaseTitle}
            </h4>
            <p className="text-[11px] text-[#A7A0A6]">
              {ar.settings.databaseSource}
            </p>
          </div>
        </div>
        <span
          className={`comic-badge text-[10px] font-mono font-bold ${
            dbStatus === "connected"
              ? "text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10"
              : "text-rose-400 border-rose-500/40 bg-rose-500/10"
          }`}
        >
          {dbStatus === "connected" ? "ONLINE" : "ERROR"}
        </span>
      </div>

      {/* PWA Information */}
      <div className="comic-card p-4 border-[#2A242E] bg-[#151318] space-y-2 shadow-sm text-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F1E9DD]">
                {ar.settings.pwaTitle}
              </h4>
              <p className="text-[11px] text-[#A7A0A6]">
                {ar.settings.pwaDesc}
              </p>
            </div>
          </div>
          <span className="comic-badge text-[10px] text-sky-400 border-sky-400/40 bg-sky-500/10 font-mono font-bold">
            PWA READY
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-[11px] text-[#A7A0A6] leading-relaxed">
          💡 {ar.settings.pwaInstruction}
        </div>
      </div>

      {/* Session & Security */}
      <div className="comic-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[#2A242E] bg-[#151318] shadow-sm">
        <div className="flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F1E9DD]">
              {ar.settings.sessionTitle}
            </h4>
            <p className="text-[11px] text-[#A7A0A6]">
              {ar.settings.sessionUser}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>{ar.settings.logoutCTA}</span>
        </button>
      </div>
    </div>
  );
}
