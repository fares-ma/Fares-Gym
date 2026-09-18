import Link from "next/link";
import Image from "next/image";
import { getTimeAwareGreeting } from "@/lib/utils";
import { ar } from "@/i18n/ar";
import { Dumbbell, ArrowLeft, Flame } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";
import { ScheduleStepper } from "@/ui/ScheduleStepper";
import { NutritionSnapshotCard } from "@/ui/NutritionSnapshotCard";
import { RemindersCard } from "@/ui/RemindersCard";
import { QuoteBanner } from "@/ui/QuoteBanner";
import { ThemeToggle } from "@/ui/ThemeToggle";
import {
  getWorkoutProgramsWithRotation,
  getActiveWorkoutSession,
} from "@/server/workout-queries";
import { getDailyNutrition } from "@/server/nutrition-queries";
import { getDashboardActivities } from "@/server/activities-queries";
import { getUserTodayDateStr, formatUserArabicDate } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const greeting = getTimeAwareGreeting();
  const todayStr = getUserTodayDateStr();

  // Fetch real workout, nutrition, and activities data
  let nextProgramName = "Posterior A";
  let exerciseCount = 8;
  let activeSessionId: string | null = null;
  let todayNutrition = null;
  let activitiesData = null;

  try {
    const [{ programs }, activeData, nutritionData, activities] = await Promise.all([
      getWorkoutProgramsWithRotation(),
      getActiveWorkoutSession(),
      getDailyNutrition(todayStr),
      getDashboardActivities(),
    ]);

    todayNutrition = nutritionData;
    activitiesData = activities;

    if (activeData) {
      nextProgramName = activeData.program.name;
      exerciseCount = activeData.exercises?.length || 8;
      activeSessionId = activeData.session.id;
    } else {
      const nextProg = programs.find((p) => p.isNextScheduled) || programs[0];
      if (nextProg) {
        nextProgramName = nextProg.name;
        exerciseCount = nextProg.exerciseCount || 8;
      }
    }
  } catch {
    // Graceful fallback if database is loading/seeding
  }

  // Current Arabic Date formatted with Cairo timezone
  const arabicDate = formatUserArabicDate();


  return (
    <div className="space-y-4 md:space-y-5 pb-6">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* User Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#D6AA63] tracking-widest uppercase font-mono">
              FARES HUB
            </span>
            <span className="text-[10px] text-[#9D969D]/80 font-mono hidden sm:inline">
              • Discipline Builds Freedom
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#F2EADF] tracking-tight mt-0.5">
            {greeting}
          </h1>
          <p className="text-xs text-[#9D969D] mt-0.5 font-medium">
            {arabicDate}
          </p>
        </div>

        {/* Right side: Theme toggle + Crown Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="flex flex-col items-end">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D6AA63] shadow-lg bg-[#211C23] relative">
              <Image
                src="/character/avatar.png"
                alt="Fares"
                width={48}
                height={48}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="text-[9px] text-[#D6AA63] font-mono tracking-tight -mt-0.5 hidden sm:inline">
              Same Guy... Higher Standards
            </span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S MISSION (Hero Card) */}
      <div className="relative rounded-2xl overflow-hidden border-1.5 border-[#7C1D38] bg-gradient-to-br from-[#25101A] via-[#1A1218] to-[#120E15] p-5 sm:p-6 shadow-xl">
        {/* Background glow & decorative subtle lines */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#7C1D38]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* Mission Details */}
          <div className="flex-1 space-y-3 text-right w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#E0537A] uppercase font-mono">
                TODAY&apos;S MISSION
              </span>
              {activeSessionId && (
                <span className="comic-badge text-[10px] bg-[#7C1D38] text-[#F2EADF] animate-pulse">
                  {ar.home.activeSessionBadge}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F2EADF] tracking-tight">
                {nextProgramName}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs font-bold text-[#D6AA63]">
                <Dumbbell className="w-4 h-4" />
                <span>{ar.workout.rotation.exercisesCount.replace("{count}", String(exerciseCount))}</span>
              </div>
            </div>

            {/* Motivational Speech */}
            <p className="text-xs sm:text-sm text-[#9D969D] font-medium leading-relaxed max-w-sm">
              ❝ {ar.home.missionMotto} ❞
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href={activeSessionId ? "/workout/active" : "/workout"}
                className="inline-flex items-center gap-2 comic-btn-primary px-6 py-3 rounded-xl text-sm font-black tracking-wide shadow-lg shadow-[#7C1D38]/30 group cursor-pointer"
              >
                {activeSessionId ? (
                  <>
                    <Flame className="w-4 h-4 text-[#D6AA63] animate-pulse" />
                    <span>{ar.workout.active.resumeCTA}</span>
                  </>
                ) : (
                  <>
                    <span>START WORKOUT</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
              </Link>
            </div>

          </div>

          {/* Hero Mini Fares Character Illustration */}
          <div className="relative shrink-0 flex items-center justify-center pt-2 sm:pt-0">
            {/* "LET'S GO!" comic sticker */}
            <div className="absolute -top-1 -right-2 comic-badge text-[11px] font-black bg-[#D6AA63] text-black border-none rotate-6 shadow-md z-20 select-none">
              LET&apos;S GO!
            </div>
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative">
              <MiniFares
                pose="hero-bench"
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

      {/* 3. Schedule Stepper (الجدول الحالي) */}
      <ScheduleStepper blocks={activitiesData?.schedule} />

      {/* 4. Dual Cards: Nutrition Snapshot + Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NutritionSnapshotCard
          consumedCalories={todayNutrition?.calories.consumed}
          targetCalories={todayNutrition?.calories.target}
          proteinConsumed={todayNutrition?.protein.consumed}
          proteinTarget={todayNutrition?.protein.target}
          carbsConsumed={todayNutrition?.carbs.consumed}
          carbsTarget={todayNutrition?.carbs.target}
          fatConsumed={todayNutrition?.fats.consumed}
          fatTarget={todayNutrition?.fats.target}
          loggedMeals={todayNutrition?.meals.length}
        />
        <RemindersCard initialReminders={activitiesData?.reminders} />
      </div>

      {/* 5. Quote Banner with Mini Fares */}
      <QuoteBanner context="home" tag="CONSISTENCY WINS." />
    </div>
  );
}
