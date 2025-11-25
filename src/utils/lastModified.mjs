import { execSync } from "child_process";

export function modifiedTime() {
  return function (_tree, { data, history }) {
    const path = history[0];
    const result = execSync(`git log -1 --pretty="format:%cI" "${path}"`);
    data.astro.frontmatter.lastModified = result.toString();
  }
}