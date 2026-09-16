import { pgTable, text, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// 1. نوع الوزن المخصص المعتم (Opaque Unit Tags: K / B)
export type WeightValue = {
  rawWeight: string; // مثال: "50K" أو "150B"
  numericValue: number; // 50 (للحساب فقط)
  unitTag: string; // "K" | "B" | غير معرّف
  isUnitConfirmed: boolean;
};

// 2. إدارة المستخدم والجلسات (Single-User Auth)
export const userProfile = pgTable("user_profile", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

// سجل محاولات تسجيل الدخول للـ Rate Limiting
export const loginAttempts = pgTable("login_attempts", {
  id: text("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  attemptedAt: timestamp("attempted_at", { mode: "date" }).notNull(),
  success: boolean("success").notNull(),
});

// 3. كتالوج التمارين والبرامج
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(), // slug: db_shoulder_press
  displayName: text("display_name").notNull(),
  aliases: jsonb("aliases").$type<string[]>().default([]),
  tutorialUrl: text("tutorial_url"),
  personalNotes: text("personal_notes"),
});

export const workoutPrograms = pgTable("workout_programs", {
  id: text("id").primaryKey(), // anterior_a
  name: text("name").notNull(),
  version: integer("version").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
  isActive: boolean("is_active").default(true),
});

export const workoutProgramExercises = pgTable("workout_program_exercises", {
  id: text("id").primaryKey(),
  programId: text("program_id").notNull(),
  programVersion: integer("program_version").notNull(),
  exerciseId: text("exercise_id").notNull(),
  orderIndex: integer("order_index").notNull(),
  heating: text("heating").notNull(), // "1-2", "0", إلخ
  workingSets: integer("working_sets").notNull(),
  targetReps: text("target_reps").notNull(),
  rest: text("rest").notNull(),
  defaultWeight: jsonb("default_weight").$type<WeightValue>(),
});

// 4. جلسات التمرين والتاريخ (Append-Only)
export const workoutSessions = pgTable("workout_sessions", {
  id: text("id").primaryKey(),
  programId: text("program_id").notNull(),
  programVersion: integer("program_version").notNull(),
  startedAt: timestamp("started_at", { mode: "date" }).notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),
  status: text("status").notNull().default("in_progress"), // "in_progress" | "completed" | "abandoned"
  durationSeconds: integer("duration_seconds"),
  notes: text("notes"),
});

export const performedSets = pgTable("performed_sets", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  setNumber: integer("set_number").notNull(),
  type: text("type").notNull(), // "heating" | "working"
  targetReps: text("target_reps"),
  actualReps: integer("actual_reps"),
  targetWeight: jsonb("target_weight").$type<WeightValue>(),
  actualWeight: jsonb("actual_weight").$type<WeightValue>(),
  completed: boolean("completed").default(false),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

export const workoutSetEntries = performedSets;

// 5. الإحماء والتسخين والتفعيل
export const warmupRules = pgTable("warmup_rules", {
  id: text("id").primaryKey(),
  heatingCode: text("heating_code").notNull(),
  setsFormula: jsonb("sets_formula").notNull(),
});

export const warmupOverrides = pgTable("warmup_overrides", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id").notNull(),
  customHeating: text("custom_heating").notNull(),
});

export const activationSessions = pgTable("activation_sessions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id"),
  routineName: text("routine_name").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).notNull(),
});

// 6. التغذية والوجبات
export const meals = pgTable("meals", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  proteinGrams: real("protein_grams").notNull(),
  carbsGrams: real("carbs_grams").notNull(),
  fatsGrams: real("fats_grams").notNull(),
  loggedAt: timestamp("logged_at", { mode: "date" }).notNull(),
});

export const nutritionTargets = pgTable("nutrition_targets", {
  id: text("id").primaryKey(),
  effectiveDate: text("effective_date").notNull(),
  targetCalories: integer("target_calories").notNull(),
  targetProtein: real("target_protein").notNull(),
  targetCarbs: real("target_carbs").notNull(),
  targetFats: real("target_fats").notNull(),
});

// 7. الأنشطة والمذكرات والمقاييس
export const scheduleBlocks = pgTable("schedule_blocks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const weeklySplits = pgTable("weekly_splits", {
  id: text("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  targetProgramId: text("target_program_id"),
});

export const reminders = pgTable("reminders", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  dueTime: text("due_time").notNull(),
  isCompleted: boolean("is_completed").default(false),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});

export const dailyActivities = pgTable("daily_activities", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  steps: integer("steps"),
  activeMinutes: integer("active_minutes"),
  notes: text("notes"),
});

export const progressSnapshots = pgTable("progress_snapshots", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  exerciseId: text("exercise_id").notNull(),
  maxWeight: jsonb("max_weight").$type<WeightValue>(),
  volume: real("volume").notNull(),
});

export const bodyMetrics = pgTable("body_metrics", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  weightKg: real("weight_kg"),
  notes: text("notes"),
});

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});
