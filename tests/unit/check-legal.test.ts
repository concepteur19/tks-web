import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { missingLegalFields } from '../../scripts/check-legal.ts';

const host = {
  name: 'Cloudflare, Inc.',
  address: '101 Townsend St, San Francisco, CA 94107',
  url: 'https://www.cloudflare.com',
};

describe('contrôle des mentions légales', () => {
  it('liste chaque champ d’identité manquant', () => {
    expect(missingLegalFields({ legal: { host } })).toEqual([
      'publisherName',
      'legalForm',
      'registration.rccm',
      'registration.niu',
      'address',
      'publicationDirector',
    ]);
  });

  it('ne signale rien quand l’identité est complète', () => {
    expect(
      missingLegalFields({
        legal: {
          host,
          publisherName: 'Kibreeze SARL',
          legalForm: 'SARL',
          registration: { rccm: 'RC/KRI/2026/B/001', niu: 'M012600000000A' },
          address: 'Kribi, Cameroun',
          publicationDirector: 'Franck',
        },
      }),
    ).toEqual([]);
  });

  it('informe sans jamais faire échouer la construction', () => {
    const result = spawnSync(
      process.execPath,
      ['--experimental-strip-types', 'scripts/check-legal.ts'],
      {
        encoding: 'utf8',
      },
    );
    expect(result.status).toBe(0);
    expect(result.stderr + result.stdout).toMatch(/entreprise en cours de création/);
  });
});
