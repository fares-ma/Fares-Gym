"use client";

import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";
import { SettingsSummary } from "@/src/server/settings-queries";
import { BackupExportCard } from "./BackupExportCard";
import { WeightNotationCard } from "./WeightNotationCard";
import { SystemInfoCard } from "./SystemInfoCard";
import { ar } from "@/i18n/ar";

interface SettingsViewProps {
  summary: SettingsSummary;
}

export function SettingsView({ summary }: SettingsViewProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Hero Header */}
      <div className="comic-card p-6 border border-[#2B252E] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="comic-badge text-[10px] bg-[#211C23] text-[#D6AA63]">
              SYSTEM PREFERENCES & SOVEREIGNTY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F2EADF] flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-[#7C1D38]" />
            <span>{ar.settings.title}</span>
          </h1>
          <p className="text-xs text-[#9D969D] mt-1">
            {ar.settings.subtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <MiniFares pose="settings-wrench" size="md" animate="breathe" />
        </div>
      </div>

      {/* 1. Sovereign JSON Backup & Data Export */}
      <BackupExportCard
        lastBackupAt={summary.lastBackupAt}
        tableStats={summary.tableStats}
      />

      {/* 2. Weight Notation Rules (K & B Machine Stack Tags) */}
      <WeightNotationCard
        tagK={summary.unitTags.tagK}
        tagB={summary.unitTags.tagB}
      />

      {/* 3. System Diagnostics, PWA & Session */}
      <SystemInfoCard dbStatus={summary.dbStatus} />
    </div>
  );
}
