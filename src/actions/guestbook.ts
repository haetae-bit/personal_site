import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, Guestbook, isDbError } from "astro:db";
import DOMPurify from "isomorphic-dompurify";

export const guestbook = {
  addEntry: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().min(1, "You should have a name!"),
      website: z.string().url().optional(),
      message: z.string().min(1, "Can't be that short..."),
    }),
    handler: async ({ username, website, message }) => {
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
        if (isDbError(e)) {
          return new Response(`Cannot insert entry\n\n${e.message}`, { status: 400 });
        }
        return new Response('An unexpected error occurred', { status: 500 });
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
          if (isDbError(e)) {
            return new Response(`Cannot update entry\n\n${e.message}`, { status: 400 });
          }
          return new Response('An unexpected error occurred', { status: 500 });
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
          if (isDbError(e)) {
            return new Response(`Cannot update entry\n\n${e.message}`, { status: 400 });
          }
          return new Response('An unexpected error occurred', { status: 500 });
        }
      },
    }),
  },
};