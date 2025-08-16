import { statSync } from "fs";

export function modifiedTime() {
  return function (_tree, file) {
    const path = file.history[0];
    try {
      const result = statSync(path);
      file.data.astro.frontmatter.lastModified = result.mtime;
    } catch (error) {
      return;
    }    
  }
}