'use client';

import { useEffect, useState } from 'react';
import { useFinishGame } from '../useFinishGame';

const PADS = ['#1758BA', '#2CDFC9', '#ED6C02', '#7C4DFF'];

function nextStep(current: number[]) {
  return [...current, Math.floor(Math.random() * PADS.length)];
}

export default function SequenceGame() {
  const finish = useFinishGame();
  const [pattern, setPattern] = useState<number[]>(() => nextStep([]));
  const [lit, setLit] = useState<number | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [locked, setLocked] = useState(true);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLocked(true);
    setInput([]);
    const play = async () => {
      for (const pad of pattern) {
        if (cancelled) return;
        setLit(pad);
        await new Promise((resolve) => setTimeout(resolve, 420));
        setLit(null);
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
      if (!cancelled) setLocked(false);
    };
    void play();
    return () => {
      cancelled = true;
    };
  }, [pattern]);

  const press = (index: number) => {
    if (locked) return;
    const next = [...input, index];
    if (pattern[next.length - 1] !== index) {
      finish({
        slug: 'sequence',
        title: 'ترتیب حافظه',
        score: Math.min(100, (level - 1) * 16),
        detail: `تا سطح ${level - 1} پیش رفتید`,
      });
      return;
    }
    if (next.length === pattern.length) {
      if (level >= 6) {
        finish({ slug: 'sequence', title: 'ترتیب حافظه', score: 100, detail: 'هر ۶ سطح کامل شد' });
        return;
      }
      setLevel(level + 1);
      setPattern(nextStep(pattern));
      return;
    }
    setInput(next);
  };

  return (
    <div>
      <p className="text-sm text-[#637381] mb-2">همان ترتیبی که روشن شد را لمس کنید.</p>
      <p className="text-sm mb-3">سطح {level} از ۶ {locked ? '— در حال نمایش' : '— نوبت شما'}</p>
      <div className="grid grid-cols-2 gap-3">
        {PADS.map((color, index) => (
          <button
            key={color}
            type="button"
            onClick={() => press(index)}
            className="h-24 rounded-2xl border border-[#E8E8E8]"
            style={{ backgroundColor: color, opacity: lit === index ? 1 : 0.35 }}
          />
        ))}
      </div>
    </div>
  );
}
