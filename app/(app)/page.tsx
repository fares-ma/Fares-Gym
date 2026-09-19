import Link from "next/link";
import Image from "next/image";
import { ar } from "@/i18n/ar";
import { Dumbbell, ArrowLeft, Flame, Sparkles, Clock } from "lucide-react";
import { MiniFares, CharacterPose } from "@/ui/MiniFares";
import { ScheduleStepper } from "@/ui/ScheduleStepper";
import { NutritionSnapshotCard } from "@/ui/NutritionSnapshotCard";
import { RemindersCard } from "@/ui/RemindersCard";
import { QuoteBanner } from "@/ui/QuoteBanner";
import { getHomeDashboardData } from "@/server/home-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomeDashboardData();
  const { greeting, arabicDate, mission, nutrition, schedule, reminders } = data;

  const hasActiveSession = Boolean(mission.activeSession);
  const currentProgram = mission.activeSession || mission.nextProgram;

  // Select appropriate character pose based on mission state
  let heroPose: CharacterPose = "hero-bench";
  if (hasActiveSession) {
    heroPose = "hero-bench";
  } else if (mission.isRestDay) {
    heroPose = "hero-rest-day";
  } else {
    heroPose = "hero-bench";
  }

  return (
    <div className="space-y-4 md:space-y-5 pb-6">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* User Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#C9A15A] tracking-widest uppercase font-latin">
              {ar.home.hubTitle}
            </span>
            <span className="text-[10px] text-[#A7A0A6]/80 hidden sm:inline">
              • {ar.home.disciplineSlogan}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#F1E9DD] tracking-tight mt-0.5">
            {greeting}
          </h1>
          <p className="text-xs text-[#A7A0A6] mt-0.5 font-medium">
            {arabicDate}
          </p>
        </div>

        {/* Right side: Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-end">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A15A] shadow-lg bg-[#1D1920] relative">
              <Image
                src="/character/avatar.png"
                alt="Fares"
                width={48}
                height={48}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="text-[9px] text-[#C9A15A] tracking-tight -mt-0.5 hidden sm:inline font-semibold">
              {ar.home.sameGuySlogan}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S MISSION (Hero Card) */}
      <div className="relative rounded-2xl overflow-hidden border border-[#7A1735] bg-gradient-to-br from-[#26101B] via-[#1A1218] to-[#120E15] p-5 sm:p-6 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#7A1735]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          {/* Mission Details */}
          <div className="flex-1 space-y-3.5 text-right w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              {hasActiveSession ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A1024] border border-[#A83252] text-[11px] font-black text-[#F1E9DD] shadow-sm animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-[#C9A15A]" />
                  <span>{ar.home.activeSessionBadge}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D1920] border border-[#2A242E] text-[11px] font-black text-[#C9A15A] shadow-sm uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#C9A15A]" />
                  <span>{ar.home.heroTitle}</span>
                </span>
              )}
            </div>

            <div>
              {currentProgram ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#F1E9DD] tracking-tight leading-tight">
                    {"programName" in currentProgram
                      ? currentProgram.programName
                      : currentProgram.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-[#C9A15A] flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-[#A83252]" />
                      <span>
                        {ar.workout.rotation.exercisesCount.replace(
                          "{count}",
                          String(currentProgram.exerciseCount)
                        )}
                      </span>
                    </div>
                    <span className="text-[#6B646B]">•</span>
                    <div className="flex items-center gap-1 text-[#A7A0A6]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-latin">~45-60 min</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-black text-[#F1E9DD]">
                    {ar.home.restDayTitle}
                  </h2>
                  <p className="text-xs text-[#A7A0A6] mt-1 font-medium">
                    {ar.home.restDaySubtitle}
                  </p>
                </>
              )}
            </div>

            {/* Motivational Speech */}
            <p className="text-xs sm:text-sm text-[#A7A0A6] font-medium leading-relaxed max-w-sm">
              ❝ {ar.home.missionMotto} ❞
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href={
                  hasActiveSession
                    ? "/workout/active"
                    : mission.nextProgram
                    ? `/workout/program/${mission.nextProgram.id}`
                    : "/workout"
                }
                className="inline-flex items-center gap-2.5 hub-btn-primary px-6 py-3 rounded-xl text-sm font-black tracking-wide shadow-lg shadow-[#7A1735]/40 group cursor-pointer"
              >
                {hasActiveSession ? (
                  <>
                    <Flame className="w-4 h-4 text-[#C9A15A] animate-pulse" />
                    <span>{ar.workout.active.resumeCTA}</span>
                  </>
                ) : mission.nextProgram ? (
                  <>
                    <span>{ar.home.startWorkout}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </>
                ) : (
                  <>
                    <span>{ar.workout.title}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </Link>
            </div>
          </div>

          {/* Hero Mini Fares Character Illustration */}
          <div className="relative shrink-0 flex items-center justify-center pt-2 sm:pt-0">
            <div className="absolute -top-1 -right-2 hub-badge text-[11px] font-black bg-[#C9A15A] text-[#0D0C0F] border-none rotate-6 shadow-md z-20 select-none">
              {ar.home.letsGo}
            </div>
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative">
              <MiniFares
                pose={heroPose}
                size="xl"
                animate="breathe"
                priority
                className="w-full h-full"
                imageClassName="scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Schedule Stepper */}
      <ScheduleStepper blocks={schedule} />

      {/* 4. Dual Cards: Nutrition Snapshot + Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NutritionSnapshotCard
          consumedCalories={nutrition.consumedCalories}
          targetCalories={nutrition.targetCalories}
          proteinConsumed={nutrition.proteinConsumed}
          proteinTarget={nutrition.proteinTarget}
          carbsConsumed={nutrition.carbsConsumed}
          carbsTarget={nutrition.carbsTarget}
          fatConsumed={nutrition.fatConsumed}
          fatTarget={nutrition.fatTarget}
          loggedMeals={nutrition.loggedMeals}
          totalMeals={nutrition.totalMeals}
        />
        <RemindersCard initialReminders={reminders} />
      </div>

      {/* 5. Quote Banner with Mini Fares */}
      <QuoteBanner context="home" tag={ar.home.consistencyWins} />
    </div>
  );
}

