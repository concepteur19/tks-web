/**
 * Accès typé aux collections du catalogue. Aucune règle métier ici : le prix affiché
 * d'une carte est décidé par src/features/estimation/cardPrice.ts.
 */
import { getCollection } from 'astro:content';
import { isImplemented } from '../i18n/navigation.ts';

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

export async function getExperience(slug: string) {
  return (await getExperiences()).find((service) => service.id === slug);
}

/** Options proposées sur toutes les fiches (FR-003, FR-016). */
export async function getOptions() {
  const options = await getCollection(
    'services',
    (service) => service.data.isOption === true && service.data.availability !== 'disabled',
  );
  return options.sort(byOrderThenName);
}

/** Catégories qui contiennent au moins une expérience publiée : elles seules ont un onglet. */
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
