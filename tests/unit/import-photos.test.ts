import { describe, expect, it } from 'vitest';
import { entryIssue, normalizeEntry } from '../../scripts/import-photos.ts';

const SOURCE = 'voitures-tks/photo_2026-10-06_06-34-19.jpg';

describe('normalizeEntry', () => {
  it('accepte une entrée texte, sans flou', () => {
    expect(normalizeEntry(SOURCE)).toEqual({ source: SOURCE, blur: [] });
  });

  it('accepte une entrée objet avec ses zones de flou', () => {
    const zone = { left: 0.38, top: 0.78, width: 0.16, height: 0.07 };
    expect(normalizeEntry({ source: SOURCE, blur: [zone] })).toEqual({
      source: SOURCE,
      blur: [zone],
    });
    expect(normalizeEntry({ source: SOURCE })).toEqual({ source: SOURCE, blur: [] });
  });
});

describe('entryIssue', () => {
  it("ne signale rien pour une zone dans l'image", () => {
    expect(entryIssue({ source: SOURCE, blur: [] })).toBeNull();
    expect(
      entryIssue({ source: SOURCE, blur: [{ left: 0, top: 0.9, width: 1, height: 0.1 }] }),
    ).toBeNull();
  });

  it.each([
    { left: 0.9, top: 0.5, width: 0.2, height: 0.1 },
    { left: 0.1, top: 0.95, width: 0.2, height: 0.1 },
    { left: -0.1, top: 0.5, width: 0.2, height: 0.1 },
    { left: 0.1, top: 0.5, width: 0, height: 0.1 },
    { left: 0.1, top: 0.5, width: 0.2, height: 0 },
  ])('refuse une zone hors de l’image : %o', (zone) => {
    expect(entryIssue({ source: SOURCE, blur: [zone] })).toBe(
      `[photos] zone de flou hors de l'image : ${SOURCE}`,
    );
  });

  it('refuse une photo filigranée, sous les deux formes', () => {
    const watermarked = 'village-mayi/L3-02_FILIGRANE.jpg';
    const expected = `[photos] refusé : ${watermarked} porte un filigrane, Kibreeze n'en a pas les droits`;
    expect(entryIssue(normalizeEntry(watermarked))).toBe(expected);
    expect(entryIssue(normalizeEntry({ source: watermarked, blur: [] }))).toBe(expected);
  });
});
