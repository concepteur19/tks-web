/**
 * Contrôle des traductions.
 * Hors production : avertit. En production : échoue en listant les manques.
 * La parité des dictionnaires est déjà garantie à la compilation par
 * `satisfies Dictionary` ; ce script couvre ce que le typage ne voit pas,
 * à savoir les valeurs vides, et plus tard les fichiers de contenu (T039).
 */
import { en } from '../src/i18n/en.ts';
import { fr } from '../src/i18n/fr.ts';

type Issue = { file: string; key: string; reason: string };

function collectIssues(): Issue[] {
  const issues: Issue[] = [];
  for (const key of Object.keys(fr)) {
    const value = en[key as keyof typeof en];
    if (value === undefined) {
      issues.push({ file: 'src/i18n/en.ts', key, reason: 'clé absente' });
      continue;
    }
    if (typeof value === 'string' && value.trim() === '') {
      issues.push({ file: 'src/i18n/en.ts', key, reason: 'valeur vide' });
    }
  }
  return issues;
}

const issues = collectIssues();
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true';

if (issues.length === 0) {
  console.log('[i18n] toutes les traductions anglaises sont présentes');
  process.exit(0);
}

for (const issue of issues) {
  console.error(`[i18n] ${issue.file} → « ${issue.key} » : ${issue.reason}`);
}

if (isProduction) {
  console.error(`[i18n] ${issues.length} traduction(s) manquante(s), build de production interrompu`);
  process.exit(1);
}

console.warn(`[i18n] ${issues.length} traduction(s) manquante(s), repli sur le français`);
process.exit(0);
