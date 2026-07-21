'use client';

import { CgClose } from 'react-icons/cg';
import { LuHammer } from 'react-icons/lu';
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
  packageName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PickUpPackagingRequestDialog({
  open,
  packageId,
  packageName,
  onClose,
  onSuccess,
}: PickUpPackagingRequestDialogProps) {
  const { mutate, isPending } = usePickUpPackagingRequest({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!packageId) return;
    mutate(packageId);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      dir="ltr"
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          borderRadius: '24px',
          margin: '10px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <IconButton
          aria-label="بستن"
          disabled={isPending}
          onClick={handleClose}
          sx={{ m: 1, mt: 1.5 }}>
          <CgClose color="#404040" size="1.5rem" />
        </IconButton>
      </Box>

      <DialogContent
        dir="rtl"
        sx={{
          px: 3,
          pt: 0,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            bgcolor: '#FFF4E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}>
          <LuHammer size={34} color="#B45309" strokeWidth={2.25} />
        </Box>

        <Typography fontSize="18px" fontWeight={700} color="#161616" mb={0.5}>
          شروع فرایند ساخت
        </Typography>

        {packageName?.trim() && (
          <Typography fontSize="14px" fontWeight={600} color="#1758BA" mb={2}>
            {packageName}
          </Typography>
        )}

        <Box
          sx={{
            width: '100%',
            bgcolor: '#F7F7FF',
            borderRadius: '16px',
            px: 2.5,
            py: 2,
            mb: 3,
            textAlign: 'right',
          }}>
          <Typography fontSize="14px" fontWeight={700} color="#161616" mb={1}>
            توجه
          </Typography>
          <Typography fontSize="14px" fontWeight={500} color="#393939" lineHeight={1.9}>
            با شروع فرایند ساخت فرم برای این درخواست، ادمین دیگری نمی‌تواند روی این فرم ویرایش
            انجام دهد.
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed #DDE1E6',
            }}>
            <Typography fontSize="13px" fontWeight={600} color="#B45309">
              آیا از ادامه فرایند مطمئن هستید؟
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={isPending}
            onClick={handleClose}
            sx={{
              height: '50px',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              color: '#1758BA',
              borderColor: '#1758BA',
              bgcolor: 'white',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'white', boxShadow: 'none' },
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
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.92, boxShadow: 'none' },
            }}>
            {isPending ? <CircularProgress size={22} color="inherit" /> : 'بله، ادامه'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
