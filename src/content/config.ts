import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import moods from "@/utils/moods";
import { ficsLoader } from "@/utils/loader";

function slugify(input: string) {
  return input
    .toString()
    .toLocaleLowerCase()
    .normalize("NFKD")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/_+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const parser = new MarkdownIt({
  html: true,
  breaks: true,
});

const blog = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: "./src/content/blog" }),
  schema: rssSchema.extend({ 
    currently: z.object({
      mood: z.enum(moods).optional(),
      reading: z.ostring(),
      watching: z.ostring(),
      playing: z.ostring(),
      listening: z.ostring(),
    }).optional(),
  }),
});

const source = "./src/content/fics";
const chapters = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx,mdoc}",
    base: source,
  }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    notes: z.ostring().transform(notes => parser.renderInline(notes ?? "", {})),
    lastModified: z.coerce.date().optional(),
    sortOrder: z.number().default(1),
  }),
});

const fics = defineCollection({
  loader: glob({ 
    pattern: "**/*.{yml,yaml}", 
    base: source, 
    generateId: ({ entry, data }) => {
      if (data.slug) return data.slug as string;
      return slugify(entry.split("/")[0]);
    } 
  }),
  schema: z.object({
    title: z.string(),
    series: z.union([z.string(), z.array(z.string())]),
    publishedAt: z.coerce.date(),
    summary: z.string().transform(summary => parser.renderInline(summary, {})),
    characters: z.array(z.string()).optional(),
    ships: z.ostring(),
    tags: z.array(z.string()).optional(),
    notes: z.ostring().transform(notes => parser.renderInline(notes ?? "", {})),
    lastModified: z.coerce.date().optional(),
  }),
});

// const fics = defineCollection({
//   loader: ficsLoader(glob({ pattern: "**/*.{yml,yaml}", base: source })),
// });

export const collections = { blog, fics, chapters };