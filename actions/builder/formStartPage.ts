'use server';
import { api } from '@/services/axios/actionWapper';

export interface StartPagePayload {
  formId: number | string;
  startPageMsg: string;
}

export interface StartPageResponse {
  startPageMsg: string;
}

export async function upsertStartPageAction(payload: StartPagePayload) {
  return api.put<StartPageResponse>('/form/start-page', payload);
}
