'use client';
import { z } from 'zod';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
// action
import { getPackageSettingAction, putPackageSettingAction } from '../../../actions/packaging/packageSetting';
import { useQueryClient } from '@tanstack/react-query';

const nameSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ' '))
  .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }).max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }));

const propertiesSchema = z.object({
  name: nameSchema,
  ratio: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({ invalid_type_error: 'عدد معتبر وارد کنید' })
        .min(1, { message: 'ضریب باید حداقل ۱ باشد' })
    ),
});

type packageSettingSchemaType = z.infer<typeof propertiesSchema>;

// ------------------- Styles -------------------
const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const inputFieldContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  paddingX: 0.5,
};

// ------------------- Component -------------------
export default function PackagingSettingsDialog({ packageId }: { packageId: number }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleOpen = () => {
    setOpenDialog((prev) => !prev);
  }

  const methods = useForm<packageSettingSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      ratio: 1,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (!openDialog) return;

    async function loadData() {
      setLoading(true);
      try {
        const data = await getPackageSettingAction(packageId);
        reset({
          name: data.name || "",
          ratio: data.ratio || 1
        });
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [openDialog, reset]);


  const onSubmit = async (formData: packageSettingSchemaType) => {
    try {
      await putPackageSettingAction(packageId, {
        name: formData.name,
        ratio: formData.ratio,
      });
      toast.success('عملیات با موفقیت انجام شد');
      queryClient.invalidateQueries({
        queryKey: ['datas_builder_query'],
      });
      handleOpen();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          height: '40px',
          width: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        aria-label='تنظیمات بسته'>
        <IoSettingsOutline color='#2A2A2A' />
      </IconButton>
      <Dialog
        open={openDialog}
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
        <Box className='flex items-center justify-start' sx={{ p: 2, pb: 0 }}>
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
          <Box className='flex justify-center items-baseline' sx={{ mb: 2 }}>
            <Typography variant='h6' component='p' fontWeight='bold' textAlign='center'>
              تنظیمات بسته
            </Typography>
          </Box>


          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                bgcolor: '#F7F7FF',
                borderRadius: '8px',
                padding: 2,
                paddingBottom: 4,
                marginY: 2,
                gap: 1,
                direction: 'ltr',
              }}>
              <Box display='flex' gap={1} width='100%'>
                <Box sx={inputFieldContainerSx}>
                  <Typography variant='subtitle2' fontWeight='700'>
                    نام بسته:
                  </Typography>
                  <RHFTextField disabled={loading} sx={textFieldCommonSx} name='name' fullWidth />
                </Box>

                <Box sx={inputFieldContainerSx}>
                  <Typography variant='subtitle2' fontWeight='700'>
                    ضریب قیمت:
                  </Typography>
                  <RHFTextField
                    sx={textFieldCommonSx}
                    disabled={loading}
                    name='ratio'
                    fullWidth
                    type='number'
                    inputProps={{ step: '0.1', min: '1' }}
                  />
                </Box>
              </Box>
              {loading && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  در حال بارگذاری اطلاعات...
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                background: '#FFF',
                py: '10px',
                px: 2,
                my: 3
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={isSubmitting || loading}
                  sx={{
                    bgcolor: '#1758BA',
                    height: '54px',
                    color: 'white',
                    fontSize: { xs: '13px', sm: '16px' },
                    fontWeight: '700',
                    borderRadius: '10px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#1758BA' },
                  }}>
                  {loading ? "در حال ثبت..." : "ثبت"}
                </Button>
                <Button
                  disabled={isSubmitting || loading}
                  fullWidth
                  type='button'
                  variant='outlined'
                  onClick={() => {
                    handleOpen();
                    reset();
                  }}
                  sx={{
                    height: '54px',
                    fontWeight: '700',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#1758BA',
                    borderColor: '#1758BA',
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'transparent' },
                  }}>
                  بستن
                </Button>


              </Box>
            </Box>
          </FormProvider>


        </DialogContent>
      </Dialog>
    </>
  );
}
