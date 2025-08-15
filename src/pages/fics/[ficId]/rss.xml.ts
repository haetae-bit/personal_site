import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";

import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

const parser = marked.use({ gfm: true, breaks: true });
const fics = await getCollection("fics", ({ data }) => data.oneshot !== true);

export const GET: APIRoute = async (context) => {
  const chapters = await getCollection("chapters", ({ id }) => id.split("/")[0] === context.params.ficId);
  const fic = fics.find(({ id }) => id === context.params.ficId);
  const container = await AstroContainer.create();
  const feed: RSSFeedItem[] = [];

  for (const entry of chapters) {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);

    feed.push({
      link: `/fics/${entry.id}`,
      title: entry.data.title,
      pubDate: entry.data.publishedAt,
      content: DOMPurify.sanitize(content),
      categories: typeof fic?.data.series == "string" ? [fic?.data.series] : [...fic?.data.series!],
    });
  }
  const summary = await parser.parse(fic?.data.summary ?? "");

  return rss({
    title: `${fic?.data.title}`,
    description: DOMPurify.sanitize(summary),
    site: context.site!,
    items: feed,
  });
};

export function getStaticPaths() {
  return fics.map(fic => ({
    params: { ficId: fic.id },
  }));
}