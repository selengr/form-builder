'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { useUpdateMajorFormulaInfo } from './useUpdateMajorFormulaInfo';

const settingsSchema = z.object({
  majorName: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' })
        .max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }),
    ),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface MajorFormulaSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  majorId: string;
  majorName: string;
}

export default function MajorFormulaSettingsDialog({ open, onClose, majorId, majorName }: MajorFormulaSettingsDialogProps) {
  const { mutate: updateInfo, isPending } = useUpdateMajorFormulaInfo();

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'all',
    defaultValues: { majorName },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (open) reset({ majorName });
  }, [open, majorName, reset]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = (values: SettingsFormValues) => {
    updateInfo(
      { id: Number(majorId), majorName: values.majorName },
      {
        onSuccess: () => {
          toast.success('تنظیمات با موفقیت ثبت شد');
          onClose();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      dir="ltr"
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          borderRadius: '24px',
          margin: '10px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <div className="flex items-center justify-start">
        <button type="button" className="mx-4 mt-4 mb-0" onClick={handleClose} aria-label="بستن">
          <CgClose size="1.5rem" color="#404040" />
        </button>
      </div>

      <DialogContent
        dir="rtl"
        sx={{
          maxHeight: '75vh',
          scrollbarWidth: 'thin',
          maxWidth: '100%',
          width: '450px',
          paddingX: 1,
          paddingTop: 0,
        }}>
        <div className="flex flex-col pb-4 p-2">
          <div className="flex justify-center items-baseline mb-6">
            <p className="font-bold text-center text-[20px]">تنظیمات فرمول</p>
          </div>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingX: 1.5, width: '100%', gap: '20px' }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography fontWeight="600" fontSize="15px">
                  نام فرمول:
                </Typography>
                <RHFTextField
                  name="majorName"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                      fontWeight: '600',
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '16px', paddingX: '16px', width: '100%', marginTop: '38px' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
                sx={{
                  bgcolor: '#1758BA',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1758BA' },
                }}>
                {isPending ? 'در حال ثبت...' : 'ثبت'}
              </Button>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                disabled={isPending}
                onClick={handleClose}
                sx={{
                  height: '50px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  fontSize: '16px',
                  color: '#1758BA',
                  borderColor: '#1758BA',
                }}>
                انصراف
              </Button>
            </Box>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
