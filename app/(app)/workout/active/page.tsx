import { redirect } from "next/navigation";
import { getActiveWorkoutSession } from "@/src/server/workout-queries";
import { ActiveWorkoutView } from "@/src/ui/workout/ActiveWorkoutView";

export const dynamic = "force-dynamic";

export default async function ActiveWorkoutPage() {
  const activeData = await getActiveWorkoutSession();

  if (!activeData) {
    redirect("/workout");
  }

  const { session, program, exercises, entries } = activeData;

  return (
    <ActiveWorkoutView
      session={{
        id: session.id,
        programId: session.programId,
        programVersion: session.programVersion,
        startedAt: new Date(session.startedAt),
        status: session.status,
      }}
      program={{
        id: program.id,
        name: program.name,
        version: program.version,
      }}
      exercises={exercises}
      initialEntries={entries.map((e) => ({
        id: e.id,
        exerciseId: e.exerciseId,
        setNumber: e.setNumber,
        setType: (e.type as "heating" | "working") || "working",
        targetWeight: e.targetWeight,
        actualWeight: e.actualWeight,
        targetReps: parseInt(e.targetReps || "8", 10) || 8,
        actualReps: e.actualReps ?? 8,
        isCompleted: e.completed ?? false,
      }))}
    />
  );
}
