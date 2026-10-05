import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  contentIssues,
  dictionaryIssues,
  formatIssue,
  legalIssues,
  placeholderIssues,
} from '../../scripts/check-i18n.ts';

let dir: string;

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'i18n-'));
  mkdirSync(join(dir, 'services'));
  writeFileSync(
    join(dir, 'services', 'quad.json'),
    JSON.stringify({
      title: { fr: 'Quad', en: 'Quad bike' },
      description: { fr: 'Sensations fortes sur la plage' },
      conditions: { included: [{ fr: 'Casque', en: '  ' }] },
      pricing: { kind: 'fixed', amount: 10000, unit: 'per_session' },
    }),
  );
});

afterAll(() => rmSync(dir, { recursive: true, force: true }));

function runScript(env: Record<string, string>) {
  return spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/check-i18n.ts'], {
    env: { ...process.env, CI: '', NODE_ENV: '', ...env },
    encoding: 'utf8',
  });
}

describe('contrôle des traductions', () => {
  it('détecte un champ anglais manquant ou vide, avec le fichier et le champ', () => {
    const issues = contentIssues(dir, dir);
    expect(issues).toEqual([
      {
        file: join('services', 'quad.json'),
        key: 'description.en',
        reason: 'traduction anglaise absente',
      },
      {
        file: join('services', 'quad.json'),
        key: 'conditions.included[0].en',
        reason: 'traduction anglaise absente',
      },
    ]);
    expect(formatIssue(issues[0]!)).toBe(
      `[i18n] ${join('services', 'quad.json')} → « description.en » : traduction anglaise absente`,
    );
  });

  it('ignore les valeurs qui ne sont pas des textes localisés', () => {
    expect(contentIssues(dir, dir).some((issue) => issue.key.startsWith('pricing'))).toBe(false);
  });

  it('détecte une clé de dictionnaire vide', () => {
    expect(dictionaryIssues({ 'nav.home': 'Accueil' }, { 'nav.home': '' })).toEqual([
      { file: 'src/i18n/en.ts', key: 'nav.home', reason: 'valeur vide' },
    ]);
  });

  it('échoue avec un code non nul en production', () => {
    const result = runScript({ I18N_CONTENT_DIR: dir, NODE_ENV: 'production' });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('« description.en » : traduction anglaise absente');
    expect(result.stderr).toContain('build de production interrompu');
  });

  it('se contente d’avertir hors production', () => {
    const result = runScript({ I18N_CONTENT_DIR: dir });
    expect(result.status).toBe(0);
    expect(result.stderr).toContain('repli sur le français');
  });

  it('signale une marque [PLACEHOLDER] dans les sources, avec le fichier et la ligne', () => {
    const src = mkdtempSync(join(tmpdir(), 'placeholder-'));
    mkdirSync(join(src, 'styles'));
    mkdirSync(join(src, 'pages', 'dev'), { recursive: true });
    writeFileSync(
      join(src, 'styles', 'tokens.css'),
      ':root {\n  --x: #fff; /* [PLACEHOLDER] */\n}\n',
    );
    writeFileSync(join(src, 'styles', 'clean.css'), ':root { --y: #000; }\n');
    writeFileSync(join(src, 'pages', 'dev', 'ui.astro'), '<p>[PLACEHOLDER]</p>\n');
    try {
      expect(placeholderIssues(src, src)).toEqual([
        { file: join('styles', 'tokens.css'), key: 'ligne 2', reason: 'marque [PLACEHOLDER]' },
      ]);
    } finally {
      rmSync(src, { recursive: true, force: true });
    }
  });

  it('échoue en production quand une marque [PLACEHOLDER] subsiste', () => {
    const src = mkdtempSync(join(tmpdir(), 'placeholder-'));
    writeFileSync(join(src, 'a.ts'), '// [PLACEHOLDER]\n');
    try {
      const result = runScript({
        I18N_CONTENT_DIR: join(src, 'vide'),
        I18N_SOURCE_DIR: src,
        NODE_ENV: 'production',
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('marque [PLACEHOLDER]');
    } finally {
      rmSync(src, { recursive: true, force: true });
    }
  });

  it('exige chaque document légal dans les deux langues, avec une langue cohérente', () => {
    const legal = mkdtempSync(join(tmpdir(), 'legal-'));
    mkdirSync(join(legal, 'fr'));
    mkdirSync(join(legal, 'en'));
    const frontmatter = (doc: string, locale: string) =>
      `---\ndoc: ${doc}\nlocale: ${locale}\ntitle: T\ndescription: D\nupdatedAt: 2026-10-05\n---\nTexte\n`;
    writeFileSync(join(legal, 'fr', 'legal-notice.md'), frontmatter('legalNotice', 'fr'));
    writeFileSync(join(legal, 'en', 'legal-notice.md'), frontmatter('legalNotice', 'en'));
    writeFileSync(join(legal, 'fr', 'privacy.md'), frontmatter('privacy', 'fr'));
    writeFileSync(join(legal, 'fr', 'terms.md'), frontmatter('terms', 'fr'));
    writeFileSync(join(legal, 'en', 'terms.md'), frontmatter('terms', 'fr'));
    try {
      expect(legalIssues(legal, legal)).toEqual([
        { file: join('en', 'privacy.md'), key: 'privacy', reason: 'document légal anglais absent' },
        {
          file: join('en', 'terms.md'),
          key: 'locale',
          reason: 'langue « fr » différente du dossier « en »',
        },
      ]);
    } finally {
      rmSync(legal, { recursive: true, force: true });
    }
  });
});
