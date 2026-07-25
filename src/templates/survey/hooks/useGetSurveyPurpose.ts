'use client';

import { useQuery } from '@tanstack/react-query';
import { getSurveyPurposeAction } from '../../../../actions/survey/getSurveyPurposeAction';

export const SURVEY_PURPOSE_QUERY_KEY = ['survey-purpose'] as const;

export function useGetSurveyPurpose(open:boolean) {
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: SURVEY_PURPOSE_QUERY_KEY,
    queryFn: () => getSurveyPurposeAction(),
    staleTime: 5 * 60 * 1000,
    enabled : open
  });

  return {
    isFetchingSurvey: isFetching,
    isLoadingSurvey: isLoading,
    isErrorSurvey: isError,
    errorSurvey: error,
    Survey: data?.dataList,
  };
}