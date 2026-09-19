import { z } from "zod";

// ==========================================
// Workout Schemas
// ==========================================
export const startWorkoutSessionSchema = z.object({
  programId: z.string().trim().min(1, "معرف البرنامج مطلوب"),
});

export const logSetEntrySchema = z.object({
  entryId: z.string().trim().min(1, "معرف المجموعة مطلوب"),
  actualWeight: z.string().trim().min(1, "الوزن مطلوب"),
  actualReps: z.number().int().min(0, "العدات يجب أن تكون 0 أو أكثر"),
  isCompleted: z.boolean().optional(),
  status: z.enum(["pending", "completed", "skipped"]).optional(),
  notes: z.string().optional().nullable(),
});

export const completeWorkoutSessionSchema = z.object({
  sessionId: z.string().trim().min(1, "معرف الجلسة مطلوب"),
  notes: z.string().optional().nullable(),
});

export const abandonWorkoutSessionSchema = z.object({
  sessionId: z.string().trim().min(1, "معرف الجلسة مطلوب"),
});

// ==========================================
// Nutrition Schemas
// ==========================================
export const MealInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  name: z.string().trim().min(1, "Meal name is required"),
  calories: z.number().int().nonnegative("Calories must be non-negative"),
  proteinGrams: z.number().nonnegative("Protein must be non-negative").default(0),
  carbsGrams: z.number().nonnegative("Carbohydrates must be non-negative").default(0),
  fatsGrams: z.number().nonnegative("Fats must be non-negative").default(0),
});

export const TargetInputSchema = z.object({
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  targetCalories: z.number().int().positive("Target calories must be greater than 0"),
  targetProtein: z.number().nonnegative("Target protein must be non-negative"),
  targetCarbs: z.number().nonnegative("Target carbohydrates must be non-negative"),
  targetFats: z.number().nonnegative("Target fats must be non-negative"),
});

// ==========================================
// Activities Schemas
// ==========================================
export const ScheduleBlockSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    dayOfWeek: z.number().int().min(0).max(7),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time (HH:MM)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time (HH:MM)"),
  })
  .refine((data) => data.startTime !== data.endTime, {
    message: "وقت البداية والنهاية لا يمكن أن يكونا متطابقين",
  });

export const ReminderSchema = z.object({
  text: z.string().trim().min(1, "Reminder text is required"),
  dueTime: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$|^$/, "Invalid due time (HH:MM)")
    .default(""),
});

export const NoteSchema = z.object({
  content: z.string().trim().min(1, "Note content cannot be empty"),
});

// ==========================================
// Progress & Metrics Schemas
// ==========================================
export const BodyWeightSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine(
      (val) => {
        const [yearStr, monthStr, dayStr] = val.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        if (month < 1 || month > 12 || day < 1 || day > 31) return false;
        const d = new Date(Date.UTC(year, month - 1, day));
        return (
          d.getUTCFullYear() === year &&
          d.getUTCMonth() === month - 1 &&
          d.getUTCDate() === day
        );
      },
      { message: "Invalid calendar date" }
    ),
  weightKg: z.number().positive("Weight must be greater than 0").max(300, "Invalid weight value"),
  notes: z.string().trim().max(250).optional().default(""),
});
