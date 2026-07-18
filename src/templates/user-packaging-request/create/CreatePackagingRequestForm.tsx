'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFMultiSelectV0, RHFSelect, RHFTextField } from '@/components/hook-form';
import { SkeletonMenuItem } from '@/components/Fields/PackageInjectionField';
import DocumentListField from './DocumentListField';
import {
  createPackagingRequestSchema,
  CreatePackagingRequestFormValues,
} from './schema';
import { CREATE_PAGE_CONTENT_MAX_WIDTH } from './layout';
import { useCreateUserPackagingRequest } from '../hooks/useCreateUserPackagingRequest';
import { useGetUserPackagingRequestTargetLabel } from '../hooks/useGetUserPackagingRequestTargetLabel';
import { useGetUserPackagingRequestParentCategory } from '../hooks/useGetUserPackagingRequestParentCategory';
import { useGetUserPackagingRequestSubCategory } from '../hooks/useGetUserPackagingRequestSubCategory';

const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const centeredContentSx = {
  width: '100%',
  maxWidth: CREATE_PAGE_CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 1.5, sm: 2 },
};

export default function CreatePackagingRequestForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateUserPackagingRequest({ push: router.push });
  const { targetLabels, isFetchingTargetLabel } = useGetUserPackagingRequestTargetLabel();
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const methods = useForm<CreatePackagingRequestFormValues>({
    resolver: zodResolver(createPackagingRequestSchema),
    defaultValues: {
      name: '',
      targetLabelEnum: '',
      categoryIds: [],
      subCategoryIds: [],
      documentList: [{ title: '', uuid: '' }],
      newComment: '',
    },
  });

  const {
    watch,
    getValues,
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const watchCategoryIds = watch('categoryIds');

  const handleFetchSubcategories = () => {
    const selectedCategoryIds = getValues('categoryIds');
    if (selectedCategoryIds.length > 0) {
      mutation.mutate(selectedCategoryIds);
    }
  };

  const onSubmit = (data: CreatePackagingRequestFormValues) => {
    const allCategoryIds = [...data.categoryIds, ...data.subCategoryIds].map(Number);

    const payload = {
      name: data.name,
      targetLabelEnum: data.targetLabelEnum,
      documentList: data.documentList.map(({ title, uuid }) => ({ title, uuid })),
      ...(allCategoryIds.length > 0
        ? { formCategorysModel: { categoryId: allCategoryIds } }
        : {}),
      ...(data.newComment?.trim() ? { newComment: data.newComment.trim() } : {}),
    };

    mutate(payload);
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& > form': {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          width: '100%',
        },
      }}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          width: '100%',
          overflow: 'hidden',
          marginTop : 4
        }}>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            width: '100%',
            pb: 2,
          }}>
          <Box
            sx={{
              ...centeredContentSx,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              direction: 'ltr',
              py: 1,
            }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600} fontSize="15px">
                عنوان:
              </Typography>
              <RHFTextField
                name="name"
                sx={{
                  height: '48px',
                  '& .MuiInputBase-root': {
                    borderRadius: '10px',
                    fontWeight: '600',
                  },
                }}
              />
            </Stack>

            <Box display="flex" flexDirection="column" gap="6px" width="100%" mb={2} mt={2}>
              <Typography variant="subtitle2" fontWeight={700}>
                جامعه هدف:
              </Typography>
              <RHFSelect fullWidth name="targetLabelEnum" sx={textFieldCommonSx}>
                <MenuItem value="">انتخاب کنید</MenuItem>
                {isFetchingTargetLabel && (
                  <MenuItem value="">
                    <SkeletonMenuItem />
                  </MenuItem>
                )}
                {targetLabels?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.caption}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <DocumentListField
              control={control}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              errors={errors}
            />


<Box display="flex" flexDirection="column" gap="6px" width="100%">
              <Typography variant="subtitle2" fontWeight={700}>
                دسته بند‌ی‌ها (اختیاری):
              </Typography>
              <RHFMultiSelectV0
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#fff',
                    paddingY: '8px',
                    borderRadius: '10px',
                  },
                }}
                chip
                checkbox
                fullWidth
                name="categoryIds"
                options={categories ?? []}
                isLoading={isFetchingCategory}
                disabled={isFetchingCategory}
                onClose={handleFetchSubcategories}
              />

              <RHFMultiSelectV0
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#fff',
                    paddingY: '8px',
                    borderRadius: '10px',
                  },
                }}
                chip
                checkbox
                fullWidth
                name="subCategoryIds"
                options={subCategories ?? []}
                isLoading={mutation.isPending}
                disabled={watchCategoryIds.length === 0 || mutation.isPending}
              />
            </Box>

            <Stack spacing={1} mt={2} mb={3}>
              <Typography variant="subtitle2" fontWeight={700}>
                توضیحات (اختیاری):
              </Typography>
              <RHFTextField multiline rows={3} name="newComment" 
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                    },
                  }} />
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            width: '100%',
            bgcolor: 'white',
            pt: 2,
            pb: { xs: 2, sm: 2.5 },
          }}>
          <Box sx={{ ...centeredContentSx, maxWidth : "450px", display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              disableElevation
              variant="contained"
              disabled={isSubmitting || isPending}
              sx={{
                bgcolor: '#1758BA',
                fontWeight: '600',
                fontSize: '15px',
                height: '50px',
                borderRadius: '10px',
                '&.MuiButtonBase-root:hover': { bgcolor: '#1758BA' },
              }}>
              ثبت درخواست
            </Button>

            <Button
              type="button"
              variant="outlined"
              fullWidth
              disabled={isSubmitting || isPending}
              onClick={() => router.push('/user-packaging-request')}
              sx={{
                bgcolor: 'white',
                height: '50px',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: '10px',
                color: '#1758BA',
                borderColor: '#1758BA',
                '&.MuiButtonBase-root:hover': { bgcolor: 'white', color: '#1758BA' },
              }}>
              انصراف
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
    </Box>
  );
}
