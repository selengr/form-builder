'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { CREATE_PAGE_CONTENT_MAX_WIDTH } from '../create/layout';
import CommentChatList from '../edit/CommentChatList';
import ReadOnlyCategoryFields from '../edit/ReadOnlyCategoryFields';
import ReadOnlyFormField from '../edit/ReadOnlyFormField';
import DocumentListView from './DocumentListView';
import OwnershipTypeField from '../create/OwnershipTypeField';
import { useGetUserPackagingRequestById } from '../hooks/useGetUserPackagingRequestById';
import { useGetUserPackagingRequestTargetLabel } from '../hooks/useGetUserPackagingRequestTargetLabel';
import { useGetUserPackagingRequestParentCategory } from '../hooks/useGetUserPackagingRequestParentCategory';
import { usePackagingRequestCategoryForm } from '../hooks/usePackagingRequestCategoryForm';

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

export default function ViewPackagingRequestForm({ requestId }: ViewPackagingRequestFormProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetUserPackagingRequestById(requestId);
  const { targetLabels } = useGetUserPackagingRequestTargetLabel(Boolean(data));
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const {
    methods,
    watchCategoryIds,
    watchSubCategoryIds,
    subCategories,
    isFetchingSubCategory,
  } = usePackagingRequestCategoryForm(requestId, data, categories);

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
        '& > form': {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          width: '100%',
        },
      }}>
      <FormProvider methods={methods}>
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
              <OwnershipTypeField
                readOnly
                value={data.ownershipTypeEnum}
                showSampleDownload={false}
              />
              <DocumentListView documents={data.documentList} />
              <ReadOnlyCategoryFields
                categoryIds={watchCategoryIds}
                subCategoryIds={watchSubCategoryIds}
                categories={categories ?? []}
                subCategories={subCategories ?? []}
                isFetchingCategory={isFetchingCategory}
                isFetchingSubCategory={isFetchingSubCategory}
              />
              <CommentChatList comments={data.commentList ?? []} />
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
}
