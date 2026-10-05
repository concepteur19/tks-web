import { describe, expect, it } from 'vitest';
import { formatPhone } from '../../src/lib/phone.ts';

describe('formatPhone', () => {
  it('formate un numéro camerounais comme Franck l’écrit', () => {
    expect(formatPhone('237697135388')).toBe('+237 697 13 53 88');
  });

  it('garde un numéro étranger lisible, sans le déformer', () => {
    expect(formatPhone('33612345678')).toBe('+33612345678');
  });
});
