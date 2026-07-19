'use client';

import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import EditPackagingRequestForm from './EditPackagingRequestForm';

interface EditPackagingRequestPageContentProps {
  requestId: number;
}

export default function EditPackagingRequestPageContent({
  requestId,
}: EditPackagingRequestPageContentProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 'calc(100vh - 60px)', md: 'calc(100vh - 16px)' },
        bgcolor: 'white',
        borderRadius: '16px',
        mx: { xs: 0, sm: 1 },
        my: { xs: 0, sm: 1 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          width: '100%',
          flexShrink: 0,
          px: { xs: 1, sm: 2 },
          pt: 2,
          pb: 1,
        }}>
        <Box
          className="relative flex h-[52px] w-full items-center justify-center rounded-lg bg-[#F7F7FF] px-2"
          dir="rtl">
          <IconButton
            sx={{ position: 'absolute', left: '8px' }}
            onClick={() => router.push('/user-packaging-request')}>
            <MdOutlineKeyboardArrowRight color="#292D32" />
          </IconButton>
          <Typography fontSize={16} fontWeight={700} color="#161616">
            ویرایش درخواست آنلاین سازی آزمون
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <EditPackagingRequestForm requestId={requestId} />
      </Box>
    </Box>
  );
}
