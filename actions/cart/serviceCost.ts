'use server';

import { api } from '@/services/axios/actionWapper';
import { IPurchaseOrder } from '@/types/shoppingCart';

export async function serviceCostAction() {
  return api.get<IPurchaseOrder>('/purchase-order/invoice');
}
