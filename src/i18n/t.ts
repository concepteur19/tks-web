import { en } from './en.ts';
import { fr, type Dictionary } from './fr.ts';
import {
  DEFAULT_LOCALE,
  type DictionaryEntry,
  type Locale,
  type LocalizedString,
  type PluralForms,
} from './types.ts';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en };

export type TranslationKey = keyof Dictionary;

type Params = Record<string, string | number>;

function interpolate(template: string, params: Params | undefined): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

function selectPlural(forms: PluralForms, locale: Locale, count: number): string {
  if (count === 0 && forms.zero !== undefined) return forms.zero;
  const rule = new Intl.PluralRules(locale).select(count);
  return rule === 'one' ? forms.one : forms.other;
}

/**
 * Traduit une clé d'interface. Les pluriels s'appuient sur `count`, passé en
 * paramètre, et sur les règles de la langue.
 */
export function t(locale: Locale, key: TranslationKey, params?: Params): string {
  const entry: DictionaryEntry = DICTIONARIES[locale][key];
  if (typeof entry === 'string') return interpolate(entry, params);
  const count = Number(params?.count ?? 0);
  return interpolate(selectPlural(entry, locale, count), params);
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
