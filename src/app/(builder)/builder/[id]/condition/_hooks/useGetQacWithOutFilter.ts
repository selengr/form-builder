
import AxiosApi from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';


const fetchData = async () => {
        const customComboFilterModel = {"type":"COMBO","entity":"QUESTIONS","mode":"QUESTIONS_IN_FORM_BUILDER__ALL","input":"","page":0,"rows":10000,"extMap":{"formId":21,"typeRequest":"QAC_WIHT_OUT_FILTER"}}
        const baseUrl = '/question/q-and-c-custom-combo';
        const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
        const url = baseUrl + queryString;
        const response = await AxiosApi.get(url);
        return response.data;
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

  const qacWithOutFilterOptions = data?.dataList?.map((item : IConditionQuestionType) => {
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
