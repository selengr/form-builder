'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, SxProps, Theme, useMediaQuery } from '@mui/material';

import CreateCalculatorDialog from './CreateCalculatorDialog';

const buttonSx: SxProps<Theme> = {
  height: 52,
  width: '100%',
  marginTop: '10px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6F6F6F',
  cursor: 'pointer',
  border: '1px dashed #DDE1E6',
  '&:hover': {
    backgroundColor: '#F7F7FF',
  },
};

const CreateCalculator = () => {
  const router = useRouter();
  const { id } = useParams();
  const isDesktop = useMediaQuery('(min-width:768px)');
  const [open, setOpen] = useState(false);

  const handleCreateCalculator = () => {
    if (isDesktop) {
      setOpen(true);
    } else {
      router.push(`/builder/${id}/calculator/create`);
    }
  };

  return (
    <>
      <Button variant="text" onClick={handleCreateCalculator} fullWidth sx={buttonSx}>
        ایجاد محاسبه‌گر
      </Button>

      <CreateCalculatorDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCalculator;
