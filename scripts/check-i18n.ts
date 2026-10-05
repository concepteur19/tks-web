/**
 * Contrôle des traductions — FR-I18N-8, ADR-013.
 * Hors production : avertit. En production (--production, NODE_ENV=production ou CI) : échoue.
 *
 * La parité des clés des dictionnaires est déjà garantie à la compilation par
 * `satisfies Dictionary` ; ce script couvre ce que le typage ne voit pas : les
 * valeurs vides, et les fichiers de contenu, où tout objet portant un champ `fr`
 * est un texte localisé qui doit aussi porter un `en` non vide.
 *
 * Il vérifie aussi qu'aucune marque `[PLACEHOLDER]` ne subsiste dans `src/` (constitution,
 * principe IV), hors de la page de démonstration `src/pages/dev/`, jamais construite en production.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { en } from '../src/i18n/en.ts';
import { fr } from '../src/i18n/fr.ts';

export type Issue = { file: string; key: string; reason: string };

export function dictionaryIssues(
  reference: Record<string, unknown>,
  translation: Record<string, unknown>,
): Issue[] {
  const issues: Issue[] = [];
  for (const key of Object.keys(reference)) {
    const value = translation[key];
    if (value === undefined) issues.push({ file: 'src/i18n/en.ts', key, reason: 'clé absente' });
    else if (typeof value === 'string' && value.trim() === '') {
      issues.push({ file: 'src/i18n/en.ts', key, reason: 'valeur vide' });
    }
  }
  return issues;
}

function walk(value: unknown, path: string, file: string, issues: Issue[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, file, issues));
    return;
  }
  if (value === null || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (typeof record.fr === 'string') {
    const translation = record.en;
    if (typeof translation !== 'string' || translation.trim() === '') {
      issues.push({ file, key: path ? `${path}.en` : 'en', reason: 'traduction anglaise absente' });
    }
    return;
  }
  for (const [key, child] of Object.entries(record))
    walk(child, path ? `${path}.${key}` : key, file, issues);
}

function jsonFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return jsonFiles(full);
    return entry.endsWith('.json') ? [full] : [];
  });
}

export function contentIssues(contentDir: string, root = process.cwd()): Issue[] {
  const issues: Issue[] = [];
  for (const file of jsonFiles(contentDir)) {
    walk(JSON.parse(readFileSync(file, 'utf8')), '', relative(root, file), issues);
  }
  return issues;
}

const PLACEHOLDER = '[PLACEHOLDER]';
const SOURCE_EXTENSIONS = /\.(astro|ts|tsx|mjs|js|css|json|md)$/;

function sourceFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return SOURCE_EXTENSIONS.test(entry) ? [full] : [];
  });
}

export function placeholderIssues(sourceDir: string, root = process.cwd()): Issue[] {
  const devPages = join(sourceDir, 'pages', 'dev');
  const issues: Issue[] = [];
  for (const file of sourceFiles(sourceDir)) {
    if (file.startsWith(devPages)) continue;
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (line.includes(PLACEHOLDER)) {
          issues.push({
            file: relative(root, file),
            key: `ligne ${index + 1}`,
            reason: 'marque [PLACEHOLDER]',
          });
        }
      });
  }
  return issues;
}

/** Fichier de chaque document légal, par langue : src/content/legal/<locale>/<fichier>. */
const LEGAL_FILES = {
  legalNotice: 'legal-notice.md',
  privacy: 'privacy.md',
  terms: 'terms.md',
} as const;

/** Chaque document légal existe en français et en anglais, avec une langue cohérente. */
export function legalIssues(legalDir: string, root = process.cwd()): Issue[] {
  const issues: Issue[] = [];
  for (const [doc, fileName] of Object.entries(LEGAL_FILES)) {
    for (const locale of ['fr', 'en'] as const) {
      const file = join(legalDir, locale, fileName);
      if (!existsSync(file)) {
        const language = locale === 'fr' ? 'français' : 'anglais';
        issues.push({
          file: relative(root, file),
          key: doc,
          reason: `document légal ${language} absent`,
        });
        continue;
      }
      const declared = /^locale:\s*(\w+)/m.exec(readFileSync(file, 'utf8'))?.[1];
      if (declared !== locale) {
        issues.push({
          file: relative(root, file),
          key: 'locale',
          reason: `langue « ${declared ?? '?'} » différente du dossier « ${locale} »`,
        });
      }
    }
  }
  return issues;
}

export function formatIssue(issue: Issue): string {
  return `[i18n] ${issue.file} → « ${issue.key} » : ${issue.reason}`;
}

function main(): void {
  const contentDir = process.env.I18N_CONTENT_DIR ?? 'src/content';
  const sourceDir = process.env.I18N_SOURCE_DIR ?? 'src';
  const legalDir = process.env.I18N_LEGAL_DIR ?? join(contentDir, 'legal');
  const issues = [
    ...dictionaryIssues(fr, en),
    ...contentIssues(contentDir),
    ...legalIssues(legalDir),
    ...placeholderIssues(sourceDir),
  ];
  const isProduction =
    process.argv.includes('--production') ||
    process.env.NODE_ENV === 'production' ||
    process.env.CI === 'true';

  if (issues.length === 0) {
    console.log(
      '[i18n] toutes les traductions anglaises sont présentes, aucune marque [PLACEHOLDER]',
    );
    return;
  }
  for (const issue of issues) console.error(formatIssue(issue));
  if (isProduction) {
    console.error(`[i18n] ${issues.length} anomalie(s), build de production interrompu`);
    process.exit(1);
  }
  console.warn(
    `[i18n] ${issues.length} anomalie(s) : repli sur le français pour les traductions manquantes`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
