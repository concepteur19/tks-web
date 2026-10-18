/**
 * Notifications qui ne viennent pas de la sélection (009) : « Lien copié » après un partage.
 * Lues par l'îlot des notifications, à côté des événements de la sélection.
 */
import { atom } from 'nanostores';

export type NoticeKey = 'share.copied';
export type Notice = { key: NoticeKey; at: number };

export const $notice = atom<Notice | null>(null);

let sequence = 0;

/** Publie une notification ; deux notifications identiques restent deux événements distincts. */
export function notify(key: NoticeKey): void {
  sequence += 1;
  $notice.set({ key, at: sequence });
}
