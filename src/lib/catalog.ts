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

export async function getFeatured() {
  const services = await getCollection(
    'services',
    (service) => service.data.featured === true && service.data.availability !== 'disabled',
  );
  return services.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
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
