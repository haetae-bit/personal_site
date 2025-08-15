import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";

import DOMPurify from "isomorphic-dompurify";

export const GET: APIRoute = async (context) => {
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });
  
  const blog = await getCollection("blog");
  const feed: RSSFeedItem[] = [];

  for (const entry of blog) {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);

    feed.push({
      link: `/blog/${entry.id}`,
      content: DOMPurify.sanitize(content, {
        ALLOW_DATA_ATTR: false,
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