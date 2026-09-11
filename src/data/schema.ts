import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// 1. نوع الوزن المخصص المعتم (Opaque Unit Tags: K / B)
export type WeightValue = {
  rawWeight: string; // مثال: "50K" أو "150B"
  numericValue: number; // 50 (للحساب فقط)
  unitTag: string; // "K" | "B" | غير معرّف
  isUnitConfirmed: boolean;
};

// 2. إدارة المستخدم والجلسات (Single-User Auth)
export const userProfile = sqliteTable("user_profile", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// سجل محاولات تسجيل الدخول للـ Rate Limiting
export const loginAttempts = sqliteTable("login_attempts", {
  id: text("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  attemptedAt: integer("attempted_at", { mode: "timestamp" }).notNull(),
  success: integer("success", { mode: "boolean" }).notNull(),
});

// 3. كتالوج التمارين والبرامج
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(), // slug: db_shoulder_press
  displayName: text("display_name").notNull(),
  aliases: text("aliases", { mode: "json" }).$type<string[]>().default([]),
  tutorialUrl: text("tutorial_url"),
  personalNotes: text("personal_notes"),
});

export const workoutPrograms = sqliteTable("workout_programs", {
  id: text("id").primaryKey(), // anterior_a
  name: text("name").notNull(),
  version: integer("version").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const workoutProgramExercises = sqliteTable("workout_program_exercises", {
  id: text("id").primaryKey(),
  programId: text("program_id").notNull(),
  programVersion: integer("program_version").notNull(),
  exerciseId: text("exercise_id").notNull(),
  orderIndex: integer("order_index").notNull(),
  heating: text("heating").notNull(), // "1-2", "0", إلخ
  workingSets: integer("working_sets").notNull(),
  targetReps: text("target_reps").notNull(),
  rest: text("rest").notNull(),
  defaultWeight: text("default_weight", { mode: "json" }).$type<WeightValue>(),
});

// 4. جلسات التمرين والتاريخ (Append-Only)
export const workoutSessions = sqliteTable("workout_sessions", {
  id: text("id").primaryKey(),
  programId: text("program_id").notNull(),
  programVersion: integer("program_version").notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  notes: text("notes"),
});

export const performedSets = sqliteTable("performed_sets", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  setNumber: integer("set_number").notNull(),
  type: text("type", { enum: ["warmup", "working"] }).notNull(),
  targetReps: text("target_reps"),
  actualReps: integer("actual_reps"),
  targetWeight: text("target_weight", { mode: "json" }).$type<WeightValue>(),
  actualWeight: text("actual_weight", { mode: "json" }).$type<WeightValue>(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});

// 5. الإحماء والتسخين والتفعيل
export const warmupRules = sqliteTable("warmup_rules", {
  id: text("id").primaryKey(),
  heatingCode: text("heating_code").notNull(),
  setsFormula: text("sets_formula", { mode: "json" }).notNull(),
});

export const warmupOverrides = sqliteTable("warmup_overrides", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id").notNull(),
  customHeating: text("custom_heating").notNull(),
});

export const activationSessions = sqliteTable("activation_sessions", {
  id: text("id").primaryKey(),
  sessionId: text("session_id"),
  routineName: text("routine_name").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }).notNull(),
});

// 6. التغذية والوجبات
export const meals = sqliteTable("meals", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  proteinGrams: real("protein_grams").notNull(),
  carbsGrams: real("carbs_grams").notNull(),
  fatsGrams: real("fats_grams").notNull(),
  loggedAt: integer("logged_at", { mode: "timestamp" }).notNull(),
});

export const nutritionTargets = sqliteTable("nutrition_targets", {
  id: text("id").primaryKey(),
  effectiveDate: text("effective_date").notNull(),
  targetCalories: integer("target_calories").notNull(),
  targetProtein: real("target_protein").notNull(),
  targetCarbs: real("target_carbs").notNull(),
  targetFats: real("target_fats").notNull(),
});

// 7. الأنشطة والمذكرات والمقاييس
export const scheduleBlocks = sqliteTable("schedule_blocks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const weeklySplits = sqliteTable("weekly_splits", {
  id: text("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  targetProgramId: text("target_program_id"),
});

export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  dueTime: text("due_time").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const dailyActivities = sqliteTable("daily_activities", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  steps: integer("steps"),
  activeMinutes: integer("active_minutes"),
  notes: text("notes"),
});

export const progressSnapshots = sqliteTable("progress_snapshots", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  exerciseId: text("exercise_id").notNull(),
  maxWeight: text("max_weight", { mode: "json" }).$type<WeightValue>(),
  volume: real("volume").notNull(),
});

export const bodyMetrics = sqliteTable("body_metrics", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  weightKg: real("weight_kg"),
  notes: text("notes"),
});

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
