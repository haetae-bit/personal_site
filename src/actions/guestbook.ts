import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, Guestbook } from "astro:db";
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
      const addLine = message.replaceAll("/n", "<br/>");
      sanitize(addLine);

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
      if (context.url.hostname !== "127.0.0.1" || "localhost") {
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
};