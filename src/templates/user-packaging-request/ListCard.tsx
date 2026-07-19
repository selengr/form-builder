'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import {
  getPackagingRequestStatusLabel,
  getPackagingRequestStatusStyle,
} from './constants';
import { PackagingRequestListItem } from './types';

export default function PackagingRequestListCard({
  data,
}: UnifiedListGridCardProps<PackagingRequestListItem>) {
  const router = useRouter();
  const statusStyle = getPackagingRequestStatusStyle(data.status);

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm w-full">
      <IconButton
        color="primary"
        onClick={() => router.push(`/user-packaging-request/${data.id}/edit`)}
        sx={{ position: 'absolute', top: 12, right: 12, padding: 0 }}>
        <Image src={EditIcon} alt="edit" width={24} height={24} />
      </IconButton>

      <InfoRow label="نام" value={data.name} bold />
      <InfoRow
        label="وضعیت"
        value={
          <span
            className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{
              backgroundColor: statusStyle.backgroundColor,
              color: statusStyle.color,
            }}>
            {getPackagingRequestStatusLabel(data.status)}
          </span>
        }
      />
    </div>
  );
}
