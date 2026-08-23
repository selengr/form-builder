'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogContent, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import { IoClose } from 'react-icons/io5';
// components
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from '@/components/hook-form';
// hooks
import { useGetTargetPlatform } from './hooks/useGetTargetPlatform';
import { useCreateDataCollection } from './hooks/useCreateDataCollection';
import { SkeletonMenuItem } from '@/components/Fields/PackageInjectionField';

interface IGetTargetPlatform {
  value: string;
  caption: string;
}

const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }).max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' })),
  targetPlatformEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),
  label: z
    .string()
    .trim()
    .transform((value) => {
      const normalized = value.replace(/\s+/g, ' ');
      return normalized === '' ? null : normalized;
    })
    .nullable()
    .refine(
      (value) =>
        value === null ||
        !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value),
      {
        message: 'استفاده از حروف فارسی مجاز نیست',
      }
    )
    .refine(
      (value) => value === null || (value.length >= 8 && value.length <= 30),
      {
        message: 'حداقل باید 8 و حداکثر 30 کاراکتر باشد',
      }
    ),
});

export type FormSchemaType = z.infer<typeof propertiesSchema>;
interface IProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateDataCollectionBtn({ open, onClose }: IProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateDataCollection();
  const { TargetPlatform, isFetchingTargetPlatform } = useGetTargetPlatform(open);

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: '',
      targetPlatformEnum: '',
      label: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormSchemaType) => {
    mutate(data, {
      onSuccess: (result) => {
        toast.success('عملیات با موفقیت انجام شد');
        handleClose()
        router.push(`/builder/${result.id}?admin=data-collection`);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'خطا در ایجاد فرم');
      },
    });
  };

  const handleClose = () => {
    if (isSubmitting || isPending) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      dir='ltr'
      onClose={handleClose}
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <IconButton disabled={isSubmitting} aria-label='close' onClick={handleClose} sx={{ marginX: 1, marginTop: 1, marginBottom: 0 }}>
          <IoClose color='#404040' width={25} height={25} />
        </IconButton>
      </Box>
      <DialogContent
        dir='rtl'
        sx={{
          maxHeight: '75vh',
          height: 'auto',
          scrollbarWidth: 'none',
          maxWidth: '100%',
          width: '450px',
          paddingX: 1,
          paddingBottom: 1,
          paddingTop: 0,
        }}>
        <Box width='100%' display='flex' justifyContent='center' alignItems='center' mb={2}>
          <Typography variant='subtitle2' color='#404040' fontSize='16px' fontWeight='700'>
            فرم جدید
          </Typography>
        </Box>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              paddingX: 1.5,
              direction: 'ltr',
              width: '100%',
            }}>
            <Stack spacing={1} mb='10px'>
              <Typography variant='subtitle2' fontWeight='600' fontSize='15px'>
                نام فرم جمع آوری داده:
              </Typography>
              <RHFTextField
                name='name'
                sx={{
                  height: '48px',
                  '& .MuiInputBase-root': {
                    borderRadius: '10px',
                    fontWeight: '600',
                  },
                }}
              />
            </Stack>

            <Box display='flex' flexDirection='column' gap='6px' width='100%' mt='20px'>
              <Typography variant='subtitle2' fontWeight='700'>
                سرویس‌گیرنده:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  direction: 'ltr',
                  width: '100%',
                  paddingX: 0.5,
                  '& .MuiFormControl-root, & .MuiInputBase-root': {
                    borderRadius: '10px',
                  },
                }}>

                <RHFSelect fullWidth name='targetPlatformEnum' sx={textFieldCommonSx} >
                  <MenuItem value=''>انتخاب کنید</MenuItem>
                  {isFetchingTargetPlatform && <MenuItem value=''><SkeletonMenuItem /></MenuItem>}
                  {TargetPlatform?.map((item: IGetTargetPlatform) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.caption}
                    </MenuItem>
                  ))}
                </RHFSelect>

              </Box>
            </Box>

            <Stack spacing={1} mt={1} mb={2}>
              <Typography variant='subtitle2' fontWeight='700'>
                شناسه:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  direction: 'ltr',
                  width: '100%',
                  paddingX: 0.5,
                  '& .MuiFormControl-root, & .MuiInputBase-root': {
                    borderRadius: '10px',
                  },
                }}>
                <RHFTextField name='label' dir='ltr' sx={{ height: 50 }} />
              </Box>
            </Stack>

            <Box display='flex' gap={3} width='100%' marginTop={2} marginBottom={2} paddingX='40px'>
              <Button
                type='submit'
                fullWidth
                disableElevation
                variant='contained'
                loading={isSubmitting || isPending || isFetchingTargetPlatform}
                disabled={isSubmitting || isPending}
                sx={{
                  bgcolor: '#1758BA',
                  fontWeight: '400',
                  fontSize: '15px',
                  height: '50px',
                  borderRadius: '10px',
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: '#1758BA',
                  },
                }}>
                <Typography variant='body2' component={'p'} py={0.5} fontWeight='600'>
                  تایید
                </Typography>
              </Button>

              <Button
                type='button'
                variant='outlined'
                fullWidth
                sx={{
                  bgcolor: 'white',
                  height: '50px',
                  fontWeight: '400',
                  fontSize: '15px',
                  borderRadius: '10px',
                  color: '#1758BA',
                  borderColor: '#1758BA',
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: 'white',
                    color: '#1758BA',
                  },
                }}
                onClick={handleClose}
                disabled={isSubmitting || isPending}
              >
                <Typography color='#1758BA' variant='body2' component={'p'} py={0.5} fontWeight='600'>
                  انصراف
                </Typography>
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}