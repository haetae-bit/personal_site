import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import sanitize from "sanitize-html";
import fixRssImages from "@/utils/fixRssImages";

const parser = new MarkdownIt();

export const GET: APIRoute = async (context) => {
  const blog = await getCollection("blog");
  const feed: RSSFeedItem[] = [];

  for (const entry of blog) {
    const content = parser.render(entry.body!);
    const html = htmlParser.parse(content);
    const images = html.querySelectorAll("img");

    await fixRssImages(images, context);

    feed.push({
      link: `/blog/${entry.id}`,
      content: sanitize(html.toString(), {
        allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      }),
      ...entry.data,
    });
  }

  return rss({
    title: "haetae's blog",
    description: "a blog about a weirdo who likes coding",
    site: context.site!,
    items: feed,
  });
}