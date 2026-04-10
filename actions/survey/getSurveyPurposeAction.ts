'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface IGetSurvey {
  value: string;
  caption: string;
}

type SurveyPurposeResponse = {
  dataList: IGetSurvey[];
};

export async function getSurveyPurposeAction(): Promise<SurveyPurposeResponse> {
try{  
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/survey/survey-purpose/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;

  const { data } = await serverApi.get<SurveyPurposeResponse>(url);
  return data;
} catch (error: any) {
  const message =
    error?.response?.data?.message?.[0]?.title ||
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    'خطای نامشخص';

  throw new Error(message);
}
}