'use client';

import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useFinishGame } from '../useFinishGame';

function makeSequence(length: number) {
  return Array.from({ length }, () => String(Math.floor(Math.random() * 9) + 1)).join('');
}

export default function DigitSpanGame() {
  const finish = useFinishGame();
  const [length, setLength] = useState(3);
  const [sequence, setSequence] = useState(() => makeSequence(3));
  const [shown, setShown] = useState(true);
  const [value, setValue] = useState('');
  const [best, setBest] = useState(0);

  useEffect(() => {
    setShown(true);
    const timer = window.setTimeout(() => setShown(false), 900 + length * 350);
    return () => window.clearTimeout(timer);
  }, [sequence, length]);

  const submit = () => {
    if (value === sequence) {
      const nextLength = length + 1;
      setBest(length);
      if (nextLength > 8) {
        finish({ slug: 'digit-span', title: 'ظرفیت اعداد', score: 100, detail: 'تا ۸ رقم درست بود' });
        return;
      }
      setLength(nextLength);
      setSequence(makeSequence(nextLength));
      setValue('');
      return;
    }

    finish({
      slug: 'digit-span',
      title: 'ظرفیت اعداد',
      score: Math.min(100, best * 12),
      detail: best > 0 ? `بیشترین طول درست: ${best}` : 'هیچ دنباله‌ای کامل نشد',
    });
  };

  return (
    <div>
      <p className="text-sm text-[#637381] mb-3">اعداد را ببینید، بعد همان را وارد کنید.</p>
      <div className="h-24 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-center mb-4">
        <span dir="ltr" className="text-3xl font-black tracking-[0.4em] text-[#1758BA]">
          {shown ? sequence : '؟'}
        </span>
      </div>
      <TextField
        fullWidth
        dir="ltr"
        disabled={shown}
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/\D/g, ''))}
        placeholder="اعداد"
        inputProps={{ inputMode: 'numeric', style: { textAlign: 'center', fontSize: 22, letterSpacing: 6 } }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />
      <Button
        fullWidth
        disabled={shown || value.length === 0}
        variant="contained"
        disableElevation
        onClick={submit}
        sx={{ mt: 2, height: 48, borderRadius: '12px', bgcolor: '#1758BA' }}>
        بررسی
      </Button>
    </div>
  );
}
