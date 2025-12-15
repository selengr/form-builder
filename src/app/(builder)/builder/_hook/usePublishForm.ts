'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishFormAction } from '../../../../../actions/publishFormAction';

interface UsePublishFormParams {
  formId?: string | string[];
  survey: boolean;
}

export function usePublishForm({ formId, survey }: UsePublishFormParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!formId) throw new Error('Form id is missing');
      await publishFormAction(formId, survey);
    },
    onSuccess: () => {
      toast.success('عملیات با موفقیت انجام شد');
      queryClient.invalidateQueries({
        queryKey: ['form-builder', formId],
      });
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });
}
