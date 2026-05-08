'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogContent, IconButton, MenuItem, Stack, Typography } from '@mui/material';
// components
import FormProvider from '@/components/hook-form/FormProvider';
import PreviewLoading from '@/app/(builder)/preview/[id]/loading';
import { RHFMultiSelectV0, RHFSelect, RHFTextField } from '@/components/hook-form';
// hooks
import { useCreatePackaging } from './hooks/useCreatePackaging';
import { useGetSubCategory } from '@/components/CreateFormBtn/hooks/useGetSubCategory';
import { useGetParentCategory } from '@/components/CreateFormBtn/hooks/useGetParentCategory';
import { useGetSurveyPurpose as useGetPackagingPurpose } from '../survey/hooks/useGetSurveyPurpose';

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
  targetLabelEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),
  categoryIds: z.array(z.string()).min(1, { message: 'لطفا حداقل یک دسته بندی را انتخاب کنید' }),
  subCategoryIds: z.array(z.string()).min(1, { message: 'لطفا حداقل یک دسته بندی را انتخاب کنید' }),
});

export type PackaginigFormSchemaType = z.infer<typeof propertiesSchema>;

interface ICreatePackagingModalProps {
  open: boolean;
  onClose: () => void;
}
// --------------------------------------------------------------------------
export default function CreatePackagingModal({ open, onClose }: ICreatePackagingModalProps) {
  const { push } = useRouter();
  const { mutate, isPending } = useCreatePackaging({ push, onClose });

  const { mutation, SubCategoryData } = useGetSubCategory();
  const { Category, isFetchingCategory } = useGetParentCategory();
  const { Survey: Packaging, isFetchingSurvey: isFetchingPackaging } = useGetPackagingPurpose(open);

  const methods = useForm<PackaginigFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: '',
      targetLabelEnum: '',
      categoryIds: [],
      subCategoryIds: [],
    },
  });

  const {
    watch,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFetchSubcategories = () => {
    const selectedCategoryIds = getValues('categoryIds');
    if (selectedCategoryIds.length > 0) {
      mutation.mutate(selectedCategoryIds);
    }
  };

  const subcategories = SubCategoryData(mutation.data);

  const onSubmit = async (data: PackaginigFormSchemaType) => {
    const { name, targetLabelEnum, categoryIds, subCategoryIds } = data;
    const allCategoryIds = [...categoryIds, ...subCategoryIds];

    const body = {
      name,
      targetLabelEnum: targetLabelEnum === "GENERAL" ? "DEFAULT" : targetLabelEnum,
      formCategorysModel: {
        categoryId: allCategoryIds,
      },
    };
    mutate({ data: body })
  };

  const watchCategoryIds = watch('categoryIds');

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
                نام بسته ارزیابی:
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

                <RHFSelect fullWidth name='targetLabelEnum' sx={textFieldCommonSx}>
                  <MenuItem value=''>انتخاب کنید</MenuItem>
                  {isFetchingPackaging && <MenuItem value=''><PreviewLoading /></MenuItem>}
                  {Packaging?.map((item: IGetTargetPlatform) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.caption}
                    </MenuItem>
                  ))}
                </RHFSelect>

              </Box>
            </Box>

            <Box display='flex' flexDirection='column' gap='6px' width='100%' mt='25px'>
              <Typography variant='subtitle2' fontWeight='700'>
                دسته بند‌ی‌ها:
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  paddingX: 0.5,
                  height: '100%',
                  display: 'flex',
                  direction: 'ltr',
                  flexDirection: 'column',
                  '& .MuiFormControl-root, & .MuiInputBase-root': {
                    borderRadius: '10px',
                  },
                }}>
                <RHFMultiSelectV0
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#fff',
                      paddingY: '8px',
                    },
                  }}
                  chip
                  checkbox
                  fullWidth
                  name='categoryIds'
                  options={Category ?? []}
                  isLoading={isFetchingCategory}
                  disabled={isFetchingCategory}
                  onClose={handleFetchSubcategories}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  direction: 'ltr',
                  width: '100%',
                  paddingX: 0.5,
                  marginTop: '8px',
                  '& .MuiFormControl-root, & .MuiInputBase-root': {
                    borderRadius: '10px',
                  },
                }}>
                <RHFMultiSelectV0
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#fff',
                      paddingY: '8px',
                    },
                  }}
                  chip
                  checkbox
                  fullWidth
                  name='subCategoryIds'
                  options={subcategories ?? []}
                  isLoading={mutation.isPending}
                  disabled={watchCategoryIds.length === 0 || mutation.isPending}
                />
              </Box>
            </Box>

            <Box display='flex' gap={3} width='100%' marginTop={2} marginBottom={2} paddingX='40px'>
              <Button
                type='submit'
                fullWidth
                disableElevation
                variant='contained'
                loading={isSubmitting || isPending}
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
