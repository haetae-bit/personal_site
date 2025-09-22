import { loadEnv } from "vite";
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client";

const { TURSO_DATABASE_URL } = loadEnv(process.env.NODE_ENV!, process.cwd(), "");

const client = createClient({
  url: TURSO_DATABASE_URL,
});
export const db = drizzle({ client });
