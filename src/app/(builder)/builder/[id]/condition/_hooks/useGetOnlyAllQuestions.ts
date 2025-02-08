
import AxiosApi from '@/services/axios/AxiosApi';
import { useQuery } from '@tanstack/react-query';
import { IConditionQuestionType } from '@/types/condition';


const fetchData = async () => {
    const customComboFilterModel = {
        type: "COMBO",
        entity: "QUESTIONS",
        mode: "QUESTIONS_IN_FORM_BUILDER__ALL",
        input: "",
        page: 0,
        rows: 10000,
        extMap: {
          formId: 21,
          typeRequest: "ONLY_ALL_QUESTIONS" 
        }
    }

        const baseUrl = '/question/q-and-c-custom-combo';
        const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
        const url = baseUrl + queryString;
        const response = await AxiosApi.get(url);
        return response.data;
}



export const useGetOnlyAllQuestions = () => {

  const { data, isFetching } = useQuery({
    queryKey: ['ONLY_ALL_QUESTIONS'],
    queryFn: () => fetchData(),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3
  });

  const onlyAllQuestionsOptions = data?.dataList?.map((item : IConditionQuestionType) => ({
    value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
    label: item.caption,
  }));



  const onlySomeQuestionsOptions = data?.dataList
  ?.filter((item : IConditionQuestionType) => {
    const { TEXT_FIELD_PATTERN, SPECTRAL_TYPE, MULTI_SELECT } = item.extMap;
    const isMultiSelect = MULTI_SELECT === "false";
    const isSpectralSingle = SPECTRAL_TYPE === "SPECTRAL";
    const isTextFieldNumber = TEXT_FIELD_PATTERN === "NUMBER";
    
    return isTextFieldNumber || isMultiSelect || isSpectralSingle;
  })
  ?.map((item : IConditionQuestionType) => ({
    value: `${item?.extMap.UNIC_NAME}@${item.caption}`,
    label: item.caption,
  }));

  return {
    isFetchingOnlyAllQuestions: isFetching,
    onlyAllQuestions: data?.dataList,
    onlyAllQuestionsOptions,
    onlySomeQuestionsOptions,
  };
};
