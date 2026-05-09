'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ConfirmDialogProps } from './types';

export default function ConfirmDialog({ title, content, action, open, onClose, cancelText = 'نه، منصرف شدم', cancelStatus = true, loading = false, ...other }: ConfirmDialogProps) {
  return (
    <Dialog
      fullWidth
      dir='rtl'
      maxWidth='xs'
      open={open}
      {...other}
      sx={{
        '& .MuiPaper-root': {
          m: 1.5,
          borderRadius: '20px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsla(0, 0%, 100%, 0.5)',
        },
      }}>
      <DialogTitle sx={{ pb: 2, fontWeight: 700 }}>{title}</DialogTitle>

      {content && (
        <DialogContent>
          <Typography fontWeight={700} variant='body2'>
            {content}
          </Typography>
        </DialogContent>
      )}

      <DialogActions
        sx={{
          display: 'flex',
          gap: 2,
          width: '100%',
          mt: 1,
          mb: 2,
          px: 3,
        }}>
        {action}
        {cancelStatus && (
          <Button
            disabled={loading}
            onClick={onClose}
            fullWidth
            variant='outlined'
            disableRipple
            sx={{
              height: 50    ,
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 2,
              borderColor: '#1758BA',
              color: '#1758BA',
              '&:hover': {
                borderColor: '#1758BA',
              },
            }}>
            {cancelText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
