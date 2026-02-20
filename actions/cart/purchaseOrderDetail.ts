'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function deletePurchaseOrderDetailAction(id: number) {
  try {
    const res = await AxiosApi.delete(`/purchase-order/purchase-order-detail/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}