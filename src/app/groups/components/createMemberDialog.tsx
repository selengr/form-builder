'use client';

import AddMember from './addMember';
import { CgClose } from 'react-icons/cg';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

interface ICancelGroupAllocationModalProps {
  showCreateMemberDialog: boolean;
  groupId: number;
  groupName: string;
  handleOpen: () => void;
}

export const CancelGroupAllocationModal: React.FC<ICancelGroupAllocationModalProps> = ({
  showCreateMemberDialog,
  groupId,
  groupName,
  handleOpen
}) => {

  return (
    <>
      <Dialog
        open={showCreateMemberDialog}
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
        <Box className='flex items-center justify-start' sx={{ px: 2, pt: 2 }}>
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
          <Box className='flex justify-center items-baseline'>
            <Typography variant='h6' component='p' fontWeight='bold' textAlign='center'>
              افزودن عضو به گروه {groupName}
            </Typography>
          </Box>
          <AddMember handleOpen={handleOpen} groupId={groupId} />
        </DialogContent>
      </Dialog>
    </>
  )
}

