import { GAMES_CATALOG } from './catalog';
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from './labels';
import type { GameCatalogItem, GameCategory } from './types';

export function filterGamesCatalog(query: string, category: GameCategory | 'all' = 'all'): GameCatalogItem[] {
  const needle = query.trim().toLowerCase();

  return GAMES_CATALOG.filter((game) => {
    if (category !== 'all' && game.category !== category) return false;
    if (!needle) return true;

    const haystack = [
      game.title,
      game.summary,
      CATEGORY_LABEL[game.category],
      DIFFICULTY_LABEL[game.difficulty],
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}
