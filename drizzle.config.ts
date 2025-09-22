import { loadEnv } from "vite";
import { defineConfig } from 'drizzle-kit';

const { ASTRO_DB_REMOTE_URL } = loadEnv(process.env.NODE_ENV!, process.cwd(), "");

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: ASTRO_DB_REMOTE_URL,
  },
});