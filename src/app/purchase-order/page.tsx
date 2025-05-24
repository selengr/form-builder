"use client";
import { toast } from "sonner";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// services
import AxiosApi from "@/services/axios/AxiosApi";
// components
import { CircleLoading } from "@/components";
// templates
import { CartItem, InvoiceItem, EmptyCart } from "@/templates/purchase-order";
// _hook
import { useGetPurchaseOrder } from "./_hook/useGetPurchaseOrder";

export default function ShoppingCartPage() {
  const { push } = useRouter();
  const [open, setOpen ] = useState(false)
  const [loading, setLoading ] = useState(false)

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { data: purchaseOrder, isFetching, error } = useGetPurchaseOrder();
  const { purchaseOrderDetailModels } = purchaseOrder || {};

  useEffect(() => {
    if (purchaseOrder && purchaseOrder.purchaseOrderDetailModels.length > 0) {
      setSelectedIndex(0);
    }
  }, [purchaseOrder]);

  const handleRemoveDetail = async (id: number) => {
    try {
      setLoading(true);
      const res: any = await AxiosApi.delete(
        `/purchase-order/purchase-order-detail/${id}`
      );
      if (res.data) {
        toast.success("با موفقیت حذف شد");
      } else {
        toast.error("ناموفق بود مجددا امتحان فرمایید");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); 
    }

  };

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index);
  };

  const toggleConfirm = () => {
    setOpen((prev)=> !prev)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount / 1000) + " هزار تومان";
  };

  const subtotal = purchaseOrder?.totalAmount || 0;
  const tax = purchaseOrder?.tax || 0;
  const total = purchaseOrder?.payAble ?? subtotal + tax;


  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>خطا در بارگذاری اطلاعات: {error.message}</p>
      </div>
    );
  }

  if (
    !purchaseOrderDetailModels ||
    (purchaseOrderDetailModels.length === 0 && !isFetching)
  ) {
    return <EmptyCart />;
  }

  const handlePayment = () => {
    if (purchaseOrder?.purchaseOrderId) {
      push(
        `/purchase-order/${JSON.stringify(
          purchaseOrder.purchaseOrderId
        )}/gateway`
      );
    }
  };

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
            {isFetching && <CircleLoading text="در حال بارگذاری..." />}
            <div className="space-y-3 px-2 md:px-8">
              {purchaseOrderDetailModels?.map((detail, index) => (
                <CartItem
                  key={index}
                  open={open}
                  index={index}
                  detail={detail}
                  loading={loading}
                  toggleConfirm={toggleConfirm}
                  isSelected={index === selectedIndex}
                  onSelect={() => handleSelectItem(index)}
                  onRemove={handleRemoveDetail}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[30%] bg-white rounded-[20px] p-2 flex flex-col justify-between ml-2">
        <div className="bg-[#F7F7FF] rounded-lg w-full min-h-[52px] text-center mb-3 flex justify-center items-center ">
          <h3 className="text-[#161616] font-bold text-base">صورتحساب</h3>
        </div>
        <div className="mb-3 overflow-y-auto flex-grow">
          <div className="space-y-2">
            {purchaseOrderDetailModels.length > 0 &&
              selectedIndex < purchaseOrderDetailModels.length && (
                <InvoiceItem
                  key={selectedIndex}
                  index={selectedIndex + 1}
                  detail={purchaseOrderDetailModels[selectedIndex]}
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
              <span className="font-bold text-[#393939]">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-[13px] text-[#393939] font-[500px]">
                مالیات:
              </span>
              <span className="font-bold text-[#393939]">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-[13px] text-[#393939] font-[500px]">
                قابل پرداخت:
              </span>
              <span className="font-bold text-[#393939]">
                {formatCurrency(total)}
              </span>
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
            disabled={!purchaseOrder?.purchaseOrderId}
            onClick={handlePayment}
          >
            <span className="text-[14px] font-[500px]">پرداخت صورت حساب</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
