import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { contentIssues, dictionaryIssues, formatIssue } from '../../scripts/check-i18n.ts';

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
});
