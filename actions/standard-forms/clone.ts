'use server';

import { api } from '@/services/axios/actionWapper';

export async function clonePackageAction(id: number) {
  return api.post('/user/packaging/clone', { id });
}


// 'use server';

// import { serverApi } from "@/services/axios/serverApi";

// export async function clonePackageAction(id: number) {
//   // try {
//     const url = `/user/packaging/clone`;
//     const res = await serverApi.post(url, {id});
//     return res.data;

//   // } catch (error: any) {
//   //   const message =
//   //     error?.response?.data?.message?.[0]?.title ||
//   //     error?.response?.data?.message ||
//   //     'خطا در ثبت';

//   //   throw new Error(message);
//   // }
// }