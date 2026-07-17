'use client';

import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { getPackagingRequestStatusLabel } from './constants';
import { PackagingRequestListItem } from './types';

export default function PackagingRequestListCard({
  data,
}: UnifiedListGridCardProps<PackagingRequestListItem>) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm w-full">
      <InfoRow label="نام" value={data.name} bold />
      <InfoRow label="وضعیت" value={getPackagingRequestStatusLabel(data.status)} bold />
    </div>
  );
}
