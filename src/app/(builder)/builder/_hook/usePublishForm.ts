'use client';

import { toast } from 'sonner';
import { getAuthToken } from '@/utils/getAuthToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UsePublishFormParams {
  formId?: string | string[];
  IsSurvey: boolean;
  IsDataCollection: boolean;
}

const API_BASE = '/api/builder';

const publishFormAction = async ({formId, IsSurvey, IsDataCollection }: UsePublishFormParams) => {
    const token = await getAuthToken();
     const url =  `${API_BASE}/${formId}/publish`
    try {
       await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          IsSurvey,
          IsDataCollection 
        }),
      });

    } catch (error) {
      toast.error('خطا در برقراری ارتباط با سرور.');
    }
};  


export function usePublishForm({ formId, IsSurvey, IsDataCollection }: UsePublishFormParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:() =>  publishFormAction({formId, IsSurvey, IsDataCollection}),
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
