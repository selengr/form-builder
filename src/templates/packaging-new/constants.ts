export type PackagingListType = 'PACKAGING' | 'PACKAGING_REQUESTE' | string;

export type PackagingStatus = 'WAIT_FOR_CREATE' | 'CREATE' | string;

export const PACKAGING_REQUEST_TYPE = 'PACKAGING_REQUESTE';

export const packagingStatusLabels: Record<string, string> = {
  WAIT_FOR_CREATE: 'در انتظار ساخت',
  CREATE: 'ایجاد شده',
};

const defaultStatusStyle = { backgroundColor: '#F7F7FF', color: '#393939' };

export const packagingStatusStyles: Record<string, { backgroundColor: string; color: string }> = {
  WAIT_FOR_CREATE: { backgroundColor: '#FFF4E5', color: '#B45309' },
  CREATE: { backgroundColor: '#F7F7FF', color: '#393939' },
  FINAL: { backgroundColor: '#F7F7FF', color: '#393939' }
};

export function isPackagingRequestItem(type?: string) {
  return type === PACKAGING_REQUEST_TYPE || type === 'PACKAGING_REQUEST';
}

export function getPackagingRequestViewId(item: {
  id: number;
  packagingRequestId?: number;
}) {
  return item.packagingRequestId ?? item.id;
}

export function getPackagingStatusLabel(status?: string) {
  if (!status) return '—';
  if (status === 'WAIT_FOR_CREATE') return packagingStatusLabels.WAIT_FOR_CREATE;
  if (status === 'CREATE') return packagingStatusLabels.CREATE;
  return 'نهایی';
}

export function getPackagingStatusStyle(status?: string) {
  if (!status) return defaultStatusStyle;
  if (status === 'WAIT_FOR_CREATE') return packagingStatusStyles.WAIT_FOR_CREATE;
  if (status === 'CREATE') return packagingStatusStyles.CREATE;
  return packagingStatusStyles.FINAL;
}
