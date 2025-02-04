
import { useQuery } from '@tanstack/react-query';

const baseUrl = 'http://localhost:3000/api/question/q-and-c-custom-combo';
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

const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
const url = baseUrl + queryString;


const fetchData = async (url : string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const useGetOnlyAllCalculation = () => {

  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_CALC'],
    queryFn: () => fetchData(url),
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
