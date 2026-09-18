/** Langues du site. Le français est la langue par défaut, servie sans préfixe. */
export const LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Texte de contenu traduit. `en` est optionnel dans le schéma pour accepter le
 * contenu livré au fil de l'eau ; le contrôle de production l'exige partout.
 */
export type LocalizedString = { fr: string; en?: string };

/** Formes plurielles d'une chaîne d'interface. */
export type PluralForms = { zero?: string; one: string; other: string };

export type DictionaryEntry = string | PluralForms;

export type DictionaryShape = Record<string, DictionaryEntry>;
