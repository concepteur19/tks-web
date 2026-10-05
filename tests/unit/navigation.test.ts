import { describe, expect, it } from 'vitest';
import {
  DESKTOP_NAV,
  FOOTER_LINKS,
  isImplemented,
  LEGAL_LINKS,
  resolveLink,
  TAB_BAR,
  visible,
} from '../../src/i18n/navigation.ts';
import { IMPLEMENTED_ROUTES, type RouteKey } from '../../src/i18n/routes.ts';

const NUMBER = '237697135388';

describe('listes de navigation', () => {
  it('ordonne les onglets mobiles comme la maquette validée', () => {
    expect(TAB_BAR).toEqual(['home', 'experiences', 'accommodation', 'packages', 'stay']);
  });

  it('ordonne la navigation ordinateur sans Mon séjour, rendu à part', () => {
    expect(DESKTOP_NAV).toEqual(['experiences', 'accommodation', 'packages', 'mobility']);
  });

  it('liste les liens du pied de page et les liens légaux', () => {
    expect(FOOTER_LINKS).toEqual([
      'experiences',
      'accommodation',
      'packages',
      'mobility',
      'contact',
    ]);
    expect(LEGAL_LINKS).toEqual(['legalNotice', 'privacy', 'terms']);
  });
});

describe('état livré', () => {
  it("ne garde d'une liste que les pages livrées, dans l'ordre", () => {
    const delivered = TAB_BAR.filter((key) => IMPLEMENTED_ROUTES.includes(key));
    expect(visible(TAB_BAR)).toEqual(delivered);
    expect(visible(TAB_BAR)[0]).toBe('home');
  });

  it("reconnaît une page livrée et une page qui ne l'est pas", () => {
    expect(isImplemented('home')).toBe(true);
    expect(isImplemented('stay')).toBe(false);
  });
});

describe('resolveLink', () => {
  it('renvoie le chemin interne d’une page livrée, dans la bonne langue', () => {
    expect(resolveLink('home', 'fr', NUMBER)).toEqual({ kind: 'internal', href: '/' });
    expect(resolveLink('home', 'en', NUMBER)).toEqual({ kind: 'internal', href: '/en/' });
  });

  it('renvoie WhatsApp avec le message générique pour une page non livrée', () => {
    const french = resolveLink('stay', 'fr', NUMBER);
    expect(french.kind).toBe('whatsapp');
    expect(french.href).toBe(
      `https://wa.me/${NUMBER}?text=${encodeURIComponent(
        'Bonjour Kibreeze, je souhaite des informations sur vos expériences à Kribi.',
      )}`,
    );

    const english = resolveLink('stay', 'en', NUMBER);
    expect(decodeURIComponent(english.href)).toContain(
      'Hello Kibreeze, I would like some information about your experiences in Kribi.',
    );
  });

  it('bascule tout seul quand une clé entre dans les routes livrées', () => {
    const notYet: RouteKey = 'experiences';
    expect(resolveLink(notYet, 'fr', NUMBER, [...IMPLEMENTED_ROUTES, notYet])).toEqual({
      kind: 'internal',
      href: '/experiences',
    });
  });
});
