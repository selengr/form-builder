'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
// image
import TrashIcon from '@/../public/images/home-page/trash.svg';
import React, { useEffect, useState } from 'react';
// components
import ConfirmDialog from '@/components/confirm-dialog';
// hook
import { useGetPurchaseOrder } from './_hook/useGetPurchaseOrder';
// templates
import { CartItem, EmptyCart } from '@/templates/purchase-order';
import LoadingCart from '@/templates/purchase-order/loading-cart';
// actions
import { deletePurchaseOrderDetailAction } from '../../../actions/cart/purchaseOrderDetail';
import { ShoppingCartSkeleton } from '@/templates/purchase-order/cart-skeleton';

const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
const formatCurrencyNumber = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);

const InvoiceSection = ({ purchaseOrder, handlePayment }: any) => {
  const { totalAmount, infrastructureCost, purchaseOrderDetailModels, tax, payAble, purchaseOrderId } = purchaseOrder || {};
  const subtotal = totalAmount || 0;
  const infrastructureCostFinal = purchaseOrderDetailModels.length * infrastructureCost;
  const total = payAble

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm flex flex-col lg:max-h-screen w-full'>
      <div className='bg-[#F7F7FF] rounded-lg h-12 flex justify-center items-center mb-4'>
        <h3 className='text-[#161616] font-bold text-base'>صورتحساب</h3>
      </div>

      <div className='bg-[#F4F6FB] rounded-2xl flex flex-col gap-3 p-4 mt-auto'>
        <div className='flex justify-between text-sm text-[#393939] font-medium'>
          <span>مجموع:</span>
          <span className='font-bold'>{formatCurrency(subtotal)}</span>
        </div>
        {/*<hr className='border-gray-300 border-dashed border-b-1 mx-3' />*/}
        {/*<div className='flex justify-between text-sm text-[#393939] font-medium'>*/}
        {/*  <span>مالیات:</span>*/}
        {/*  <span className='font-bold'>{formatCurrency(tax || 0)}</span>*/}
        {/*</div>*/}
        <hr className='border-gray-300 border-dashed border-b-1 mx-3' />
        <div className='flex justify-between text-sm text-[#393939] font-medium items-center'>
          <div className='flex flex-col'>
            <span>هزینه:</span>
            <span>زیرساخت</span>
          </div>
          <div className='flex flex-row'>
            <span className='flex justify-end font-light text-xs'>({purchaseOrderDetailModels.length}*{formatCurrencyNumber(infrastructureCost)})</span>
            <span className='font-bold'>{formatCurrency(infrastructureCostFinal)}</span>
          </div>
        </div>

        <hr className='border-gray-300 border-dashed border-b-1 mx-3' />
        <div className='flex justify-between text-sm text-[#1758BA] font-bold'>
          <span>قابل پرداخت:</span>
          <span className='font-bold'>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button
        type='button'
        variant='contained'
        sx={{
          backgroundColor: '#1758BA',
          borderRadius: '10px',
          height: '50px',
          marginTop: '1rem',
          '&.MuiButtonBase-root:hover': {
            backgroundColor: '#1758BA',
          },
        }}
        disabled={!purchaseOrderId}
        onClick={handlePayment}>
        <span className='text-sm font-medium'>پرداخت صورت حساب</span>
      </Button>
    </div>
  );
};

const PageStateWrapper = ({ isFetching, error, purchaseOrderDetailModels }: any) => {
  return <ShoppingCartSkeleton />; 
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen text-red-500 p-4'>
        <p>خطا در بارگذاری اطلاعات: {error.message}</p>
      </div>
    );
  }

  const isEmpty = !purchaseOrderDetailModels?.length;
  if (isEmpty) return <EmptyCart />;

  return null;
};

export default function ShoppingCartPage() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteDescription, setDescription] = useState<string>("");

  const { data: purchaseOrder, isFetching, error, refetch } = useGetPurchaseOrder();
  const purchaseOrderDetailModels = purchaseOrder?.purchaseOrderDetailModels;

  useEffect(() => {
    if (purchaseOrderDetailModels && purchaseOrderDetailModels.length > 0) {
      setSelectedIndex(0);
    }
  }, [purchaseOrderDetailModels]);

  const handleRemoveDetail = async () => {
    try {
      setLoading(true);
      const data = await deletePurchaseOrderDetailAction(deleteId as number);
      if (data) {
        toast.success('با موفقیت حذف شد');
        await refetch();
      } else {
        toast.error('ناموفق بود مجددا امتحان نمایید');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('خطایی رخ داد');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handlePayment = () => {
    if (purchaseOrder?.purchaseOrderId) {
      push(`/purchase-order/${purchaseOrder.purchaseOrderId}/gateway`);
    }
  };

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index);
  };

  const toggleConfirm = () => setOpen((prev) => !prev);

  const pageState = <PageStateWrapper isFetching={isFetching} error={error} purchaseOrderDetailModels={purchaseOrderDetailModels} />;

  if (isFetching || error || !purchaseOrderDetailModels || purchaseOrderDetailModels.length === 0) {
    return <ShoppingCartSkeleton />
  }

  return <ShoppingCartSkeleton />
  return (
    <>
      <div dir='rtl' className='w-full px-2 py-4 lg:p-4 flex flex-col lg:flex-row gap-4 h-[calc(100vh-60px)] lg:h-screen'>
        <div className='w-full flex-grow bg-white rounded-2xl p-4 shadow-sm lg:max-h-screen flex flex-col mobile:mb-[10px] lg:mb-0 h-2/3 lg:h-full'>
          <div className='bg-[#F7F7FF] rounded-lg h-12 flex justify-center items-center mb-6 shrink-0'>
            <h3 className='text-[#161616] font-bold text-base'>سبد خرید</h3>
          </div>
          <div className='flex-1 overflow-y-auto space-y-4 px-2 lg:px-6'>
            {purchaseOrderDetailModels?.map((detail, index) => (
              <CartItem
                key={detail.purchaseOrderDetailId}
                open={open}
                index={index}
                detail={detail}
                loading={loading}
                toggleConfirm={toggleConfirm}
                isSelected={index === selectedIndex}
                onSelect={() => handleSelectItem(index)}
                // onRemove={handleRemoveDetail}
                setDeleteId={setDeleteId}
                setDescription={setDescription}
              />
            ))}
          </div>
        </div>

        <div className='w-full lg:w-[450px] hidden lg:flex'>
          <InvoiceSection purchaseOrder={purchaseOrder} handlePayment={handlePayment} />
        </div>

        <div className='z-20 lg:hidden'>
          <InvoiceSection purchaseOrder={purchaseOrder} handlePayment={handlePayment} />
        </div>
      </div>


      <ConfirmDialog
        content={
          <>
            <div className='flex flex-row items-center'>
              <Image src={TrashIcon} alt='delete' width={20} height={20} />
              <span className='text-xs'>{deleteDescription}</span>
            </div>
            <br />
            <p>آیا از انجام عملیات حذف این مورد اطمینان دارید؟</p>
          </>
        }
        open={open}
        title='حذف آیتم'
        loading={loading}
        onClose={toggleConfirm}
        cancelText='انصراف'
        action={
          <Button
            type='submit'
            fullWidth
            disableRipple
            disableElevation
            variant='contained'
            disabled={loading}
            sx={{
              height: '52px',
              fontWeight: 500,
              fontSize: '16px',
              borderRadius: '12px',
              boxShadow: 'none',
              textTransform: 'none',
            }}
            onClick={handleRemoveDetail}>
            حذف کن
          </Button>
        }
      />
    </>
  );
}
