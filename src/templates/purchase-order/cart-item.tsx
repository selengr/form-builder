"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import { ICartItemProps } from "@/types/shoppingCart";
import ConfirmDialog from "@/components/confirm-dialog";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import {PiDotOutlineFill} from "react-icons/pi";

function CartItem({
                      detail,
                      onSelect,
                      onRemove,
                      toggleConfirm,
                      loading,
                      open,
                      index
                  }: ICartItemProps) {
    const { description, purchaseOrderProductModels, purchaseOrderDetailId } = detail;

    const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleConfirm();
    };

    const handleConfirmAction = () => {
        onRemove(purchaseOrderDetailId);
    };

    return (
        <>
            <div
                onClick={onSelect}
                className={`flex items-center gap-4 p-4 rounded-2xl border border-neutral-200`}>
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#F4F6FB] text-blue-500 font-bold flex items-center justify-center">
                    {index + 1}
                </div>

                <div className="flex-grow flex flex-col gap-1">
                    {description && (
                        <p className="font-bold text-gray-800 text-base leading-tight line-clamp-2">
                            {description}
                        </p>
                    )}
                    <div className="mt-1 flex flex-col gap-1">
                        {purchaseOrderProductModels?.map((product) => (
                            <span
                                key={product.purchaseOrderProductId}
                                className="text-sm text-gray-500 line-clamp-1"
                            >
                                <div className="flex items-center gap-1">
                                <PiDotOutlineFill/>{product.title}
                                    </div>
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleRemoveClick}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                    aria-label="حذف آیتم"
                >
                    <Image src={TrashIcon} alt="delete" width={24} height={24} />
                </button>
            </div>

            <ConfirmDialog
                content="آیا از انجام عملیات حذف این مورد اطمینان دارید؟"
                open={open}
                title="حذف آیتم"
                loading={loading}
                onClose={toggleConfirm}
                cancelText="انصراف"
                action={
                    <Button
                        type="submit"
                        fullWidth
                        disableRipple
                        disableElevation
                        variant="contained"
                        disabled={loading}
                        sx={{
                            height: "52px",
                            fontWeight: 500,
                            fontSize: "16px",
                            borderRadius: "12px",
                            boxShadow: "none",
                            textTransform: "none",
                        }}
                        onClick={handleConfirmAction}
                    >
                        حذف کن
                    </Button>
                }
            />
        </>
    );
}

export default CartItem;