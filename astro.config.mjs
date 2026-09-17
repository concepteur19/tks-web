// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'static',
  // 'preserve' garde l'arborescence des pages : en/404.astro devient en/404.html,
  // que l'hébergeur sert bien comme page d'erreur des adresses sous /en/.
  build: { format: 'preserve' },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      PUBLIC_WHATSAPP_NUMBER: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public' }),
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
