import { db } from "./db";
import { exercises, workoutPrograms, workoutProgramExercises, WeightValue } from "./schema";
import gymData from "../../gym-data.json";

function parseSeedWeight(raw: string): WeightValue {
  const match = raw.match(/^([0-9.]+)\s*([a-zA-Z]*)$/);
  const num = match ? parseFloat(match[1]) : 0;
  const tag = match && match[2] ? match[2].toUpperCase() : "";
  return {
    rawWeight: raw,
    numericValue: num,
    unitTag: tag || "K",
    isUnitConfirmed: true,
  };
}

export async function seedDatabase() {
  console.log("Seeding database from gym-data.json...");

  // 1. Seed Exercises
  for (const ex of gymData.exercises) {
    await db
      .insert(exercises)
      .values({
        id: ex.id,
        displayName: ex.displayName,
        aliases: ex.aliases || [],
      })
      .onConflictDoNothing();
  }
  console.log(`Inserted / verified ${gymData.exercises.length} exercises.`);

  // 2. Seed Programs and Program Exercises
  for (const prog of gymData.programs) {
    await db
      .insert(workoutPrograms)
      .values({
        id: prog.id,
        name: prog.name,
        version: prog.version,
        orderIndex: prog.order,
        isActive: true,
      })
      .onConflictDoNothing();

    for (let i = 0; i < prog.exercises.length; i++) {
      const e = prog.exercises[i];
      const progExId = `${prog.id}_v${prog.version}_${e.exerciseId}`;

      await db
        .insert(workoutProgramExercises)
        .values({
          id: progExId,
          programId: prog.id,
          programVersion: prog.version,
          exerciseId: e.exerciseId,
          orderIndex: i + 1,
          heating: e.heating,
          workingSets: e.workingSets,
          targetReps: e.reps,
          rest: e.rest,
          defaultWeight: parseSeedWeight(e.weight),
        })
        .onConflictDoNothing();
    }
  }
  console.log(`Inserted / verified ${gymData.programs.length} workout programs with full exercise configurations.`);
  console.log("Seeding complete!");
}

// Allow running directly via tsx / node
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
