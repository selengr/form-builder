'use client';

import { Box, Button, Typography } from '@mui/material';

const SAMPLE_FILE_PATH = '/sample-ownership.docx';
const SAMPLE_FILE_NAME = 'نمونه-فایل-مالکیت.docx';

export default function OwnershipSampleDownload() {
  const downloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = SAMPLE_FILE_PATH;
    link.download = SAMPLE_FILE_NAME;
    link.click();
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '10px',
        border: '1px dashed #1758BA',
        bgcolor: '#fff',
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.25,
      }}>
      <Typography
        fontSize={{ xs: '12px', sm: '13px' }}
        color="#393939"
        lineHeight={1.8}
        fontWeight={500}
        sx={{ width: '100%', textAlign: 'left' }}>
        در صورت مشارکت دیگران، لطفاً فایل نمونه را دانلود کرده، تکمیل کنید و در بخش مدارک
        بارگذاری نمایید.
      </Typography>

      <Button
        type="button"
        variant="contained"
        disableElevation
        onClick={downloadSampleFile}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
            />
          </svg>
        }
        sx={{
          alignSelf: { xs: 'stretch', sm: 'center' },
          fontSize: { xs: '12px', sm: '13px' },
          fontWeight: 700,
          borderRadius: '8px',
          bgcolor: '#1758BA',
          height: 40,
          px: 2,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#216ee1', boxShadow: 'none' },
        }}>
        دانلود فایل نمونه
      </Button>
    </Box>
  );
}
