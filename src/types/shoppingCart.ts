export interface IPurchaseOrder {
    purchaseOrderId: number
    totalAmount: number
    tax: number
    payAble: number | null
    purchaseOrderDetailModels: IPurchaseOrderDetail[]
  }
  
 export interface IPurchaseOrderProduct {
    title: string
 }
  
 export interface IPurchaseOrderDetail {
   description: string | null
   purchaseOrderProductModels: IPurchaseOrderProduct[]
 }
  

 // ----------------------------------------------------------------

  
 export interface ICartItemProps {
    detail: IPurchaseOrderDetail
    index: number
    isSelected: boolean
    onSelect: () => void
    onRemove: () => void
  }


 export interface InvoiceItemProps {
    detail: IPurchaseOrderDetail
    index: number
  }
  