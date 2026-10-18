/**
 * Retours d'un ajout au séjour (009, FR-010) : « Ajouté ✓ » un court instant sur le bouton.
 * Durée d'un état, pas d'une animation : elle ne double aucun token de mouvement.
 */
import { useEffect, useState } from 'preact/hooks';
import type { SelectionEvent } from './selection.ts';

export const ADDED_FLASH_MS = 1500;
export const VIBRATION_MS = 15;

/** L'événement est-il un ajout réussi (nouvelle ligne ou quantités additionnées) ? */
export const isAddition = (event: SelectionEvent | null | undefined) =>
  event?.type === 'added' || event?.type === 'merged';

/** `[flashing, notify]` : appeler `notify(événement)` après un ajout. */
export function useAddedFlash(): [boolean, (event: SelectionEvent) => void] {
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (!flashing) return;
    const timer = setTimeout(() => setFlashing(false), ADDED_FLASH_MS);
    return () => clearTimeout(timer);
  }, [flashing]);
  return [flashing, (event) => isAddition(event) && setFlashing(true)];
}
