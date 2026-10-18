/**
 * Partager une fiche (009, FR-016) : menu de partage de l'appareil ; à défaut, copie du lien et
 * notification « Lien copié » ; à défaut encore, WhatsApp. Absent sans JavaScript : rien au rendu
 * serveur, le bouton paraît une fois l'îlot actif.
 */
import { useEffect, useState } from 'preact/hooks';
import { t } from '../../i18n/t.ts';
import type { Locale } from '../../i18n/types.ts';
import { notify } from '../feedback/notice.ts';

type Props = { title: string; url: string; locale: Locale };

const SHARE_ICON =
  'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z';

async function share(title: string, url: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch {
      // Partage annulé par le visiteur, ou refusé : rien à signaler.
    }
    return;
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      notify('share.copied');
      return;
    } catch {
      // Presse-papiers refusé : on passe à WhatsApp.
    }
  }
  window.open(
    `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    '_blank',
    'noopener,noreferrer',
  );
}

export default function ShareButton({ title, url, locale }: Props) {
  // Rien au rendu serveur : sans JavaScript, pas de bouton (FR-018).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      type="button"
      class="press border-border text-fg inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold"
      aria-label={t(locale, 'share.aria', { title })}
      data-testid="share"
      onClick={() => void share(title, url)}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d={SHARE_ICON} />
      </svg>
      {t(locale, 'share.label')}
    </button>
  );
}
