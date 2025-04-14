// @ts-check
import { defineConfig } from 'astro/config';
import { modifiedTime } from './src/utils/last-modified.mjs';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  site: "https://haetae.32-b.it",
  markdown: {
    remarkPlugins: [modifiedTime],
  },
  integrations: [alpinejs()],
});