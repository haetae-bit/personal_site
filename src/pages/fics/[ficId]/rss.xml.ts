import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";
const parser = new MarkdownIt();

const fics = await getCollection("fics");

export const GET: APIRoute = async (context) => {
  const chapters = await getCollection("chapters", ({ id }) => {
    return id.split("/")[0] === context.params.ficId;
  });
  const fic = fics.find(({ id }) => id === context.params.ficId);
  return rss({
    title: `${fic?.data.title}`,
    description: sanitize(parser.render(fic?.data.summary!), {
      allowedTags: sanitize.defaults.allowedTags.concat(["br"]),
    }),
    site: context.site!,
    items: chapters.map(chapter => ({
      link: `/fics/${chapter.id}`,
      title: chapter.data.title,
      pubDate: chapter.data.publishedAt,
      content: sanitize(parser.render(chapter.body!), {
        allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      }),
      categories: fic?.data.series.concat(fic.data.title),
    })),
  });
};

export function getStaticPaths() {
  return fics.map(fic => ({
    params: { ficId: fic.id },
  }));
}