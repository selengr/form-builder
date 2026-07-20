'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import {
  getPackagingRequestStatusLabel,
  getPackagingRequestStatusStyle,
} from '@/templates/user-packaging-request/constants';
import { PackagingRequestListItem } from '@/templates/user-packaging-request/types';

export default function AdminPackagingRequestListCard({
  data,
}: UnifiedListGridCardProps<PackagingRequestListItem>) {
  const router = useRouter();
  const statusStyle = getPackagingRequestStatusStyle(data.status);
  const canProcess = data.status === 'WAITING_FOR_PROCESS';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm w-full">
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

      {canProcess && (
        <Button
          type="button"
          variant="contained"
          disableElevation
          onClick={() => router.push(`/admin-packaging-request/${data.id}/process`)}
          sx={{
            mt: 0.5,
            height: '44px',
            borderRadius: '10px',
            bgcolor: '#1758BA',
            fontWeight: 700,
            fontSize: '14px',
            '&.MuiButtonBase-root:hover': { bgcolor: '#1758BA' },
          }}>
          رسیدگی به درخواست
        </Button>
      )}
    </div>
  );
}
