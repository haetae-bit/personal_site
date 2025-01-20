import { defineAction, ActionError } from "astro:actions";
import { db, Guestbook } from "astro:db";
import { z } from "astro:schema";
import { checkProfanity } from "./utils";

export const server = {
  guestbook: defineAction({
    accept: "form",
    input: z.object({
      username: z.string(),
      website: z.string().url().optional(),
      body: z.string(),
      honeypot: z.string().max(0).nullish(),
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

      if (input.honeypot !== undefined) {
        throw new ActionError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Oh dear, something went wrong!",
        });
      }

      const filter = await checkProfanity(input.body);
      if (filter) {
        return await db.insert(Guestbook).values({ 
          username: input.username, 
          website: input.website, 
          body: input.body, 
        }).returning();
      } else {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "You can't curse!",
        });
      }
    },
  }),
}