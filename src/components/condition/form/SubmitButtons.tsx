'use client';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface ISubmitButtonsProps {
  isLoading: boolean;
  isDisabled?: boolean;
  handleClose: () => void;
}

export const SubmitButtons: React.FC<ISubmitButtonsProps> = ({
  isLoading,
  isDisabled,
  handleClose,
}) => {
  return (
    <Box
      display="flex"
      gap={2}
      width="100%"
      sx={{
        justifyContent: 'center',
        mt: 2,
        mb: 1,
      }}
    >
      <Button
        disabled={isLoading || isDisabled}
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#1758BA',
          borderRadius: '10px',
          height: '48px',
          minWidth: { xs: 120, md: 132 },
          boxShadow: 'none',
          '&:hover': { backgroundColor: '#134a9e' },
          '&.MuiButtonBase-root:hover': {
            backgroundColor: '#134a9e',
          },
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
        onClick={handleClose}
        type="button"
        variant="outlined"
        sx={{
          height: '48px',
          minWidth: { xs: 120, md: 132 },
          borderRadius: '10px',
          borderColor: '#1758BA',
          background: '#fff',
          '&:hover': {
            background: '#F7F7FF',
            borderColor: '#1758BA',
          },
        }}
      >
        <Typography variant="body2" color="#1758BA" sx={{ fontWeight: 600, fontSize: 14 }}>
          انصراف
        </Typography>
      </Button>
    </Box>
  );
};
