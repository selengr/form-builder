"use client"

import {useEffect, useState} from "react"


import Image from "next/image";
import {useRouter} from "next/navigation";
import BuilderLoading from "../(builder)/builder/[id]/loading";
import {CartItem} from "@/templates/purchase-order/cart-item";
import {useGetPurchaseOrder} from "./_hook/useGetPurchaseOrder"
import {InvoiceItem} from "@/templates/purchase-order/invoice-item";
import {Button} from "@mui/material";


export default function ShoppingCartPage() {
  const { push } = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const {data:purchaseOrder,isLoading,error} = useGetPurchaseOrder()


  useEffect(() => {
    if (purchaseOrder && purchaseOrder.purchaseOrderDetailModels.length > 0) {
      setSelectedIndex(0)
    }
  }, [purchaseOrder])

  const handleRemoveDetail = (index: number) => {
    if (!purchaseOrder) return

    const updatedPurchaseOrder = { ...purchaseOrder }
    const updatedDetails = [...updatedPurchaseOrder.purchaseOrderDetailModels]
    updatedDetails.splice(index, 1)

    if (selectedIndex >= updatedDetails.length) {
      setSelectedIndex(Math.max(0, updatedDetails.length - 1))
    } else if (index === selectedIndex && updatedDetails.length > 0) {
      setSelectedIndex(Math.min(selectedIndex, updatedDetails.length - 1))
    }

  }

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount / 1000) + " هزار تومان"
  }

  const subtotal = purchaseOrder?.totalAmount || 0
  const tax = purchaseOrder?.tax || 0
  const total = purchaseOrder?.payAble ?? subtotal + tax

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BuilderLoading />
        <span className="mr-2">در حال بارگذاری...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>خطا در بارگذاری اطلاعات: {error.message}</p>
      </div>
    )
  }


  return (
    <div
      dir="rtl"
      className="container mx-auto flex justify-center h-screen overflow-hidden py-4"
    >
      <div className="w-[70%] bg-white rounded-[20px] mx-[6px] p-2 ">
        <div className="bg-[#F7F7FF] rounded-lg w-ful h-[52px] text-center] mb-8  flex justify-center items-center ">
          <h3 className="text-[#161616] font-bold text-base">سبد خرید</h3>
        </div>
        <div className="w-full  justify-center items-center overflow-y-auto h-[calc(100%-80px)]">
          <div className="px-16 h-full">
          {purchaseOrder && purchaseOrder.purchaseOrderDetailModels.length > 0 ? (
                <div className="space-y-3 px-2 md:px-8">
                 {purchaseOrder.purchaseOrderDetailModels.map((detail, index) => (
                  <CartItem
                    key={index}
                    detail={detail}
                    index={index}
                    isSelected={index === selectedIndex}
                    onSelect={() => handleSelectItem(index)}
                    onRemove={() => handleRemoveDetail(index)}
                  />
                ))}
              </div>

            ) : (
              <div className="w-full h-[80%] justify-center items-center flex flex-col">
                <Image
                  src="/images/home-page/empty-shopping-cart.svg"
                  alt="empty"
                  width={200}
                  height={200}
                  className="w-full h-full max-h-[400px]"
                />
                <span className="text-[#404040] font-bold text-[15px] -mt-20">
                  در حال حاضر سبد خرید شما خالی است
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[30%] bg-white rounded-[20px] p-2 flex flex-col justify-between ml-2">
        <div className="bg-[#F7F7FF] rounded-lg w-full min-h-[52px] text-center mb-3 flex justify-center items-center ">
          <h3 className="text-[#161616] font-bold text-base">صورتحساب</h3>
        </div>
        <div className="mb-3 overflow-y-auto flex-grow">
        <div className="space-y-2">
        {purchaseOrder &&
              purchaseOrder.purchaseOrderDetailModels.length > 0 &&
              selectedIndex < purchaseOrder.purchaseOrderDetailModels.length && (
                <InvoiceItem
                  key={selectedIndex}
                  index={selectedIndex + 1}
                  detail={purchaseOrder.purchaseOrderDetailModels[selectedIndex]}
                />
              )}
           </div>
        </div>
        <div>
          <div className="bg-[#F7F7FF] rounded-[20px] w-ful text-center] my-[6px] mx-1 flex justify-center items-center flex-col p-4">
            <div className="flex justify-between w-full">
              <span className="text-[13px] text-[#393939] font-[500px]">
                مجموع:
              </span>
              <span className="font-bold text-[#393939]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-[13px] text-[#393939] font-[500px]">
                مالیات:
              </span>
              <span className="font-bold text-[#393939]">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-[13px] text-[#393939] font-[500px]">
                قابل پرداخت:
              </span>
              <span className="font-bold text-[#393939]">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "#1758BA",
              borderRadius: "10px",
              height: "52px",
              width: "100%",
              marginRight: "6px",
              marginY: "12px",
              "&.MuiButtonBase-root:hover": {
                backgroundColor: "#1758BA",
              },
            }}
            onClick={()=>{
              if(purchaseOrder?.purchaseOrderId){
                const id : string = JSON.stringify(purchaseOrder.purchaseOrderId)
                push(`/purchase-order/${id}/gateway`)
              }
            }}
          >
            <span className="text-[14px] font-[500px]">پرداخت صورت حساب</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
