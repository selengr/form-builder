"use client";
import { toast } from "sonner";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AxiosApi from "@/services/axios/AxiosApi";
import { CircleLoading } from "@/components";
import { CartItem, InvoiceItem, EmptyCart } from "@/templates/purchase-order";
import { useGetPurchaseOrder } from "./_hook/useGetPurchaseOrder";

export default function ShoppingCartPage() {
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { data: purchaseOrder, isFetching, error, refetch } = useGetPurchaseOrder();
  const { purchaseOrderDetailModels } = purchaseOrder || {};

  useEffect(() => {
    // @ts-ignore
    if (purchaseOrder?.purchaseOrderDetailModels?.length > 0) {
      setSelectedIndex(0);
    }
  }, [purchaseOrder]);

  const handleRemoveDetail = async (id: number) => {
    try {
      setLoading(true);
      const res: any = await AxiosApi.delete(`/purchase-order/purchase-order-detail/${id}`);
      if (res.data) {
        toast.success("با موفقیت حذف شد");
        toggleConfirm();
        await refetch();
      } else {
        toast.error("ناموفق بود مجددا امتحان فرمایید");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index);
  };

  const toggleConfirm = () => setOpen((prev) => !prev);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fa-IR").format(amount / 1000) + " هزار تومان";

  const subtotal = purchaseOrder?.totalAmount || 0;
  const tax = purchaseOrder?.tax || 0;
  const total = purchaseOrder?.payAble ?? subtotal + tax;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>خطا در بارگذاری اطلاعات: {error.message}</p>
      </div>
    );
  }

  if (!purchaseOrderDetailModels || (purchaseOrderDetailModels.length === 0 && !isFetching)) {
    return <EmptyCart />;
  }

  const handlePayment = () => {
    if (purchaseOrder?.purchaseOrderId) {
      push(`/purchase-order/${JSON.stringify(purchaseOrder.purchaseOrderId)}/gateway`);
    }
  };

  return (
    <div dir="rtl" className="min-w-full mx-auto px-2 py-4 flex flex-col md:flex-row gap-4 min-[calc(h-screen - 60px)] md:min-h-screen bg-[#f9f9f9]">

      {/* سبد خرید */}
      <div className="w-full md:w-[70%] bg-white rounded-2xl p-4 shadow-sm flex flex-col grow md:max-h-screen overflow-hidden">
        <div className="bg-[#F7F7FF] rounded-lg h-12 flex justify-center items-center mb-6">
          <h3 className="text-[#161616] font-bold text-base">سبد خرید</h3>
        </div>

        <div className="overflow-y-auto flex-1 px-2 md:px-6 pb-36 md:pb-0">
          {isFetching && <CircleLoading text="در حال بارگذاری..." />}
          <div className="space-y-4">
            {purchaseOrderDetailModels.map((detail, index) => (
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

      {/* صورتحساب دسکتاپ */}
      <div className="w-full md:w-[30%] bg-white rounded-2xl p-4 shadow-sm flex-col max-h-screen hidden md:flex">
        <div className="bg-[#F7F7FF] rounded-lg h-12 flex justify-center items-center mb-4">
          <h3 className="text-[#161616] font-bold text-base">صورتحساب</h3>
        </div>

        <div className="overflow-y-auto grow mb-4">
          {purchaseOrderDetailModels.length > 0 && selectedIndex < purchaseOrderDetailModels.length && (
            <InvoiceItem
              key={selectedIndex}
              index={selectedIndex + 1}
              detail={purchaseOrderDetailModels[selectedIndex]}
            />
          )}
        </div>

        <div className="bg-[#F7F7FF] rounded-2xl flex flex-col gap-2 p-4">
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>مجموع:</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>مالیات:</span>
            <span className="font-bold">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>قابل پرداخت:</span>
            <span className="font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="contained"
          sx={{
            backgroundColor: "#1758BA",
            borderRadius: "10px",
            height: "52px",
            marginTop: "1rem",
            "&.MuiButtonBase-root:hover": {
              backgroundColor: "#1758BA",
            },
          }}
          disabled={!purchaseOrder?.purchaseOrderId}
          onClick={handlePayment}
        >
          <span className="text-sm font-medium">پرداخت صورت حساب</span>
        </Button>
      </div>

      {/* صورتحساب موبایل */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl p-4 shadow-lg z-20 flex flex-col md:hidden">
        <div className="bg-[#F7F7FF] rounded-lg h-12 flex justify-center items-center mb-4">
          <h3 className="text-[#161616] font-bold text-base">صورتحساب</h3>
        </div>

        <div className="mb-4">
          {purchaseOrderDetailModels.length > 0 && selectedIndex < purchaseOrderDetailModels.length && (
            <InvoiceItem
              key={selectedIndex}
              index={selectedIndex + 1}
              detail={purchaseOrderDetailModels[selectedIndex]}
            />
          )}
        </div>

        <div className="bg-[#F7F7FF] rounded-2xl flex flex-col gap-2 p-4">
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>مجموع:</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>مالیات:</span>
            <span className="font-bold">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#393939] font-medium">
            <span>قابل پرداخت:</span>
            <span className="font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="contained"
          sx={{
            backgroundColor: "#1758BA",
            borderRadius: "10px",
            height: "52px",
            marginTop: "1rem",
            "&.MuiButtonBase-root:hover": {
              backgroundColor: "#1758BA",
            },
          }}
          disabled={!purchaseOrder?.purchaseOrderId}
          onClick={handlePayment}
        >
          <span className="text-sm font-medium">پرداخت صورت حساب</span>
        </Button>
      </div>
    </div>
  );
}
