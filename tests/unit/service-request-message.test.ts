import { describe, expect, it } from 'vitest';
import { buildServiceRequestMessage } from '../../src/features/whatsapp/buildServiceRequestMessage.ts';

describe('message « Demander ce service »', () => {
  it('nomme l’expérience et donne l’adresse de la fiche, en français', () => {
    expect(
      buildServiceRequestMessage({
        title: 'Excursion en pirogue',
        url: 'https://kibreeze.com/experiences/excursion-en-pirogue',
        locale: 'fr',
      }),
    ).toBe(
      'Bonjour Kibreeze, je souhaite des informations sur l’expérience « Excursion en pirogue » : https://kibreeze.com/experiences/excursion-en-pirogue',
    );
  });

  it('suit la langue de la page, en anglais', () => {
    expect(
      buildServiceRequestMessage({
        title: 'Dugout canoe trip',
        url: 'https://kibreeze.com/en/experiences/excursion-en-pirogue',
        locale: 'en',
      }),
    ).toBe(
      'Hello Kibreeze, I would like some information about the “Dugout canoe trip” experience: https://kibreeze.com/en/experiences/excursion-en-pirogue',
    );
  });
});
