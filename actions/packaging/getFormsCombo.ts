'use server';

import { api } from '@/services/axios/actionWapper';

export interface IGetList {
  value: string;
  caption: string;
}

type IProps = {
  dataList: IGetList[];
};

export async function getPackagingFormsComboAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const baseUrl = `/form/forms-custom-combo`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const url = baseUrl + queryString;

  return api.get<IProps>(url);
}

// 'use server';

// import { serverApi } from '@/services/axios/serverApi';

// export interface IGetList {
//   value: string;
//   caption: string;
// }

// type IProps = {
//   dataList: IGetList[];
// };

// export async function getPackagingFormsComboAction(): Promise<IProps> {
// // try{  
//   const customComboFilterModel = {
//     type: 'COMBO',
//     entity: 'PROJECTS',
//     input: '',
//     page: 0,
//     rows: 1000,
//   };

//   const baseUrl = `/form/forms-custom-combo`;
//   const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
//   const url = baseUrl + queryString;

//   const { data } = await serverApi.get<IProps>(url);
//   return data;
// // } catch (error: any) {
// //   const message =
// //     error?.response?.data?.message?.[0]?.title ||
// //     error?.response?.data?.message ||
// //     'خطای نامشخص';

// //   throw new Error(message);
// // }
// }