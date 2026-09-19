import Link from "next/link";
import {
  getWorkoutProgramsWithRotation,
  getActiveWorkoutSession,
} from "@/server/workout-queries";
import { ProgramCard } from "@/ui/workout/ProgramCard";
import { ar } from "@/i18n/ar";
import { Dumbbell, History, Flame, ArrowLeft } from "lucide-react";

import { MiniFares } from "@/ui/MiniFares";
import { QuoteBanner } from "@/ui/QuoteBanner";

export const dynamic = "force-dynamic";

export default async function WorkoutPage() {
  const [{ programs }, activeData] = await Promise.all([
    getWorkoutProgramsWithRotation(),
    getActiveWorkoutSession(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header with Mini Fares Warm-up */}
      <div className="hub-card p-5 sm:p-6 border border-[#2A242E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-right w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-[#C9A15A] uppercase font-latin">
              WORKOUT HUB
            </span>
            <span className="hub-badge text-[10px] font-latin">4-DAY CYCLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F1E9DD] tracking-tight flex items-center gap-2.5">
            <Dumbbell className="w-6 h-6 text-[#A83252]" />
            <span>{ar.workout.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A7A0A6]">
            {ar.workout.subtitle}
          </p>

          <div className="pt-2">
            <Link
              href="/workout/history"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A15A] hover:text-[#F1E9DD] transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{ar.workout.tabs.history} ➔</span>
            </Link>
          </div>
        </div>

        {/* Mini Fares Gym Warmup Character */}
        <div className="shrink-0 flex items-center justify-center">
          <MiniFares
            pose="gym-warmup"
            size="lg"
            animate="breathe"
            alt="Mini Fares Warmup"
          />
        </div>
      </div>

      {/* Active Workout Resume Banner (if session is in progress) */}
      {activeData && (
        <div className="hub-card-accent p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#2E1120] to-[#151318] border border-[#7A1735]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A1024] border border-[#A83252] text-[#F1E9DD] flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Flame className="w-5 h-5 text-[#C9A15A]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#F1E9DD]">
                {ar.workout.active.inProgressBanner}
              </h3>
              <p className="text-xs text-[#A7A0A6] mt-0.5 font-medium">
                {activeData.program.name} • {ar.workout.active.startedAt}{" "}
                {new Date(activeData.session.startedAt).toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <Link
            href="/workout/active"
            className="hub-btn-primary px-5 py-2.5 rounded-xl text-xs font-black tracking-wide inline-flex items-center justify-center gap-2"
          >
            <span>{ar.workout.active.resumeCTA}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#F1E9DD]">
            {ar.workout.tabs.programs}
          </h2>
          <span className="text-xs text-[#A7A0A6] font-mono">
            {ar.workout.rotation.cycleInfo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program, idx) => (
            <ProgramCard
              key={program.id}
              program={program}
              orderIndex={idx + 1}
            />
          ))}
        </div>
      </div>

      {/* Motivational Workout Quote */}
      <QuoteBanner context="workout" tag="STRENGTH BUILDS HABITS" />
    </div>
  );
}

