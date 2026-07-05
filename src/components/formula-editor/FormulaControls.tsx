'use client';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface ISubmitButtonsProps {
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const FormulaControls: React.FC<ISubmitButtonsProps> = ({ onSubmit, onCancel, isLoading }) => {
  return (
    <Box
      display="flex"
      gap={2}
      width="100%"
      sx={{ justifyContent: 'center', mt: 3, mb: 1 }}
    >
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={isLoading}
        sx={{
          backgroundColor: '#1758BA',
          fontWeight: 600,
          fontSize: 14,
          borderRadius: '12px',
          height: '48px',
          minWidth: { xs: 120, md: 132 },
          boxShadow: 'none',
          '&:hover': { backgroundColor: '#134a9e' },
        }}
      >
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
          {isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" thickness={5} style={{ marginLeft: 10 }} />
              در حال ارسال…
            </>
          ) : (
            'تایید'
          )}
        </Typography>
      </Button>

      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{
          height: '48px',
          minWidth: { xs: 120, md: 132 },
          fontWeight: 600,
          fontSize: 14,
          borderRadius: '12px',
          borderColor: '#1758BA',
          background: '#fff',
          '&:hover': { background: '#F7F7FF', borderColor: '#1758BA' },
        }}
      >
        <Typography variant="body2" color="#1758BA" sx={{ fontWeight: 600, fontSize: 14 }}>
          انصراف
        </Typography>
      </Button>
    </Box>
  );
};

export default FormulaControls;
