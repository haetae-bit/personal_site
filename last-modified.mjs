import { statSync } from "fs";

export function modifiedTime() {
  return function (tree, file) {
    const path = file.history[0];
    const result = statSync(path);
    file.data.astro.frontmatter.lastModified = result.mtime;
  }
}