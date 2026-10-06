/** Lien WhatsApp prérempli (FR-WA-2). Sans dépendance : utilisable par les îlots. */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
