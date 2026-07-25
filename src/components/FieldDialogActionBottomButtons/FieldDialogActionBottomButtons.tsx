'use client';

import { memo, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop, Button } from '@mui/material';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import {
  FIELD_DIALOG_FOOTER_ID,
  FIELD_PROPERTIES_FORM_ID,
} from '@/constants/fieldDialog';

const FieldDialogActionBottomButtons = memo(function FieldDialogActionBottomButtons({
  status,
}: {
  status: boolean;
}) {
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const [footerEl, setFooterEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setFooterEl(document.getElementById(FIELD_DIALOG_FOOTER_ID));
  }, []);

  const buttons = (
    <>
      <div className="flex gap-4 w-full">
        <Button
          type="submit"
          form={FIELD_PROPERTIES_FORM_ID}
          fullWidth
          variant="contained"
          loading={status}
          disabled={status}
          disableRipple
          sx={{
            bgcolor: '#1758BA',
            height: '50px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '500',
            borderRadius: '10px',
            boxShadow: 'none',
            '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
              bgcolor: '#1758BA',
              boxShadow: 'none',
            },
          }}
        >
          ثبت
        </Button>
        <Button
          disabled={status}
          type="button"
          fullWidth
          className="text-[15px] text-[#1758BA]"
          sx={{
            height: '50px',
            fontWeight: '500',
            borderRadius: '10px',
            fontSize: '15px',
            color: '#1758BA',
            borderColor: '#1758BA',
            bgcolor: 'white',
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'transparent',
              boxShadow: 'none',
              color: '#1758BA',
            },
          }}
          variant="outlined"
          onClick={() => {
            if (status) return;
            setOpenDialog(false);
            setSelectedElement(null);
          }}
        >
          انصراف
        </Button>
      </div>
      {status && (
        <Backdrop
          sx={(theme) => ({
            color: 'transparent',
            zIndex: theme.zIndex.drawer + 1,
            '&.MuiBackdrop-root': {
              bgcolor: 'transparent',
            },
          })}
          open={status}
        />
      )}
    </>
  );

  if (footerEl) return createPortal(buttons, footerEl);
  return null;
});

export default FieldDialogActionBottomButtons;
