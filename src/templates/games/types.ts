export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type GameSlug = 'memory' | 'reaction' | 'stroop' | 'digit-span' | 'visual-search' | 'sequence';

export type GameCategory = 'memory' | 'attention' | 'speed';

export type GameCatalogItem = {
  slug: GameSlug;
  title: string;
  summary: string;
  durationLabel: string;
  difficulty: GameDifficulty;
  category: GameCategory;
};

export type GameResultRecord = {
  id: string;
  slug: GameSlug;
  title: string;
  score: number;
  detail: string;
  playedAt: string;
};
