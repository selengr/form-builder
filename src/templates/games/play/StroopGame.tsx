'use client';

import { useMemo, useState } from 'react';
import { useFinishGame } from '../useFinishGame';

const COLORS = [
  { key: 'blue', label: 'آبی', className: 'text-[#1758BA]' },
  { key: 'green', label: 'سبز', className: 'text-[#0f766e]' },
  { key: 'red', label: 'قرمز', className: 'text-[#C62828]' },
  { key: 'amber', label: 'نارنجی', className: 'text-[#ED6C02]' },
] as const;

type ColorKey = (typeof COLORS)[number]['key'];

function nextTrial() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  let ink = COLORS[Math.floor(Math.random() * COLORS.length)];
  if (ink.key === word.key) {
    ink = COLORS[(COLORS.findIndex((item) => item.key === ink.key) + 1) % COLORS.length];
  }
  return { word, ink };
}

export default function StroopGame() {
  const finish = useFinishGame();
  const [trial, setTrial] = useState(nextTrial);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const remaining = 12 - index;

  const options = useMemo(() => COLORS, []);

  const choose = (key: ColorKey) => {
    const isCorrect = key === trial.ink.key;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextIndex = index + 1;
    if (nextIndex >= 12) {
      finish({
        slug: 'stroop',
        title: 'آزمون استروپ',
        score: Math.round((nextCorrect / 12) * 100),
        detail: `${nextCorrect} پاسخ درست از ۱۲`,
      });
      return;
    }
    setCorrect(nextCorrect);
    setIndex(nextIndex);
    setTrial(nextTrial());
  };

  return (
    <div>
      <p className="text-sm text-[#637381] mb-2">رنگ نوشته را انتخاب کنید، نه معنی کلمه را.</p>
      <p className="text-sm mb-4">باقی‌مانده: {remaining}</p>
      <div className="h-28 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-center mb-4">
        <span className={`text-4xl font-black ${trial.ink.className}`}>{trial.word.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => choose(item.key)}
            className="h-12 rounded-xl border border-[#E8E8E8] bg-[#F7F7FF] font-bold">
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
