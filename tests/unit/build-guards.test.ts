/**
 * Garde-fous de la construction — T042. Ces tests lancent de vraies constructions : ils sont
 * lents (une dizaine de secondes chacun), mais c'est la seule façon de prouver que la
 * publication s'arrête sur un contenu ou une configuration invalide.
 *
 * Variable absente : la construction ne s'arrête pas, elle prend le repli documenté
 * (contracts/env.md). C'est une valeur mal formée qui doit l'arrêter.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const workdir = mkdtempSync(join(tmpdir(), 'build-guards-'));
afterAll(() => rmSync(workdir, { recursive: true, force: true }));

// Vitest injecte DEV, PROD, MODE, SSR et NODE_ENV dans l'environnement : hérités tels quels,
// ils feraient construire Astro en mode développement. On les retire, on ne les vide pas.
const LEAKED = /^(NODE_ENV|CI|DEV|PROD|MODE|SSR|BASE_URL|TEST|VITEST.*)$/;

function run(command: string, args: string[], env: Record<string, string>) {
  const inherited = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !LEAKED.test(key)),
  );
  return spawnSync(command, args, {
    env: { ...inherited, ...env },
    encoding: 'utf8',
    timeout: 180_000,
  });
}

describe('construction de production', () => {
  it('échoue sur une fiche privée de sa traduction anglaise', () => {
    const content = join(workdir, 'content', 'services');
    mkdirSync(content, { recursive: true });
    writeFileSync(
      join(content, 'fiche-essai.json'),
      JSON.stringify({
        title: { fr: 'Fiche d’essai' },
        description: { fr: 'Sans traduction', en: 'Translated' },
      }),
    );
    const result = run('npm', ['run', 'build:prod'], {
      I18N_CONTENT_DIR: join(workdir, 'content'),
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(
      'fiche-essai.json → « title.en » : traduction anglaise absente',
    );
  }, 180_000);

  it('échoue sur une variable d’environnement mal formée', () => {
    const result = run('npx', ['astro', 'build', '--outDir', join(workdir, 'dist-env')], {
      PUBLIC_WHATSAPP_NUMBER: '+237 6 97',
    });
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain('PUBLIC_WHATSAPP_NUMBER');
  }, 180_000);

  it('réussit avec la configuration du dépôt, sans la page de démonstration', () => {
    const outDir = join(workdir, 'dist-ok');
    const result = run('npx', ['astro', 'build', '--outDir', outDir], {});
    expect(result.status).toBe(0);
    expect(existsSync(join(outDir, 'index.html'))).toBe(true);
    expect(existsSync(join(outDir, 'dev'))).toBe(false);
  }, 180_000);
});
