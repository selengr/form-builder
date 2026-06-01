
'use server';

import { api } from '@/services/axios/actionWapper'; 

export async function creatFormAction(body: any) {
  return api.post<{ id: string }>('/form', body);
}


// 'use server';

// import { serverApi } from '@/services/axios/serverApi';

// export async function creatFormAction(body: any) {
//   // try {
//     const res = await serverApi.post('/form', body);
//     return { data: res.data };
//   // } catch (error: any) {
//   //   const message =
//   //     error?.response?.data?.message?.[0]?.title ||
//   //     error?.response?.data?.message ||
//   //     error?.response?.data ||
//   //     error?.message ||
//   //     'خطا در ایجاد فرم';

//   //   throw new Error(message);
//   // }
// }