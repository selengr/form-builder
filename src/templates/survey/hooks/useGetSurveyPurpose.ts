'use client';

import { useQuery } from '@tanstack/react-query';
import { getSurveyPurposeAction } from '@actions/survey/getSurveyPurposeAction';

export const SURVEY_PURPOSE_QUERY_KEY = ['survey-purpose'] as const;

export function useGetSurveyPurpose(open?: boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: SURVEY_PURPOSE_QUERY_KEY,
    queryFn: async () => {
      const res = await getSurveyPurposeAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت جامعه هدف');
      }

      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open ?? true,
  });

  return {
    isFetchingSurvey: isFetching,
    isLoadingSurvey: isLoading,
    isErrorSurvey: isError,
    errorSurvey: error,
    Survey: data?.dataList,
  };
}
