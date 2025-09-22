import { TURSO_DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client";

const client = createClient({
  url: TURSO_DATABASE_URL,
});
export const db = drizzle({ client });
