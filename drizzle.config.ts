import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/data/schema.ts",
  out: "./src/data/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
