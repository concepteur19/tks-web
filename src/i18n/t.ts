import { en } from './en.ts';
import { fr, type Dictionary } from './fr.ts';
import { formatEntry, type Params } from './format.ts';
import { DEFAULT_LOCALE, type Locale, type LocalizedString } from './types.ts';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en };

export type TranslationKey = keyof Dictionary;

/**
 * Traduit une clé d'interface. Les pluriels s'appuient sur `count`, passé en
 * paramètre, et sur les règles de la langue.
 */
export function t(locale: Locale, key: TranslationKey, params?: Params): string {
  return formatEntry(DICTIONARIES[locale][key], locale, params);
}

/**
 * Texte de contenu dans la langue demandée. Replie sur le français quand la
 * traduction manque, en le signalant hors production. Le build de production
 * échoue plus tôt, avant même d'arriver ici.
 */
export function localize(value: LocalizedString, locale: Locale): string {
  const translated = value[locale];
  if (translated !== undefined && translated !== '') return translated;
  if (locale !== DEFAULT_LOCALE && !import.meta.env?.PROD) {
    console.warn(`[i18n] traduction ${locale} manquante, repli sur le français : « ${value.fr} »`);
  }
  return value.fr;
}
