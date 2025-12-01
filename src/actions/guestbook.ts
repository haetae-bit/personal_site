import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, eq, Guestbook } from "astro:db";
// import { guestbookTable } from "db/schema";
import DOMPurify from "isomorphic-dompurify";

export const guestbook = {
  addEntry: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().nonempty("You should have a name!"),
      website: z.string().url().optional(),
      message: z.string().nonempty("Can't be that short..."),
      challenge: z.string().nonempty("Can't be empty!"),
    }),
    handler: async ({ username, website, message, challenge }) => {
      if (challenge !== "haetae") {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Check the challenge question again!",
        });
      }
      
      const addLine = message.replaceAll(/\r?\n/g, "<br />");
      const sanitized = DOMPurify.sanitize(addLine);

      try {
        const entry = await db.insert(Guestbook).values({
          username,
          website,
          message: sanitized,
        }).returning();
        
        return entry[0];
      } catch (e) {
        return new Response(`An unexpected error occurred\n\n${e}`, { status: 500 });
      }
    },
  }),
  ...import.meta.env.DEV && {
    reply: defineAction({
      accept: "form",
      input: z.object({
        id: z.coerce.number(),
        reply: z.string(),
      }),
      handler: async ({ id, reply }) => {
        if (!import.meta.env.DEV) {
          throw new ActionError({ code: "UNAUTHORIZED" });
        }
        
        const entry = await db.select().from(Guestbook).where(eq(Guestbook.id, id));
        if (!entry) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "That entry doesn't exist!"
          });
        }
        
        const addLine = reply.replaceAll(/\r?\n/g, "<br />");
        const sanitized = DOMPurify.sanitize(addLine);
        
        try {
          const update = await db.update(Guestbook).set({
            reply: sanitized,
            updated: new Date(),
          }).where(eq(Guestbook.id, id)).returning();

          return update[0];
        } catch (e) {
          return new Response(`An unexpected error occurred\n\n${e}`, { status: 500 });
        }
      },
    }),
    deleteEntry: defineAction({
      accept: "form",
      input: z.object({
        id: z.coerce.number()
      }),
      handler: async ({ id }) => {
        if (!import.meta.env.DEV) {
          throw new ActionError({ code: "UNAUTHORIZED" });
        }
        
        const entry = await db.select().from(Guestbook).where(eq(Guestbook.id, id));
        if (!entry) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "That entry doesn't exist!"
          });
        }

        try {
          const entry = await db.delete(Guestbook).where(eq(Guestbook.id, id)).returning();
          
          return entry[0];
        } catch (e) {
          return new Response(`An unexpected error occurred\n\n${e}`, { status: 500 });
        }
      },
    }),
  },
};