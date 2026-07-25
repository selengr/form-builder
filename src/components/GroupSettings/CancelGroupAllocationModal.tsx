'use client';

import React, { memo } from 'react';
import { CgClose } from 'react-icons/cg';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import MemberSettings from './MemberSettings';

interface CancelGroupAllocationModalProps {
  openCancelGroupAllocationDialog: boolean;
  handleClose: () => void;
  groupId: number | null;
  formId: string | number;
  formData: {
    isCreatedSoloReport: boolean | null;
  };
}

const dialogSx = {
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '& .MuiPaper-root': {
    borderRadius: '24px',
    margin: '10px',
    width: '100%',
    maxWidth: '600px',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
  },
};

const contentSx = {
  maxHeight: '75vh',
  scrollbarWidth: 'thin',
  px: 1,
  pt: 0,
  pb: 0,
  display: 'flex',
  flexDirection: 'column',
};

const CancelGroupAllocationModal = ({
  openCancelGroupAllocationDialog,
  handleClose,
  groupId,
  formId,
  formData,
}: CancelGroupAllocationModalProps) => {
  return (
    <Dialog
      open={openCancelGroupAllocationDialog}
      onClose={handleClose}
      aria-labelledby="cancel-group-allocation-title"
      dir="ltr"
      sx={dialogSx}
    >
      <Box display="flex" alignItems="center" justifyContent="flex-start" px={2} pt={2}>
        <IconButton onClick={handleClose} aria-label="close dialog">
          <CgClose color="#404040" size="1.5rem" />
        </IconButton>
      </Box>

      <DialogContent dir="rtl" sx={contentSx}>
        <Box display="flex" justifyContent="center" alignItems="baseline">
          <Typography
            id="cancel-group-allocation-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
            textAlign="center"
          >
            انتخاب اعضای پایگاه داده ۱
          </Typography>
        </Box>

        <MemberSettings
          groupId={groupId}
          handleClose={handleClose}
          formId={formId}
          formData={formData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(CancelGroupAllocationModal);
