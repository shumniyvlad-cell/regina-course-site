import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { config } from './src/config';

// .env (локально) → process.env, чтобы сборка видела LESSON_VIDEOS_JSON так же, как в GitHub Actions
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
for (const key of ['LESSON_VIDEOS_JSON', 'COURSE_PASSWORD']) {
  if (!process.env[key] && env[key]) process.env[key] = env[key];
}

const base = config.base.replace(/\/$/, '') || '/';

export default defineConfig({
  site: config.site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  compressHTML: false,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/learn/') && !page.includes('/404'),
    }),
  ],
  image: { responsiveStyles: false },
});
