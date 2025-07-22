"use client";
import Image from "next/image";
import {Button, IconButton} from "@mui/material";
// types
import {ICartItemProps} from "@/types/shoppingCart";
// components
import ConfirmDialog from "@/components/confirm-dialog";
// public
import TrashIcon from "@/../public/images/home-page/trash.svg";

function CartItem({
                      detail,
                      index,
                      isSelected,
                      onSelect,
                      onRemove,
                      toggleConfirm,
                      loading,
                      open,
                  }: ICartItemProps) {
    const { description, purchaseOrderProductModels, purchaseOrderDetailId } = detail;
    const productTitle = purchaseOrderProductModels?.[0]?.title || "محصول";

    return (
        <div
            className={`flex items-start justify-between p-4 border rounded-2xl cursor-pointer transition-colors duration-200 ${
                isSelected ? "border-[#1758BA] bg-white" : "border-[#DDE1E6] bg-white"
            }`}
            onClick={onSelect}
        >
            {/* اطلاعات محصول */}
            <div className="flex flex-col max-w-[80%]">
                <span className="font-bold text-[#161616] text-sm line-clamp-2">{productTitle}</span>
                {description && (
                    <span className="text-xs text-[#404040] mt-1 line-clamp-2">{description}</span>
                )}
            </div>

            {/* دکمه حذف */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    toggleConfirm();
                }}
                sx={{ width: 48, height: 48 }}
            >
                <Image src={TrashIcon} alt="delete" width={24} height={24} />
            </IconButton>

            {/* دیالوگ تایید حذف */}
            <ConfirmDialog
                content="آیا از عملیات حذف اطمینان دارید؟"
                open={open}
                title="حذف"
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
                            fontWeight: 400,
                            fontSize: "15px",
                            borderRadius: "10px",
                            backgroundColor: "#1758BA",
                            boxShadow: "none",
                            "&:hover, &:active": {
                                backgroundColor: "#1758BA",
                            },
                        }}
                        onClick={() => onRemove(purchaseOrderDetailId)}
                    >
                        تایید
                    </Button>
                }
            />
        </div>
    );
}

export default CartItem;
