import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramDetails } from "@/src/server/workout-queries";
import { ExerciseItem } from "@/src/ui/workout/ExerciseItem";
import { ar } from "@/src/i18n/ar";
import { ArrowRight, Dumbbell } from "lucide-react";
import { StartProgramButton } from "./StartProgramButton";

export const dynamic = "force-dynamic";

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;
  const details = await getProgramDetails(id);

  if (!details) {
    notFound();
  }

  const { program, exercises } = details;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button */}
      <Link
        href="/workout"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>{ar.workout.details.backToPrograms}</span>
      </Link>

      {/* Program Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{program.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              v{program.version}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
            <span>{ar.workout.rotation.exercisesCount.replace("{count}", String(exercises.length))}</span>
          </p>
        </div>

        {/* Start Workout Button */}
        <StartProgramButton programId={program.id} label={ar.workout.details.startWorkout} />
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-200 px-1">
          {ar.workout.details.exercisesTitle}
        </h2>
        <div className="space-y-2.5">
          {exercises.map((exercise, idx) => (
            <ExerciseItem key={exercise.id} exercise={exercise} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
