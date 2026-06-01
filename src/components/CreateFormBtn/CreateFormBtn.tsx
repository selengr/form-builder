'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';

import FormProvider from '../hook-form/FormProvider';
import { RHFMultiSelectV0, RHFTextField } from '../hook-form';
import { useGetSubCategory } from './hooks/useGetSubCategory';
import { useGetParentCategory } from './hooks/useGetParentCategory';
import { creatFormAction } from '../../../actions/builder/createForm';

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }).max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' })),
  typeEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),

  categoryIds: z.array(z.string()).min(1, { message: 'لطفا حداقل یک دسته بندی را انتخاب کنید' }),
  subCategoryIds: z.array(z.string()).min(1, { message: 'لطفا حداقل یک دسته بندی را انتخاب کنید' }),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

interface CreateFormBtnProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateFormBtn({ open, onClose }: CreateFormBtnProps) {
  const router = useRouter();
  const { mutation, SubCategoryData } = useGetSubCategory();
  const { Category, isFetchingCategory } = useGetParentCategory();

  const methods = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      name: '',
      typeEnum: 'QUESTION',
      categoryIds: [],
      subCategoryIds: [],
    },
  });

  const {
    reset,
    watch,
    setValue,
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

  const onSubmit = async (data: PropertiesFormSchemaType) => {
    const { name, typeEnum, categoryIds, subCategoryIds } = data;
    const allCategoryIds = [...categoryIds, ...subCategoryIds];

    const body = {
      name,
      typeEnum,
      formCategorysModel: {
        categoryId: allCategoryIds,
      },
    };

    try {
      const result = await creatFormAction(body)

      if (result.success) {
        toast.success('عملیات با موفقیت انجام شد');
        router.push(`/builder/${result.data?.id}`);
        // onClose();
        reset()
      } else {
        toast.error(result.message || 'خطا در ایجاد فرم');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleClose = () => {
    if (isSubmitting || mutation.isPending) return;
    onClose();
    reset()
  };

  const handleTabChange = (_: unknown, newValue: string) => {
    setValue('typeEnum', newValue);
  };

  const watchTypeEnum = watch('typeEnum');
  const watchCategoryIds = watch('categoryIds');

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
        <IconButton disabled={isSubmitting || mutation.isPending} aria-label='close' onClick={handleClose} sx={{ marginX: 1, marginTop: 1, marginBottom: 0 }}>
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
            <Stack spacing={1}>
              <Typography variant='subtitle2' fontWeight='600' fontSize='15px'>
                نام:
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

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 5,
                flexDirection: 'column',
              }}>
              <Tabs
                variant='fullWidth'
                value={watchTypeEnum}
                onChange={handleTabChange}
                sx={{
                  border: '1px solid #d3d3d3',
                  borderRadius: '10px',
                  padding: '5px',
                  '& .MuiTabs-scroller': {
                    display: 'flex',
                    justifyContent: 'center',
                  },
                  '& .MuiButtonBase-root': {
                    zIndex: 10,
                  },
                  '& .Mui-selected': {
                    color: 'white !important',
                  },
                  '& .MuiTabs-indicator': {
                    zIndex: 0,
                    height: '48px',
                    borderRadius: '12px',
                    bgcolor: '#1758BA',
                  },
                  '& .MuiTabs-list': {
                    width: "100%"
                  }
                }}>
                {[
                  { value: 'QUESTION', label: 'پرسشنامه' },
                  { value: 'TEST', label: 'آزمون' },
                  { value: 'COMPETITION', label: 'مسابقه' }
                  // { value: 'SURVEY', label: 'نظرسنجی' },
                ].map((tab) => (
                  <Tab
                    key={tab.value}
                    disableRipple
                    value={tab.value}
                    label={tab.label}
                    sx={{
                      color: '#000',
                      fontWeight: 600,
                      width: "100%"
                      // px: 5,
                      // flex: 1
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Box display='flex' flexDirection='column' gap='6px' width='100%' mt='10px'>
              <Typography variant='subtitle2' fontWeight='700'>
                دسته بند‌ی‌ها:
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

            <Box display='flex' gap={3} width='100%' marginTop={5} marginBottom={2} paddingX='40px'>
              <Button
                type='submit'
                fullWidth
                disableElevation
                variant='contained'
                loading={isSubmitting}
                disabled={isSubmitting}
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
                disabled={isSubmitting}>
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
