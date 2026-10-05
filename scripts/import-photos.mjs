/**
 * Importe les photos de Franck dans le dépôt, prêtes pour astro:assets.
 * Les originaux vivent dans Elements/, ignoré par Git (décision du 2026-09-25) ;
 * le build en CI a besoin de copies versionnées, réduites pour garder le dépôt léger.
 *
 * Usage : node scripts/import-photos.mjs [fichier de correspondances]
 * Par défaut : src/assets/photos/sources.json, un objet { "destination": "source" },
 * destination relative à src/assets/photos/, source relative à Elements/tri-par-activite/.
 *
 * Voir specs/002-kibreeze-core/research.md, décision 3.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = 'Elements/tri-par-activite';
const TARGET_ROOT = 'src/assets/photos';
const MAX_WIDTH = 2400;
const QUALITY = 82;

const mappingFile = process.argv[2] ?? join(TARGET_ROOT, 'sources.json');
const mapping = JSON.parse(readFileSync(mappingFile, 'utf8'));

let failures = 0;
for (const [target, source] of Object.entries(mapping)) {
  if (source.includes('_FILIGRANE')) {
    console.error(`[photos] refusé : ${source} porte un filigrane, Kibreeze n'en a pas les droits`);
    failures += 1;
    continue;
  }
  const output = join(TARGET_ROOT, target);
  mkdirSync(dirname(output), { recursive: true });
  // rotate() applique l'orientation EXIF avant que les métadonnées soient retirées.
  const info = await sharp(join(SOURCE_ROOT, source))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(output);
  console.info(
    `[photos] ${source} → ${output} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko)`,
  );
}

if (failures > 0) process.exit(1);
