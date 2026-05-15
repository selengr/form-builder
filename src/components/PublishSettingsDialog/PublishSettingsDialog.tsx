'use client';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import PublishSettingsTabValue from './PublishSettingsTabValue';

interface PublishSettingsDialogProps {
  formId: string;
  formData: any;
}

export default function PublishSettingsDialog({ formId , formData }: PublishSettingsDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpen = useCallback(() => {
    setIsAnimating(true);
    setOpenDialog((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 150);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          height: '40px',
          width: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:active::before': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
        }}
        aria-label='تنظیمات انتشار'>
        <IoSettingsOutline 
          color='#2A2A2A'
          style={{
            transition: 'all 0.15s cubic-bezier(0.34, 1.2, 0.64, 1)',
            transform: isAnimating ? 'rotate(90deg) scale(1.08)' : 'rotate(0deg) scale(1)',
          }}
        />
      </IconButton>
      <Dialog
        open={openDialog}
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
            transition: 'transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.2s ease',
            transform: openDialog ? 'scale(1)' : 'scale(0.96)',
            opacity: openDialog ? 1 : 0,
          },
          '& .MuiDialog-container': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'hsl(0deg 0% 100% / 50%)',
            transition: 'opacity 0.2s ease',
          },
        }}>
        <Box className='flex items-center justify-start' sx={{ p: 2, pb : 0 }}>
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
               paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box className='flex justify-center items-baseline' sx={{ mb: 2 }}>
            <Typography variant='h6' component='p' fontWeight='bold' textAlign='center'>
              تنظیمات انتشار
            </Typography>
          </Box>
          <PublishSettingsTabValue handleOpen={handleOpen} formId={formId} formData={formData} />
        </DialogContent>
      </Dialog>
    </>
  );
}