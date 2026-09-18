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
      <div className="comic-card p-4 flex items-center justify-between border-[#2B252E]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#211C23] text-[#D6AA63]">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F2EADF]">
              {ar.settings.themeTitle}
            </h4>
            <p className="text-[11px] text-[#9D969D]">
              {ar.settings.themeDesc}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Database Connection */}
      <div className="comic-card p-4 flex items-center justify-between border-[#2B252E]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#211C23] text-[#34D399]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F2EADF]">
              {ar.settings.databaseTitle}
            </h4>
            <p className="text-[11px] text-[#9D969D]">
              {ar.settings.databaseSource}
            </p>
          </div>
        </div>
        <span
          className={`comic-badge text-[10px] font-mono ${
            dbStatus === "connected"
              ? "text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10"
              : "text-rose-400 border-rose-500/40 bg-rose-500/10"
          }`}
        >
          {dbStatus === "connected" ? "ONLINE" : "ERROR"}
        </span>
      </div>

      {/* PWA Information */}
      <div className="comic-card p-4 border-[#2B252E] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#211C23] text-[#60A5FA]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2EADF]">
                {ar.settings.pwaTitle}
              </h4>
              <p className="text-[11px] text-[#9D969D]">
                {ar.settings.pwaDesc}
              </p>
            </div>
          </div>
          <span className="comic-badge text-[10px] text-[#60A5FA] border-[#60A5FA]/40 bg-[#60A5FA]/10">
            PWA READY
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#141016] border border-[#231E26] text-[11px] text-[#9D969D]">
          💡 {ar.settings.pwaInstruction}
        </div>
      </div>

      {/* Session & Security */}
      <div className="comic-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[#2B252E]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#211C23] text-[#A78BFA]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F2EADF]">
              {ar.settings.sessionTitle}
            </h4>
            <p className="text-[11px] text-[#9D969D]">
              {ar.settings.sessionUser}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{ar.settings.logoutCTA}</span>
        </button>
      </div>
    </div>
  );
}
