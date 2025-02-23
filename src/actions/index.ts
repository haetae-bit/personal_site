import { defineAction, ActionError } from "astro:actions";
import { db, Guestbook } from "astro:db";
import { z } from "astro:schema";

export const server = {
  guestbook: defineAction({
    accept: "form",
    input: z.object({
      username: z.string(),
      website: z.string().url().optional(),
      body: z.string(),
      password: z.string().regex(/\biliad/g),
    }),
    handler: async (input) => {
      if (input.username === "") {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "You should put in a name for yourself!"
        });
      }

      if (input.body === "") {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "There should be a message here."
        });
      }

      if (input.password !== "iliad") {
        throw new ActionError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Whoops, something went wrong!",
        });
      }

      return await db.insert(Guestbook).values({ 
        username: input.username, 
        website: input.website, 
        body: input.body, 
      }).returning();
    },
  }),
}