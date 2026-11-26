import type { GameCatalogItem, GameSlug } from './types';

export const GAMES_CATALOG: GameCatalogItem[] = [
  {
    slug: 'memory',
    title: 'حافظه کارت‌ها',
    summary: 'جفت کارت‌های یکسان را با کمترین حرکت پیدا کنید.',
    durationLabel: '۲ تا ۳ دقیقه',
    difficulty: 'easy',
    category: 'memory',
  },
  {
    slug: 'reaction',
    title: 'زمان واکنش',
    summary: 'به‌محض سبز شدن صفحه، هرچه سریع‌تر لمس کنید.',
    durationLabel: '۱ دقیقه',
    difficulty: 'easy',
    category: 'speed',
  },
  {
    slug: 'stroop',
    title: 'آزمون استروپ',
    summary: 'رنگ نوشته را بگویید، نه خود کلمه را.',
    durationLabel: '۲ دقیقه',
    difficulty: 'medium',
    category: 'attention',
  },
  {
    slug: 'digit-span',
    title: 'ظرفیت اعداد',
    summary: 'دنباله اعداد را ببینید و همان را وارد کنید.',
    durationLabel: '۳ دقیقه',
    difficulty: 'medium',
    category: 'memory',
  },
  {
    slug: 'visual-search',
    title: 'جست‌وجوی دیداری',
    summary: 'میان شکل‌های شبیه، مورد متفاوت را پیدا کنید.',
    durationLabel: '۲ دقیقه',
    difficulty: 'medium',
    category: 'attention',
  },
  {
    slug: 'sequence',
    title: 'ترتیب حافظه',
    summary: 'چراغ‌ها را به همان ترتیبی که روشن شدند لمس کنید.',
    durationLabel: '۳ دقیقه',
    difficulty: 'hard',
    category: 'memory',
  },
];

export function getGameBySlug(slug: string): GameCatalogItem | undefined {
  return GAMES_CATALOG.find((game) => game.slug === slug);
}

export function isGameSlug(value: string): value is GameSlug {
  return GAMES_CATALOG.some((game) => game.slug === value);
}
