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
import PreviewLoading from '@/app/(builder)/preview/[id]/loading';
// hooks
import { useCreateSurvey } from './hooks/useCreateSurvey';
import { useGetSurveyPurpose } from './hooks/useGetSurveyPurpose';
import { IGetTargetPlatform, useGetTargetPlatform } from './hooks/useGetTargetPlatform';
import { QueryClient } from '@tanstack/react-query';

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
  surveyTargetPlatformEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),
  surveyPurposeEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),
});

export type SurveyFormSchemaType = z.infer<typeof propertiesSchema>;

interface CreateSurveyBtnProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSurveyBtn({ open, onClose }: CreateSurveyBtnProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateSurvey();
  const { Survey, isFetchingSurvey } = useGetSurveyPurpose();
  const { TargetPlatform, isFetchingTargetPlatform } = useGetTargetPlatform();

  const methods = useForm<SurveyFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: '',
      surveyTargetPlatformEnum: '',
      surveyPurposeEnum: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data: SurveyFormSchemaType) => {
        mutate(data, {
          onSuccess: (result) => {    
            toast.success('عملیات با موفقیت انجام شد');
            handleClose()
            router.push(`/builder/${result.id}?survey=admin`);
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
                نام نظرسنجی:
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

                <RHFSelect fullWidth name='surveyTargetPlatformEnum' sx={textFieldCommonSx} >
                  <MenuItem value=''>انتخاب کنید</MenuItem>
                  {isFetchingSurvey && <MenuItem value=''><PreviewLoading /></MenuItem>}
                  {TargetPlatform?.map((item: IGetTargetPlatform) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.caption}
                    </MenuItem>
                  ))}
                </RHFSelect>

              </Box>
            </Box>



            <Box display='flex' flexDirection='column' gap='6px' width='100%' mt='16px'>
              <Typography variant='subtitle2' fontWeight='700'>
                جامعه هدف:
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

                <RHFSelect fullWidth name='surveyPurposeEnum' sx={textFieldCommonSx}>
                  <MenuItem value=''>انتخاب کنید</MenuItem>
                  {isFetchingTargetPlatform && <MenuItem value=''><PreviewLoading /></MenuItem>}
                  {Survey?.map((item: IGetTargetPlatform) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.caption}
                    </MenuItem>
                  ))}
                </RHFSelect>

              </Box>
            </Box>


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
