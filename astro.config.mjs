// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { resolveSiteUrl, resolveWhatsAppNumber } from './config/resolve-env.mjs';

const fileEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const buildEnv = { ...fileEnv, ...process.env };

const siteUrl = resolveSiteUrl(buildEnv);
const whatsappNumber = resolveWhatsAppNumber(buildEnv);

// Les variables résolues sont réinjectées pour que le schéma d'environnement
// d'Astro, et donc src/lib/env.ts, voient toujours une valeur.
process.env.PUBLIC_SITE_URL = siteUrl.value;
process.env.PUBLIC_WHATSAPP_NUMBER = whatsappNumber.value;

if (siteUrl.source !== 'explicit') {
  console.info(
    `[env] PUBLIC_SITE_URL non définie, repli sur ${siteUrl.value} (${siteUrl.source})`,
  );
}
if (whatsappNumber.source !== 'explicit') {
  console.info('[env] PUBLIC_WHATSAPP_NUMBER non définie, repli sur la valeur du dépôt');
}

export default defineConfig({
  site: siteUrl.value,
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
