"use client";

import React, { useState, useTransition } from "react";
import { Download, FileJson, CheckCircle2, AlertCircle, HardDrive } from "lucide-react";
import { exportAllDataAction } from "@/src/server/settings-actions";
import { ar } from "@/i18n/ar";

interface BackupExportCardProps {
  lastBackupAt: string | null;
  tableStats: {
    exercisesCount: number;
    completedSessionsCount: number;
    loggedMealsCount: number;
    scheduleBlocksCount: number;
    weightLogsCount: number;
  };
}

export function BackupExportCard({
  lastBackupAt,
  tableStats,
}: BackupExportCardProps) {
  const [isPending, startTransition] = useTransition();
  const [lastExport, setLastExport] = useState<string | null>(lastBackupAt);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleExport = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        const res = await exportAllDataAction();
        if (res.success && res.jsonData && res.filename) {
          // Trigger browser download of JSON
          const blob = new Blob([res.jsonData], { type: "application/json;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = res.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          const nowFormatted = new Date().toLocaleString("ar-EG");
          setLastExport(nowFormatted);
          setFeedback({
            type: "success",
            message: ar.settings.backupSuccess,
          });
        } else {
          setFeedback({
            type: "error",
            message: res.error || ar.errors.generic,
          });
        }
      } catch {
        setFeedback({
          type: "error",
          message: ar.errors.generic,
        });
      }
    });
  };

  return (
    <div className="comic-card p-5 border border-[#2B252E] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#211C23] text-[#D6AA63]">
          <FileJson className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#F2EADF]">
            {ar.settings.backupTitle}
          </h3>
          <p className="text-xs text-[#9D969D]">
            {ar.settings.backupDesc}
          </p>
        </div>
      </div>

      {/* Tables count preview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center font-mono">
        <div className="p-2 rounded-xl bg-[#151117] border border-[#2B252E]">
          <span className="text-[10px] text-[#9D969D] block">التمارين</span>
          <strong className="text-sm text-[#F2EADF] font-black">
            {tableStats.exercisesCount}
          </strong>
        </div>
        <div className="p-2 rounded-xl bg-[#151117] border border-[#2B252E]">
          <span className="text-[10px] text-[#9D969D] block">الجلسات</span>
          <strong className="text-sm text-[#F2EADF] font-black">
            {tableStats.completedSessionsCount}
          </strong>
        </div>
        <div className="p-2 rounded-xl bg-[#151117] border border-[#2B252E]">
          <span className="text-[10px] text-[#9D969D] block">الوجبات</span>
          <strong className="text-sm text-[#F2EADF] font-black">
            {tableStats.loggedMealsCount}
          </strong>
        </div>
        <div className="p-2 rounded-xl bg-[#151117] border border-[#2B252E]">
          <span className="text-[10px] text-[#9D969D] block">البلوكات</span>
          <strong className="text-sm text-[#F2EADF] font-black">
            {tableStats.scheduleBlocksCount}
          </strong>
        </div>
        <div className="p-2 rounded-xl bg-[#151117] border border-[#2B252E] col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[#9D969D] block">أوزان الجسم</span>
          <strong className="text-sm text-[#F2EADF] font-black">
            {tableStats.weightLogsCount}
          </strong>
        </div>
      </div>

      {/* Status & Last Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#231E26]">
        <div className="flex items-center gap-2 text-[#9D969D]">
          <HardDrive className="w-4 h-4 text-[#D6AA63]" />
          <span>
            {lastExport
              ? ar.settings.lastExport.replace("{date}", lastExport.slice(0, 19))
              : ar.settings.noExportYet}
          </span>
        </div>

        <button
          onClick={handleExport}
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 comic-btn-primary px-4 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isPending ? ar.settings.exporting : ar.settings.exportBtn}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
              : "bg-rose-950/40 border-rose-900/60 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
