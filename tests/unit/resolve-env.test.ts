import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SITE_URL,
  DEFAULT_WHATSAPP_NUMBER,
  resolveSiteUrl,
  resolveWhatsAppNumber,
} from '../../config/resolve-env.mjs';

describe('adresse du site', () => {
  it('préfère la variable explicite', () => {
    const result = resolveSiteUrl({
      PUBLIC_SITE_URL: 'https://tks-web-1h2.pages.dev',
      CF_PAGES_URL: 'https://apercu.tks-web-1h2.pages.dev',
    });
    expect(result).toEqual({ value: 'https://tks-web-1h2.pages.dev', source: 'explicit' });
  });

  it("retombe sur l'adresse fournie par l'hébergeur", () => {
    const result = resolveSiteUrl({ CF_PAGES_URL: 'https://apercu.tks-web-1h2.pages.dev' });
    expect(result).toEqual({ value: 'https://apercu.tks-web-1h2.pages.dev', source: 'cloudflare' });
  });

  it('retombe en dernier ressort sur le développement local', () => {
    expect(resolveSiteUrl({})).toEqual({ value: DEFAULT_SITE_URL, source: 'default' });
  });

  it('retire la barre oblique finale', () => {
    expect(resolveSiteUrl({ PUBLIC_SITE_URL: 'https://exemple.test/' }).value).toBe(
      'https://exemple.test',
    );
    expect(resolveSiteUrl({ CF_PAGES_URL: 'https://exemple.test/' }).value).toBe(
      'https://exemple.test',
    );
  });

  it('ignore une valeur vide ou faite d’espaces', () => {
    expect(resolveSiteUrl({ PUBLIC_SITE_URL: '   ' }).source).toBe('default');
  });
});

describe('numéro WhatsApp', () => {
  it('préfère la variable explicite', () => {
    expect(resolveWhatsAppNumber({ PUBLIC_WHATSAPP_NUMBER: '237600000000' })).toEqual({
      value: '237600000000',
      source: 'explicit',
    });
  });

  it('retombe sur le numéro versionné dans le dépôt', () => {
    expect(resolveWhatsAppNumber({})).toEqual({
      value: DEFAULT_WHATSAPP_NUMBER,
      source: 'default',
    });
  });

  it('expose un numéro par défaut au bon format', () => {
    expect(DEFAULT_WHATSAPP_NUMBER).toMatch(/^\d{8,15}$/);
  });
});
