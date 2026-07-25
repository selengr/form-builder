'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, SxProps, Theme, useMediaQuery } from '@mui/material';

import CreateCalculatorDialog from './CreateCalculatorDialog';

const buttonSx: SxProps<Theme> = {
  height: 52,
  width: '100%',
  marginTop: '10px',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  justifyContent: 'center',
  color: '#6F6F6F',
  cursor: 'pointer',
  fontSize: { xs: 12, md: 14 },
  border: '1px dashed #DDE1E6',
  '&:hover': {
    backgroundColor: '#F7F7FF',
  },
};

const buttonSxDisabled: SxProps<Theme> = {
  ...buttonSx,
  border: "none"
};

const CreateCalculator = ({ isCreateMode }: { isCreateMode: boolean }) => {
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

  if (!isCreateMode) {
    return (
      <Button variant="text" fullWidth sx={buttonSxDisabled}>
        منتشر شده
      </Button>
    )
  }

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
