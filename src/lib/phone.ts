/**
 * Numéro lisible à partir de la forme stockée (chiffres seuls, contrat env de 001).
 * Cameroun : « +237 697 13 53 88 », comme Franck l'écrit. Autres pays : intact, plutôt
 * qu'un découpage faux.
 */
export function formatPhone(digits: string): string {
  const cameroon = /^237(\d{3})(\d{2})(\d{2})(\d{2})$/.exec(digits);
  if (cameroon) return `+237 ${cameroon.slice(1).join(' ')}`;
  return `+${digits}`;
}
