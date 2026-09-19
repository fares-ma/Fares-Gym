"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExerciseTarget, WeightValue } from "@/domain/workout/types";
import { formatWeight } from "@/domain/workout/weight-parser";
import { ar } from "@/i18n/ar";
import { SetEntryRow } from "./SetEntryRow";
import { RestTimer } from "./RestTimer";
import { useRestTimer } from "./useRestTimer";
import {
  completeWorkoutSessionAction,
  abandonWorkoutSessionAction,
} from "@/server/workout-actions";
import {
  Flame,
  Dumbbell,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";

interface ActiveWorkoutViewProps {
  session: {
    id: string;
    programId: string;
    programVersion: number;
    startedAt: Date;
    status: string;
  };
  program: {
    id: string;
    name: string;
    version: number;
  };
  exercises: ExerciseTarget[];
  initialEntries: Array<{
    id: string;
    exerciseId: string;
    setNumber: number;
    setType: "heating" | "working";
    targetWeight: any;
    actualWeight: any;
    targetReps: number;
    actualReps: number;
    isCompleted: boolean;
  }>;
}

export function ActiveWorkoutView({
  session,
  program,
  exercises,
  initialEntries,
}: ActiveWorkoutViewProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [notes, setNotes] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    isActive: isTimerActive,
    secondsRemaining,
    totalSeconds,
    startTimer,
    addTime,
    skipTimer,
  } = useRestTimer();

  const currentExercise = exercises[currentIdx];

  // Filter set entries for current exercise
  const currentEntries = initialEntries.filter(
    (e) => e.exerciseId === currentExercise?.exerciseId
  );

  const heatingEntries = currentEntries.filter((e) => e.setType === "heating");
  const workingEntries = currentEntries.filter((e) => e.setType === "working");

  // Handler when a set is completed
  const handleSetCompleted = (isWorking: boolean) => {
    // Trigger quick celebration badge
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 1400);

    if (
      isWorking &&
      currentExercise?.targetRest &&
      currentExercise.targetRest !== "-"
    ) {
      const restRange = currentExercise.targetRest.split("-");
      const restMins = parseFloat(restRange[0]) || 3;
      startTimer(restMins * 60);
    }
  };

  // Complete entire session
  const handleFinishSession = () => {
    startTransition(async () => {
      const res = await completeWorkoutSessionAction(session.id, notes);
      if (res.success) {
        router.push("/workout/history");
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  // Abandon session
  const handleAbandonSession = () => {
    if (confirm(ar.workout.active.confirmDiscard)) {
      startTransition(async () => {
        const res = await abandonWorkoutSessionAction(session.id);
        if (res.success) {
          router.push("/workout");
        } else {
          alert(res.error || ar.errors.generic);
        }
      });
    }
  };

  if (!currentExercise) return null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12 relative">
      {/* Set Completion Celebration Flash */}
      {showCelebration && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-subtle pointer-events-none">
          <div className="comic-card-accent py-2 px-4 flex items-center gap-3 bg-[#211C23] shadow-2xl border-[#7C1D38]">
            <MiniFares pose="fist-pump" size="xs" animate="bounce" />
            <span className="text-xs font-black text-[#D6AA63]">
              {ar.workout.active.setCelebration}
            </span>
          </div>
        </div>
      )}

      {/* Top Session Status Bar */}
      <div className="hub-card p-3.5 sm:p-4 flex items-center justify-between gap-4 border border-[#2A242E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A1024] border border-[#7A1735] flex items-center justify-center text-[#F1E9DD] shrink-0">
            <Dumbbell className="w-5 h-5 text-[#C9A15A]" />
          </div>
          <div>
            <span className="text-xs font-black text-[#C9A15A] block font-latin">
              {program.name}
            </span>
            <p className="text-[11px] text-[#A7A0A6] font-medium">
              {ar.workout.active.exerciseProgress
                .replace("{current}", String(currentIdx + 1))
                .replace("{total}", String(exercises.length))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFinishModal(true)}
            className="hub-btn-primary text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#7A1735]/40"
          >
            <CheckCircle className="w-4 h-4 text-[#C9A15A]" />
            <span>{ar.workout.active.finishWorkout}</span>
          </button>

          <button
            onClick={handleAbandonSession}
            className="text-xs text-[#A7A0A6] hover:text-[#E05252] p-2 rounded-xl hover:bg-[#1D1920] transition-colors cursor-pointer"
            title={ar.workout.active.discardCTA}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Exercise Hero Card */}
      <div className="hub-card-accent p-5 sm:p-6 shadow-xl border border-[#7A1735]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="hub-badge text-[10px] font-latin">
                EXERCISE {String(currentIdx + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#F1E9DD] tracking-tight">
              {currentExercise.displayName}
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#A7A0A6] flex-wrap">
              <span className="font-mono text-[#C9A15A] font-black bg-[#1D1920] px-2.5 py-0.5 rounded-md border border-[#2A242E]">
                {ar.workout.details.weightTarget}{" "}
                {formatWeight(currentExercise.defaultWeight)}
              </span>
              <span>•</span>
              <span className="font-bold text-[#F1E9DD]">
                {ar.workout.details.repsTarget} {currentExercise.targetReps}
              </span>
              {currentExercise.targetRest !== "-" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A7A0A6]" />
                    {currentExercise.targetRest} {ar.workout.details.minutes}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Heating Sets Section */}
        {heatingEntries.length > 0 && (
          <div className="mb-5 space-y-2">
            <h3 className="text-xs font-black text-[#C9A15A] uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Flame className="w-4 h-4 text-[#C9A15A]" />
              <span>{ar.workout.active.heatingSetsHeader}</span>
            </h3>
            <div className="space-y-2">
              {heatingEntries.map((entry) => (
                <SetEntryRow
                  key={entry.id}
                  entryId={entry.id}
                  setNumber={entry.setNumber}
                  setType="heating"
                  targetWeight={entry.targetWeight as WeightValue}
                  initialActualWeight={entry.actualWeight as WeightValue}
                  initialActualReps={entry.actualReps}
                  initialIsCompleted={entry.isCompleted}
                  onSetCompleted={handleSetCompleted}
                />
              ))}
            </div>
          </div>
        )}

        {/* Working Sets Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-[#F1E9DD] uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Dumbbell className="w-4 h-4 text-[#A83252]" />
            <span>{ar.workout.active.workingSetsHeader}</span>
          </h3>
          <div className="space-y-2">
            {workingEntries.map((entry) => (
              <SetEntryRow
                key={entry.id}
                entryId={entry.id}
                setNumber={entry.setNumber}
                setType="working"
                targetWeight={entry.targetWeight as WeightValue}
                initialActualWeight={entry.actualWeight as WeightValue}
                initialActualReps={entry.actualReps}
                initialIsCompleted={entry.isCompleted}
                onSetCompleted={handleSetCompleted}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex-1 min-h-[48px] py-3 px-4 rounded-xl text-xs font-black hub-btn-secondary disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{ar.workout.active.prevExerciseBtn}</span>
        </button>

        <button
          onClick={() =>
            setCurrentIdx((prev) => Math.min(exercises.length - 1, prev + 1))
          }
          disabled={currentIdx === exercises.length - 1}
          className="flex-1 min-h-[48px] py-3 px-4 rounded-xl text-xs font-black hub-btn-primary disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7A1735]/40"
        >
          <span>{ar.workout.active.nextExerciseBtn}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Rest Timer */}
      {isTimerActive && (
        <RestTimer
          secondsRemaining={secondsRemaining}
          totalSeconds={totalSeconds}
          onAddTime={addTime}
          onSkip={skipTimer}
        />
      )}

      {/* Finish Session Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="hub-card-elevated p-6 max-w-md w-full space-y-4 shadow-2xl border border-[#2A242E] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <MiniFares pose="trophy" size="sm" animate="bounce" />
              <div>
                <h3 className="text-lg font-black text-[#F1E9DD]">
                  {ar.workout.active.finishWorkout}
                </h3>
                <p className="text-xs text-[#A7A0A6]">
                  {ar.workout.active.confirmFinish}
                </p>
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-bold text-[#F1E9DD] mb-1.5">
                {ar.workout.active.sessionNotesLabel}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={ar.workout.active.notesPlaceholder}
                className="w-full bg-[#151318] border border-[#2A242E] rounded-xl p-3 text-xs text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#A83252] focus:ring-1 focus:ring-[#A83252] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleFinishSession}
                disabled={isPending}
                className="flex-1 hub-btn-primary min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-black cursor-pointer disabled:opacity-50"
              >
                {isPending
                  ? ar.workout.active.saving
                  : ar.workout.active.finishWorkout}
              </button>

              <button
                onClick={() => setShowFinishModal(false)}
                disabled={isPending}
                className="hub-btn-secondary min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer"
              >
                {ar.workout.active.undo}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
