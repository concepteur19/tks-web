import { describe, expect, it } from 'vitest';
import { $draft } from '../../src/features/selection/draft.ts';

describe('configuration en cours', () => {
  it('est partagée entre les îlots de la fiche', () => {
    expect($draft.get()).toBeNull();
    const line = { serviceId: 'quad', quantities: [1], optionIds: [] };
    $draft.set(line);
    expect($draft.get()).toBe(line);
  });
});
