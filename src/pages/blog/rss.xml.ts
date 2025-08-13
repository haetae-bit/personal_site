import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";

import { parse as htmlParser } from "node-html-parser";
import sanitize from "sanitize-html";
import fixRssImages from "@/utils/fixRssImages";

export const GET: APIRoute = async (context) => {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });
  
  const blog = await getCollection("blog");
  const feed: RSSFeedItem[] = [];

  for (const entry of blog) {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);
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