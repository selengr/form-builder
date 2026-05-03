'use client';
import { CgClose } from 'react-icons/cg';
import { useCallback, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import FormProvider, { RHFTextField } from '@/components/hook-form';

const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const inputFieldContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  paddingX: 0.5,
};

export default function PackagingSettingsDialog() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  
    const handleOpen = () => {
      setOpenDialog((prev) => !prev);
    }


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
        }}
        aria-label='تنظیمات بسته'>
        <IoSettingsOutline color='#2A2A2A' />
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
          },
          '& .MuiDialog-container': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'hsl(0deg 0% 100% / 50%)',
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
                 تنظیمات بسته
            </Typography>
          </Box>
        




  <Box sx={{ position: "relative" }}>
      <FormProvider methods={methods} onSubmit={() => preSubmit(event)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            bgcolor: '#F7F7FF',
            borderRadius: '8px',
            padding: 2,
            marginY: 2,
            gap: 1,
            direction: 'ltr',
          }}>
          <Box display='flex' gap={1} width='100%'>
            <Box sx={inputFieldContainerSx}>
              <Typography variant='subtitle2' fontWeight='700'>
                نام بسته:
              </Typography>
              <RHFTextField sx={textFieldCommonSx} name='name' fullWidth />
            </Box>
            <Box sx={inputFieldContainerSx}>
              <Typography variant='subtitle2' fontWeight='700'>
                  ضریب قیمت:
              </Typography>
              <RHFTextField sx={textFieldCommonSx} name='family' fullWidth />
            </Box>
          </Box>

          
          </Box>
          </Box>
        
   

        <Box sx={{
          position: "sticky",
          bottom: '0px',
          background: "#FFF",
          paddingY: "10px"
        }}
          pr={1} pl={2}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              paddingX: '16px',
              width: '100%',
              marginTop: '24px',
              marginBottom: '16px',
            }}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={isSubmitting || !isValid && removedMember.length === 0}
              sx={{
                bgcolor: '#1758BA',
                height: '54px',
                color: 'white',
                fontSize: {
                  xs: '13px',
                  sm: '16px',
                },
                fontWeight: '700',
                borderRadius: '10px',
                boxShadow: 'none',
                '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                  bgcolor: '#1758BA',
                  boxShadow: 'none',
                },
              }}>
              {buttonLabel()}
            </Button>
            <Button
              disabled={isSubmitting}
              type='button'
              fullWidth
              sx={{
                height: '54px',
                fontWeight: '700',
                borderRadius: '10px',
                fontSize: '16px',
                color: '#1758BA',
                borderColor: '#1758BA',
                bgcolor: 'white',
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  color: '#1758BA',
                },
                '&.Mui-disabled': {
                  borderColor: '#d9d9d9',
                  color: '#b0b0b0',
                },
              }}
              variant='outlined'
              onClick={() => {
                handleOpen();
                reset();
              }}>
              بستن
            </Button>
          </Box>
        </Box>
     
      </FormProvider>
    </Box>




        </DialogContent>
      </Dialog>
    </>
  );
}
