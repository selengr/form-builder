'use client';

import { Box, Typography } from '@mui/material';

export default function DocumentUploadTips() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#F7F7FF',
        borderRadius: '10px',
        px: 1.5,
        py: 1,
        mb: 1,
      }}>
      <Typography
        component="p"
        fontSize="12px"
        fontWeight={600}
        color="#393939"
        lineHeight={1.7}
        sx={{ display: 'flex', gap: 0.5 }}>
        <Box component="span" flexShrink={0}>
          •
        </Box>
        <span>آپلود اسناد زیر ضروری است:</span>
      </Typography>
      <Typography
        component="p"
        fontSize="12px"
        fontWeight={500}
        color="#393939"
        lineHeight={1.7}
        mt={0.5}
        sx={{ display: 'flex', gap: 0.5 }}>
        <Box component="span" flexShrink={0}>
          •
        </Box>
        <span>
          فایل سند انتشار قطعی ابزار (برای مثال مقاله علمی معتبر)؛ سند پرسشنامه با فرمت .docx؛
          سند شیوه نمره‌گذاری، شروط و محاسبات
        </span>
      </Typography>
    </Box>
  );
}
