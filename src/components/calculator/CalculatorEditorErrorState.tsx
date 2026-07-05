'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '@mui/material';

function getErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return undefined;
}

export interface CalculatorEditorErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  onClose?: () => void;
  closeLabel?: string;
  isRetrying?: boolean;
  className?: string;
  compact?: boolean;
}

const primaryBtnSx = {
  backgroundColor: '#1758BA',
  fontWeight: 600,
  fontSize: 14,
  borderRadius: '12px',
  height: 48,
  minWidth: 120,
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#134a9e' },
};

const outlinedBtnSx = {
  height: 48,
  minWidth: 120,
  fontWeight: 600,
  fontSize: 14,
  borderRadius: '12px',
  borderColor: '#1758BA',
  color: '#1758BA',
  background: '#fff',
  '&:hover': { background: '#F7F7FF', borderColor: '#1758BA' },
};

export default function CalculatorEditorErrorState({
  title = 'بارگیری محاسبه‌گر ناموفق بود',
  description = 'در دریافت اطلاعات محاسبه‌گر مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
  error,
  onRetry,
  onClose,
  closeLabel = 'انصراف',
  isRetrying = false,
  className,
  compact = false,
}: CalculatorEditorErrorStateProps) {
  const detail = getErrorMessage(error);

  return (
    <div
      dir="rtl"
      className={clsx(
        'flex flex-col items-center justify-center text-center w-full',
        compact ? 'py-8 px-4' : 'py-10 px-6 min-h-[360px]',
        className,
      )}
    >
      <div
        className={clsx(
          'flex flex-col items-center w-full max-w-[360px] rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] px-5',
          compact ? 'py-6 gap-4' : 'py-8 gap-5',
        )}
      >
        <Image
          src="/images/home-page/notfound-meh.svg"
          alt=""
          width={compact ? 120 : 160}
          height={compact ? 80 : 100}
          className="opacity-90"
          draggable={false}
        />

        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-[16px] font-bold text-[#161616]">{title}</h3>
          <p className="text-[13px] leading-6 text-[#6F6F6F]">{description}</p>
          {detail && (
            <p className="text-[12px] leading-5 text-[#9EA3AC] break-words mt-1 px-2">
              {detail}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
          {onRetry && (
            <Button
              variant="contained"
              onClick={onRetry}
              disabled={isRetrying}
              loading={isRetrying}
              sx={primaryBtnSx}
            >
              تلاش مجدد
            </Button>
          )}
          {onClose && (
            <Button variant="outlined" onClick={onClose} disabled={isRetrying} sx={outlinedBtnSx}>
              {closeLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
