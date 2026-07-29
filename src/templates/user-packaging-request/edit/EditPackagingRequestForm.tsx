'use client';

import { useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFTextField } from '@/components/hook-form';
import DocumentListField from '../create/DocumentListField';
import OwnershipTypeField from '../create/OwnershipTypeField';
import { CREATE_PAGE_CONTENT_MAX_WIDTH } from '../create/layout';
import CommentChatList from './CommentChatList';
import ReadOnlyFormField from './ReadOnlyFormField';
import ReadOnlyCategoryFields from './ReadOnlyCategoryFields';
import {
  editPackagingRequestSchema,
  EditPackagingRequestFormValues,
} from './schema';
import { useGetUserPackagingRequestById } from '../hooks/useGetUserPackagingRequestById';
import { useUpdateUserPackagingRequest } from '../hooks/useUpdateUserPackagingRequest';
import { useGetUserPackagingRequestTargetLabel } from '../hooks/useGetUserPackagingRequestTargetLabel';
import {
  useGetUserPackagingRequestParentCategory,
  UserPackagingRequestCategorySelectOption,
} from '../hooks/useGetUserPackagingRequestParentCategory';
import { useGetUserPackagingRequestSubCategory } from '../hooks/useGetUserPackagingRequestSubCategory';

const LIST_PAGE_PATH = '/user-packaging-request';

const centeredContentSx = {
  width: '100%',
  maxWidth: CREATE_PAGE_CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 1.5, sm: 2 },
};

interface EditPackagingRequestFormProps {
  requestId: number;
}

export default function EditPackagingRequestForm({ requestId }: EditPackagingRequestFormProps) {
  const router = useRouter();
  const formInitializedRef = useRef('');
  const subCategoriesFetchedRef = useRef('');
  const { data, isLoading, isError, error } = useGetUserPackagingRequestById(requestId);
  const { mutate, isPending } = useUpdateUserPackagingRequest({ push: router.push });
  const { targetLabels } = useGetUserPackagingRequestTargetLabel(Boolean(data));
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const savedCategoryIdsKey = data?.formCategorysModel?.categoryId?.join(',') ?? '';
  const categoriesKey = categories?.map((category) => category.value).join(',') ?? '';

  const methods = useForm<EditPackagingRequestFormValues>({
    resolver: zodResolver(editPackagingRequestSchema),
    defaultValues: {
      name: '',
      categoryIds: [],
      subCategoryIds: [],
      documentList: [{ title: '', uuid: '' }],
      newComment: '',
    },
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const watchCategoryIds = watch('categoryIds');
  const watchSubCategoryIds = watch('subCategoryIds');

  useEffect(() => {
    formInitializedRef.current = '';
    subCategoriesFetchedRef.current = '';
  }, [requestId]);

  useEffect(() => {
    if (!data) return;

    const allIds = data.formCategorysModel?.categoryId?.map(String) ?? [];
    let categoryIds: string[] = [];
    let subCategoryIds: string[] = allIds;

    if (allIds.length && categories?.length) {
      categoryIds = allIds.filter((id) =>
        categories.some((category: UserPackagingRequestCategorySelectOption) => category.value === id),
      );
      subCategoryIds = allIds.filter((id) => !categoryIds.includes(id));
    }

    const initKey = `${data.id}:${data.name}:${JSON.stringify(data.documentList)}:${savedCategoryIdsKey}:${categoriesKey}`;
    if (formInitializedRef.current === initKey) return;
    formInitializedRef.current = initKey;

    reset({
      name: data.name,
      categoryIds,
      subCategoryIds,
      documentList: data.documentList.length
        ? data.documentList.map((document) => ({
            id: document.id,
            title: document.title,
            uuid: document.uuid,
            link: document.link,
            isNew: false,
          }))
        : [{ title: '', uuid: '' }],
      newComment: '',
    });
  }, [data, savedCategoryIdsKey, categoriesKey, categories, reset]);

  useEffect(() => {
    if (!data || !categories?.length || !savedCategoryIdsKey) return;

    const allIds = savedCategoryIdsKey.split(',');
    const parentIds = allIds.filter((id) =>
      categories.some((category: UserPackagingRequestCategorySelectOption) => category.value === id),
    );
    if (!parentIds.length) return;

    const fetchKey = parentIds.join(',');
    if (subCategoriesFetchedRef.current === fetchKey) return;

    subCategoriesFetchedRef.current = fetchKey;
    mutation.mutate(parentIds);
  }, [data, savedCategoryIdsKey, categoriesKey, categories, mutation.mutate]);

  const targetLabelCaption = useMemo(() => {
    if (!data?.targetLabelEnum) return '—';
    return (
      targetLabels?.find((item) => item.value === data.targetLabelEnum)?.caption ??
      data.targetLabelEnum
    );
  }, [data?.targetLabelEnum, targetLabels]);

  const onSubmit = (formData: EditPackagingRequestFormValues) => {
    mutate({
      id: requestId,
      name: formData.name,
      documentList: formData.documentList.map(({ id, title, uuid, isNew }) => ({
        ...(typeof id === 'number' && Number.isFinite(id) && !isNew ? { id } : {}),
        title,
        uuid,
      })),
      ...(formData.newComment?.trim() ? { newComment: formData.newComment.trim() } : {}),
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ ...centeredContentSx, py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ ...centeredContentSx, py: 4 }}>
        <Typography color="error" textAlign="center">
          {error?.message || 'خطا در بارگذاری درخواست'}
        </Typography>
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="outlined" onClick={() => router.push(LIST_PAGE_PATH)}>
            بازگشت به لیست
          </Button>
        </Box>
      </Box>
    );
  }

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
            marginTop: 4,
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
                  disabled
                  sx={{
                    height: '48px',
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                      fontWeight: '600',
                    },
                  }}
                />
              </Stack>

              <ReadOnlyFormField label="جامعه هدف:" value={targetLabelCaption} />

              <OwnershipTypeField
                readOnly
                value={data.ownershipTypeEnum}
                showSampleDownload={false}
              />

              <DocumentListField
                mode="edit"
                control={control as never}
                register={register as never}
                setValue={setValue as never}
                clearErrors={clearErrors as never}
                errors={errors as never}
              />

              <ReadOnlyCategoryFields
                categoryIds={watchCategoryIds}
                subCategoryIds={watchSubCategoryIds}
                categories={categories ?? []}
                subCategories={subCategories ?? []}
                isFetchingCategory={isFetchingCategory}
                isFetchingSubCategory={mutation.isPending}
              />

              <CommentChatList comments={data.commentList ?? []} />

              <Stack spacing={1} mt={2} mb={3}>
                <Typography variant="subtitle2" fontWeight={700}>
                  توضیحات جدید (اختیاری):
                </Typography>
                <RHFTextField
                  multiline
                  rows={3}
                  name="newComment"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
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
            <Box sx={{ ...centeredContentSx, maxWidth: '450px', display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                disableElevation
                variant="contained"
                loading={isSubmitting || isPending}
                disabled={isSubmitting || isPending}
                sx={{
                  bgcolor: '#1758BA',
                  fontWeight: '600',
                  fontSize: '15px',
                  height: '50px',
                  borderRadius: '10px',
                  '&.MuiButtonBase-root:hover': { bgcolor: '#1758BA' },
                }}>
                ذخیره تغییرات
              </Button>

              <Button
                type="button"
                variant="outlined"
                fullWidth
                disabled={isSubmitting || isPending}
                onClick={() => router.push(LIST_PAGE_PATH)}
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
