'use server';

import { api } from '@/services/axios/actionWapper';

export interface EndPagePayload {
  formId: number | string;
  description: string;
  endPageId?: number | string;
}

export interface EndPageResponse {
  endPageId: number | string;
  description: string;
}

export async function createEndPageAction(payload: EndPagePayload) {
  return api.post<EndPageResponse>('/form/end-page', payload);
}

export async function updateEndPageAction(payload: EndPagePayload) {
  return api.put<EndPageResponse>('/form/end-page', payload);
}


// 'use server';

// import { serverApi } from '@/services/axios/serverApi';

// export async function createEndPageAction(payload: any) {
//   const res: any = await serverApi.post('/form/end-page', payload);
//   return { data: res.data };
// }

// export async function updateEndPageAction(payload: any) {
//   const res: any = await serverApi.put('/form/end-page', payload);
//   return { data: res.data };
// }