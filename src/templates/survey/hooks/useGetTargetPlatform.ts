import { AxiosApi } from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';

export interface IGetTargetPlatform {
  value: string;
  caption: string;
}

const fetchTargetPlatformData = async () => {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/survey/target-platform/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const useGetTargetPlatform = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['TargetPlatform'],
    queryFn: () => fetchTargetPlatformData(),
    gcTime: 600000,
    staleTime: 0,
    retry: 3,
  });

  return {
    isFetchingTargetPlatform: isFetching,
    TargetPlatform : data?.dataList,
  };
};
