'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export interface IGetTargetPlatform {
  value: string;
  caption: string;
}

type TargetPlatformResponse = {
  dataList: IGetTargetPlatform[];
};

export async function getTargetPlatformAction(): Promise<TargetPlatformResponse> {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/survey/target-platform/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;

  const { data } = await AxiosApi.get<TargetPlatformResponse>(baseUrl + queryString);
  return data;
}