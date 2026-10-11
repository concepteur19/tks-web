/**
 * Configuration en cours sur une fiche (quantités, tarif, options), partagée entre la rubrique
 * « Votre réservation » et la barre d'action, qui sont deux îlots distincts.
 */
import { atom } from 'nanostores';
import type { SelectedLine } from './selection.ts';

export const $draft = atom<SelectedLine | null>(null);
