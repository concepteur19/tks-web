import { describe, expect, it } from 'vitest';
import { formatEurEquivalent, formatXaf } from '../../src/features/estimation/formatPrice.ts';

const RATE = 655.957;
const NARROW_NBSP = '\u202f';
const NBSP = '\u00a0';

/** Les séparateurs insécables sont voulus ; on les ramène à une espace pour lire les attentes. */
const plain = (value: string) => value.replace(/[\u202f\u00a0]/g, ' ');

describe('formatXaf', () => {
  it('sépare les milliers par une espace fine insécable en français', () => {
    expect(formatXaf(100000, 'fr')).toBe(`100${NARROW_NBSP}000${NBSP}FCFA`);
    expect(plain(formatXaf(100000, 'fr'))).toBe('100 000 FCFA');
  });

  it('sépare les milliers par une virgule en anglais', () => {
    expect(plain(formatXaf(100000, 'en'))).toBe('100,000 FCFA');
  });

  it('formate un petit montant sans séparateur', () => {
    expect(plain(formatXaf(500, 'fr'))).toBe('500 FCFA');
  });

  it('refuse un montant nul, négatif ou non entier', () => {
    expect(() => formatXaf(0, 'fr')).toThrow(RangeError);
    expect(() => formatXaf(-5000, 'fr')).toThrow(RangeError);
    expect(() => formatXaf(1500.5, 'fr')).toThrow(RangeError);
  });
});

describe('formatEurEquivalent', () => {
  it('convertit à la parité fixe, avec deux décimales, en français', () => {
    expect(plain(formatEurEquivalent(25000, 'fr', RATE))).toBe('≈ 38,11 €');
    expect(plain(formatEurEquivalent(15000, 'fr', RATE))).toBe('≈ 22,87 €');
  });

  it('place le symbole avant le montant en anglais', () => {
    expect(plain(formatEurEquivalent(25000, 'en', RATE))).toBe('≈ €38.11');
  });

  it('garde deux décimales même pour un montant rond', () => {
    expect(plain(formatEurEquivalent(655957, 'fr', RATE))).toBe('≈ 1 000,00 €');
    expect(plain(formatEurEquivalent(655957, 'en', RATE))).toBe('≈ €1,000.00');
  });

  it('arrondit au centime le plus proche', () => {
    // 5 000 / 655,957 = 7,6224… → 7,62 ; 35 000 / 655,957 = 53,3572… → 53,36
    expect(plain(formatEurEquivalent(5000, 'fr', RATE))).toBe('≈ 7,62 €');
    expect(plain(formatEurEquivalent(35000, 'fr', RATE))).toBe('≈ 53,36 €');
  });

  it('ne laisse jamais le signe ≈ seul en fin de ligne', () => {
    expect(formatEurEquivalent(25000, 'fr', RATE).startsWith(`≈${NBSP}`)).toBe(true);
  });

  it('refuse un montant ou un taux invalide', () => {
    expect(() => formatEurEquivalent(0, 'fr', RATE)).toThrow(RangeError);
    expect(() => formatEurEquivalent(25000, 'fr', 0)).toThrow(RangeError);
  });
});
