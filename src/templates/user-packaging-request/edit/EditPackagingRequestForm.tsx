'use client';

import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFTextField } from '@/components/hook-form';
import DocumentListField from '../create/DocumentListField';
import { CREATE_PAGE_CONTENT_MAX_WIDTH } from '../create/layout';
import CommentChatList from './CommentChatList';
import ReadOnlyFormField from './ReadOnlyFormField';
import {
  editPackagingRequestSchema,
  EditPackagingRequestFormValues,
} from './schema';
import { useGetUserPackagingRequestById } from '../hooks/useGetUserPackagingRequestById';
import { useUpdateUserPackagingRequest } from '../hooks/useUpdateUserPackagingRequest';
import { useGetUserPackagingRequestTargetLabel } from '../hooks/useGetUserPackagingRequestTargetLabel';
import { useGetUserPackagingRequestParentCategory } from '../hooks/useGetUserPackagingRequestParentCategory';
import { useGetUserPackagingRequestSubCategory } from '../hooks/useGetUserPackagingRequestSubCategory';
import { getPackagingRequestStatusLabel } from '../constants';

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
  const { data, isLoading, isError, error } = useGetUserPackagingRequestById(requestId);
  const { mutate, isPending } = useUpdateUserPackagingRequest({ push: router.push });
  const { targetLabels } = useGetUserPackagingRequestTargetLabel(Boolean(data));
  const { categories } = useGetUserPackagingRequestParentCategory();
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const methods = useForm<EditPackagingRequestFormValues>({
    resolver: zodResolver(editPackagingRequestSchema),
    defaultValues: {
      name: '',
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
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (!data) return;

    reset({
      name: data.name,
      documentList: data.documentList.length
        ? data.documentList.map((document) => ({
            id: document.id,
            title: document.title,
            uuid: document.uuid,
            link: document.link,
          }))
        : [{ title: '', uuid: '' }],
      newComment: '',
    });

    if (data.formCategorysModel?.categoryId?.length) {
      mutation.mutate(data.formCategorysModel.categoryId.map(String));
    }
  }, [data, reset, mutation]);

  const targetLabelCaption = useMemo(() => {
    if (!data?.targetLabelEnum) return '—';
    return (
      targetLabels?.find((item) => item.value === data.targetLabelEnum)?.caption ??
      data.targetLabelEnum
    );
  }, [data?.targetLabelEnum, targetLabels]);

  const categoryCaption = useMemo(() => {
    const ids = data?.formCategorysModel?.categoryId ?? [];
    if (!ids.length) return '—';

    const allOptions = [...(categories ?? []), ...(subCategories ?? [])];
    const labels = ids
      .map((id) => allOptions.find((option) => Number(option.value) === id)?.label ?? String(id))
      .filter(Boolean);

    return labels.length ? labels.join('، ') : ids.join('، ');
  }, [data?.formCategorysModel?.categoryId, categories, subCategories]);

  const onSubmit = (formData: EditPackagingRequestFormValues) => {
    mutate({
      id: requestId,
      name: formData.name,
      documentList: formData.documentList.map(({ id, title, uuid }) => ({
        ...(id ? { id } : {}),
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
              <ReadOnlyFormField
                label="وضعیت:"
                value={getPackagingRequestStatusLabel(data.status)}
              />

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

              <ReadOnlyFormField label="جامعه هدف:" value={targetLabelCaption} />

              <DocumentListField
                mode="edit"
                control={control}
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
                errors={errors}
              />

              <ReadOnlyFormField label="دسته بند‌ی‌ها:" value={categoryCaption} />

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
