import { useQuery } from '@tanstack/react-query';
import { getPurchaseOrderAction } from '@actions/cart/purchaseOrder';
import type { IPurchaseOrder } from '@/types/shoppingCart';

const emptyPurchaseOrder: IPurchaseOrder = {
  purchaseOrderId: 0,
  totalAmount: 0,
  tax: 0,
  payAble: null,
  purchaseOrderDetailModels: [],
};

export const useGetPurchaseOrder = () => {
  return useQuery({
    queryKey: ['purchaseOrder'],
    queryFn: async () => {
      const res = await getPurchaseOrderAction();
      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت سبد خرید');
      }
      return res.data;
    },
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    placeholderData: emptyPurchaseOrder,
  });
};
