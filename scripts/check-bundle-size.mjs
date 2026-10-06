/**
 * Contrôle du JavaScript réellement téléchargé par chaque page — TR-20 :
 * 50 kB compressés sur une page de contenu, 80 kB sur Mon séjour.
 *
 * Pour chaque page, on part des scripts qu'elle référence (`<script src>`, et pour les îlots
 * `component-url` et `renderer-url`), puis on suit leurs imports. Chaque fichier n'est compté
 * qu'une fois par page. Les fichiers produits mais jamais référencés ne comptent pas.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const KB = 1024;
const BUDGETS = [
  { match: /^(en\/my-trip|sejour)\.html$/, bytes: 80 * KB, label: 'Mon séjour' },
  { match: /.*/, bytes: 50 * KB, label: 'page de contenu' },
];

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

const sizes = new Map();
const gzipSize = (file) => {
  if (!sizes.has(file)) sizes.set(file, gzipSync(readFileSync(file)).length);
  return sizes.get(file);
};

/** Fichiers JavaScript atteints depuis un point d'entrée, imports statiques et dynamiques compris. */
function reachable(entry, seen = new Set()) {
  if (seen.has(entry) || !existsSync(entry)) return seen;
  seen.add(entry);
  const code = readFileSync(entry, 'utf8');
  for (const match of code.matchAll(/(?:from|import\(?)\s?["'](\.\.?\/[^"']+\.js)["']/g)) {
    reachable(join(dirname(entry), match[1]), seen);
  }
  return seen;
}

let failures = 0;
let worst = { page: '', bytes: 0 };
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const entries = new Set();
  for (const match of html.matchAll(/(?:src|component-url|renderer-url)="(\/[^"]+\.js)"/g)) {
    entries.add(join(DIST, match[1].replace(/^\//, '')));
  }
  if (entries.size === 0) continue;
  const files = new Set();
  for (const entry of entries) for (const file of reachable(entry)) files.add(file);
  const total = [...files].reduce((sum, file) => sum + gzipSize(file), 0);
  const name = relative(DIST, page);
  const budget = BUDGETS.find((candidate) => candidate.match.test(name));
  const line = `${name} — ${(total / KB).toFixed(1)} kB compressés (${files.size} fichier(s)), budget ${budget.label} ${budget.bytes / KB} kB`;
  if (total > budget.bytes) {
    console.error(`[bundle] ✗ ${line}`);
    failures += 1;
  } else {
    console.info(`[bundle] ✓ ${line}`);
  }
  if (total > worst.bytes) worst = { page: name, bytes: total };
}

if (worst.bytes === 0) {
  console.info('[bundle] aucune page ne charge de script');
  process.exit(0);
}
if (failures > 0) {
  console.error(`[bundle] ${failures} page(s) au-delà du budget`);
  process.exit(1);
}
console.info(`[bundle] page la plus lourde : ${worst.page}, ${(worst.bytes / KB).toFixed(1)} kB`);
