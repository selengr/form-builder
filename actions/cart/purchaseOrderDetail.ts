'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function deletePurchaseOrderDetailAction(id: number) {
  // try {
    const res = await serverApi.delete(`/purchase-order/purchase-order-detail/${id}`);
    return res.data;
  // } catch (error) {
  //   throw error;
  // }
}