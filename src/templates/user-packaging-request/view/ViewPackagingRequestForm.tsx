'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { CREATE_PAGE_CONTENT_MAX_WIDTH } from '../create/layout';
import CommentChatList from '../edit/CommentChatList';
import ReadOnlyCategoryFields from '../edit/ReadOnlyCategoryFields';
import ReadOnlyFormField from '../edit/ReadOnlyFormField';
import DocumentListView from './DocumentListView';
import { useGetUserPackagingRequestById } from '../hooks/useGetUserPackagingRequestById';
import { useGetUserPackagingRequestTargetLabel } from '../hooks/useGetUserPackagingRequestTargetLabel';
import { useGetUserPackagingRequestParentCategory } from '../hooks/useGetUserPackagingRequestParentCategory';
import { useGetUserPackagingRequestSubCategory } from '../hooks/useGetUserPackagingRequestSubCategory';

const LIST_PAGE_PATH = '/user-packaging-request';

const centeredContentSx = {
  width: '100%',
  maxWidth: CREATE_PAGE_CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 1.5, sm: 2 },
};

interface ViewPackagingRequestFormProps {
  requestId: number;
}

type ViewCategoryFormValues = {
  categoryIds: string[];
  subCategoryIds: string[];
};

export default function ViewPackagingRequestForm({ requestId }: ViewPackagingRequestFormProps) {
  const router = useRouter();
  const categoriesInitializedRef = useRef('');
  const { data, isLoading, isError, error } = useGetUserPackagingRequestById(requestId);
  const { targetLabels } = useGetUserPackagingRequestTargetLabel(Boolean(data));
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const methods = useForm<ViewCategoryFormValues>({
    defaultValues: {
      categoryIds: [],
      subCategoryIds: [],
    },
  });

  const { reset, watch } = methods;
  const watchCategoryIds = watch('categoryIds');
  const watchSubCategoryIds = watch('subCategoryIds');

  useEffect(() => {
    categoriesInitializedRef.current = '';
  }, [requestId]);

  useEffect(() => {
    if (!data) return;

    const allIds = data.formCategorysModel?.categoryId?.map(String) ?? [];
    let categoryIds: string[] = [];
    let subCategoryIds: string[] = allIds;

    if (allIds.length && categories?.length) {
      categoryIds = allIds.filter((id) => categories.some((category) => category.value === id));
      subCategoryIds = allIds.filter((id) => !categoryIds.includes(id));
    }

    reset({ categoryIds, subCategoryIds });
  }, [data, categories, reset]);

  useEffect(() => {
    if (!data || !categories?.length) return;

    const allIds = data.formCategorysModel?.categoryId?.map(String) ?? [];
    if (!allIds.length) return;

    const parentIds = allIds.filter((id) => categories.some((category) => category.value === id));
    if (!parentIds.length) return;

    const fetchKey = parentIds.join(',');
    if (categoriesInitializedRef.current === fetchKey) return;

    categoriesInitializedRef.current = fetchKey;
    mutation.mutate(parentIds);
  }, [data, categories, mutation]);

  const targetLabelCaption = useMemo(() => {
    if (!data?.targetLabelEnum) return '—';
    return (
      targetLabels?.find((item) => item.value === data.targetLabelEnum)?.caption ??
      data.targetLabelEnum
    );
  }, [data?.targetLabelEnum, targetLabels]);

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
        overflow: 'hidden',
        marginTop: 4,
      }}>
      <FormProvider methods={methods}>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            width: '100%',
            pb: 3,
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
            <ReadOnlyFormField label="عنوان:" value={data.name} />
            <ReadOnlyFormField label="جامعه هدف:" value={targetLabelCaption} />
            <DocumentListView documents={data.documentList} />
            <ReadOnlyCategoryFields
              categoryIds={watchCategoryIds}
              subCategoryIds={watchSubCategoryIds}
              categories={categories ?? []}
              subCategories={subCategories ?? []}
              isFetchingCategory={isFetchingCategory}
              isFetchingSubCategory={mutation.isPending}
            />
            <CommentChatList comments={data.commentList ?? []} />
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
}
