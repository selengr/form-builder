export interface IPurchaseOrder {
  purchaseOrderId: number;
  totalAmount: number;
  tax: number;
  payAble: number | null;
  purchaseOrderDetailModels: IPurchaseOrderDetail[];
}

export interface IPurchaseOrderProduct {
  title: string;
  purchaseOrderProductId: number; // این فیلد اضافه شد
}

export interface IPurchaseOrderDetail {
  description: string;
  purchaseOrderDetailId: number;
  purchaseOrderProductModels: IPurchaseOrderProduct[];
}

// ----------------------------------------------------------------

export interface ICartItemProps {
  detail: IPurchaseOrderDetail;
  index: number;
  open: boolean;
  loading: boolean;
  isSelected: boolean;
  onSelect: () => void;
  setDeleteId: (id:number) => void;
  setDescription: (description:string) => void;
  onRemove?: (id: number) => void;
  toggleConfirm: () => void;
}
