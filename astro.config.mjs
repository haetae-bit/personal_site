// @ts-check
import { defineConfig } from 'astro/config';
import { modifiedTime } from './src/utils/lastModified.mjs';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  site: "https://haetae.32-b.it",
  markdown: {
    remarkPlugins: [modifiedTime],
    smartypants: false,
  },
  integrations: [alpinejs()],
});