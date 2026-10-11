/**
 * Minimum de participants d'une prestation (008, FR-017) : la borne basse de sa dimension
 * « personnes », qui borne déjà le sélecteur. Affiché seulement quand il dépasse 1.
 * Fonction pure, couverte à 100 % (constitution, principe III).
 */
import type { QuantityRule } from '../../content/schemas.ts';

export function minimumParticipants(service: { quantity: QuantityRule }): number | undefined {
  const persons = service.quantity.dimensions.find((dimension) => dimension.kind === 'persons');
  return persons && persons.min > 1 ? persons.min : undefined;
}
