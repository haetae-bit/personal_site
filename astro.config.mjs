// @ts-check
import { defineConfig } from 'astro/config';
import { modifiedTime } from './src/utils/lastModified.mjs';
import alpinejs from '@astrojs/alpinejs';
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://haetae.32-b.it",
  markdown: {
    remarkPlugins: [modifiedTime],
    smartypants: false,
  },
  integrations: [alpinejs(), svelte()],
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "Arial Pixel",
        cssVariable: "--arial",
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ['./src/assets/fonts/pixearg.woff2']
          },
          {
            weight: 700,
            style: "normal",
            src: ['./src/assets/fonts/pixeab.woff2']
          },
        ],
        fallbacks: ["Arial", "Helvetica", "sans-serif"],
      },
      {
        provider: "local",
        name: "Departure Mono",
        cssVariable: "--mono",
        variants: [{
          weight: 400,
          style: "normal",
          src: ['./src/assets/fonts/DepartureMono-Regular.woff2']
        }],
        fallbacks: ["ui-monospace", 'Cascadia Code', 'Source Code Pro', "Menlo", "Consolas", 'DejaVu Sans Mono', "monospace"],
      },
      {
        provider: "local",
        name: "Dotum 11",
        cssVariable: "--dotum-11",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/dotum-11.woff2"]
        }],
      },
      {
        provider: "local",
        name: "Dotum 12",
        cssVariable: "--dotum-12",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/dotum-12.woff2"]
        }]
      },
      {
        provider: "local",
        name: "DotumChe 11",
        cssVariable: "--dotumche-11",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/dotumche-11.woff2"]
        }]
      },
      {
        provider: "local",
        name: "DotumChe 12",
        cssVariable: "--dotumche-12",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/dotumche-12.woff2"]
        }]
      },
      {
        provider: "local",
        name: "Kiwi Soda",
        cssVariable: "--kiwi",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/KiwiSoda.woff2"]
        }],
        fallbacks: ["Impact", "Haettenschweiler", 'Arial Narrow Bold', "sans-serif"],
      },
      {
        provider: "local",
        name: "MLSS",
        cssVariable: "--mlss",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/mario-luigi-rpg-speech-text.woff2"]
        }],
        fallbacks: ['Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', "Geneva", "Verdana", "sans-serif"],
      },
      {
        provider: "local",
        name: "Redaction",
        cssVariable: "--serif",
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Redaction_35-Regular.woff2"]
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/assets/fonts/Redaction_35-Italic.woff2"]
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/Redaction_35-Bold.woff2"]
          },
        ],
        fallbacks: ['Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', "P052", "serif"],
      },
      {
        provider: "local",
        name: "sq",
        cssVariable: "--sq",
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/sq.woff2"]
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/sqb.woff2"]
          }
        ],
        fallbacks: ["system-ui", "-apple-system", "BlinkMacSystemFont", 'Segoe UI', "Roboto", "Oxygen", "Ubuntu", "Cantarell", 'Open Sans', 'Helvetica Neue', "sans-serif"],
      },
      {
        provider: "local",
        name: "Wonder Mail",
        cssVariable: "--wondermail",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/wondermail.woff2"]
        }],
        fallbacks: ["Inter", "Roboto", 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', "Arial", 'sans-serif'],
      },
    ],
  },
});