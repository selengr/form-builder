"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import { ICartItemProps } from "@/types/shoppingCart";
import ConfirmDialog from "@/components/confirm-dialog";
import TrashIcon from "@/../public/images/home-page/trash.svg";



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
                className={`
                    flex items-center gap-4 p-4 rounded-2xl
                    transition-all duration-300 ease-in-out border border-blue-500`}
            >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#F4F6FB] text-blue-500 font-bold flex items-center justify-center">
                    {index + 1}
                </div>

                <div className="flex-grow flex flex-col">
                    {description && (
                        <p className="font-bold text-gray-800 text-base leading-tight line-clamp-2">
                            {description}
                        </p>
                    )}
                    <div className="mt-1 flex flex-col">
                        {purchaseOrderProductModels?.map((product) => (
                            <span
                                key={product.purchaseOrderProductId}
                                className="text-sm text-gray-500 line-clamp-1"
                            >
                                - {product.title}
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleRemoveClick}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label="حذف آیتم"
                >
                    <Image src={TrashIcon} alt="delete" width={20} height={20} />
                </button>
            </div>

            <ConfirmDialog
                content="آیا از عملیات حذف اطمینان دارید؟"
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
                        variant="contained"
                        disabled={loading}
                        sx={{
                            height: "50px",
                            fontWeight: 500,
                            fontSize: "16px",
                            borderRadius: "12px",
                            backgroundColor: "#E53935",
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#D32F2F",
                            },
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