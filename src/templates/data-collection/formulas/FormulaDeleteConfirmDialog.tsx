'use client';

import { Button, CircularProgress } from '@mui/material';
import ConfirmDialog from '@/components/confirm-dialog';

interface FormulaDeleteConfirmDialogProps {
  open: boolean;
  content: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function FormulaDeleteConfirmDialog({ open, content, loading, onClose, onConfirm }: FormulaDeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      title="حذف"
      content={content}
      open={open}
      loading={loading}
      onClose={() => {
        if (!loading) onClose();
      }}
      cancelText="انصراف"
      action={
        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          sx={{
            height: '45px',
            fontWeight: '400',
            fontSize: '15px',
            borderRadius: '12px',
            boxShadow: 'none',
            bgcolor: '#FA4D56',
            '&:hover': { bgcolor: '#C6394D', boxShadow: 'none' },
            '&:active': { bgcolor: '#A32A3A' },
          }}>
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" style={{ marginLeft: 10 }} />
              در حال حذف…
            </>
          ) : (
            'حذف'
          )}
        </Button>
      }
    />
  );
}
