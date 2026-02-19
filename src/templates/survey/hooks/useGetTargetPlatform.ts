import { useQuery } from '@tanstack/react-query';
// actions
import { fetchTargetPlatformDataAction, TARGET_PLATFORM_QUERY_KEY } from '../../../../actions/survey/getTargetPlatformAction';

export interface IGetTargetPlatform {
  value: string;
  caption: string;
}

export const useGetTargetPlatform = () => {
  const { data, isFetching } = useQuery({
    queryKey: TARGET_PLATFORM_QUERY_KEY,
    queryFn: () => fetchTargetPlatformDataAction(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    isFetchingTargetPlatform: isFetching,
    TargetPlatform : data?.dataList,
  };
};
