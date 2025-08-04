import { glob as astroGlob, type Loader, type LoaderContext } from "astro/loaders";
import path from "path";
import { glob } from "fs/promises";

async function getAllChapters(metaPath: string) {
  const entryPath = path.parse(metaPath);
  const fic = entryPath.dir;
  const entries = await Array.fromAsync(glob(fic + '/*.md'));
  const chapters = entries.map(chapter => path.relative(fic, chapter));
  return chapters.map(chapter => ({
    relativePath: chapter,
    chapter: path.resolve(fic, chapter),
  }));
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
            context.store.set({
              ...valueWithoutDigest,
              data: newData,
              digest: context.generateDigest(newData),
            });
            loadedPromise.resolve(chapters);
          }
        );

        return loadedPromise.promise;
      })
    );
  };

  return loader;
}