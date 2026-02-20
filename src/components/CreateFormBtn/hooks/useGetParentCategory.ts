import { useQuery } from '@tanstack/react-query';
import { fetchParentCategory } from '../../../../actions/builder/categoryActions';

export interface IGetCategory {
  value: string;
  caption: string;
}

export const useGetParentCategory = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['PARENT_CATEGORY'],
    queryFn: () => fetchParentCategory(),
    gcTime: 600000,
    staleTime: 0,
    retry: 3,
  });

  const Category = data?.dataList?.map((item: IGetCategory) => ({
    value: item.value,
    label: item.caption,
  }));

  return {
    isFetchingCategory: isFetching,
    Category,
  };
};
