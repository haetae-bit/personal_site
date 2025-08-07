import { defineAction } from "astro:actions";
import { z } from "astro:content";
import sanitize from "sanitize-html";

export const comments = {
  addComment: defineAction({
    accept: "form",
    input: z.object({
      postId: z.string(),
      replyId: z.number().optional(),
      name: z.string(),
      website: z.string().url().optional(),
      comment: z.string(),
    }),
    handler: async (input) => {
      // sanitize but allow line breaks
      sanitize(input.comment);
      // post to comment server
    },
  }),
};