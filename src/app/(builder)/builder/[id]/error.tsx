'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@mui/material';
import { getBuilderBackConfig } from './builderBackConfig';

type BuilderErrorPageProps = {
  message?: string;
  backHref?: string;
  backLabel?: string;
  error?: Error & { digest?: string };
};

export default function BuilderErrorPage({
  message,
  backHref,
  backLabel,
  error,
}: BuilderErrorPageProps) {
  const searchParams = useSearchParams();
  const admin = searchParams.get('admin');

  const displayMessage =
    message || error?.message || 'انجام عملیات با خطا مواجه شد';

  const back = backHref
    ? { href: backHref, label: backLabel || 'بازگشت' }
    : getBuilderBackConfig(admin ?? undefined);

  return (
    <div className="min-h-[calc(100dvh-5rem)] md:min-h-[100dvh] w-full flex items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-6 p-10 rounded-3xl bg-white shadow-2xl shadow-gray-300 max-w-md w-full">
        <p className="text-red-600 text-lg font-bold text-center leading-relaxed">
          {displayMessage}
        </p>

        <Button
          variant="contained"
          sx={{
            borderRadius: '14px',
            height: '56px',
            px: '24px',
            fontWeight: 'bold',
            backgroundColor: '#2563eb',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1e40af',
            },
          }}>
          <Link href={back.href} className="text-white text-base no-underline">
            {back.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
