"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgramSummary } from "@/domain/workout/types";
import { ar } from "@/i18n/ar";
import { startWorkoutSessionAction } from "@/server/workout-actions";
import { Dumbbell, Calendar, ArrowLeft, Play, Sparkles } from "lucide-react";

interface ProgramCardProps {
  program: ProgramSummary;
  orderIndex?: number;
}

export function ProgramCard({ program, orderIndex = 1 }: ProgramCardProps) {
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

  const formattedIndex = String(orderIndex).padStart(2, "0");

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-200 ${
        program.isNextScheduled
          ? "comic-card-accent shadow-xl shadow-[#7C1D38]/15"
          : "comic-card hover:border-[#3D3542]"
      }`}
    >
      {/* Top blueprint row: index + next badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-[#D6AA63] font-mono leading-none">
            {formattedIndex}
          </span>
          <div>
            <h3 className="text-lg font-black text-[#F2EADF] leading-snug">
              {program.name}
            </h3>
            <p className="text-xs text-[#9D969D] flex items-center gap-1 mt-0.5">
              <Dumbbell className="w-3.5 h-3.5 text-[#7C1D38]" />
              <span>
                {ar.workout.rotation.exercisesCount.replace(
                  "{count}",
                  String(program.exerciseCount)
                )}
              </span>
            </p>
          </div>
        </div>

        {program.isNextScheduled && (
          <div className="comic-badge text-[11px] bg-[#7C1D38] text-[#F2EADF] border-none flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-[#D6AA63]" />
            <span>{ar.workout.rotation.nextBadge}</span>
          </div>
        )}
      </div>

      {/* Date metadata */}
      <div className="text-[11px] text-[#9D969D] flex items-center gap-1.5 bg-[#211C23] px-3 py-1.5 rounded-lg w-fit mb-4">
        <Calendar className="w-3.5 h-3.5 text-[#D6AA63]" />
        <span>
          {program.lastCompletedAt
            ? `${ar.workout.rotation.lastDone} ${new Date(
                program.lastCompletedAt
              ).toLocaleDateString("ar-EG")}`
            : ar.workout.rotation.neverDone}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#2B252E]">
        <button
          onClick={handleStartWorkout}
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs transition-all cursor-pointer ${
            program.isNextScheduled
              ? "comic-btn-primary"
              : "comic-btn-secondary"
          } disabled:opacity-50`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>
            {isPending
              ? ar.workout.active.saving
              : ar.workout.rotation.startCTA}
          </span>
        </button>

        <Link
          href={`/workout/program/${program.id}`}
          className="flex items-center justify-center gap-1 py-2.5 px-3.5 rounded-xl text-xs font-bold text-[#9D969D] hover:text-[#F2EADF] bg-[#211C23] border border-[#362E3B] hover:border-[#7C1D38] transition-colors"
        >
          <span>{ar.workout.rotation.viewDetails}</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
