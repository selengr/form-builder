
import { useQuery } from '@tanstack/react-query';

const fetchData = async () => {
  const response = await fetch('http://localhost:3000/api/question/q-and-c-custom-combo?customComboFilterModel=%7B%22type%22%3A%22COMBO%22%2C%22entity%22%3A%22QUESTIONS%22%2C%22mode%22%3A%22QUESTIONS_IN_FORM_BUILDER__ALL%22%2C%22input%22%3A%22%22%2C%22page%22%3A0%2C%22rows%22%3A10000%2C%22extMap%22%3A%7B%22formId%22%3A81%2C%22typeRequest%22%3A%22QAC_WIHT_OUT_FILTER%22%7D%7D');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const useGetQacWithOutFilter = () => {

  const { data, isFetching } = useQuery({
    queryKey: ['QAC_WIHT_OUT_FILTER'],
    queryFn: () => fetchData(),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3
  });

  const qacWithOutFilterOptions = data?.dataList?.map((item) => {
    const isCalculation = item.elementStr === "CALCULATION";
    const isTextFieldDate = item.extMap.TEXT_FIELD_PATTERN === "DATE";
    const isSpectralDouble = item.extMap.SPECTRAL_TYPE === "DOMAIN";
    const isTextFieldNumber = item.extMap.TEXT_FIELD_PATTERN === "NUMBER";
    const isMultiSelect = item.extMap.MULTI_SELECT ? JSON.parse(item.extMap.MULTI_SELECT) : false;
    
    const questionType = isCalculation
      ? `${item.elementStr}*${item.extMap.UNIC_NAME}`
      : isTextFieldDate
      ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
      : isMultiSelect
      ? `${item.extMap.QUESTION_TYPE}_MULTI_SELECT*${item.extMap.UNIC_NAME}`
      : isSpectralDouble
      ? `${item.extMap.QUESTION_TYPE}_${item.extMap.SPECTRAL_TYPE}*${item.extMap.UNIC_NAME}`
      : isTextFieldNumber 
      ? `${item.extMap.QUESTION_TYPE}_${item.extMap.TEXT_FIELD_PATTERN}*${item.extMap.UNIC_NAME}`
      : `${item.extMap.QUESTION_TYPE}*${item.extMap.UNIC_NAME || ""}`;

    return {
      value: questionType,
      label: item.caption,
    };
  });

  return {
    isFetchingQacWithOutFilter: isFetching,
    qacWithOutFilter: data?.dataList,
    qacWithOutFilterOptions,
  };
};
