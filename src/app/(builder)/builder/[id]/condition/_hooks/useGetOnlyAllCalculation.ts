import AxiosApi from '@/services/axios/AxiosApi';
import {useQuery} from '@tanstack/react-query';
import {IConditionQuestionType} from '@/types/condition';
import {useParams} from 'next/navigation';

const fetchData = async (id: string | string[]) => {
  const customComboFilterModel = {
    type: "COMBO",
    entity: "QUESTIONS",
    mode: "QUESTIONS_IN_FORM_BUILDER__ALL",
    input: "",
    page: 0,
    rows: 10000,
    extMap: {
      formId: id,
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
  const {id} = useParams();
  const {data, isFetching} = useQuery({
    queryKey: ['ONLY_ALL_CALC'],
    queryFn: () => fetchData(id),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3
  });


  const onlyAllCalculationOptions = data?.dataList?.map((item: IConditionQuestionType) => ({
    value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
    label: item.caption,
  }));


  return {
    isFetchingOnlyAllCalculation: isFetching,
    onlyAllCalculation: data?.dataList,
    onlyAllCalculationOptions
  };
};
