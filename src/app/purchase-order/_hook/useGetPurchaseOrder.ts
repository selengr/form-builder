import { useQuery } from '@tanstack/react-query';
// actions
import { getPurchaseOrderAction } from '../../../../actions/cart/purchaseOrder';

export const useGetPurchaseOrder = () => {
  return useQuery({
    queryKey: ['purchaseOrder'],
    queryFn: () => getPurchaseOrderAction(),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    placeholderData: {
      purchaseOrderId: 0,
      totalAmount: 0,
      tax: 0,
      payAble: null,
      purchaseOrderDetailModels: [],
    },
  });
};
