import dns from "node:dns";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (typeof dns?.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

