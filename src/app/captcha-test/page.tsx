'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { MdCheck, MdRefresh } from 'react-icons/md';

const IMAGE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const IMAGE_LENGTH = 5;
const PRIMARY = '#1758BA';

function randomChars(source: string, length: number) {
  return Array.from({ length }, () => source[Math.floor(Math.random() * source.length)]).join('');
}

function paintImageCaptcha(canvas: HTMLCanvasElement, code: string) {
  const dpr = window.devicePixelRatio || 1;
  const width = 280;
  const height = 92;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#eef4ff');
  bg.addColorStop(1, '#e7fbf7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = `rgba(23, 88, 186, ${0.08 + Math.random() * 0.18})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(23, 88, 186, ${Math.random() * 0.35})`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const step = width / (code.length + 1);
  code.split('').forEach((char, index) => {
    const x = step * (index + 0.7);
    const y = 52 + (Math.random() * 16 - 8);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.55);
    ctx.font = `bold ${32 + Math.floor(Math.random() * 8)}px Tahoma, Arial, sans-serif`;
    ctx.fillStyle = Math.random() > 0.5 ? PRIMARY : '#0f766e';
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  for (let i = 0; i < 7; i++) {
    ctx.strokeStyle = `rgba(23, 88, 186, ${0.28 + Math.random() * 0.35})`;
    ctx.lineWidth = 1.2 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 10 + Math.random() * (height - 20));
    ctx.bezierCurveTo(
      width * 0.3,
      Math.random() * height,
      width * 0.7,
      Math.random() * height,
      width,
      10 + Math.random() * (height - 20),
    );
    ctx.stroke();
  }

  for (let i = 0; i < 35; i++) {
    ctx.fillStyle = `rgba(15, 118, 110, ${0.15 + Math.random() * 0.35})`;
    ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
  }
}

function paintMathCaptcha(canvas: HTMLCanvasElement, question: string) {
  const dpr = window.devicePixelRatio || 1;
  const width = 220;
  const height = 80;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#f4f6f8';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = 'rgba(99, 115, 129, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * height);
    ctx.lineTo(width, Math.random() * height);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(width / 2, height / 2 + 8);
  ctx.rotate((Math.random() - 0.5) * 0.12);
  ctx.font = 'bold 28px Tahoma, Arial, sans-serif';
  ctx.fillStyle = PRIMARY;
  ctx.textAlign = 'center';
  ctx.fillText(question, 0, 0);
  ctx.restore();
}

function Card({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid #DFE3E8',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 320,
      }}>
      <Box>
        <Typography fontWeight={700} fontSize='1.05rem'>
          {title}
        </Typography>
        <Typography color='#637381' fontSize='0.85rem' mt={0.5}>
          {hint}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
}

function ImageCaptchaSample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(IMAGE_LENGTH).fill(''));
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const refresh = useCallback(() => {
    const next = randomChars(IMAGE_CHARS, IMAGE_LENGTH);
    setCode(next);
    setDigits(Array(IMAGE_LENGTH).fill(''));
    setStatus('idle');
    requestAnimationFrame(() => {
      if (canvasRef.current) paintImageCaptcha(canvasRef.current, next);
      inputRefs.current[0]?.focus();
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/[^a-zA-Z0-9]/g, '').slice(-1).toUpperCase();
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setStatus('idle');
    if (char && index < IMAGE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submit = () => {
    const typed = digits.join('');
    if (typed.length < IMAGE_LENGTH) {
      toast.error('همه خانه‌ها را پر کنید');
      return;
    }
    if (typed === code) {
      setStatus('ok');
      toast.success('کد تصویر درست بود');
    } else {
      setStatus('err');
      toast.error('کد تصویر نادرست است');
      refresh();
    }
  };

  return (
    <Card title='کپچای تصویری' hint='حروف و اعداد تصویر را در خانه‌ها وارد کنید.'>
      <Box display='flex' alignItems='center' gap={1}>
        <Box
          dir='ltr'
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #C4CDD5',
            bgcolor: '#fff',
          }}>
          <canvas ref={canvasRef} aria-label='تصویر کپچا' />
        </Box>
        <Button onClick={refresh} color='inherit' sx={{ minWidth: 44, height: 44, borderRadius: '12px' }}>
          <MdRefresh size={22} />
        </Button>
      </Box>

      <Box dir='ltr' display='flex' gap={1} justifyContent='flex-start'>
        {digits.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            inputProps={{
              maxLength: 1,
              'aria-label': `کاراکتر ${index + 1}`,
              style: { textAlign: 'center', fontSize: 20, fontWeight: 700, padding: '12px 0' },
            }}
            sx={{ width: 48, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        ))}
      </Box>

      <Button variant='contained' onClick={submit} startIcon={<MdCheck />} sx={{ borderRadius: '12px', py: 1.1 }}>
        تأیید
      </Button>
      {status !== 'idle' && (
        <Typography color={status === 'ok' ? 'success.main' : 'error.main'} fontSize='0.9rem'>
          {status === 'ok' ? 'درست' : 'نادرست — تصویر عوض شد'}
        </Typography>
      )}
    </Card>
  );
}

function MathCaptchaSample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [answer, setAnswer] = useState<number>(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const refresh = useCallback(() => {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    const useMinus = Math.random() > 0.55 && a >= b;
    const question = useMinus ? `${a} - ${b} = ?` : `${a} + ${b} = ?`;
    setAnswer(useMinus ? a - b : a + b);
    setValue('');
    setStatus('idle');
    requestAnimationFrame(() => {
      if (canvasRef.current) paintMathCaptcha(canvasRef.current, question);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = () => {
    if (value.trim() === '') {
      toast.error('پاسخ را وارد کنید');
      return;
    }
    if (Number(value) === answer) {
      setStatus('ok');
      toast.success('پاسخ ریاضی درست بود');
    } else {
      setStatus('err');
      toast.error('پاسخ نادرست است');
      refresh();
    }
  };

  return (
    <Card title='کپچای ریاضی' hint='حاصل تصویر را در یک ورودی بنویسید.'>
      <Box display='flex' alignItems='center' gap={1}>
        <Box dir='ltr' sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #C4CDD5', bgcolor: '#fff' }}>
          <canvas ref={canvasRef} aria-label='سؤال ریاضی کپچا' />
        </Box>
        <Button onClick={refresh} color='inherit' sx={{ minWidth: 44, height: 44, borderRadius: '12px' }}>
          <MdRefresh size={22} />
        </Button>
      </Box>
      <TextField
        dir='ltr'
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/[^\d-]/g, ''));
          setStatus('idle');
        }}
        placeholder='پاسخ'
        inputProps={{ inputMode: 'numeric', style: { textAlign: 'center', fontSize: 18, fontWeight: 600 } }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />
      <Button variant='contained' onClick={submit} startIcon={<MdCheck />} sx={{ borderRadius: '12px', py: 1.1 }}>
        تأیید
      </Button>
      {status !== 'idle' && (
        <Typography color={status === 'ok' ? 'success.main' : 'error.main'} fontSize='0.9rem'>
          {status === 'ok' ? 'درست' : 'نادرست — سؤال عوض شد'}
        </Typography>
      )}
    </Card>
  );
}

function SliderCaptchaSample() {
  const trackId = useId();
  const [target, setTarget] = useState(70);
  const [value, setValue] = useState(0);
  const [locked, setLocked] = useState(false);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    setTarget(55 + Math.floor(Math.random() * 35));
    setValue(0);
    setLocked(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const setFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track || locked) return;
    const rect = track.getBoundingClientRect();
    const next = Math.round(((rect.right - clientX) / rect.width) * 100);
    setValue(Math.min(100, Math.max(0, next)));
  };

  const finish = (current: number) => {
    if (Math.abs(current - target) <= 3) {
      setValue(target);
      setLocked(true);
      toast.success('اسلایدر درست بود');
    }
  };

  return (
    <Card title='کپچای اسلایدر' hint='دکمه را بکشید تا روی خط‌چین قرار بگیرد.'>
      <Box
        ref={trackRef}
        id={trackId}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          setFromClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          const rect = trackRef.current?.getBoundingClientRect();
          if (!rect) return;
          const current = Math.round(((rect.right - e.clientX) / rect.width) * 100);
          finish(Math.min(100, Math.max(0, current)));
        }}
        sx={{
          position: 'relative',
          height: 52,
          borderRadius: '14px',
          bgcolor: locked ? '#e7fbf7' : '#F4F6F8',
          border: '1px solid #C4CDD5',
          cursor: locked ? 'default' : 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 6,
            bottom: 6,
            width: 4,
            bgcolor: PRIMARY,
            borderRadius: 1,
            right: `calc(${target}% - 2px)`,
            opacity: 0.55,
            border: '1px dashed #1758BA',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 6,
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: locked ? '#2CDFC9' : PRIMARY,
            right: `calc(${value}% - 20px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(23,88,186,0.25)',
          }}>
          {locked ? '✓' : '↔'}
        </Box>
      </Box>
      <Button variant='outlined' onClick={refresh} startIcon={<MdRefresh />} sx={{ borderRadius: '12px', py: 1.1 }}>
        از نو
      </Button>
      <Typography fontSize='0.9rem' color={locked ? 'success.main' : '#637381'}>
        {locked ? 'درست' : 'هنوز کامل نشده'}
      </Typography>
    </Card>
  );
}

export default function CaptchaTestPage() {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant='h5' fontWeight={800} mb={0.5}>
        صفحه تست کپچا
      </Typography>
      <Typography color='#637381' mb={3} fontSize='0.95rem'>
        سه نمونه بدون کتابخانه اضافه. این صفحه فقط برای آزمایش است و اعتبارسنجی واقعی سمت سرور ندارد.
      </Typography>
      <Box
        display='grid'
        gap={2}
        sx={{
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
        }}>
        <ImageCaptchaSample />
        <MathCaptchaSample />
        <SliderCaptchaSample />
      </Box>
    </Box>
  );
}
