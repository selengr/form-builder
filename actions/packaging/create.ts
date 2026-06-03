'use server';

import { api } from '@/services/axios/actionWapper';
import { IPayloadPackage } from '@/templates/packaging/hooks/useCreatePackaging';

export function createPackageAction(data: IPayloadPackage) {
  return api.post('/admin/packaging', data);
}

// 'use server';

// import { serverApi } from '@/services/axios/serverApi';
// import { IPayloadPackage } from '@/templates/packaging/hooks/useCreatePackaging';


// export async function createPackageAction(data : IPayloadPackage) {
//   // try {
//     const url = `/admin/packaging`;
//     const res = await serverApi.post(url, data);
//     return res.data;

//   // } catch (error: any) {
//   //   const message =
//   //     error?.response?.data?.message?.[0]?.title ||
//   //     error?.response?.data?.message ||
//   //     error?.response?.data ||
//   //     'خطا در ثبت';

//   //   throw new Error(message);
//   // }
// }