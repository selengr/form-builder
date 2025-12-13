import { AxiosApi } from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';

export interface IGetSurvey {
  value: string;
  caption: string;
}

export const SURVEY_PURPOSE_QUERY_KEY = ['survey-purpose'];

export const fetchSurveyData = async () => {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/survey/survey-purpose/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const useGetSurveyPurpose = () => {
    const { data, isFetching } = useQuery({
    queryKey: SURVEY_PURPOSE_QUERY_KEY,
    queryFn: () => fetchSurveyData(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    isFetchingSurvey: isFetching,
    Survey : data?.dataList,
  };
};
