// @ts-check
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import node from '@astrojs/node';
import { modifiedTime } from './src/utils/last-modified.mjs';

// https://astro.build/config
export default defineConfig({
  site: "https://haetae.gay",
  markdown: {
    remarkPlugins: [modifiedTime],
  },
  integrations: [db()],
  adapter: node({
    mode: 'standalone',
  }),
});