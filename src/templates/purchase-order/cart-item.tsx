'use client';

import React from 'react';
import Image from 'next/image';
import { ICartItemProps } from '@/types/shoppingCart';
import TrashIcon from '@/../public/images/home-page/trash.svg';

function CartItem({ detail, onSelect, toggleConfirm, index, setDeleteId, setDescription }: ICartItemProps) {
  const { description, purchaseOrderProductModels, purchaseOrderDetailId } = detail;

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleConfirm();
    setDeleteId(purchaseOrderDetailId)
    setDescription(description)
  };

  // const handleConfirmAction = () => {
  //   onRemove(purchaseOrderDetailId);
  // };

  return (
    <>
      <div onClick={onSelect} className={`flex items-center gap-4 p-4 rounded-2xl border border-neutral-200`}>
        <div
          className='flex-shrink-0 w-12 h-12 rounded-2xl bg-[#F4F6FB] text-blue-500 font-bold flex items-center justify-center'>{index + 1}</div>

        <div className='flex-grow flex flex-col gap-1'>
          {description && <p className='font-bold text-gray-800 text-base leading-tight line-clamp-2'>{description}</p>}
          <div className='mt-1 flex flex-col gap-1'>
            {purchaseOrderProductModels?.map((product, i: number) => (
              <span key={product.purchaseOrderProductId + i} className='text-sm font-semibold text-gray-500 line-clamp-1'>
                <div className='flex items-center gap-1 '>
                  <span className={"font-normal text-blue-400"}>{i + 1}</span>
                  <span className={" text-md border-r border-[#F4F6FB] pr-1"}>
                    {product.title}
                  </span>
                </div>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleRemoveClick}
          className='flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors'
          aria-label='حذف آیتم'>
          <Image src={TrashIcon} alt='delete' width={24} height={24} unoptimized/>
        </button>
      </div>
    </>
  );
}

export default CartItem;
