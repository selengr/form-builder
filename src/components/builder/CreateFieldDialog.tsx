'use client';

import { memo, useCallback, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import { IconButton, useMediaQuery } from '@mui/material';
import { CgClose } from 'react-icons/cg';
import { ImSpinner2 } from 'react-icons/im';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useOpenDialog from '@/hooks/useOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useQuestionLoading from '@/hooks/useQuestionLoading';
import useSelectedElement from '@/hooks/useSelectedElement';
import { ElementsType, FormElements } from '@/types/FormElements';
import { FIELD_DIALOG_FOOTER_ID } from '@/constants/fieldDialog';
import PropertiesFormSidebar from './PropertiesFormSidebar';

function useFieldDialogTitle() {
  const selectedElement = useSelectedElement();

  return useMemo(() => {
    const fieldElement = selectedElement?.fieldElement;
    if (!fieldElement?.questionType) return '';

    const questionType = fieldElement.questionType as ElementsType;
    const fieldLabel = FormElements[questionType].designerBtnElement.label;

    if (questionType === 'INFO_FIELD') return fieldLabel;
    if (questionType === 'PACKAGE_INJECTION_FIELD') return fieldLabel;
    return `سوال ${fieldLabel}`;
  }, [selectedElement]);
}

const CreateFieldDialogLoading = memo(function CreateFieldDialogLoading({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <>
      <div
        dir="ltr"
        className="relative flex shrink-0 items-center justify-center px-4 py-3 min-h-[56px] bg-white"
      >
        <IconButton
          onClick={onClose}
          aria-label="بستن"
          sx={{
            position: 'absolute',
            right: 12,
            top: 30,
            transform: 'translateY(-50%)',
            p: 0.5,
          }}
        >
          <CgClose color="#404040" size="1.4rem" />
        </IconButton>
      </div>

      <div dir="rtl" className="flex flex-1 items-center justify-center w-full min-h-[280px]">
        <ImSpinner2 className="animate-spin h-12 w-12 text-[#1758BA]" />
      </div>
    </>
  );
});

const CreateFieldDialogBody = memo(function CreateFieldDialogBody({
  onClose,
}: {
  onClose: () => void;
}) {
  const dialogTitle = useFieldDialogTitle();

  return (
    <>
      <div
        dir="ltr"
        className="relative flex shrink-0 items-center justify-center px-4 py-3 min-h-[56px] bg-white"
      >
        <IconButton
          onClick={onClose}
          aria-label="بستن"
          sx={{
            position: 'absolute',
            right: 12,
            top: 30,
            transform: 'translateY(-50%)',
            p: 0.5,
          }}
        >
          <CgClose color="#404040" size="1.4rem" />
        </IconButton>
        {dialogTitle && (
          <h2 className="text-[18px] font-bold text-[#404040] px-10 pt-10 text-center truncate">
            {dialogTitle}
          </h2>
        )}
      </div>

      <div dir="rtl" className="flex flex-1 flex-col min-h-0 overflow-hidden bg-white">
        <div
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pt-2 pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          <PropertiesFormSidebar />
        </div>

        <div id={FIELD_DIALOG_FOOTER_ID} className="shrink-0 bg-white px-[80px] font-medium gap-6 pt-4 pb-6" />
      </div>
    </>
  );
});

const CreateFieldDialog = memo(function CreateFieldDialog() {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const setOpenDialog = useActionOpenDialog();
  const openDialog = useOpenDialog();
  const questionLoading = useQuestionLoading();
  const setSelectedElement = useActionSelectedElement();

  const handleClose = useCallback(() => {
    setOpenDialog((prev) => !prev);
    setSelectedElement(null);
  }, [setOpenDialog, setSelectedElement]);

  return (
    <Dialog
      open={openDialog}
      dir="ltr"
      fullScreen={!isDesktop}
      onClose={handleClose}
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          m: '10px',
          borderRadius: '24px',
          width: isDesktop ? 480 : '100%',
          maxWidth: isDesktop ? 480 : '100%',
          height: isDesktop ? 680 : 650,
          maxHeight: isDesktop ? 'min(680px, 75dvh)' : '70dvh',
        },
      }}
    >
      {openDialog &&
        (questionLoading ? (
          <CreateFieldDialogLoading onClose={handleClose} />
        ) : (
          <CreateFieldDialogBody onClose={handleClose} />
        ))}
    </Dialog>
  );
});

export default CreateFieldDialog;