'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import MresalatDialog from './MresalatDialog';

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        نمایش امرسالت
      </Button>

      <MresalatDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}