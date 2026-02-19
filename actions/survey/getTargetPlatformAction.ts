'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export interface IGetTargetPlatform {
  value: string;
  caption: string;
}

export const TARGET_PLATFORM_QUERY_KEY = ['TargetPlatform'] as const;

export async function fetchTargetPlatformDataAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/survey/target-platform/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(
    JSON.stringify(customComboFilterModel),
  )}`;

  const res = await AxiosApi.get(`${baseUrl}${queryString}`);
  return res.data;
}