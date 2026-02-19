'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export interface IGetSurvey {
  value: string;
  caption: string;
}

export const SURVEY_PURPOSE_QUERY_KEY = ['survey-purpose'] as const;

export async function getSurveyPurposeAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = '/admin/form/survey/survey-purpose/custom-combo';
  const queryString = `?customComboFilterModel=${encodeURIComponent(
    JSON.stringify(customComboFilterModel),
  )}`;

  const res = await AxiosApi.get(`${baseUrl}${queryString}`);
  return res.data;
}