'use server';

import { api } from '@/services/axios/actionWapper';

export interface IGetSurvey {
  value: string;
  caption: string;
}

type SurveyPurposeResponse = {
  dataList: IGetSurvey[];
};

export async function getSurveyPurposeAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const url =
    `/admin/form/survey/survey-purpose/custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  return api.get<SurveyPurposeResponse>(url);
}
