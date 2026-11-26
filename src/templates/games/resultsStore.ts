import type { GameResultRecord } from './types';

const HISTORY_KEY = 'psya_games_history';
const LAST_RESULT_KEY = 'psya_games_last_result';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getGameHistory(): GameResultRecord[] {
  return readJson<GameResultRecord[]>(HISTORY_KEY, []);
}

export function getLastGameResult(): GameResultRecord | null {
  return readJson<GameResultRecord | null>(LAST_RESULT_KEY, null);
}

export function saveGameResult(record: Omit<GameResultRecord, 'id' | 'playedAt'>): GameResultRecord {
  const full: GameResultRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playedAt: new Date().toISOString(),
  };

  const history = [full, ...getGameHistory()].slice(0, 30);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  window.localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(full));
  return full;
}
