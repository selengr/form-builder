'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFTextField } from '@/components/hook-form';
import CommentChatList from '@/templates/user-packaging-request/edit/CommentChatList';
import ReadOnlyCategoryFields from '@/templates/user-packaging-request/edit/ReadOnlyCategoryFields';
import ReadOnlyFormField from '@/templates/user-packaging-request/edit/ReadOnlyFormField';
import DocumentListView from '@/templates/user-packaging-request/view/DocumentListView';
import { useGetUserPackagingRequestTargetLabel } from '@/templates/user-packaging-request/hooks/useGetUserPackagingRequestTargetLabel';
import { useGetUserPackagingRequestParentCategory } from '@/templates/user-packaging-request/hooks/useGetUserPackagingRequestParentCategory';
import { usePackagingRequestCategoryForm } from '@/templates/user-packaging-request/hooks/usePackagingRequestCategoryForm';
import { PackagingRequestStatus } from '@/templates/user-packaging-request/constants';
import { useGetAdminPackagingRequestById } from '../hooks/useGetAdminPackagingRequestById';
import { useProcessAdminPackagingRequest } from '../hooks/useProcessAdminPackagingRequest';
import { ADMIN_LIST_PAGE_PATH, ADMIN_PAGE_CONTENT_MAX_WIDTH } from '../layout';
import {
  processPackagingRequestSchema,
  ProcessPackagingRequestFormValues,
} from './schema';

const centeredContentSx = {
  width: '100%',
  maxWidth: ADMIN_PAGE_CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 1.5, sm: 2 },
};

const PROCESS_STATUSES: Array<{
  status: Extract<PackagingRequestStatus, 'ACCEPTED' | 'REJECTED' | 'REVISION'>;
  label: string;
  bgcolor: string;
  hoverBgcolor: string;
  color?: string;
  borderColor?: string;
}> = [
  {
    status: 'ACCEPTED',
    label: 'تایید',
    bgcolor: '#15803D',
    hoverBgcolor: '#15803D',
  },
  {
    status: 'REJECTED',
    label: 'رد',
    bgcolor: '#B91C1C',
    hoverBgcolor: '#B91C1C',
  },
  {
    status: 'REVISION',
    label: 'نیاز به اصلاح',
    bgcolor: '#BE185D',
    hoverBgcolor: '#BE185D',
  },
];

interface ProcessPackagingRequestFormProps {
  requestId: number;
}

export default function ProcessPackagingRequestForm({ requestId }: ProcessPackagingRequestFormProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAdminPackagingRequestById(requestId);
  const { mutate, isPending } = useProcessAdminPackagingRequest({ push: router.push });
  const { targetLabels } = useGetUserPackagingRequestTargetLabel(Boolean(data));
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const {
    methods: categoryMethods,
    watchCategoryIds,
    watchSubCategoryIds,
    subCategories,
    isFetchingSubCategory,
  } = usePackagingRequestCategoryForm(requestId, data, categories);

  const commentMethods = useForm<ProcessPackagingRequestFormValues>({
    resolver: zodResolver(processPackagingRequestSchema),
    defaultValues: {
      newComment: '',
    },
  });

  const { handleSubmit } = commentMethods;

  const targetLabelCaption = useMemo(() => {
    if (!data?.targetLabelEnum) return '—';
    return (
      targetLabels?.find((item) => item.value === data.targetLabelEnum)?.caption ??
      data.targetLabelEnum
    );
  }, [data?.targetLabelEnum, targetLabels]);

  const handleProcess = (
    status: Extract<PackagingRequestStatus, 'ACCEPTED' | 'REJECTED' | 'REVISION'>,
  ) => {
    handleSubmit((formData) => {
      const trimmedComment = formData.newComment?.trim();

      mutate({
        id: requestId,
        status,
        newComment: trimmedComment ? trimmedComment : null,
      });
    })();
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
          <Button variant="outlined" onClick={() => router.push(ADMIN_LIST_PAGE_PATH)}>
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
      }}>
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
            <FormProvider methods={categoryMethods}>
              <ReadOnlyFormField label="عنوان:" value={data.name} />
              <ReadOnlyFormField label="جامعه هدف:" value={targetLabelCaption} />
              <DocumentListView documents={data.documentList} />
              <ReadOnlyCategoryFields
                categoryIds={watchCategoryIds}
                subCategoryIds={watchSubCategoryIds}
                categories={categories ?? []}
                subCategories={subCategories ?? []}
                isFetchingCategory={isFetchingCategory}
                isFetchingSubCategory={isFetchingSubCategory}
              />
            </FormProvider>

            <CommentChatList comments={data.commentList ?? []} />

            <FormProvider methods={commentMethods}>
              <Stack spacing={1} mt={1} mb={2}>
                <Typography variant="subtitle2" fontWeight={700}>
                  توضیحات (اختیاری):
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
            </FormProvider>
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
          <Box
            sx={{
              ...centeredContentSx,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
            }}>
            {PROCESS_STATUSES.map(({ status, label, bgcolor, hoverBgcolor }) => (
              <Button
                key={status}
                type="button"
                fullWidth
                disableElevation
                variant="contained"
                disabled={isPending}
                loading={isPending}
                onClick={() => handleProcess(status)}
                sx={{
                  height: '50px',
                  borderRadius: '10px',
                  bgcolor,
                  fontWeight: 700,
                  fontSize: '15px',
                  '&.MuiButtonBase-root:hover': { bgcolor: hoverBgcolor },
                }}>
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
