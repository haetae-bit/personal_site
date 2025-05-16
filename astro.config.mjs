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
        ]
      },
      {
        provider: "local",
        name: "Departure Mono",
        cssVariable: "--mono",
        variants: [{
          weight: 400,
          style: "normal",
          src: ['./src/assets/fonts/DepartureMono-Regular.woff2']
        }]
      },
      {
        provider: "local",
        name: "Dotum 11",
        cssVariable: "--dotum-11",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/dotum-11.woff2"]
        }]
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
      },
      {
        provider: "local",
        name: "MLSS",
        cssVariable: "--mlss",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/mario-luigi-rpg-speech-text.woff2"]
        }]
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
        ]
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
      },
      {
        provider: "local",
        name: "Wonder Mail",
        cssVariable: "--wondermail",
        variants: [{
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/wondermail.woff2"]
        }]
      },
    ],
  },
});