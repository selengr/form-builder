'use server';

import { api } from '@/services/axios/actionWapper';

export interface IGetTargetPlatform {
  value: string;
  caption: string;
}

type TargetPlatformResponse = {
  dataList: IGetTargetPlatform[];
};

export async function getTargetPlatformAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const url =
    `/admin/form/survey/target-platform/custom-combo?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  return api.get<TargetPlatformResponse>(url);
}
