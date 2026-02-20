'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';
import { IPurchaseOrder } from '@/types/shoppingCart';

export async function getPurchaseOrderAction() {
  const baseUrl = '/purchase-order/invoice';
  const response = await AxiosApi.get<IPurchaseOrder>(baseUrl);
  return response.data;
}