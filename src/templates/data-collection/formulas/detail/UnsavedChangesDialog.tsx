'use client';

import { CgClose } from 'react-icons/cg';
import { LuSave } from 'react-icons/lu';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';

interface UnsavedChangesDialogProps {
  open: boolean;
  loading: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export default function UnsavedChangesDialog({ open, loading, onStay, onDiscard, onSave }: UnsavedChangesDialogProps) {
  const handleStay = () => {
    if (loading) return;
    onStay();
  };

  return (
    <Dialog
      open={open}
      onClose={handleStay}
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
        <IconButton aria-label="بستن" disabled={loading} onClick={handleStay} sx={{ m: 1, mt: 1.5 }}>
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
          <LuSave size={34} color="#1758BA" strokeWidth={2.25} />
        </Box>

        <Typography fontSize="18px" fontWeight={700} color="#161616" mb={2}>
          تغییرات ذخیره نشده
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
            محاسبه‌ای که ساخته‌اید هنوز ذخیره نشده و با خروج از این صفحه از بین می‌رود.
          </Typography>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed #DDE1E6' }}>
            <Typography fontSize="13px" fontWeight={600} color="#1758BA">
              قبل از خروج ذخیره شود؟
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={loading}
            onClick={onDiscard}
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
            خروج بدون ذخیره
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            disabled={loading}
            onClick={onSave}
            sx={{
              height: '50px',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.92, boxShadow: 'none' },
            }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'ذخیره و خروج'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
