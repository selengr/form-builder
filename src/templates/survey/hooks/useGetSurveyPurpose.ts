import { useQuery } from '@tanstack/react-query';
// actions
import { getSurveyPurposeAction, SURVEY_PURPOSE_QUERY_KEY } from '../../../../actions/survey/getSurveyPurposeAction';

export const useGetSurveyPurpose = () => {
    const { data, isFetching } = useQuery({
    queryKey: SURVEY_PURPOSE_QUERY_KEY,
    queryFn: () => getSurveyPurposeAction(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    isFetchingSurvey: isFetching,
    Survey : data?.dataList,
  };
};
