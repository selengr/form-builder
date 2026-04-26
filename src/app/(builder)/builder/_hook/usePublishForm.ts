'use client';

import { toast } from 'sonner';
import { getAuthToken } from '@/utils/getAuthToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UsePublishFormParams {
  formId?: string | string[];
  IsSurvey: boolean;
  IsPackaging: boolean;
}

const API_BASE = '/api/builder';

const publishFormAction = async ({formId, IsSurvey, IsPackaging }: UsePublishFormParams) => {
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
          IsPackaging 
        }),
      });

    } catch (error:any) {
      toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    }
};  


export function usePublishForm({ formId, IsSurvey, IsPackaging }: UsePublishFormParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:() =>  publishFormAction({formId, IsSurvey, IsPackaging}),
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
