import { loadEnv } from "vite";
import { defineConfig } from 'drizzle-kit';

const { TURSO_DATABASE_URL } = loadEnv(process.env.NODE_ENV!, process.cwd(), "");

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: TURSO_DATABASE_URL,
  },
});