import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guestbookTable = sqliteTable("guestbook_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  website: text(),
  message: text().notNull(),
  published: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updated: text().$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  reply: text(),
});