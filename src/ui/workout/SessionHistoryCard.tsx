import { ar } from "@/i18n/ar";
import { Calendar, Clock, ShieldCheck, FileText } from "lucide-react";

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
    <div className="hub-card p-5 border border-[#2A242E] hover:border-[#7A1735]/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-[#F1E9DD]">
              {session.programName}
            </h4>
            <span className="hub-badge text-[10px] font-mono">
              v{session.programVersion}
            </span>
          </div>
          <p className="text-xs text-[#A7A0A6] flex items-center gap-1.5 mt-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C9A15A]" />
            <span>{dateStr}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#C9A15A] font-mono font-bold bg-[#1D1920] border border-[#2A242E] px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-[#A83252]" />
          <span>
            {durationMins} {ar.workout.details.minutes}
          </span>
        </div>
      </div>

      {session.notes && (
        <div className="mt-3 p-3 rounded-xl bg-[#1D1920] border border-[#2A242E] text-xs text-[#F1E9DD] flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-[#C9A15A] mt-0.5 shrink-0" />
          <span className="leading-relaxed">{session.notes}</span>
        </div>
      )}

      {/* Immutable Notice Footer */}
      <div className="mt-4 pt-3 border-t border-[#2A242E] flex items-center justify-between text-[11px] text-[#A7A0A6]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>{ar.workout.history.immutableNotice}</span>
        </span>
        <span className="font-mono text-[10px] text-[#6B646B]">
          ID: {session.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}

