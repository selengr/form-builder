import AxiosApi from '@/services/axios/AxiosApi';
import {useQuery} from '@tanstack/react-query';


const fetchSubcategoryData = async () => {
  const customComboFilterModel = {
    type: "COMBO",
    entity: "PROJECTS",
    input: "",
    page: 0,
    rows: 1000
  };

  const baseUrl = `/category/subcategory`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;
  const response = await AxiosApi.get(url);
  return response.data;
}



export const useGetSubCategory = () => {

  const {data, isFetching} = useQuery({
    queryKey: ['SUB_CATEGORY'],
    queryFn: () => fetchSubcategoryData(),
    gcTime: 600000,
    staleTime: 0,
    retry: 3
  });

    return {
    isFetchingOnlyAllQuestions: isFetching,
    onlyAllQuestions: data?.dataList,

  };

};
