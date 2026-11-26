'use client';

import { useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useFinishGame } from '../useFinishGame';

type Phase = 'idle' | 'wait' | 'go' | 'early';

export default function ReactionGame() {
  const finish = useFinishGame();
  const [phase, setPhase] = useState<Phase>('idle');
  const [times, setTimes] = useState<number[]>([]);
  const startedAt = useRef(0);
  const timer = useRef<number>(0);

  const arm = () => {
    setPhase('wait');
    const delay = 900 + Math.random() * 1800;
    timer.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setPhase('go');
    }, delay);
  };

  const tap = () => {
    if (phase === 'wait') {
      window.clearTimeout(timer.current);
      setPhase('early');
      return;
    }
    if (phase !== 'go') return;
    const elapsed = Math.round(performance.now() - startedAt.current);
    const next = [...times, elapsed];
    setTimes(next);
    if (next.length >= 5) {
      const average = Math.round(next.reduce((sum, item) => sum + item, 0) / next.length);
      finish({
        slug: 'reaction',
        title: 'زمان واکنش',
        score: Math.max(10, 100 - Math.round(average / 8)),
        detail: `میانگین ${average} میلی‌ثانیه`,
      });
      return;
    }
    setPhase('idle');
  };

  const color =
    phase === 'go' ? 'bg-[#2CDFC9]' : phase === 'wait' ? 'bg-[#F4F6F8]' : phase === 'early' ? 'bg-[#FFE4E4]' : 'bg-[#F7F7FF]';
  const label =
    phase === 'go'
      ? 'حالا!'
      : phase === 'wait'
        ? 'صبر کنید...'
        : phase === 'early'
          ? 'زود بود'
          : times.length === 0
            ? 'برای شروع لمس کنید'
            : `دور ${times.length + 1} از ۵`;

  return (
    <div>
      <p className="text-sm text-[#637381] mb-3">۵ واکنش پشت‌سرهم گرفته می‌شود.</p>
      <button
        type="button"
        onClick={phase === 'idle' || phase === 'early' ? arm : tap}
        className={`w-full h-48 rounded-2xl border border-[#E8E8E8] text-lg font-bold ${color}`}>
        {label}
      </button>
      {times.length > 0 && (
        <p className="text-sm text-[#393939] mt-3">زمان‌ها: {times.join('، ')} میلی‌ثانیه</p>
      )}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          window.clearTimeout(timer.current);
          setTimes([]);
          setPhase('idle');
        }}
        sx={{ mt: 2, borderRadius: '12px' }}>
        از نو
      </Button>
    </div>
  );
}
