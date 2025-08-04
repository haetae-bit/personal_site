import { glob, type Loader, type LoaderContext } from "astro/loaders";
import { readdirSync, readFileSync } from "fs";
import path from "path";

export function ficsLoader(options: { path: string }) {

  return {
    name: "fics",
    async load(context: LoaderContext) {
      const fics = readdirSync(options.path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const fic of fics) {
        const chapters = readdirSync(path.join(options.path, `/${fic}`), { withFileTypes: true });
        const isOneshot = chapters.filter(chapter => chapter.isFile() && chapter.name.endsWith(".md"));
        if (isOneshot.length === 1) {
          const data = {
            id: fic,
            data: chapters,
          };
          const digest = context.generateDigest(data);
        } else {
          const data = {
            id: chapters
          }
        }
      }
    },
  }
}

ficsLoader({ path: "./src/content/fics" });
