import Link from "next/link";
import {
  getWorkoutProgramsWithRotation,
  getActiveWorkoutSession,
} from "@/src/server/workout-queries";
import { ProgramCard } from "@/src/ui/workout/ProgramCard";
import { ar } from "@/src/i18n/ar";
import { Dumbbell, History, Play, Flame, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkoutPage() {
  const [{ programs }, activeData] = await Promise.all([
    getWorkoutProgramsWithRotation(),
    getActiveWorkoutSession(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Dumbbell className="w-7 h-7 text-indigo-400" />
            <span>{ar.workout.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">{ar.workout.subtitle}</p>
        </div>

        {/* History Quick Link */}
        <Link
          href="/workout/history"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span>{ar.workout.tabs.history}</span>
        </Link>
      </div>

      {/* Active Workout Resume Banner (if an in-progress session exists) */}
      {activeData && (
        <div className="bg-gradient-to-r from-emerald-950/70 to-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 sm:p-5 shadow-xl shadow-emerald-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {ar.workout.active.inProgressBanner}
              </h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {activeData.program.name} • تم البدء في{" "}
                {new Date(activeData.session.startedAt).toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <Link
            href="/workout/active"
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md shadow-emerald-900/40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{ar.workout.active.resumeCTA}</span>
          </Link>
        </div>
      )}

      {/* Rotation Cycle Info Bar */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>{ar.workout.rotation.cycleInfo}</span>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
}
