/**
 * Contrôle des contrastes des tokens de couleur — WCAG 2.2 niveau AA, constitution principe V.
 * Lit src/styles/tokens.css et vérifie chaque paire texte / fond réellement utilisée par le design.
 * Une paire en échec fait sortir le script avec un code non nul ; une exception documentée
 * est affichée en avertissement et ne bloque pas.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type Pair = {
  text: string;
  background: string;
  minimum: number;
  usage: string;
  exception?: string;
};

const AA_TEXT = 4.5;
const AA_LARGE_OR_UI = 3;

export const PAIRS: Pair[] = [
  { text: 'fg', background: 'bg', minimum: AA_TEXT, usage: 'texte courant' },
  {
    text: 'fg-muted',
    background: 'bg',
    minimum: AA_TEXT,
    usage: 'texte secondaire, équivalents en euros',
  },
  { text: 'fg', background: 'bg-muted', minimum: AA_TEXT, usage: 'texte dans les encadrés crème' },
  {
    text: 'fg-muted',
    background: 'bg-muted',
    minimum: AA_TEXT,
    usage: 'mentions dans les encadrés crème',
  },
  { text: 'brand', background: 'bg', minimum: AA_TEXT, usage: 'prix, liens, onglet actif' },
  {
    text: 'brand',
    background: 'bg-muted',
    minimum: AA_TEXT,
    usage: 'prix des options dans un encadré',
  },
  {
    text: 'brand-contrast',
    background: 'brand',
    minimum: AA_TEXT,
    usage: 'texte des boutons rouges',
  },
  {
    text: 'brand-contrast',
    background: 'brand-warm',
    minimum: AA_TEXT,
    usage: 'texte de la section Formules',
  },
  { text: 'brand-warm', background: 'bg', minimum: AA_TEXT, usage: 'accent chaud sur crème' },
  {
    text: 'accent',
    background: 'bg',
    minimum: AA_TEXT,
    usage: 'badges et lignes d’information turquoise',
  },
  {
    text: 'accent',
    background: 'bg-muted',
    minimum: AA_TEXT,
    usage: 'information dans un encadré crème',
  },
  {
    text: 'brand-contrast',
    background: 'fg',
    minimum: AA_TEXT,
    usage: 'pied de page et bandeau sombres',
  },
  {
    text: 'success',
    background: 'bg',
    minimum: AA_TEXT,
    usage: 'coches vertes de « Ce qui est inclus »',
  },
  { text: 'danger', background: 'bg', minimum: AA_TEXT, usage: 'messages d’erreur' },
  {
    text: 'whatsapp-contrast',
    background: 'whatsapp',
    minimum: AA_LARGE_OR_UI,
    usage: 'bouton WhatsApp flottant, icône seule',
    exception:
      'vert imposé par la marque WhatsApp, admis pour le bouton flottant qui porte un libellé accessible. ' +
      'Les boutons à libellé visible ne peuvent pas garder du texte blanc sur ce vert : à trancher en feature 002',
  },
];

export function parseColorTokens(css: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const match of css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
    tokens.set(match[1]!, match[2]!.toLowerCase());
  }
  return tokens;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

function main(): void {
  const tokens = parseColorTokens(readFileSync('src/styles/tokens.css', 'utf8'));
  let failures = 0;
  for (const pair of PAIRS) {
    const text = tokens.get(pair.text);
    const background = tokens.get(pair.background);
    if (!text || !background) {
      console.error(`[tokens] token absent : --color-${text ? pair.background : pair.text}`);
      failures += 1;
      continue;
    }
    const ratio = contrastRatio(text, background);
    const label = `${pair.text} sur ${pair.background} (${pair.usage}) : ${ratio.toFixed(2)}:1, minimum ${pair.minimum}:1`;
    if (ratio >= pair.minimum) console.log(`[tokens] ✓ ${label}`);
    else if (pair.exception) console.warn(`[tokens] ⚠ ${label} — exception : ${pair.exception}`);
    else {
      console.error(`[tokens] ✗ ${label}`);
      failures += 1;
    }
  }
  if (failures > 0) {
    console.error(`[tokens] ${failures} paire(s) sous le niveau AA`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
