import { type Loader, type LoaderContext } from "astro/loaders";
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { readdirSync } from "fs";
import { glob } from "fs/promises";

export function ficsLoader(options: { path: string }) {
  return {
    name: "fics",
    async load(context: LoaderContext) {
      const fics = readdirSync(options.path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const fic of fics) {
        const { content } = parseFrontmatter(fic, { frontmatter: "empty-with-spaces" });
        console.log(content);
      }
    },
  };
}

async function test(options: { path: string }) {
  const fics = readdirSync(options.path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${dirent.parentPath}/${dirent.name}`);
  
  for (const fic of fics) {
    const entries = await Array.fromAsync(glob([`${fic}/*.yaml`, `${fic}/*.yml`, `${fic}/*.toml`, `${fic}/*.json`]));
    console.log(entries);
    const chapterPaths = await Array.fromAsync(glob(fic + '/*.md'));
    const chapters = chapterPaths.map(chapter => chapter);
    // const files 
    // console.log("" + chapters)
    // const { content } = parseFrontmatter(fic, { frontmatter: "empty-with-spaces" });
    // console.log(content);
  }
}

test({ path: "./src/content/fics" });