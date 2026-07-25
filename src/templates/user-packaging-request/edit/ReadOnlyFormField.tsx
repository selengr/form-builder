'use client';

import { Box, Typography } from '@mui/material';

interface ReadOnlyFormFieldProps {
  label: string;
  value?: string | null;
}

export default function ReadOnlyFormField({ label, value }: ReadOnlyFormFieldProps) {
  return (
    <Box display="flex" flexDirection="column" gap="6px" width="100%">
      <Typography variant="subtitle2" fontWeight={700}>
        {label}
      </Typography>
      <Box
        sx={{
          width: '100%',
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderRadius: '10px',
          bgcolor: '#F7F7FF',
          border: '1px solid #DDE1E6',
        }}>
        <Typography fontSize={14} fontWeight={600} color="#393939">
          {value?.trim() ? value : '—'}
        </Typography>
      </Box>
    </Box>
  );
}
