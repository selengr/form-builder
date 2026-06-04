'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface StartFromContinueDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onStartNew: () => void;
}

export const StartFromContinueDialog = ({
  open,
  onClose,
  onConfirm,
  onStartNew,
}: StartFromContinueDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="start-from-continue-dialog-title"
      aria-describedby="start-from-continue-dialog-description"
    >
      <DialogTitle id="start-from-continue-dialog-title">
        ادامه از پاسخ‌های قبلی
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="start-from-continue-dialog-description">
          شما قبلاً شروع به پاسخگویی به این فرم کرده‌اید.
          آیا می‌خواهید از جایی که متوقف شده‌اید ادامه دهید یا از ابتدا شروع کنید؟
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStartNew} color="secondary">
          شروع از ابتدا
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          ادامه از پاسخ‌های قبلی
        </Button>
      </DialogActions>
    </Dialog>
  );
};