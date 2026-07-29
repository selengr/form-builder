'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, IconButton } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
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
  const canEdit = data.status === 'REVISION';

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm w-full">
      <Box
        sx={{
          position: 'absolute',
          top: 11,
          right: 15,
          display: 'flex',
          alignItems: 'center',
          gap: .5,
        }}>
             {canEdit && (
          <IconButton
            color="primary"
            onClick={() => router.push(`/user-packaging-request/${data.id}/edit`)}
            sx={{ padding: 1 }}>
            <Image src={EditIcon} alt="edit" width={24} height={24} />
          </IconButton>
        )}
      {!canEdit && (
        <IconButton
          color="primary"
          onClick={() => router.push(`/user-packaging-request/${data.id}/view`)}
          sx={{ padding: 1 }}>
          <CodiconEye style={{ width: 28, height: 28 }} />
        </IconButton>
        )}
     
      </Box>

      <InfoRow label="نام" value={data.name} bold className='max-w-[90%]'/>
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
