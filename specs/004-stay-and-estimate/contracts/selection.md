# Contrat — sélection, estimation, message

**Feature**: 004-stay-and-estimate · Modèle : [data-model.md](../data-model.md).

## Fonctions pures (100 % de couverture)

| Module | Fonctions |
|---|---|
| `src/features/selection/selection.ts` | `emptySelection(now)`, `addLine(sel, line, catalog, now) → { sel, event }`, `updateLine(...)`, `removeLine(...)`, `clearSelection(...)`, `setStay(sel, stay, now)`, `parseSelection(raw, catalog, now) → { sel, purged }`, `defaultLine(service)` |
| `src/features/selection/islandCatalog.ts` | `toIslandCatalog(services, options, imageUrls)` |
| `src/features/estimation/computeEstimate.ts` | `computeEstimate(sel, catalog) → PriceEstimate` |
| `src/features/whatsapp/buildSelectionMessage.ts` | `buildSelectionMessage(input) → string` |

Aucune n'importe Astro, Preact ni le DOM.

## Store (`src/features/selection/store.ts`)

- `$selection` : atome persistant (`kibreeze.selection.v1`), repli en mémoire si l'écriture échoue.
- `$lastEvent` : atome du dernier `SelectionEvent`, lu par `Toasts`.
- Actions : `add(line)`, `update(serviceId, patch)`, `remove(serviceId)`, `clear()`, `setStay(stay)`, `hydrate(catalog)` (appelée par le premier îlot monté, applique `parseSelection`).

## Persistance

| Aspect | Valeur |
|---|---|
| Clé | `kibreeze.selection.v1` |
| Stockage | `localStorage` |
| Contenu | `Selection` en JSON |
| Durée | 30 jours après `updatedAt` |
| Effacement | « Vider », ou par le navigateur |
| Documentation | `src/content/legal/{fr,en}/privacy.md`, section cookies ; `DOCUMENTED_STORAGE` dans `tests/e2e/legal.spec.ts` |
