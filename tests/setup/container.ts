/**
 * Conteneur Astro des tests de composants, avec le moteur de rendu Preact : les composants de la
 * coque (en-tête, barre à onglets, cartes) contiennent des îlots depuis la feature 004.
 */
import { getContainerRenderer } from '@astrojs/preact';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';

export async function createContainer(): Promise<AstroContainer> {
  const renderers = await loadRenderers([getContainerRenderer()]);
  return AstroContainer.create({ renderers });
}
