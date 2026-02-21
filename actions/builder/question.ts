'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function createQuestionAction(payload: any) {
  try {
    const res: any = await serverApi.post('/question', payload);
    return { data: res.data };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(error?.message || 'خطای نامشخص');
    throw err;
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