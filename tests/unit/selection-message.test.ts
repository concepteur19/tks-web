import { describe, expect, it } from 'vitest';
import { computeEstimate } from '../../src/features/estimation/computeEstimate.ts';
import type { SelectedLine } from '../../src/features/selection/selection.ts';
import {
  buildSelectionMessage,
  describeQuantities,
  MAX_ENCODED_LENGTH,
} from '../../src/features/whatsapp/buildSelectionMessage.ts';
import { CATALOG, SERVICES } from '../fixtures/catalog.ts';

const line = (serviceId: string, quantities: number[], extra: Partial<SelectedLine> = {}) => ({
  serviceId,
  quantities,
  optionIds: [],
  ...extra,
});
const plain = (value: string) => value.replace(/[\u202f\u00a0]/g, ' ');
const sejour = [
  line('excursion-en-pirogue', [6], { optionIds: ['guide-touristique'] }),
  line('chutes-de-la-lobe', [2]),
  line('jet-ski', []),
];
const stay = { dates: 'du 12 au 15 décembre', travelers: 4 };

describe('message récapitulatif', () => {
  it('reprend tout le séjour, en français (non-régression)', () => {
    const estimate = computeEstimate({ items: sejour }, CATALOG);
    expect(plain(buildSelectionMessage({ estimate, stay, intent: 'quote', locale: 'fr' }))).toBe(
      [
        'Bonjour Kibreeze, je souhaite organiser un séjour à Kribi.',
        'Dates : du 12 au 15 décembre',
        'Voyageurs : 4',
        '',
        '• Excursion en pirogue — 6 personnes : 40 000 FCFA',
        '  + Guide touristique : 5 000 FCFA',
        '• Chutes de la Lobé — 2 personnes : 10 000 FCFA',
        '• Jet-ski : sur devis',
        '',
        'Total indicatif : 50 000 FCFA (+ 1 prestation sur devis)',
        '',
        'Merci, à bientôt !',
      ].join('\n'),
    );
  });

  it('reprend tout le séjour, en anglais (non-régression)', () => {
    const estimate = computeEstimate({ items: sejour }, CATALOG);
    expect(plain(buildSelectionMessage({ estimate, stay, intent: 'quote', locale: 'en' }))).toBe(
      [
        'Hello Kibreeze, I would like to organise a stay in Kribi.',
        'Dates: du 12 au 15 décembre',
        'Travellers: 4',
        '',
        '• Dugout canoe trip — 6 people: 40,000 FCFA',
        '  + Tour guide: 5,000 FCFA',
        '• Lobé Falls — 2 people: 10,000 FCFA',
        '• Jet ski: on request',
        '',
        'Indicative total: 50,000 FCFA (+ 1 service on request)',
        '',
        'Thank you, see you soon!',
      ].join('\n'),
    );
  });

  it('omet dates et voyageurs absents, et annonce un total estimatif avec un prix « à partir de »', () => {
    const estimate = computeEstimate(
      { items: [line('location', [2, 3]), line('campement-bagyeli', [], { tierId: 'couple' })] },
      CATALOG,
    );
    const message = plain(buildSelectionMessage({ estimate, intent: 'quote', locale: 'fr' }));
    expect(message).not.toContain('Dates');
    expect(message).toContain('• Location de véhicule — 2 véhicules × 3 jours : 150 000 FCFA');
    expect(message).toContain('• Campement Bagyeli — tarif Couple : 20 000 FCFA');
    expect(message).toContain('Total estimatif : 170 000 FCFA');
  });

  it('n’annonce aucun montant quand tout est sur devis', () => {
    const estimate = computeEstimate(
      {
        items: [
          line('jet-ski', [], { optionIds: ['option-devis'] }),
          line('bateau-de-plaisance', []),
        ],
      },
      new Map([
        ...CATALOG,
        [
          'option-devis',
          {
            ...CATALOG.get('guide-touristique')!,
            id: 'option-devis',
            pricing: { kind: 'quote' as const },
          },
        ],
      ]),
    );
    const message = plain(buildSelectionMessage({ estimate, intent: 'quote', locale: 'fr' }));
    expect(message).toContain('Total : sur devis (2 prestations)');
    expect(message).toContain('  + Guide touristique : sur devis');
    expect(message).not.toContain('FCFA');
  });

  it('intention « single » : présente une seule expérience avec l’adresse de sa fiche', () => {
    const estimate = computeEstimate(
      { items: [line('excursion-en-pirogue', [3], { optionIds: ['musee-d-art'] })] },
      CATALOG,
    );
    const message = plain(
      buildSelectionMessage({
        estimate,
        intent: 'single',
        locale: 'fr',
        url: 'https://kibreeze.com/experiences/excursion-en-pirogue',
      }),
    );
    expect(message.split('\n')[0]).toBe(
      'Bonjour Kibreeze, je souhaite des informations sur l’expérience « Excursion en pirogue » : https://kibreeze.com/experiences/excursion-en-pirogue',
    );
    expect(message).toContain("  + Musée d'art : 4 500 FCFA");
    expect(message).toContain('Total indicatif : 39 500 FCFA');
  });

  it('accepte une intention « single » sans ligne ni adresse', () => {
    const estimate = computeEstimate({ items: [] }, CATALOG);
    expect(buildSelectionMessage({ estimate, intent: 'single', locale: 'en' })).toContain(
      'Hello Kibreeze',
    );
  });

  it('résume les dernières lignes au-delà de la longueur autorisée, total exact', () => {
    const many = new Map(CATALOG);
    const items: SelectedLine[] = [];
    for (let index = 0; index < 40; index += 1) {
      const id = `activite-${index}`;
      many.set(id, {
        ...SERVICES[1]!,
        id,
        title: { fr: `Une activité au nom assez long numéro ${index}`, en: `Activity ${index}` },
      });
      items.push(line(id, [1]));
    }
    const estimate = computeEstimate({ items }, many);
    const message = buildSelectionMessage({ estimate, stay, intent: 'quote', locale: 'fr' });
    expect(encodeURIComponent(message).length).toBeLessThanOrEqual(MAX_ENCODED_LENGTH);
    expect(plain(message)).toMatch(/… et \d+ autres prestations/);
    expect(plain(message)).toContain('Total indicatif : 200 000 FCFA');
  });

  it('décrit les quantités, unité sans libellé comprise', () => {
    const estimate = computeEstimate({ items: [line('quad', [2])] }, CATALOG);
    const first = estimate.lines[0]!;
    expect(describeQuantities(first, 'en')).toBe('2 sessions');
    expect(
      describeQuantities({ ...first, dimensions: [{ kind: 'units' }], quantities: [] }, 'fr'),
    ).toBe('0');
    expect(
      describeQuantities(
        { ...first, dimensions: [{ kind: 'nights' }, { kind: 'hours' }], quantities: [1, 2] },
        'fr',
      ),
    ).toBe('1 nuit × 2 heures');
  });
});
