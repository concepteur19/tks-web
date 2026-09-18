import { describe, expect, it } from 'vitest';
import {
  getAlternatePath,
  getAlternates,
  getLocaleFromPath,
  getRouteKeyFromPath,
  getRoutePath,
  ROUTES,
  type RouteKey,
} from '../../src/i18n/routes.ts';
import { LOCALES } from '../../src/i18n/types.ts';

const keys = Object.keys(ROUTES) as RouteKey[];

describe('table des routes', () => {
  it('donne un chemin dans chaque langue pour chaque clé', () => {
    for (const key of keys) {
      for (const locale of LOCALES) {
        expect(ROUTES[key][locale], `${key}/${locale}`).toMatch(/^\//);
      }
    }
  });

  it("n'utilise jamais deux fois le même chemin dans une langue", () => {
    for (const locale of LOCALES) {
      const paths = keys.map((key) => ROUTES[key][locale]);
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it('préfixe toutes les adresses anglaises par /en/ et aucune française', () => {
    for (const key of keys) {
      expect(ROUTES[key].en.startsWith('/en/')).toBe(true);
      expect(ROUTES[key].fr.startsWith('/en/')).toBe(false);
    }
  });

  it('fait un aller-retour français vers anglais vers français identique', () => {
    for (const key of keys) {
      const fr = ROUTES[key].fr;
      const en = getAlternatePath(fr, 'en');
      expect(en).toBe(ROUTES[key].en);
      expect(getAlternatePath(en, 'fr')).toBe(fr);
    }
  });

  it('déduit la langue du chemin', () => {
    expect(getLocaleFromPath('/')).toBe('fr');
    expect(getLocaleFromPath('/tourisme')).toBe('fr');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/tourism')).toBe('en');
  });

  it('tolère une barre oblique finale', () => {
    expect(getRouteKeyFromPath('/tourisme/')).toBe('tourism');
    expect(getAlternatePath('/en/my-trip/', 'fr')).toBe('/sejour');
  });

  it("renvoie la page d'erreur de la langue cible pour un chemin inconnu", () => {
    expect(getAlternatePath('/inconnu', 'en')).toBe(ROUTES.notFound.en);
    expect(getRouteKeyFromPath('/inconnu')).toBeUndefined();
  });

  it('expose les deux adresses pour les liens alternatifs', () => {
    expect(getAlternates('/')).toEqual({ fr: '/', en: '/en/' });
  });

  it('donne le chemin demandé par clé et par langue', () => {
    expect(getRoutePath('stay', 'fr')).toBe('/sejour');
    expect(getRoutePath('stay', 'en')).toBe('/en/my-trip');
  });
});
