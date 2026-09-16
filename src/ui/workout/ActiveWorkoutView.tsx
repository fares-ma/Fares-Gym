"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExerciseTarget, WeightValue } from "@/src/domain/workout/types";
import { formatWeight } from "@/src/domain/workout/weight-parser";
import { ar } from "@/src/i18n/ar";
import { SetEntryRow } from "./SetEntryRow";
import { RestTimer } from "./RestTimer";
import { useRestTimer } from "./useRestTimer";
import {
  completeWorkoutSessionAction,
  abandonWorkoutSessionAction,
} from "@/src/server/workout-actions";
import {
  Flame,
  Dumbbell,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
} from "lucide-react";

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
    if (isWorking && currentExercise?.targetRest && currentExercise.targetRest !== "-") {
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
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Top Session Status Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {program.name}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            {ar.workout.active.exerciseProgress
              .replace("{current}", String(currentIdx + 1))
              .replace("{total}", String(exercises.length))}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFinishModal(true)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{ar.workout.active.finishWorkout}</span>
          </button>

          <button
            onClick={handleAbandonSession}
            className="text-xs text-slate-500 hover:text-red-400 p-2 rounded-lg transition-colors"
            title={ar.workout.active.discardCTA}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Exercise Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-white">{currentExercise.displayName}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-bold">
                {ar.workout.details.weightTarget} {formatWeight(currentExercise.defaultWeight)}
              </span>
              <span>•</span>
              <span>
                {ar.workout.details.repsTarget} {currentExercise.targetReps}
              </span>
              {currentExercise.targetRest !== "-" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {currentExercise.targetRest} {ar.workout.details.minutes}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Heating Sets Section */}
        {heatingEntries.length > 0 && (
          <div className="mb-6 space-y-2.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Flame className="w-4 h-4" />
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
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Dumbbell className="w-4 h-4" />
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
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 border border-slate-700 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{ar.workout.active.prevExerciseBtn}</span>
        </button>

        <button
          onClick={() => setCurrentIdx((prev) => Math.min(exercises.length - 1, prev + 1))}
          disabled={currentIdx === exercises.length - 1}
          className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-950"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold">{ar.workout.active.finishWorkout}</h3>
            <p className="text-sm text-slate-400">{ar.workout.active.confirmFinish}</p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {ar.workout.active.sessionNotesLabel}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أداء ممتاز، زيادة وزن تمرين..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleFinishSession}
                disabled={isPending}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-950 disabled:opacity-50"
              >
                {isPending ? ar.workout.active.saving : ar.workout.active.finishWorkout}
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                disabled={isPending}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
