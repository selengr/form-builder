'use client';

import { CgClose } from 'react-icons/cg';
import { LuClipboardCheck } from 'react-icons/lu';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';

interface CreatePackagingRequestConfirmDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CreatePackagingRequestConfirmDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: CreatePackagingRequestConfirmDialogProps) {
  const handleClose = () => {
    if (loading) return;
    onClose();
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
          disabled={loading}
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
            bgcolor: '#EEF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}>
          <LuClipboardCheck size={34} color="#1758BA" strokeWidth={2.25} />
        </Box>

        <Typography fontSize="18px" fontWeight={700} color="#161616" mb={2}>
          تأیید ثبت درخواست
        </Typography>

        <Box
          sx={{
            width: '100%',
            bgcolor: '#F7F7FF',
            borderRadius: '16px',
            px: 2.5,
            py: 2,
            mb: 3,
            textAlign: 'left',
          }}>
          <Typography fontSize="14px" fontWeight={700} color="#161616" mb={1}>
            توجه
          </Typography>
          <Typography fontSize="14px" fontWeight={500} color="#393939" lineHeight={1.9}>
            پس از ثبت درخواست، امکان ویرایش آن وجود نخواهد داشت.
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed #DDE1E6',
            }}>
            <Typography fontSize="13px" fontWeight={600} color="#1758BA">
              آیا از ثبت این درخواست مطمئن هستید؟
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={loading}
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
            disabled={loading}
            onClick={onConfirm}
            sx={{
              height: '50px',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.92, boxShadow: 'none' },
            }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'بله، ثبت درخواست'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
