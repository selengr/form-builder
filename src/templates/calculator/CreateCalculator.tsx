'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, SxProps, Theme, useMediaQuery } from '@mui/material';
// view
import CreateCalculatorDialog from './CreateCalculatorDialog';

const buttonSx: SxProps<Theme> = {
  height: 52,
  minHeight: 52,
  width: '100%',
  display: 'flex',
  color: '#6F6F6F',
  cursor: 'pointer',
  marginTop: '10px',
  marginBottom: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed #DDE1E6',
  '&:hover': {
    backgroundColor: '#F7F7FF',
  },
};

const CreateCalculator = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  const handleCreationsCalc = () => {
    if (isDesktop) {
      setOpen(true)
    } else {
      push(`/builder/${id}/calculator/create`)
    }
  }

  return (
    <>
      <Button variant='text' onClick={handleCreationsCalc} fullWidth sx={buttonSx}>
        ایجاد محاسبه‌گر
      </Button>
      <CreateCalculatorDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCalculator;
