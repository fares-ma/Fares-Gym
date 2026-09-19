import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramDetails } from "@/server/workout-queries";
import { ExerciseItem } from "@/ui/workout/ExerciseItem";
import { ar } from "@/i18n/ar";
import { ArrowRight, Dumbbell } from "lucide-react";
import { StartProgramButton } from "./StartProgramButton";
import { MiniFares } from "@/ui/MiniFares";

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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A7A0A6] hover:text-[#F1E9DD] transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>{ar.workout.details.backToPrograms}</span>
      </Link>

      {/* Program Header */}
      <div className="hub-card p-6 border border-[#2A242E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F1E9DD]">
              {program.name}
            </h1>
            <span className="hub-badge text-xs font-mono">
              v{program.version}
            </span>
          </div>
          <p className="text-xs text-[#A7A0A6] mt-1.5 flex items-center gap-1.5 font-medium">
            <Dumbbell className="w-3.5 h-3.5 text-[#A83252]" />
            <span>
              {ar.workout.rotation.exercisesCount.replace(
                "{count}",
                String(exercises.length)
              )}
            </span>
          </p>
        </div>

        {/* Start Workout Button + Mini Fares */}
        <div className="flex items-center gap-3">
          <StartProgramButton
            programId={program.id}
            label={ar.workout.details.startWorkout}
          />
          <div className="hidden sm:block">
            <MiniFares pose="gym-dumbbell" size="sm" animate="breathe" />
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-[#F1E9DD] px-1">
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

