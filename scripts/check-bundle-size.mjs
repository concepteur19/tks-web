/**
 * Contrôle de la taille du JavaScript réellement envoyé au navigateur.
 * Seuil issu de docs/technical-requirements.md, TR-20 : 50 kB compressés sur
 * une page de contenu.
 *
 * On ne mesure que les scripts référencés par les pages. La construction peut
 * produire d'autres fichiers, par exemple le moteur des îlots, qui ne sont
 * téléchargés que si une page les demande.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, posix, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET_GZIP_BYTES = 50 * 1024;

function collect(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collect(path, extension);
    return entry.name.endsWith(extension) ? [path] : [];
  });
}

let pages;
try {
  pages = collect(DIST, '.html');
} catch {
  console.error(`[bundle] ${DIST} est introuvable, lancez la construction avant ce contrôle`);
  process.exit(1);
}

const referenced = new Map();
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    const source = match[1];
    if (!source || source.startsWith('http')) continue;
    const file = join(DIST, source.replace(/^\//, ''));
    const pagesUsing = referenced.get(file) ?? [];
    pagesUsing.push(relative(DIST, page));
    referenced.set(file, pagesUsing);
  }
}

if (referenced.size === 0) {
  const produced = collect(DIST, '.js');
  console.info(
    `[bundle] aucune page ne charge de script. ${produced.length} fichier(s) produit(s) mais jamais téléchargé(s).`,
  );
  process.exit(0);
}

let worst = 0;
for (const [file, pagesUsing] of referenced) {
  const size = gzipSync(readFileSync(file)).length;
  worst = Math.max(worst, size);
  console.info(
    `[bundle] ${posix.normalize(file)} — ${(size / 1024).toFixed(1)} kB compressés, chargé par ${pagesUsing.length} page(s)`,
  );
}

const budgetKb = (BUDGET_GZIP_BYTES / 1024).toFixed(0);
if (worst > BUDGET_GZIP_BYTES) {
  console.error(
    `[bundle] ${(worst / 1024).toFixed(1)} kB compressés, budget de ${budgetKb} kB dépassé`,
  );
  process.exit(1);
}
console.info(
  `[bundle] plus gros script : ${(worst / 1024).toFixed(1)} kB sur un budget de ${budgetKb} kB`,
);
