import type { MarkdownInstance } from "astro";
import { glob as astroGlob, type Loader, type LoaderContext } from "astro/loaders";
import path from "path";
import { glob } from "fs/promises";
import { reference } from "astro:content";

async function getAllChapters(metaPath: string) {
  const entryPath = path.parse(metaPath);
  const fic = entryPath.dir;
  const entries = await Array.fromAsync(glob(fic + '/*.md'));
  const chapters = entries.map(chapter => path.relative(fic, chapter));
  return chapters.map(chapter => `${fic.split("/").at(-1)}/${path.parse(chapter).name}`);
}

export function ficsLoader(loader: Loader) {
  const oldLoad = loader.load;
  loader.load = async (context: LoaderContext) => {
    await oldLoad({
      ...context,
      parseData: async (data) => data.data,
    });
    await Promise.all(
      context.store.values().map(async (value) => {
        const loadedPromise = Promise.withResolvers();
        getAllChapters(value.filePath as string).then(
          async (chapters) => {
            const { digest, ...valueWithoutDigest } = value;
            const newData = await context.parseData({
              id: value.id,
              data: {
                ...valueWithoutDigest.data,
                ...chapters.length > 1 && { chapters: chapters },
              },
            });
            if (chapters.length === 1) {
              // i've committed unspeakable atrocities here
              const search = import.meta.glob(`../content/fics/**/*.md`, { eager: true });
              let body;
              for (const path in search) {
                if (path.includes(chapters[0])) {
                  body = search[path] as MarkdownInstance<any>;
                  context.store.set({
                    ...valueWithoutDigest,
                    data: newData,
                    body: body.rawContent(),
                    rendered: {
                      html: await body.compiledContent(),
                      metadata: {
                        headings: body.getHeadings(),
                        frontmatter: body.frontmatter,
                      },
                    },
                    digest: context.generateDigest(newData),
                  });
                };
              }
            } else {
              context.store.set({
                ...valueWithoutDigest,
                data: newData,
                digest: context.generateDigest(newData),
              });
            }
            loadedPromise.resolve(chapters);
          }
        );

        return loadedPromise.promise;
      })
    );
  };

  return loader;
}