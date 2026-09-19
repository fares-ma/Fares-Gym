import Link from "next/link";
import { getWorkoutHistory } from "@/server/workout-queries";
import { SessionHistoryCard } from "@/ui/workout/SessionHistoryCard";
import { ar } from "@/i18n/ar";
import { History, ArrowRight } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";

export const dynamic = "force-dynamic";

export default async function WorkoutHistoryPage() {
  const history = await getWorkoutHistory();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="hub-card p-5 sm:p-6 border border-[#2A242E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <Link
            href="/workout"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A7A0A6] hover:text-[#F1E9DD] transition-colors mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{ar.workout.details.backToPrograms}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F1E9DD] flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#A83252]" />
            <span>{ar.workout.tabs.history}</span>
          </h1>
          <p className="text-xs text-[#A7A0A6] mt-1">
            {ar.workout.history.subtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <MiniFares pose="notebook" size="md" animate="breathe" />
        </div>
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="hub-card p-10 text-center border border-[#2A242E]">
          <div className="w-24 h-24 mx-auto mb-3">
            <MiniFares pose="hero-standing" size="md" animate="float" />
          </div>
          <h3 className="text-base font-black text-[#F1E9DD] mb-1">
            {ar.workout.history.emptyState}
          </h3>
          <p className="text-xs text-[#A7A0A6] max-w-sm mx-auto mb-5 font-medium">
            {ar.workout.history.emptyStateDesc}
          </p>

          <Link
            href="/workout"
            className="hub-btn-primary inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-xs font-black shadow-lg shadow-[#7A1735]/40"
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
                completedAt: session.completedAt
                  ? new Date(session.completedAt)
                  : null,
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

