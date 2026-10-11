/**
 * Accès typé aux collections du catalogue. Aucune règle métier ici : le prix affiché
 * d'une carte est décidé par src/features/estimation/cardPrice.ts.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { isImplemented } from '../i18n/navigation.ts';
import { getRoutePath } from '../i18n/routes.ts';
import type { Locale } from '../i18n/types.ts';

export async function getCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

const byOrderThenName = (
  a: { data: { order?: number | undefined; title: { fr: string } } },
  b: { data: { order?: number | undefined; title: { fr: string } } },
) =>
  (a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY) ||
  a.data.title.fr.localeCompare(b.data.title.fr, 'fr');

/** Expériences publiées : ni options, ni désactivées, par ordre défini puis par nom (FR-007). */
export async function getExperiences() {
  const services = await getCollection(
    'services',
    (service) =>
      service.data.section === 'experience' &&
      !service.data.isOption &&
      service.data.availability !== 'disabled',
  );
  return services.sort(byOrderThenName);
}

/** Prestations publiées d'un univers, par ordre défini puis par nom (008, FR-004). */
export async function getUniverseExperiences(universeId: string) {
  return (await getExperiences()).filter((service) => service.data.categoryId === universeId);
}

export async function getExperience(slug: string) {
  return (await getExperiences()).find((service) => service.id === slug);
}

/** Toutes les options publiées (003, FR-003). Pour une fiche, voir `getOptionsFor`. */
export async function getOptions() {
  const options = await getCollection(
    'services',
    (service) => service.data.isOption === true && service.data.availability !== 'disabled',
  );
  return options.sort(byOrderThenName);
}

/**
 * Options proposées sur une fiche : toutes les options publiées, sauf si l'univers de la
 * prestation déclare `withOptions: false` (008, FR-016).
 */
export async function getOptionsFor(service: CollectionEntry<'services'>) {
  const universe = (await getCategories()).find((entry) => entry.id === service.data.categoryId);
  return universe?.data.withOptions === false ? [] : getOptions();
}

/** Univers qui contiennent au moins une prestation publiée : eux seuls ont une page et une carte (008). */
export async function categoriesWithExperiences() {
  const [categories, experiences] = await Promise.all([getCategories(), getExperiences()]);
  return categories.filter((category) =>
    experiences.some((service) => service.data.categoryId === category.id),
  );
}

export async function getFeatured() {
  return (await getExperiences()).filter((service) => service.data.featured === true);
}

/**
 * Nombre d'expériences publiées dans une catégorie. Tant que la page Expériences n'est pas
 * livrée, le catalogue est incomplet et le compte serait faux : il n'est pas affiché.
 */
export async function categoryCount(categoryId: string): Promise<number | undefined> {
  if (!isImplemented('experiences')) return undefined;
  const services = await getCollection(
    'services',
    (service) => service.data.categoryId === categoryId && service.data.availability !== 'disabled',
  );
  return services.length;
}

/** Adresse de la page d'un univers dans une langue (008, contracts/routes.md). */
export function universePath(universe: CollectionEntry<'categories'>, locale: Locale): string {
  return `${getRoutePath('experiences', locale)}/${universe.data.urlSlug[locale]}`;
}
