'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IPurchaseOrder } from '@/types/shoppingCart';

export async function serviceCostAction() {
  try {
    const baseUrl = '/purchase-order/invoice';
    const response = await AxiosApi.get<IPurchaseOrder>(baseUrl);
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}