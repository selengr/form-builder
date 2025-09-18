'use client';

import { Box, Typography } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  placeholder: string;
  formValue: string;
  error: boolean;
  helperText: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LoginWithPhone({
  open,
  onClose,
  label,
  placeholder,
  formValue,
  error,
  helperText,
  onChange,
  onSubmit,
}: Props) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      dir='rtl'
      maxWidth='xs'
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          margin: '10px',
          borderRadius: '20px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <DialogTitle sx={{ pb: 2, fontWeight: '700', textAlign: 'center' }}> شماره موبایل </DialogTitle>
      <DialogContent dividers>
        <Box display='flex' flexDirection='column' gap={1} width='100%' py={4} maxWidth='600px'>
          <Box display='flex' justifyContent='space-between' width='100%'>
            {/* <Typography sx={{ marginRight: '25px', fontWeight: 600 }}>{label}</Typography> */}
          </Box>

          <TextField
            placeholder={placeholder}
            type={'tel'}
            value={formValue}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            helperText={helperText}
            fullWidth
            inputProps={{
              ...({
                maxLength: 11,
                pattern: '[0-9]*',
                onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                },
              }),
            }}
          />

          <Typography variant='subtitle2' sx={{ fontSize: 12, fontWeight: 500 }}>
            لطفاً {label} خود را برای ادامه وارد کنید
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          gap: 3,
          width: '100%',
          marginTop: 1,
          marginBottom: 2,
          paddingX: '30px',
        }}>
        <Button
          onClick={onSubmit}
          fullWidth
          variant='contained'
          disableElevation
          color='primary'
          sx={{
            marginX: '0 !important',
            height: '52px',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: '12px',
            borderColor: '#1758BA',
          }}>
          تایید
        </Button>

        <Button
          onClick={onClose}
          fullWidth
          color='inherit'
          variant='outlined'
          sx={{
            marginX: '0 !important',
            height: '52px',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: '12px',
            color: '#1758BA',
            borderColor: '#1758BA',
          }}>
          انصراف
        </Button>
      </DialogActions>
    </Dialog>
  );
}
