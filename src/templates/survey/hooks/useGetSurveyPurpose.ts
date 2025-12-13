import { AxiosApi } from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';

export interface IGetSurvey {
  value: string;
  caption: string;
}

const fetchSurveyData = async () => {
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
    queryKey: ['survey-purpose'],
    queryFn: () => fetchSurveyData(),
    gcTime: 600000,
    staleTime: 0,
    retry: 3,
  });

  return {
    isFetchingSurvey: isFetching,
    Survey : data?.dataList,
  };
};
