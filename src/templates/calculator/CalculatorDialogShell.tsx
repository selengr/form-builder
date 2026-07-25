'use client';

import { ReactNode } from 'react';
import { CgClose } from 'react-icons/cg';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';

const StyledDialogContent = styled(DialogContent)({
  direction: 'rtl',
  maxHeight: '90vh',
  scrollbarWidth: 'thin',
  maxWidth: '100%',
  padding: '20px 24px 24px',
  overflowX: 'hidden',
});

const StyledDialog = styled(Dialog)({
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '& .MuiPaper-root': {
    borderRadius: '24px',
    margin: '10px',
    width: '100%',
    maxWidth: '900px',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
  },
});

interface CalculatorDialogShellProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CalculatorDialogShell({
  open,
  onClose,
  children,
}: CalculatorDialogShellProps) {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogContent>
        <div className="relative flex items-center justify-center mb-5 min-h-[32px]">
          <IconButton
            onClick={onClose}
            aria-label="بستن"
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              p: 0.5,
            }}
          >
            <CgClose color="#404040" size="1.4rem" fontWeight={"bold"}/>
          </IconButton>
          <h2 className="text-[16px] font-bold text-[#404040]">محاسبه‌گر</h2>
        </div>
        {children}
      </StyledDialogContent>
    </StyledDialog>
  );
}
