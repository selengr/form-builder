'use client';

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '@mui/material';

interface BuilderLoadErrorStateProps {
  message: string;
  backHref: string;
  backLabel?: string;
  className?: string;
}

export default function BuilderLoadErrorState({
  message,
  backHref,
  backLabel = 'بازگشت',
  className,
}: BuilderLoadErrorStateProps) {
  return (
    <div
      dir="rtl"
      className={clsx(
        'h-full w-full overflow-hidden flex items-center justify-center px-4',
        className,
      )}
    >
      <div className="w-full max-w-xl rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <Image
          src="/images/home-page/notfound-meh.svg"
          alt=""
          width={180}
          height={120}
          className="shrink-0 opacity-90 w-[140px] h-auto md:w-[180px]"
          draggable={false}
          priority
        />

        <div className="flex flex-col items-center md:items-start gap-4 flex-1 min-w-0 w-full text-center md:text-right">
          <p className="text-[15px] font-semibold text-[#393939]">خطا در بارگذاری</p>

          <p className="text-red-600 text-[15px] font-bold leading-relaxed break-words w-full">
            {message}
          </p>

          <Button
            variant="contained"
            sx={{
              borderRadius: '12px',
              height: '48px',
              px: '24px',
              fontWeight: 600,
              backgroundColor: '#1758BA',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#134a9e' },
            }}
          >
            <Link href={backHref} className="text-white text-sm no-underline">
              {backLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
