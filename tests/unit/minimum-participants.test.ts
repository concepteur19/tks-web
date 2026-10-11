import { describe, expect, it } from 'vitest';
import { minimumParticipants } from '../../src/features/catalog/minimumParticipants.ts';

const withDimensions = (dimensions: unknown[]) =>
  ({ quantity: { dimensions } }) as Parameters<typeof minimumParticipants>[0];

describe('minimumParticipants', () => {
  it('renvoie le minimum de personnes quand il dépasse 1', () => {
    expect(
      minimumParticipants(withDimensions([{ kind: 'persons', min: 2, max: 20, default: 2 }])),
    ).toBe(2);
  });

  it('ignore un minimum de 1 personne', () => {
    expect(
      minimumParticipants(withDimensions([{ kind: 'persons', min: 1, max: 20, default: 2 }])),
    ).toBeUndefined();
  });

  it('ignore les autres dimensions et l’absence de dimension', () => {
    expect(
      minimumParticipants(
        withDimensions([
          { kind: 'units', label: { fr: 'véhicules' }, min: 2, max: 5, default: 2 },
          { kind: 'hours', min: 3, max: 8, default: 3 },
        ]),
      ),
    ).toBeUndefined();
    expect(minimumParticipants(withDimensions([]))).toBeUndefined();
  });
});
