import { describe, expect, it } from 'vitest';
import { $notice, notify } from '../../src/features/feedback/notice.ts';

describe('notifications hors sélection', () => {
  it('publie la clé du message, et distingue deux notifications identiques', () => {
    expect($notice.get()).toBeNull();
    notify('share.copied');
    const first = $notice.get();
    expect(first?.key).toBe('share.copied');
    notify('share.copied');
    expect($notice.get()?.key).toBe('share.copied');
    expect($notice.get()).not.toBe(first);
    expect($notice.get()?.at).not.toBe(first?.at);
  });
});
