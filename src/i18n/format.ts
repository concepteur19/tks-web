/**
 * Mise en forme des chaînes, sans dictionnaire : interpolation et pluriels. Utilisée par `t()`
 * côté build et par les îlots, qui ne reçoivent que les chaînes dont ils ont besoin.
 */
import type { DictionaryEntry, Locale, PluralForms } from './types.ts';

export type Params = Record<string, string | number>;

export function interpolate(template: string, params: Params | undefined): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export function selectPlural(forms: PluralForms, locale: Locale, count: number): string {
  if (count === 0 && forms.zero !== undefined) return forms.zero;
  return new Intl.PluralRules(locale).select(count) === 'one' ? forms.one : forms.other;
}

export function formatEntry(entry: DictionaryEntry, locale: Locale, params?: Params): string {
  if (typeof entry === 'string') return interpolate(entry, params);
  return interpolate(selectPlural(entry, locale, Number(params?.count ?? 0)), params);
}
