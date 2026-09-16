import { db } from "./db";
import { exercises, workoutPrograms } from "./schema";
import gymData from "../../gym-data.json";

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

  // 2. Seed Programs
  for (const prog of gymData.programs) {
    await db
      .insert(workoutPrograms)
      .values({
        id: prog.id,
        name: prog.name,
        version: prog.version,
        orderIndex: prog.order,
        isActive: true,
        daysPerWeek: 4,
        rotationOrder: prog.exercises.map((e) => e.exerciseId),
      })
      .onConflictDoNothing();
  }
  console.log(`Inserted / verified ${gymData.programs.length} workout programs.`);
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
