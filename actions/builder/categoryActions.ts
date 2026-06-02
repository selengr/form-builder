'use server';

import { api } from '@/services/axios/actionWapper';

export async function fetchParentCategory() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const url =
    `/cateory/parent?customComboFilterModel=` +
    encodeURIComponent(JSON.stringify(customComboFilterModel));

  return api.get(url);
}

// 'use server';

// import { serverApi } from '@/services/axios/serverApi';

// export async function fetchParentCategory() {
//   // try {
//     const customComboFilterModel = {
//       type: 'COMBO',
//       entity: 'PROJECTS',
//       input: '',
//       page: 0,
//       rows: 1000,
//     };

//     const baseUrl = `/category/parent`;
//     const queryString = `?customComboFilterModel=${encodeURIComponent(
//       JSON.stringify(customComboFilterModel)
//     )}`;

//     const url = baseUrl + queryString;

//     const response = await serverApi.get(url);

//     if (!response?.data) {
//       throw new Error('خطا در دریافت اطلاعات');
//     }

//     return response.data;
//   // } catch (error: any) {
//   //   const message =
//   //     error?.response?.data?.message?.[0]?.title ||
//   //     error?.response?.data?.message ||
//   //     'انجام عملیات با خطا مواجه شد';

//   //   throw new Error(message);
//   // }
// }
