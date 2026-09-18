import dns from "node:dns";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (typeof dns?.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_DATABASE_URL_UNPOOLED ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

