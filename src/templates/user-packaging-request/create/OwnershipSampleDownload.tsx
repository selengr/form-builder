'use client';

import { Box, Button, Typography } from '@mui/material';

export default function OwnershipSampleDownload() {
  const handleTestClick = () => {
    // Placeholder until the static Word sample file is provided.
  };

  return (
    <Box
      sx={{
        borderRadius: '10px',
        border: '1px dashed #DDE1E6',
        bgcolor: '#FAFAFA',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1.5,
      }}>
      <Typography fontSize={{ xs: '12px', sm: '13px' }} color="#666" lineHeight={1.8}>
        در صورت مشارکت دیگران، لطفاً فایل نمونه را دانلود کرده، تکمیل کنید و در بخش مدارک
        بارگذاری نمایید.
      </Typography>

      <Typography fontSize="13px" fontWeight={600} color="#1758BA">
        this is for test
      </Typography>

      <Button
        type="button"
        variant="contained"
        disableElevation
        onClick={handleTestClick}
        sx={{
          fontSize: { xs: '12px', sm: '13px' },
          fontWeight: 600,
          borderRadius: '8px',
          bgcolor: '#1758BA',
          px: 2,
          py: 1,
          '&:hover': { bgcolor: '#216ee1' },
        }}>
        دانلود فایل نمونه
      </Button>
    </Box>
  );
}
