'use server';
import { api } from '@/services/axios/actionWapper';

export async function upsertStartPageAction(payload: any) {
  return api.put('/form/start-page', payload);
}
// import { serverApi } from '@/services/axios/serverApi';

// export async function upsertStartPageAction(payload: any) {
//   const res: any = await serverApi.put('/form/start-page', payload);
//   return { data: res.data };
// }