'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function createQuestionAction(payload: any) {
  try {
    const res = await serverApi.post('/question', payload);
    return { data: res.data };
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}

export async function updateQuestionAction(questionId: string, payload: any) {
  try {
    const res: any = await serverApi.put(`/question/${questionId}`, payload);
    return { data: res.data };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(error?.message || 'خطای نامشخص');
    throw err;
  }
}