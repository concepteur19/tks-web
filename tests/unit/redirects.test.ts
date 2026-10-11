import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Redirections Cloudflare Pages (008, contracts/routes.md) : anciennes fiches → nouvelle fiche. */
const lines = readFileSync('public/_redirects', 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(/\s+/));

const availability = (id: string): string | undefined => {
  const data = JSON.parse(readFileSync(`src/content/services/${id}.json`, 'utf8'));
  return data.availability ?? 'available';
};
const idOf = (path: string) => path.split('/').pop()!;

describe('public/_redirects', () => {
  it('redirige en 301 les deux anciennes fiches, dans les deux langues', () => {
    expect(lines).toEqual([
      ['/experiences/croisiere-en-bateau', '/experiences/croisiere-en-haute-mer', '301'],
      ['/experiences/bateau-de-plaisance', '/experiences/croisiere-en-haute-mer', '301'],
      ['/en/experiences/croisiere-en-bateau', '/en/experiences/croisiere-en-haute-mer', '301'],
      ['/en/experiences/bateau-de-plaisance', '/en/experiences/croisiere-en-haute-mer', '301'],
    ]);
  });

  it('part de prestations désactivées et mène à une prestation publiée', () => {
    for (const [from, to] of lines) {
      expect(availability(idOf(from!)), from).toBe('disabled');
      expect(availability(idOf(to!)), to).not.toBe('disabled');
    }
  });
});
