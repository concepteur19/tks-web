/**
 * Contrôle des liens internes du site construit — SC-004, FR-004.
 * Chaque href ou src qui commence par « / » doit désigner un fichier de dist/ :
 * tel quel, en « .html », ou en « /index.html ». Une page non livrée qu'on
 * aurait liée par erreur fait donc échouer la construction.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collect(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

function exists(target) {
  const path = join(DIST, decodeURIComponent(target));
  const candidates = [path, `${path}.html`, join(path, 'index.html')];
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

let pages;
try {
  pages = collect(DIST);
} catch {
  console.error(`[liens] ${DIST} est introuvable, lancez la construction avant ce contrôle`);
  process.exit(1);
}

const broken = [];
let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const raw = match[1];
    if (raw.startsWith('//')) continue;
    const target = raw.split('#')[0].split('?')[0];
    checked += 1;
    if (!exists(target)) broken.push(`${relative(DIST, page)} → ${raw}`);
  }
}

if (broken.length > 0) {
  for (const line of broken) console.error(`[liens] cassé : ${line}`);
  console.error(`[liens] ${broken.length} lien(s) interne(s) cassé(s)`);
  process.exit(1);
}
console.info(
  `[liens] ${checked} lien(s) interne(s) vérifié(s) sur ${pages.length} page(s), aucun cassé`,
);
