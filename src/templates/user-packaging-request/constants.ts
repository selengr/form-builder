export type PackagingRequestStatus =
  | 'WAITING_FOR_PROCESS'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'REVISION'
  // | 'PUBLISH';

export const packagingRequestStatusLabels: Record<PackagingRequestStatus, string> = {
  WAITING_FOR_PROCESS: 'در انتظار بررسی',
  ACCEPTED: 'تایید شده',
  REJECTED: 'رد شده',
  REVISION: 'نیاز به اصلاح',
  // PUBLISH: 'منتشر شده',
};

export const packagingRequestStatusStyles: Record<
  PackagingRequestStatus,
  { backgroundColor: string; color: string }
> = {
  WAITING_FOR_PROCESS: { backgroundColor: '#FFF4E5', color: '#B45309' },
  ACCEPTED: { backgroundColor: '#E8FAF0', color: '#15803D' },
  REJECTED: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
  REVISION: { backgroundColor: '#FCE7F3', color: '#BE185D' },
  // PUBLISH: { backgroundColor: '#ECFAFF', color: '#1758BA' },
};

const defaultStatusStyle = { backgroundColor: '#F7F7FF', color: '#393939' };

export function getPackagingRequestStatusLabel(status?: string) {
  if (!status) return '—';
  return (
    packagingRequestStatusLabels[status as PackagingRequestStatus] ?? status
  );
}

export function getPackagingRequestStatusStyle(status?: string) {
  if (!status) return defaultStatusStyle;
  return (
    packagingRequestStatusStyles[status as PackagingRequestStatus] ?? defaultStatusStyle
  );
}

/** Keep user/admin packaging request lists in sync when status changes elsewhere. */
export const PACKAGING_REQUEST_LIST_REFETCH_OPTIONS = {
  refetchInterval: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;
