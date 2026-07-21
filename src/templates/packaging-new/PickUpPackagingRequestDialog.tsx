'use client';

import { CgClose } from 'react-icons/cg';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { usePickUpPackagingRequest } from './hooks/usePickUpPackagingRequest';

interface PickUpPackagingRequestDialogProps {
  open: boolean;
  packageId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PickUpPackagingRequestDialog({
  open,
  packageId,
  onClose,
  onSuccess,
}: PickUpPackagingRequestDialogProps) {
  const { mutate, isPending } = usePickUpPackagingRequest({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const handleConfirm = () => {
    if (!packageId) return;
    mutate(packageId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="ltr"
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          borderRadius: '24px',
          margin: '10px',
          width: '100%',
          maxWidth: '520px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <Box className="flex items-center justify-start" sx={{ px: 2, pt: 2 }}>
        <IconButton onClick={onClose} aria-label="بستن" disabled={isPending}>
          <CgClose color="#404040" size="1.5rem" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 3, pt: 0 }}>
        <Typography
          fontSize={{ xs: 15, sm: 16 }}
          fontWeight={600}
          color="#161616"
          lineHeight={1.9}
          textAlign="center"
          sx={{ px: 1, mb: 3 }}>
          با شروع فرایند ساخت فرم برای این درخواست، ادمین دیگری نمی‌تواند روی این فرم ویرایش انجام
          دهد، مطمئن هستید؟
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={isPending}
            onClick={onClose}
            sx={{
              height: '50px',
              fontWeight: 600,
              fontSize: '15px',
              borderRadius: '10px',
              color: '#1758BA',
              borderColor: '#1758BA',
              bgcolor: 'white',
              '&:hover': { bgcolor: 'white' },
            }}>
            انصراف
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            disabled={isPending || !packageId}
            onClick={handleConfirm}
            sx={{
              height: '50px',
              fontWeight: 600,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.9 },
            }}>
            {isPending ? <CircularProgress size={22} color="inherit" /> : 'بله، ادامه'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
