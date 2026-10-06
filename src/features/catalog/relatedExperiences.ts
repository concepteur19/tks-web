/**
 * « Vous aimerez aussi » (FR-017) : d'abord les expériences de la même catégorie, puis les
 * autres, chacune par ordre défini ; jamais l'expérience courante, une option ou une
 * expérience désactivée. Fonction pure, couverte à 100 % (constitution, principe III).
 */
type Entry = {
  id: string;
  data: {
    categoryId?: string | undefined;
    order?: number | undefined;
    isOption?: boolean | undefined;
    availability?: string | undefined;
  };
};

const byOrder = (a: Entry, b: Entry) =>
  (a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY);

export function relatedExperiences<T extends Entry>(currentId: string, all: T[], limit = 3): T[] {
  const current = all.find((entry) => entry.id === currentId);
  const candidates = all.filter(
    (entry) =>
      entry.id !== currentId && !entry.data.isOption && entry.data.availability !== 'disabled',
  );
  const sameCategory = candidates.filter(
    (entry) =>
      current?.data.categoryId !== undefined && entry.data.categoryId === current.data.categoryId,
  );
  const others = candidates.filter((entry) => !sameCategory.includes(entry));
  return [...sameCategory.sort(byOrder), ...others.sort(byOrder)].slice(0, limit);
}
