import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { $notice } from '../../src/features/feedback/notice.ts';
import ShareButton from '../../src/features/share/ShareButton.tsx';

const AXE = {
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
} as const;
const TITLE = 'Excursion en pirogue';
const URL_ = 'https://kibreeze.example/experiences/excursion-en-pirogue';

function setNavigator(values: Record<string, unknown>) {
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(navigator, key, { value, configurable: true });
  }
}
const button = () => screen.getByRole('button', { name: `Partager : ${TITLE}` });

beforeEach(() => $notice.set(null));
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'clipboard');
  vi.restoreAllMocks();
});

describe('bouton Partager', () => {
  it('ouvre le menu de partage de l’appareil', async () => {
    const share = vi.fn(async () => {});
    setNavigator({ share });
    render(<ShareButton title={TITLE} url={URL_} locale="fr" />);
    expect(button().textContent).toContain('Partager');
    fireEvent.click(button());
    await waitFor(() => expect(share).toHaveBeenCalledWith({ title: TITLE, url: URL_ }));
    expect($notice.get()).toBeNull();
  });

  it('un partage annulé ne fait rien', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    setNavigator({ share: vi.fn(async () => Promise.reject(new DOMException('', 'AbortError'))) });
    render(<ShareButton title={TITLE} url={URL_} locale="fr" />);
    fireEvent.click(button());
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect($notice.get()).toBeNull();
    expect(open).not.toHaveBeenCalled();
  });

  it('sans menu de partage : copie le lien et le confirme', async () => {
    const writeText = vi.fn(async () => {});
    setNavigator({ share: undefined, clipboard: { writeText } });
    render(<ShareButton title={TITLE} url={URL_} locale="fr" />);
    fireEvent.click(button());
    await waitFor(() => expect($notice.get()?.key).toBe('share.copied'));
    expect(writeText).toHaveBeenCalledWith(URL_);
  });

  it('sans partage ni presse-papiers : ouvre WhatsApp avec le nom et le lien', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    setNavigator({ share: undefined, clipboard: undefined });
    render(<ShareButton title={TITLE} url={URL_} locale="fr" />);
    fireEvent.click(button());
    await waitFor(() =>
      expect(open).toHaveBeenCalledWith(
        `https://wa.me/?text=${encodeURIComponent(`${TITLE} ${URL_}`)}`,
        '_blank',
        'noopener,noreferrer',
      ),
    );
  });

  it('ne produit aucune violation d’accessibilité', async () => {
    const { container } = render(<ShareButton title={TITLE} url={URL_} locale="fr" />);
    expect((await axe.run(container, AXE)).violations).toEqual([]);
  });
});
