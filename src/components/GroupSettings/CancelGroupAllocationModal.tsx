'use client';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import MemberSettings from './MemberSettings';


interface ICancelGroupAllocationModalProps {
  openCancelGroupAllocationDialog: boolean;
  setOpenCancelGroupAllocationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: number | null;
   handleOpen: () => void;
  formId: string | number;
  formData: {
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
}

export const CancelGroupAllocationModal: React.FC<ICancelGroupAllocationModalProps> = ({
  openCancelGroupAllocationDialog,
  setOpenCancelGroupAllocationDialog,
  groupId,
   handleOpen, formId, formData
}) => {
    
  const handleClose = () => {
    setOpenCancelGroupAllocationDialog(false);
  };

  return (
    <>
    
      <Dialog
        open={openCancelGroupAllocationDialog}
        onClose={handleClose}
        dir='ltr'
        sx={{
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
        }}>
        <Box className='flex items-center justify-start' sx={{ px: 2, pt :2 }}>
          <IconButton onClick={handleClose} aria-label='بستن'>
            <CgClose color='#404040' size='1.5rem' />
          </IconButton>
        </Box>
        <DialogContent
          dir='rtl'
          sx={{
            maxHeight: '75vh',
            scrollbarWidth: 'thin',
            paddingX: 1,
            paddingTop: 0,
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box className='flex justify-center items-baseline'>
            <Typography variant='h6' component='p' fontWeight='bold' textAlign='center'>
                 انتخاب اعضای پایگاه داده ۱
            </Typography>
          </Box>
          {/* <PublishSettingsTabValue handleOpen={handleOpen} formId={formId} formData={formData} /> */}
          <MemberSettings groupId={groupId} handleClose={handleClose} formId={formId} formData={formData} />
        </DialogContent>
      </Dialog> 
    </>
  )
}

