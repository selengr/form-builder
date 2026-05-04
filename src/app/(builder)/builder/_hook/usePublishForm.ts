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

const publishFormAction = async ({ formId, IsSurvey, IsPackaging }: UsePublishFormParams) => {
  const token = await getAuthToken();
  const url = `${API_BASE}/${formId}/publish`

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      IsSurvey,
      IsPackaging
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    let errorMessage = ''

    if (Array.isArray(result?.error) && result.error[0]?.title) {
      errorMessage = result.error[0].title;
    }

    throw new Error(errorMessage);
  }

  return result;
};

export function usePublishForm({ formId, IsSurvey, IsPackaging }: UsePublishFormParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => publishFormAction({ formId, IsSurvey, IsPackaging }),
    onSuccess: () => {
      toast.success('عملیات با موفقیت انجام شد');
      queryClient.invalidateQueries({
        queryKey: ['form-builder', formId],
      });
    },
    onError: (err) => {
      toast.error(err.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });
}
