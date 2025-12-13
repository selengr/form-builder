'use server';

import { revalidatePath } from 'next/cache';
import { AxiosApi } from '@/services/axios/AxiosApi';

interface PublishFormParams {
  formId: string | string[];
  survey?: string | null;
}

export async function publishFormServer({ formId, survey }: PublishFormParams) {
  if (!formId) throw new Error('Form id is required');

  try { 
    if (survey) {
      return await AxiosApi.put(`/admin/form/survey/finalization/${formId}`);
    } else {
      return await AxiosApi.put(`/form/ready-to-publish/${formId}`);
    }
  } catch (error) {
    throw new Error('Error publishing form');
  }
}

export async function publishFormAction(formId: string|string[], survey?: string) {
  await publishFormServer({ formId, survey });
  revalidatePath(`/builder/${formId}`);
}
