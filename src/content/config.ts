import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: rssSchema,
});

function generateFicSlug({ entry, data }: { entry: string, data: any }): string {
  if (data.slug) {
    return data.slug as string;
  }
  return entry.split("/")[0];
}

const source = "./src/content/fics";
const chapters = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: source }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    notes: z.ostring(),
    lastModified: z.coerce.date().optional(),
    sortOrder: z.number(),
  }),
});

const fics = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml}", base: source, generateId: generateFicSlug }),
  schema: z.object({
    title: z.string(),
    series: z.array(z.string()),
    publishedAt: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { blog, fics, chapters };