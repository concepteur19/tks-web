import { afterEach, describe, expect, it, vi } from 'vitest';
import { en } from '../../src/i18n/en.ts';
import { fr } from '../../src/i18n/fr.ts';
import { localize, t } from '../../src/i18n/t.ts';
import type { LocalizedString } from '../../src/i18n/types.ts';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('dictionnaires', () => {
  it('couvre en anglais toutes les clés du français', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
  });

  it("n'a aucune valeur vide", () => {
    for (const [key, value] of Object.entries(en)) {
      if (typeof value === 'string') expect(value.trim(), key).not.toBe('');
    }
  });
});

describe('t()', () => {
  it('traduit dans la langue demandée', () => {
    expect(t('fr', 'notFound.title')).toBe('Page introuvable');
    expect(t('en', 'notFound.title')).toBe('Page not found');
  });

  it('interpole les paramètres', () => {
    expect(t('fr', 'common.servicesCount', { count: 3 })).toBe('3 prestations');
  });

  it('applique les règles de pluriel de chaque langue', () => {
    expect(t('fr', 'common.servicesCount', { count: 0 })).toBe('0 prestation');
    expect(t('fr', 'common.servicesCount', { count: 1 })).toBe('1 prestation');
    expect(t('fr', 'common.servicesCount', { count: 2 })).toBe('2 prestations');
    expect(t('en', 'common.servicesCount', { count: 0 })).toBe('0 services');
    expect(t('en', 'common.servicesCount', { count: 1 })).toBe('1 service');
    expect(t('en', 'common.servicesCount', { count: 5 })).toBe('5 services');
  });

  it('laisse le gabarit intact quand un paramètre manque', () => {
    expect(t('fr', 'common.servicesCount', {})).toBe('{count} prestation');
  });
});

describe('localize()', () => {
  it('rend la traduction quand elle existe', () => {
    const value: LocalizedString = { fr: 'Pirogue', en: 'Canoe' };
    expect(localize(value, 'en')).toBe('Canoe');
  });

  it('replie sur le français et signale le manque', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const value: LocalizedString = { fr: 'Pirogue' };
    expect(localize(value, 'en')).toBe('Pirogue');
    expect(warn).toHaveBeenCalledOnce();
  });

  it('replie aussi sur une traduction vide', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(localize({ fr: 'Pirogue', en: '' }, 'en')).toBe('Pirogue');
  });

  it("n'avertit jamais pour le français", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(localize({ fr: 'Pirogue' }, 'fr')).toBe('Pirogue');
    expect(warn).not.toHaveBeenCalled();
  });
});
