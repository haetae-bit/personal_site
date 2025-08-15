import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";

import { marked } from "marked";
import { parse as htmlParser } from "node-html-parser";
import sanitize from "sanitize-html";
import fixRssImages from "@/utils/fixRssImages";

const parser = marked.use({ gfm: true, breaks: true });
const fics = await getCollection("fics");

export const GET: APIRoute = async (context) => {
  const chapters = await getCollection("chapters", ({ id }) => id.split("/")[0] === context.params.ficId);
  const fic = fics.find(({ id }) => id === context.params.ficId);
  const container = await AstroContainer.create();
  const feed: RSSFeedItem[] = [];

  for (const entry of chapters) {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);
    const html = htmlParser.parse(content);
    const images = html.querySelectorAll("img");

    await fixRssImages(images, context);

    feed.push({
      link: `/fics/${entry.id}`,
      title: entry.data.title,
      pubDate: entry.data.publishedAt,
      content: sanitize(html.toString(), {
        allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      }),
      categories: typeof fic?.data.series == "string" ? [fic?.data.series] : [...fic?.data.series!],
    });
  }
  const summary = await parser.parseInline(fic?.data.summary ?? "");

  return rss({
    title: `${fic?.data.title}`,
    description: sanitize(summary),
    site: context.site!,
    items: feed,
  });
};

export function getStaticPaths() {
  return fics.map(fic => ({
    params: { ficId: fic.id },
  }));
}