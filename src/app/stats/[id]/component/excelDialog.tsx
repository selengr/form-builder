'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import Image from 'next/image';
import TrashIcon from '@/../public/images/home-page/trash.svg';
import { UserType } from '@/app/stats/[id]/component/ReportPagination';

interface Props {
  open: boolean;
  onClose: () => void;
  savedUsers: UserType[];
  onDeleteUser: (takePartId: number) => void;
  onDownload: () => void;
}

export function ExcelDialog({ open, onClose, savedUsers, onDeleteUser, onDownload }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      dir='rtl'
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '20px',
          margin: '10px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <DialogTitle sx={{ pb: 2, fontWeight: '700', textAlign: 'center' }}>لیست کاربران انتخاب‌شده</DialogTitle>

      <DialogContent dividers>
        {savedUsers.length === 0 ? (
          <Typography align='center' color='text.secondary'>
            کاربری انتخاب نشده است.
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflowY: 'auto' }} color={'primary'}>
            {savedUsers.map((user, idx) => (
              <ListItem
                className='p-2 rounded-lg mt-2 bg-[#F7F7FF] hover:bg-[#FAFAFF] transition-all'
                key={user.takePartId}
                secondaryAction={
                  <IconButton edge='end' onClick={() => onDeleteUser(user.takePartId)} color='error'>
                    <Image src={TrashIcon} alt='delete' width={24} height={24} />
                  </IconButton>
                }>
                <ListItemText primary={`${idx + 1}. ${user.name}`} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          gap: 3,
          width: '100%',
          marginTop: 1,
          marginBottom: 2,
          paddingX: '30px',
        }}>
        <Button
          onClick={onDownload}
          disabled={savedUsers.length === 0}
          fullWidth
          variant='contained'
          disableElevation
          color='primary'
          sx={{
            height: '52px',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: '12px',
          }}>
          دانلود اکسل
        </Button>

        <Button
          onClick={onClose}
          fullWidth
          color='inherit'
          variant='outlined'
          sx={{
            height: '52px',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: '12px',
            color: '#1758BA',
            borderColor: '#1758BA',
          }}>
          انصراف
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExcelDialog;
