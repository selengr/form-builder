'use server';

import { serverApi } from '@/services/axios/serverApi';
import { IPurchaseOrder } from '@/types/shoppingCart';

export async function getPurchaseOrderAction() {
  const baseUrl = '/purchase-order/invoice';
  const response = await serverApi.get<IPurchaseOrder>(baseUrl);
  return response.data;
}