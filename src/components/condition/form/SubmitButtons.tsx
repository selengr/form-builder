'use client';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface ISubmitButtonsProps {
  isLoading: boolean;
  isDisabled?: boolean;
  handleClose: () => void;
}

export const SubmitButtons: React.FC<ISubmitButtonsProps> = ({ isLoading,isDisabled, handleClose }) => {
  return (
    <Box
      display='flex'
      gap={2}
      width='100%'
      marginBottom={2}
      marginTop={5}
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Button
        disabled={isLoading || isDisabled}
        type='submit'
        variant='contained'
        sx={{
          backgroundColor: '#1758BA',
          borderRadius: '8px',
          height: '50px',
          '&.MuiButtonBase-root:hover': {
            backgroundColor: '#1758BA',
          },
          minWidth: 113,
        }}>
        <Typography variant='body2' component={'p'} py={0.5} sx={{ color: '#fff', fontWeight: 500 }}>
          {isLoading ? (
            <>
              <CircularProgress size={20} color='inherit' thickness={5} style={{ marginLeft: 10 }} />
              در حال ارسال…
            </>
          ) : (
            'تایید'
          )}
        </Typography>
      </Button>
      <Button
        onClick={handleClose}
        type='button'
        variant='outlined'
        sx={{
          height: '50px',
          minWidth: 113,
          borderRadius: '8px',
          borderColor: '#1758BA',
          background: '#F7F7FF',
        }}>
        <Typography variant='body2' component={'p'} py={0.5} color={'#1758BA'} sx={{ fontWeight: 500 }}>
          انصراف
        </Typography>
      </Button>
    </Box>
  );
};
