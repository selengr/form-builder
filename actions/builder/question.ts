'use server';

import { api } from '@/services/axios/actionWapper';

export interface IPostPackageFormInjectionBody {
  position: number;
  targetFormId: number;
  selectedFormId: number;
}

export async function createQuestionAction(payload: any) {
  return api.post('/question', payload);
}

export async function updateQuestionAction(questionId: string, payload: any) {
  return api.put(`/question/${questionId}`, payload);
}

export async function createPackagingFormInjection(payload: IPostPackageFormInjectionBody) {
  return api.post('/form/form-injection', payload);
}
