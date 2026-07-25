'use client';
import { useState } from 'react';
import { Button, SxProps, Theme } from '@mui/material';
// view
import CreateConditionDialog from './CreateConditionDialog';

const buttonSx: SxProps<Theme> = {
  height: 52,
  minHeight: 52,
  width: '100%',
  display: 'flex',
  color: '#6F6F6F',
  cursor: 'pointer',
  marginTop: '10px',
  borderRadius: '8px',
  marginBottom: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: {xs : 12 , md : 14},
  border: '1px dashed #DDE1E6',
  '&:hover': {
    backgroundColor: '#F7F7FF',
  },
};

const buttonSxDisabled: SxProps<Theme> = {
  ...buttonSx,
  border: "none"
};

const CreateCondition = ({ isCreateMode }: { isCreateMode: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);

  if (!isCreateMode) {
    return (
      <Button variant="text" fullWidth sx={buttonSxDisabled}>
        منتشر شده#
      </Button>
    )
  }

  return (
    <>
      <Button variant='text' onClick={() => setOpen(true)} fullWidth sx={buttonSx}>
        ایجاد شرط
      </Button>
      <CreateConditionDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCondition;
