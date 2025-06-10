import AxiosApi from '@/services/axios/AxiosApi';
import {useQuery} from '@tanstack/react-query';




export interface IGetCategory  {
  value: string;
  caption: string;
}

const fetchCategoryData = async () => {
  const customComboFilterModel = {
    type: "COMBO",
    entity: "PROJECTS",
    input: "",
    page: 0,
    rows: 1000
  };

  const baseUrl = `/category/parent`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;
  const response = await AxiosApi.get(url);
  return response.data;
}


export const useGetParentCategory = () => {

    const {data, isFetching} = useQuery({
    queryKey: ['PARENT_CATEGORY'],
    queryFn: () => fetchCategoryData(),
    gcTime: 600000,
    staleTime: 0,
    retry: 3
  });

console.log('Category : data?.datList :>> ', data?.dataList);
    return {
      isFetchingCategory: isFetching,
      Category : data?.dataList,
  };
};
