'use client';

import GamePlayShell from './GamePlayShell';
import DigitSpanGame from './play/DigitSpanGame';
import MemoryGame from './play/MemoryGame';
import ReactionGame from './play/ReactionGame';
import SequenceGame from './play/SequenceGame';
import StroopGame from './play/StroopGame';
import VisualSearchGame from './play/VisualSearchGame';
import type { GameCatalogItem } from './types';

const PLAYERS = {
  memory: MemoryGame,
  reaction: ReactionGame,
  stroop: StroopGame,
  'digit-span': DigitSpanGame,
  'visual-search': VisualSearchGame,
  sequence: SequenceGame,
} as const;

export default function GamePlay({ game }: { game: GameCatalogItem }) {
  const Player = PLAYERS[game.slug];

  return (
    <GamePlayShell title={game.title} slug={game.slug}>
      <Player />
    </GamePlayShell>
  );
}
