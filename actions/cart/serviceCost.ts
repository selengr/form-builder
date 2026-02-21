'use server';

import { serverApi } from '@/services/axios/serverApi';
import { IPurchaseOrder } from '@/types/shoppingCart';

export async function serviceCostAction() {
  try {
    const baseUrl = '/purchase-order/invoice';
    const response = await serverApi.get<IPurchaseOrder>(baseUrl);
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}