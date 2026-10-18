/**
 * Photo en grand (010, FR-016) : un toucher sur une photo de galerie l'ouvre en entier dans la
 * fenêtre native `<dialog>` (Échap natif), fermée aussi par son bouton ou un toucher hors de
 * l'image ; le focus revient à la photo. Sans JavaScript, le lien mène à l'image seule.
 */
const dialog = document.querySelector<HTMLDialogElement>('dialog[data-lightbox]');
const picture = dialog?.querySelector('img');
let openedFrom: HTMLElement | null = null;

if (dialog && picture) {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox-open]')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openedFrom = link;
      picture.src = link.href;
      picture.alt = link.querySelector('img')?.alt ?? '';
      dialog.showModal();
    });
  }
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  // Toucher hors de l'image : sur le fond, pas sur la photo.
  dialog.addEventListener('click', (event) => {
    if (event.target !== picture) dialog.close();
  });
  dialog.addEventListener('close', () => openedFrom?.focus());
}
