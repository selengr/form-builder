import type { GameCategory, GameDifficulty } from './types';

export const DIFFICULTY_LABEL: Record<GameDifficulty, string> = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

export const CATEGORY_LABEL: Record<GameCategory, string> = {
  memory: 'حافظه',
  attention: 'توجه',
  speed: 'سرعت',
};
