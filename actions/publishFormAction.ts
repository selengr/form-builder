'use server';

import { serverApi } from '@/services/axios/serverApi';

interface PublishFormParams {
  formId: string | string[];
  survey: boolean;
  dataCollection: boolean;
}

export async function publishFormServer({ formId, survey, dataCollection }: PublishFormParams) {
  if (!formId) throw new Error('Form id is required');

  try { 
    if (survey) {
      return await serverApi.put(`/admin/form/survey/finalization/${formId}`);
    } else if (dataCollection) {
      return await serverApi.put(`/admin/form/data-collection/finalization/${formId}`);
    } else {
      return await serverApi.put(`/form/ready-to-publish/${formId}`);
    }
  } catch (error) {
    throw new Error('Error publishing form');
  }
}

export async function publishFormAction(formId: string|string[], survey: boolean, dataCollection: boolean ) {
  await publishFormServer({ formId, survey, dataCollection });
}