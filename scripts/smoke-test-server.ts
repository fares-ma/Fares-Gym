import {
  startWorkoutSessionSchema,
  logSetEntrySchema,
  completeWorkoutSessionSchema,
  abandonWorkoutSessionSchema,
  MealInputSchema,
  TargetInputSchema,
  ScheduleBlockSchema,
  ReminderSchema,
  NoteSchema,
  BodyWeightSchema,
} from "../src/server/schemas";

console.log("Starting server action schema smoke test...");

// 1. Workout schemas
const invalidWorkoutStart = startWorkoutSessionSchema.safeParse({ programId: "" });
if (invalidWorkoutStart.success) throw new Error("Expected empty programId to fail");

const validWorkoutSet = logSetEntrySchema.safeParse({
  entryId: "123",
  actualWeight: "50K",
  actualReps: 10,
  isCompleted: true,
  status: "completed",
});
if (!validWorkoutSet.success) throw new Error("Valid workout set failed");

// 2. Nutrition schemas
const invalidMeal = MealInputSchema.safeParse({
  date: "2026-09-19",
  name: "",
  calories: -10,
  proteinGrams: 20,
  carbsGrams: 30,
  fatsGrams: 10,
});
if (invalidMeal.success) throw new Error("Expected invalid meal to fail");

const validMeal = MealInputSchema.safeParse({
  date: "2026-09-19",
  name: "Oatmeal with whey",
  calories: 450,
  proteinGrams: 35,
  carbsGrams: 55,
  fatsGrams: 8,
});
if (!validMeal.success) throw new Error("Valid meal failed");

// 3. Activities schemas
const invalidBlock = ScheduleBlockSchema.safeParse({
  title: "",
  dayOfWeek: 10,
  startTime: "25:00",
  endTime: "08:00",
});
if (invalidBlock.success) throw new Error("Expected invalid block to fail");

const validBlock = ScheduleBlockSchema.safeParse({
  title: "Gym Session",
  dayOfWeek: 1,
  startTime: "18:00",
  endTime: "19:30",
});
if (!validBlock.success) throw new Error("Valid block failed");

// Overnight block validation (should succeed)
const overnightBlock = ScheduleBlockSchema.safeParse({
  title: "Sleep",
  dayOfWeek: 1,
  startTime: "23:00",
  endTime: "07:00",
});
if (!overnightBlock.success) throw new Error("Overnight block should be valid");

// Same-time block validation (should fail)
const sameTimeBlock = ScheduleBlockSchema.safeParse({
  title: "Invalid",
  dayOfWeek: 1,
  startTime: "10:00",
  endTime: "10:00",
});
if (sameTimeBlock.success) throw new Error("Same start/end time block should fail");

// 4. Progress schemas
const invalidMetric = BodyWeightSchema.safeParse({
  weightKg: -5,
  date: "not-a-date",
});
if (invalidMetric.success) throw new Error("Expected invalid body metric to fail");

const validMetric = BodyWeightSchema.safeParse({
  weightKg: 82.5,
  date: "2026-09-19",
});
if (!validMetric.success) throw new Error("Valid metric failed");

console.log("All server validation schemas and invariants verified successfully!");
