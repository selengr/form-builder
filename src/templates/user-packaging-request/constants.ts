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

export function getPackagingRequestStatusLabel(status?: string) {
  if (!status) return '—';
  return (
    packagingRequestStatusLabels[status as PackagingRequestStatus] ?? status
  );
}
