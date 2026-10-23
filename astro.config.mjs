// @ts-check
import { defineConfig } from 'astro/config';
import remarkCallouts from './src/lib/remark-callouts.mjs';

// SITE_URL и BASE_PATH задаются в GitHub Actions автоматически (см. .github/workflows/deploy.yml).
// Для своего домена: SITE_URL=https://mods.example.com, BASE_PATH=/
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkCallouts],
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
});
