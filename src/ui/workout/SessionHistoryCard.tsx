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
    <div className="comic-card p-5 border border-[#2B252E] hover:border-[#7C1D38]/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-[#F2EADF]">
              {session.programName}
            </h4>
            <span className="comic-badge text-[10px] bg-[#211C23]">
              v{session.programVersion}
            </span>
          </div>
          <p className="text-xs text-[#9D969D] flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-[#D6AA63]" />
            <span>{dateStr}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#D6AA63] font-mono font-bold bg-[#211C23] border border-[#362E3B] px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-[#7C1D38]" />
          <span>
            {durationMins} {ar.workout.details.minutes}
          </span>
        </div>
      </div>

      {session.notes && (
        <div className="mt-3 p-3 rounded-xl bg-[#211C23] border border-[#362E3B] text-xs text-[#F2EADF] flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-[#D6AA63] mt-0.5 shrink-0" />
          <span>{session.notes}</span>
        </div>
      )}

      {/* Immutable Notice Footer */}
      <div className="mt-4 pt-3 border-t border-[#2B252E] flex items-center justify-between text-[11px] text-[#9D969D]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>{ar.workout.history.immutableNotice}</span>
        </span>
        <span className="font-mono text-[10px] text-[#9D969D]/70">
          ID: {session.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}
