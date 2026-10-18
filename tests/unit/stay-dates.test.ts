import { describe, expect, it } from 'vitest';
import { formatStayDates } from '../../src/features/whatsapp/formatStayDates.ts';

const plain = (value: string | undefined) => value?.replace(/[\u202f\u00a0]/g, ' ');

describe('dates du séjour en toutes lettres (010)', () => {
  it('même mois', () => {
    const stay = { arrival: '2026-12-12', departure: '2026-12-16' };
    expect(plain(formatStayDates(stay, 'fr'))).toBe('du 12 au 16 décembre 2026');
    expect(plain(formatStayDates(stay, 'en'))).toBe('12 to 16 December 2026');
  });

  it('mois ou années différents', () => {
    const months = { arrival: '2026-11-28', departure: '2026-12-03' };
    expect(plain(formatStayDates(months, 'fr'))).toBe('du 28 novembre au 3 décembre 2026');
    expect(plain(formatStayDates(months, 'en'))).toBe('28 November to 3 December 2026');
    const years = { arrival: '2026-12-28', departure: '2027-01-03' };
    expect(plain(formatStayDates(years, 'fr'))).toBe('du 28 décembre 2026 au 3 janvier 2027');
    expect(plain(formatStayDates(years, 'en'))).toBe('28 December 2026 to 3 January 2027');
  });

  it('arrivée seule, départ seul le même jour, ancien texte, rien', () => {
    expect(plain(formatStayDates({ arrival: '2026-12-12' }, 'fr'))).toBe(
      'à partir du 12 décembre 2026',
    );
    expect(plain(formatStayDates({ arrival: '2026-12-12' }, 'en'))).toBe('from 12 December 2026');
    expect(plain(formatStayDates({ arrival: '2026-12-12', departure: '2026-12-12' }, 'fr'))).toBe(
      '12 décembre 2026',
    );
    expect(formatStayDates({ dates: '12-16 déc.' }, 'fr')).toBe('12-16 déc.');
    expect(formatStayDates({ dates: '12-16 déc.', arrival: '2026-12-12' }, 'fr')).not.toBe(
      '12-16 déc.',
    );
    expect(formatStayDates({ departure: '2026-12-16' }, 'fr')).toBeUndefined();
    expect(formatStayDates({}, 'en')).toBeUndefined();
  });
});
