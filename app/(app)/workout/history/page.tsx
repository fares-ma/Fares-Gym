import Link from "next/link";
import { getWorkoutHistory } from "@/src/server/workout-queries";
import { SessionHistoryCard } from "@/src/ui/workout/SessionHistoryCard";
import { ar } from "@/src/i18n/ar";
import { History, ArrowRight, Dumbbell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkoutHistoryPage() {
  const history = await getWorkoutHistory();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/workout"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{ar.workout.details.backToPrograms}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <History className="w-7 h-7 text-indigo-400" />
            <span>{ar.workout.tabs.history}</span>
          </h1>
        </div>
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            {ar.workout.history.emptyState}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            سجل الجلسات يوثق تاريخك الرياضي بدقة ولا يقبل الحذف أو التعديل بعد الإتمام.
          </p>
          <Link
            href="/workout"
            className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-md shadow-indigo-950"
          >
            {ar.workout.details.backToPrograms}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => (
            <SessionHistoryCard
              key={session.id}
              session={{
                id: session.id,
                programId: session.programId,
                programVersion: session.programVersion,
                startedAt: new Date(session.startedAt),
                completedAt: session.completedAt ? new Date(session.completedAt) : null,
                durationSeconds: session.durationSeconds,
                notes: session.notes,
                programName: session.programName,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
