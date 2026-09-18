import { PUBLIC_SITE_URL, PUBLIC_WHATSAPP_NUMBER } from 'astro:env/client';

/**
 * Validation des variables d'environnement, au moment du build.
 * Voir specs/001-project-foundation/contracts/env.md.
 * Une valeur absente ou mal formée fait échouer le build, plutôt que de
 * publier un lien cassé.
 */

const WHATSAPP_PATTERN = /^\d{8,15}$/;

function fail(variable: string, reason: string): never {
  throw new Error(
    `[env] ${variable} ${reason}. Voir specs/001-project-foundation/contracts/env.md et .env.example.`,
  );
}

function readWhatsAppNumber(): string {
  const value = PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!value) fail('PUBLIC_WHATSAPP_NUMBER', 'est absente');
  if (!WHATSAPP_PATTERN.test(value)) {
    fail(
      'PUBLIC_WHATSAPP_NUMBER',
      'doit contenir 8 à 15 chiffres, sans « + », sans espace ni séparateur',
    );
  }
  return value;
}

function readSiteUrl(): string {
  const value = PUBLIC_SITE_URL?.trim();
  if (!value) fail('PUBLIC_SITE_URL', 'est absente');
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return fail('PUBLIC_SITE_URL', 'doit être une adresse absolue, protocole compris');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    fail('PUBLIC_SITE_URL', 'doit utiliser http ou https');
  }
  if (value.endsWith('/')) fail('PUBLIC_SITE_URL', 'ne doit pas finir par une barre oblique');
  return value;
}

export const env = {
  whatsappNumber: readWhatsAppNumber(),
  siteUrl: readSiteUrl(),
} as const;
