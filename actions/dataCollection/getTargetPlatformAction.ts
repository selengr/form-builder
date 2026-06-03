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
  // try {
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
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';

  //   throw new Error(message);
  // }
  }