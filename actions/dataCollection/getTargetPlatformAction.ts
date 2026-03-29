'use server';

import { serverApi } from '@/services/axios/serverApi';

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

  const { data } = await serverApi.get<TargetPlatformResponse>(baseUrl + queryString);
  return data;
}