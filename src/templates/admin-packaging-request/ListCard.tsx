'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, IconButton } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
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
    <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm w-full">
      {/* {!canProcess && ( */}
        <Box sx={{ position: 'absolute', top: 11, right: 13 }}>
          <IconButton
            color="primary"
            onClick={() => router.push(`/admin-packaging-request/${data.id}/view`)}
            sx={{ padding: 1 }}>
            <CodiconEye style={{ width: 28, height: 28 }} />
          </IconButton>
        </Box>
      {/* )} */}

      <InfoRow label="عنوان" value={data.name} bold className='max-w-[90%]'/>
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
            height: '40px',
            borderRadius: '12px',
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
