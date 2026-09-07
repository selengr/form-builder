'use server';

import { api } from '@/services/axios/actionWapper';

export async function getDestroyReportOptionsAction() {
  return api.get('/user/report-destroy-form/response-destroy');
}
