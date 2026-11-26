'use client';

import { useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useFinishGame } from '../useFinishGame';

const FACES = ['🔵', '🟢', '🟣', '🟡', '🔴', '⚪', '⬛', '🔶'];

type Tile = { id: number; face: string; open: boolean; done: boolean };

function shuffleTiles(): Tile[] {
  const faces = [...FACES, ...FACES].sort(() => Math.random() - 0.5);
  return faces.map((face, id) => ({ id, face, open: false, done: false }));
}

export default function MemoryGame() {
  const finish = useFinishGame();
  const [tiles, setTiles] = useState<Tile[]>(() => shuffleTiles());
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const doneCount = useMemo(() => tiles.filter((tile) => tile.done).length, [tiles]);

  const onPick = (id: number) => {
    const tile = tiles[id];
    if (!tile || tile.open || tile.done || picked.length === 2) return;

    const nextTiles = tiles.map((item) => (item.id === id ? { ...item, open: true } : item));
    const nextPicked = [...picked, id];
    setTiles(nextTiles);

    if (nextPicked.length < 2) {
      setPicked(nextPicked);
      return;
    }

    setMoves((value) => value + 1);
    const [firstId, secondId] = nextPicked;
    const first = nextTiles[firstId];
    const second = nextTiles[secondId];

    if (first.face === second.face) {
      const matched = nextTiles.map((item) => (item.face === first.face ? { ...item, done: true } : item));
      setTiles(matched);
      setPicked([]);
      if (matched.every((item) => item.done)) {
        const score = Math.max(10, 100 - (moves + 1) * 4);
        finish({ slug: 'memory', title: 'حافظه کارت‌ها', score, detail: `${moves + 1} حرکت` });
      }
      return;
    }

    setPicked(nextPicked);
    window.setTimeout(() => {
      setTiles((current) => current.map((item) => (item.done ? item : { ...item, open: false })));
      setPicked([]);
    }, 700);
  };

  return (
    <div>
      <div className="flex justify-between text-sm text-[#637381] mb-3">
        <span>حرکت: {moves}</span>
        <span>جفت: {doneCount / 2} از ۸</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => onPick(tile.id)}
            className={`h-16 rounded-xl border text-2xl ${
              tile.open || tile.done ? 'bg-white border-[#1758BA]' : 'bg-[#F7F7FF] border-[#E8E8E8]'
            }`}>
            {tile.open || tile.done ? tile.face : ''}
          </button>
        ))}
      </div>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          setTiles(shuffleTiles());
          setPicked([]);
          setMoves(0);
        }}
        sx={{ mt: 2, borderRadius: '12px' }}>
        از نو
      </Button>
    </div>
  );
}
