'use client';

import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import CreatePackagingRequestForm from '@/templates/user-packaging-request/create/CreatePackagingRequestForm';

const CONTENT_MAX_WIDTH = '470px';

export default function CreatePackagingRequestPageContent() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'white',
        borderRadius: '16px',
        mx: { xs: 0, sm: 1 },
        my: { xs: 0, sm: 2 },
        minHeight: { xs: 'calc(100vh - 60px)', md: 'calc(100vh - 16px)' },
        overflow: 'auto',
      }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          mx: 'auto',
          px: { xs: 1.5, sm: 2 },
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
        <Box
          className="relative flex h-[52px] w-full items-center justify-center rounded-lg bg-[#F7F7FF] px-2 shrink-0"
          dir="rtl">
          <IconButton
            sx={{ position: 'absolute', left: '8px' }}
            onClick={() => router.push('/user-packaging-request')}>
            <MdOutlineKeyboardArrowRight color="#292D32" />
          </IconButton>
          <Typography fontSize={16} fontWeight={700} color="#161616">
            ثبت درخواست بسته ارزیابی
          </Typography>
        </Box>

        <CreatePackagingRequestForm />
      </Box>
    </Box>
  );
}
