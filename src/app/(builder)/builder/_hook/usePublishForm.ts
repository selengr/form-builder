'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useSearchParams } from 'next/navigation';

export function usePublishForm(formId?: string | string[]) {
  const searchParams = useSearchParams();
  const surveyParam = searchParams.get('survey');

  return useMutation({
    mutationFn: async () => {
      if (!formId) throw new Error('Form id is missing');

      if (surveyParam) {
        return AxiosApi.put(`/psya/admin/form/survey/finalization/${formId}`);
      } else {
        return AxiosApi.put(`/form/ready-to-publish/${formId}`);
      }
    },
    onSuccess: () => toast.success('عملیات با موفقیت انجام شد'),
    onError: () => toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.'),
  });
}
