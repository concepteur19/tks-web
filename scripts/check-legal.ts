/**
 * Contrôle de l'identité légale de l'éditeur — spec 002, FR-029, research.md décision 8.
 * Avertit dans tous les builds et n'échoue jamais : le site en adresse provisoire doit rester
 * publiable. La mise en ligne sous kibreeze.com exige une sortie vide (checklist de lancement
 * de specs/002-kibreeze-core/quickstart.md).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type LegalIdentity = {
  legal: {
    publisherName?: string | undefined;
    legalForm?: string | undefined;
    registration?: { rccm?: string | undefined; niu?: string | undefined } | undefined;
    address?: string | undefined;
    publicationDirector?: string | undefined;
    host?: unknown;
  };
};

export function missingLegalFields({ legal }: LegalIdentity): string[] {
  const fields: [string, string | undefined][] = [
    ['publisherName', legal.publisherName],
    ['legalForm', legal.legalForm],
    ['registration.rccm', legal.registration?.rccm],
    ['registration.niu', legal.registration?.niu],
    ['address', legal.address],
    ['publicationDirector', legal.publicationDirector],
  ];
  return fields.filter(([, value]) => !value?.trim()).map(([name]) => name);
}

function main(): void {
  const file = process.env.COMPANY_FILE ?? 'src/content/site/company.json';
  const missing = missingLegalFields(JSON.parse(readFileSync(file, 'utf8')) as LegalIdentity);
  if (missing.length === 0) {
    console.info('[légal] identité de l’éditeur complète dans les mentions légales');
    return;
  }
  console.warn(
    `[légal] mentions légales incomplètes, champs manquants dans ${file} : ${missing.join(', ')}. ` +
      'Publiable en adresse provisoire, bloquant pour la mise en ligne sous kibreeze.com.',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
