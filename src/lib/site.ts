/**
 * Fichiers uniques du site, validés au chargement : une erreur de contenu fait échouer
 * le build plutôt que de publier une page fausse. Contrat : specs/002-kibreeze-core/contracts/content.md.
 */
import companyData from '../content/site/company.json';
import currencyData from '../content/site/currency.json';
import homeData from '../content/site/home.json';
import { z } from 'zod';
import { companySchema, currencySchema, homeSchema } from '../content/schemas.ts';

export const company = companySchema.parse(companyData);
export const currency = currencySchema.parse(currencyData);
/** Aperçus temporaires de l'accueil, sans photo à ce jour : supprimés par la feature 005. */
export const homeTeasers = homeSchema(z.string()).parse(homeData);
