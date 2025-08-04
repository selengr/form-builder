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
    description: string | null;
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
    onRemove: (id: number) => void;
    toggleConfirm: () => void;
}
