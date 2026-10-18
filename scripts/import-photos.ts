/**
 * Importe les photos de Franck dans le dépôt, prêtes pour astro:assets.
 * Les originaux vivent dans Elements/, ignoré par Git (décision du 2026-09-25) ;
 * le build en CI a besoin de copies versionnées, réduites pour garder le dépôt léger.
 *
 * Usage : npm run photos:import [fichier de correspondances]
 * Par défaut : src/assets/photos/sources.json, un objet { "destination": entrée },
 * destination relative à src/assets/photos/, source relative à Elements/tri-par-activite/.
 * Une entrée est le chemin de la source, ou `{ source, blur }` : chaque zone de `blur`, en
 * fractions de l'image après rotation, est floutée avant réduction (plaques
 * d'immatriculation, spec 006, FR-006).
 *
 * Voir specs/002-kibreeze-core/research.md, décision 3, et specs/006-tks-mobility/research.md §7.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SOURCE_ROOT = 'Elements/tri-par-activite';
const TARGET_ROOT = 'src/assets/photos';
const MAX_WIDTH = 2400;
const QUALITY = 82;

export type BlurZone = { left: number; top: number; width: number; height: number };
export type PhotoEntry = { source: string; blur: BlurZone[] };

export function normalizeEntry(entry: string | { source: string; blur?: BlurZone[] }): PhotoEntry {
  return typeof entry === 'string'
    ? { source: entry, blur: [] }
    : { source: entry.source, blur: entry.blur ?? [] };
}

const inside = ({ left, top, width, height }: BlurZone) =>
  left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= 1 && top + height <= 1;

/** Raison de refuser une entrée, ou `null`. */
export function entryIssue({ source, blur }: PhotoEntry): string | null {
  if (source.includes('_FILIGRANE')) {
    return `[photos] refusé : ${source} porte un filigrane, Kibreeze n'en a pas les droits`;
  }
  if (!blur.every(inside)) return `[photos] zone de flou hors de l'image : ${source}`;
  return null;
}

/** Image tournée selon l'EXIF, zones floutées, en pixels bruts : aucune compression en plus. */
async function blurred(file: string, blur: BlurZone[]) {
  const { data, info } = await sharp(file).rotate().raw().toBuffer({ resolveWithObject: true });
  const raw = { width: info.width, height: info.height, channels: info.channels };
  const overlays = await Promise.all(
    blur.map(async (zone) => {
      const region = {
        left: Math.floor(zone.left * raw.width),
        top: Math.floor(zone.top * raw.height),
        width: Math.max(1, Math.round(zone.width * raw.width)),
        height: Math.max(1, Math.round(zone.height * raw.height)),
      };
      region.width = Math.min(region.width, raw.width - region.left);
      region.height = Math.min(region.height, raw.height - region.top);
      const input = await sharp(data, { raw })
        .extract(region)
        .blur(Math.max(8, region.height / 2))
        .raw()
        .toBuffer();
      return {
        input,
        raw: { ...raw, width: region.width, height: region.height },
        left: region.left,
        top: region.top,
      };
    }),
  );
  // composite() ajoute un canal alpha : on le retire et on relit les dimensions renvoyées.
  const composed = await sharp(data, { raw })
    .composite(overlays)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = composed.info;
  return sharp(composed.data, { raw: { width, height, channels } });
}

async function importPhoto(target: string, { source, blur }: PhotoEntry) {
  const output = join(TARGET_ROOT, target);
  mkdirSync(dirname(output), { recursive: true });
  const file = join(SOURCE_ROOT, source);
  // rotate() applique l'orientation EXIF avant que les métadonnées soient retirées.
  const image = blur.length > 0 ? await blurred(file, blur) : sharp(file).rotate();
  const info = await image
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(output);
  const zones = blur.length > 0 ? `, ${blur.length} zone(s) floutée(s)` : '';
  console.info(
    `[photos] ${source} → ${output} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko${zones})`,
  );
}

async function main() {
  const mappingFile = process.argv[2] ?? join(TARGET_ROOT, 'sources.json');
  const mapping = JSON.parse(readFileSync(mappingFile, 'utf8')) as Record<
    string,
    Parameters<typeof normalizeEntry>[0]
  >;
  let failures = 0;
  for (const [target, raw] of Object.entries(mapping)) {
    const entry = normalizeEntry(raw);
    const issue = entryIssue(entry);
    if (issue) {
      console.error(issue);
      failures += 1;
      continue;
    }
    await importPhoto(target, entry);
  }
  if (failures > 0) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
