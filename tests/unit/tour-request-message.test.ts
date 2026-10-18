import { describe, expect, it } from 'vitest';
import { buildTourRequestMessage } from '../../src/features/whatsapp/buildTourRequestMessage.ts';

const URL_ = 'https://kibreeze.example/formules/essentiel-de-kribi';

describe('message « Personnaliser ce parcours » (010)', () => {
  it('nomme le parcours, le nombre de personnes et l’adresse', () => {
    expect(
      buildTourRequestMessage({
        title: "L'Essentiel de Kribi",
        persons: 4,
        url: URL_,
        locale: 'fr',
      }),
    ).toBe(
      `Bonjour Kibreeze, je souhaite personnaliser le parcours « L'Essentiel de Kribi » pour 4 personnes. ${URL_}`,
    );
    expect(
      buildTourRequestMessage({
        title: 'The Essence of Kribi',
        persons: 2,
        url: URL_,
        locale: 'en',
      }),
    ).toBe(
      `Hello Kibreeze, I would like to customise the “The Essence of Kribi” tour for 2 people. ${URL_}`,
    );
  });
});
