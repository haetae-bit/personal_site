import type { MarkdownInstance } from "astro";
import type { Loader, LoaderContext } from "astro/loaders";
import path from "path";
import { glob } from "fs/promises";

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
    context.watcher?.on("all", async (_event, path) => {
      if (path.includes("fics")) {
        await resolveFics(oldLoad, context);
      }
    });
    await resolveFics(oldLoad, context);
  };

  return loader;
}

// please don't ask me why i did this. idk either.
async function resolveFics(loader: (oldContext: LoaderContext) => Promise<void>, context: LoaderContext) {
  await loader({
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
              ...valueWithoutDigest.data['oneshot'] !== true && { chapters: chapters },
            },
          });
          if (valueWithoutDigest.data['oneshot'] === true) {
            // i've committed unspeakable atrocities here
            const search = import.meta.glob<MarkdownInstance<any>>(`../content/fics/**/*.md`, { eager: true });
            const body = Object.values(search).filter(path => path.file?.includes(chapters[0]))[0];
            const html = await body.compiledContent();
            context.store.set({
              ...valueWithoutDigest,
              data: newData,
              body: body.rawContent(),
              rendered: {
                html,
                metadata: {
                  headings: body.getHeadings(),
                  frontmatter: body.frontmatter,
                },
              },
              digest: context.generateDigest(newData),
            });
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
}