'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface IGetPackagePurpose {
  value: string;
  caption: string;
}

type IPurposeResponse = {
  dataList: IGetPackagePurpose[];
};

export async function getPackagePurposeAction(): Promise<IPurposeResponse> {
// try{  
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/admin/form/packaging/packaging-purpose/custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;

  const { data } = await serverApi.get<IPurposeResponse>(url);
  return data;
// } catch (error: any) {
//   const message =
//     error?.response?.data?.message?.[0]?.title ||
//     error?.response?.data?.message ||
//     error?.response?.data ||
//     error?.message ||
//     'خطای نامشخص';

//   throw new Error(message);
// }
}