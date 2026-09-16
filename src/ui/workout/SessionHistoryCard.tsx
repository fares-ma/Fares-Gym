import { ar } from "@/src/i18n/ar";
import { Calendar, Clock, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

interface SessionHistoryCardProps {
  session: {
    id: string;
    programId: string;
    programVersion: number;
    startedAt: Date;
    completedAt: Date | null;
    durationSeconds: number | null;
    notes: string | null;
    programName: string;
  };
}

export function SessionHistoryCard({ session }: SessionHistoryCardProps) {
  const durationMins = session.durationSeconds
    ? Math.round(session.durationSeconds / 60)
    : 0;

  const dateStr = session.completedAt
    ? new Date(session.completedAt).toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold text-white">{session.programName}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              v{session.programVersion}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateStr}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {durationMins} {ar.workout.details.minutes}
          </span>
        </div>
      </div>

      {session.notes && (
        <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>{session.notes}</span>
        </div>
      )}

      {/* Immutable Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
          <span>{ar.workout.history.immutableNotice}</span>
        </span>
        <span className="font-mono text-[10px] text-slate-600">ID: {session.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}
