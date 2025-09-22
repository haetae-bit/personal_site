import { ASTRO_DB_REMOTE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client";

const client = createClient({
  url: ASTRO_DB_REMOTE_URL,
});
export const db = drizzle({ client });
