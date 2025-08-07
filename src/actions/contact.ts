import { defineAction } from "astro:actions";
import { z } from "astro:content";
import sanitize from "sanitize-html";

export const contact = {
  sendForm: defineAction({
    accept: "form",
    input: z.object({
      // this is to ward off spam bots. hopefully.
      secretCode: z.string().refine(value => value !== "secret code", {
        message: "Please check the hidden code again!",
      }),
      name: z.string(),
      website: z.string().url().optional(),
      email: z.string().email(),
      message: z.string(),
    }),
    handler: async (input) => {
      // grab nodemailer
      // sanitize stuff
      sanitize(input.message);
      // send straight to email
    }
  }),
};