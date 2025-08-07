import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, Guestbook } from "astro:db";
import bcrypt from "bcryptjs";
import sanitize from "sanitize-html";

export const guestbook = {
  addEntry: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().min(1, "You should have a name!"),
      website: z.string().url().optional(),
      message: z.string().min(1, "Can't be that short..."),
    }),
    handler: async ({ username, website, message }) => {
      // figure out how to add line breaks and THEN sanitize message

      const entry = await db.insert(Guestbook).values({
        username,
        website,
        message,
      }).returning();

      return entry[0];
    },
  }),
  reply: defineAction({
    accept: "form",
    input: z.object({
      id: z.number(),
      reply: z.string(),
    }),
    handler: async ({ id, reply }, context) => {
      if (!context.session?.get("pwd")) {
        throw new ActionError({ code: "UNAUTHORIZED" });
      }

      const entry = await db.select().from(Guestbook).where(eq(Guestbook.id, id));
      if (!entry) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "That entry doesn't exist!"
        });
      }
      
      // sanitize reply here

      const update = await db.update(Guestbook).set({ reply }).where(eq(Guestbook.id, id)).returning();
      return update[0];
    },
  }),
  login: defineAction({
    accept: "form",
    input: z.object({
      password: z.string(),
    }),
    handler: async ({ password }, context) => {
      // find env var here
      if (password !== "super secret password") {
        throw new ActionError({ code: "UNAUTHORIZED" });
      }

      const hash = await bcrypt.hash(password, 10);
      context.session?.set("pwd", hash);
      return { code: 200, message: "set the thing" };
    }
  }),
  logout: defineAction({
    accept: "form",
    handler: async (_input, context) => {
      context.session?.destroy();
      return { code: 200, message: "set the thing" };
    }
  }),
};