import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";
const parser = new MarkdownIt();

export const GET: APIRoute = async (context) => {
  const blog = await getCollection("blog");
  return rss({
    title: "haetae's blog",
    description: "a blog about a weirdo who likes coding",
    site: context.site!,
    items: blog.map(entry => ({
      link: `/blog/${entry.id}`,
      content: sanitize(parser.render(entry.body!), {
        allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      }),
      ...entry.data,
    })),
  });
}