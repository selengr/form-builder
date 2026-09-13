'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishFormAction } from '@actions/publishFormAction';

interface UsePublishFormParams {
  formId?: string | string[];
  IsSurvey: boolean;
  IsPackaging: boolean;
}

export function usePublishForm({ formId, IsSurvey, IsPackaging }: UsePublishFormParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!formId) {
        throw new Error('Form id is required');
      }

      const res = await publishFormAction({
        formId,
        IsSurvey,
        IsPackaging,
      });

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('فرم با موفقیت منتشر شد');
      queryClient.invalidateQueries({
        queryKey: ['form-builder'],
      });
    },
    onError: (err) => {
      toast.error(err.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });
}
