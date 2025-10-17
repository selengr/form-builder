'use client';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { CgClose } from 'react-icons/cg';


interface ICancelGroupAllocationModalProps {
  openCancelGroupAllocationDialog: boolean;
  setOpenCancelGroupAllocationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: number | null;
}

export const CancelGroupAllocationModal: React.FC<ICancelGroupAllocationModalProps> = ({
  openCancelGroupAllocationDialog,
  setOpenCancelGroupAllocationDialog,
  groupId,
}) => {
  const handleClose = () => {
    setOpenCancelGroupAllocationDialog(false);
  };

  return (
    <Dialog open={openCancelGroupAllocationDialog} onClose={handleClose}>
      <Box p={3}>
        <Typography variant="h6">لغو تخصیص گروه</Typography>
        <Typography mt={2}>
          آیا از لغو تخصیص گروه با شناسه {groupId} اطمینان دارید؟
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button onClick={handleClose}>انصراف</Button>
          <Button variant="contained" color="error">
            تایید
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};


export const CancelGroupAllocationModal: React.FC<ICancelGroupAllocationModalProps> = ({
  openCancelGroupAllocationDialog,
  setOpenCancelGroupAllocationDialog,
}) => {
  

    
        const handleOpen = () => {
            setOpenCancelGroupAllocationDialog((prev) => !prev);
        };

  return (
    <>

      <Dialog
        open={openCancelGroupAllocationDialog}
        onClose={handleOpen}
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
        <Box className='flex items-center justify-start' sx={{ p: 2 }}>
          <IconButton onClick={handleOpen} aria-label='بستن'>
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
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box className='flex justify-center items-baseline' sx={{ mb: 3, pt: 1 }}>
            <Typography variant='h6' component='p' fontWeight='bold' textAlign='center'>
              تنظیمات انتشار
            </Typography>
          </Box>
          {/* <PublishSettingsTabValue handleOpen={handleOpen} formId={formId} formData={formData} /> */}
        </DialogContent>
      </Dialog> 
    </>
  )
}

