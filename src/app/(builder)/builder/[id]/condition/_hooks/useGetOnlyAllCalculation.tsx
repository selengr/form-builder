
import AxiosApi from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';

const fetchData = async () => {
    const customComboFilterModel = {
        type: "COMBO",
        entity: "QUESTIONS",
        mode: "QUESTIONS_IN_FORM_BUILDER__ALL",
        input: "",
        page: 0,
        rows: 10000,
        extMap: {
          formId: 81,
          typeRequest: "ONLY_ALL_CALC" 
        }
      };

        const baseUrl = '/question/q-and-c-custom-combo';
        const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
        const url = baseUrl + queryString;
        const response = await AxiosApi.get(url);
        return response.data;
}


export const useGetOnlyAllCalculation = () => {

  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_CALC'],
    queryFn: () => fetchData(),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3
  });

  const onlyAllCalculationOptions = data?.dataList?.map((item) => ({
    value: item.extMap.UNIC_NAME,
    label: item.caption,
  }));


  return {
    isFetchingOnlyAllCalculation: isFetching,
    onlyAllCalculation: data?.dataList,
    onlyAllCalculationOptions
  };
};
