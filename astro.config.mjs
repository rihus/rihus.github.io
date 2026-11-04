// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// This repo is the GitHub "user site" (rihus.github.io), so it is served
// from the domain root and needs no `base` path.
export default defineConfig({
  site: 'https://rihus.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
