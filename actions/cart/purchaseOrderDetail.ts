'use server';

import { api } from '@/services/axios/actionWapper';

export async function deletePurchaseOrderDetailAction(id: number) {
  return api.delete(`/purchase-order/purchase-order-detail/${id}`);
}
