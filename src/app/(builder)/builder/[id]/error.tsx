'use client';

import { useSearchParams } from 'next/navigation';
import { getBuilderBackConfig } from './builderBackConfig';
import BuilderLoadErrorState from '@/components/builder/BuilderLoadErrorState';

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
    <BuilderLoadErrorState
      message={displayMessage}
      backHref={back.href}
      backLabel={back.label}
    />
  );
}