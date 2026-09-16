"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgramSummary } from "@/src/domain/workout/types";
import { ar } from "@/src/i18n/ar";
import { startWorkoutSessionAction } from "@/src/server/workout-actions";
import { Dumbbell, Calendar, ArrowLeft, Play, CheckCircle2 } from "lucide-react";

interface ProgramCardProps {
  program: ProgramSummary;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStartWorkout = () => {
    startTransition(async () => {
      const res = await startWorkoutSessionAction(program.id);
      if (res.success && res.sessionId) {
        router.push("/workout/active");
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-200 border ${
        program.isNextScheduled
          ? "bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/30"
          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-100">{program.name}</h3>
            {program.isNextScheduled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {ar.workout.rotation.nextBadge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-slate-500" />
            <span>{ar.workout.rotation.exercisesCount.replace("{count}", String(program.exerciseCount))}</span>
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {program.lastCompletedAt
              ? `${ar.workout.rotation.lastDone} ${new Date(program.lastCompletedAt).toLocaleDateString("ar-EG")}`
              : ar.workout.rotation.neverDone}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80 mt-2">
        <button
          onClick={handleStartWorkout}
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            program.isNextScheduled
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 font-semibold"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          } disabled:opacity-50`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isPending ? ar.workout.active.saving : ar.workout.rotation.startCTA}</span>
        </button>

        <Link
          href={`/workout/program/${program.id}`}
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50"
        >
          <span>{ar.workout.rotation.viewDetails}</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
