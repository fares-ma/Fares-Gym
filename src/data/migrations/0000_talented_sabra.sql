CREATE TABLE "activation_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"routine_name" text NOT NULL,
	"completed_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "body_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"weight_kg" real,
	"notes" text,
	CONSTRAINT "body_metrics_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "daily_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"steps" integer,
	"active_minutes" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"aliases" jsonb DEFAULT '[]'::jsonb,
	"tutorial_url" text,
	"personal_notes" text
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text NOT NULL,
	"attempted_at" timestamp NOT NULL,
	"success" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"name" text NOT NULL,
	"calories" integer NOT NULL,
	"protein_grams" real NOT NULL,
	"carbs_grams" real NOT NULL,
	"fats_grams" real NOT NULL,
	"logged_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"file_path" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_targets" (
	"id" text PRIMARY KEY NOT NULL,
	"effective_date" text NOT NULL,
	"target_calories" integer NOT NULL,
	"target_protein" real NOT NULL,
	"target_carbs" real NOT NULL,
	"target_fats" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performed_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"type" text NOT NULL,
	"target_reps" text,
	"actual_reps" integer,
	"target_weight" jsonb,
	"actual_weight" jsonb,
	"completed" boolean DEFAULT false,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"exercise_id" text NOT NULL,
	"max_weight" jsonb,
	"volume" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"due_time" text NOT NULL,
	"is_completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "schedule_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warmup_overrides" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"custom_heating" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warmup_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"heating_code" text NOT NULL,
	"sets_formula" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_splits" (
	"id" text PRIMARY KEY NOT NULL,
	"day_of_week" integer NOT NULL,
	"target_program_id" text
);
--> statement-breakpoint
CREATE TABLE "workout_program_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"program_version" integer NOT NULL,
	"exercise_id" text NOT NULL,
	"order_index" integer NOT NULL,
	"heating" text NOT NULL,
	"working_sets" integer NOT NULL,
	"target_reps" text NOT NULL,
	"rest" text NOT NULL,
	"default_weight" jsonb
);
--> statement-breakpoint
CREATE TABLE "workout_programs" (
	"id" text NOT NULL,
	"name" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"order_index" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "workout_programs_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"program_version" integer NOT NULL,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"duration_seconds" integer,
	"notes" text
);
--> statement-breakpoint
CREATE INDEX "login_attempts_ip_idx" ON "login_attempts" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "meals_date_idx" ON "meals" USING btree ("date");--> statement-breakpoint
CREATE INDEX "nutrition_targets_effective_date_idx" ON "nutrition_targets" USING btree ("effective_date");--> statement-breakpoint
CREATE INDEX "performed_sets_session_id_idx" ON "performed_sets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "performed_sets_exercise_id_idx" ON "performed_sets" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "schedule_blocks_day_of_week_idx" ON "schedule_blocks" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "prog_exercises_prog_idx" ON "workout_program_exercises" USING btree ("program_id","program_version");--> statement-breakpoint
CREATE INDEX "prog_exercises_ex_idx" ON "workout_program_exercises" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "workout_sessions_status_idx" ON "workout_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workout_sessions_completed_at_idx" ON "workout_sessions" USING btree ("completed_at");