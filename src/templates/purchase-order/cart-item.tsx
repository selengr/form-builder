"use client";
import Image from "next/image";
import { Button, IconButton } from "@mui/material";
// types
import { ICartItemProps } from "@/types/shoppingCart";
// components
import ConfirmDialog from "@/components/confirm-dialog";
// public
import TrashIcon from "@/../public/images/home-page/trash.svg";


function CartItem({ detail, index, isSelected, onSelect, onRemove, toggleConfirm, loading, open }: ICartItemProps) {

  const { description, purchaseOrderDetailId } = detail;

  return (
    <div className={`flex items-start justify-between p-4 border rounded-2xl ${
        isSelected ? "border border-[#1758BA]" : "border-[#DDE1E6]"
      }`}  onClick={onSelect}>
      <div className="flex flex-col">
        {/* <span className="text-xs text-[#393939]">بابت: </span>
        <h6 className="text-[#393939] font-bold">{item.title}</h6>
        <span className="text-xs text-[#393939]">
          تعداد:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد
          </span>
        </span> */}
        {/* <span className="font-bold text-[#161616]">{detail.purchaseOrderProductModels[0]?.title || "محصول"}</span> */}
        <span className="font-bold text-[#161616] line-clamp-2">{description || "محصول"}</span>
        {/* {detail.description && <span className="text-sm text-[#404040]">{detail.description}</span>} */}
      </div>

      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          toggleConfirm()
        }}
        sx={{
          width: "52px",
          height: "52px",
        }}
      >
        <Image src={TrashIcon} alt="delete" width={24} height={24} />
      </IconButton>


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
              loading={loading}
              disabled={loading}
              sx={{
                height: "50px",
                fontWeight: "400",
                fontSize: "15px",
                borderRadius: "10px",
                borderColor: "#1758BA",
                boxShadow: "none",
                "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                  bgcolor: "#1758BA",
                  boxShadow: "none",
                },
              }}
              onClick={()=>onRemove(purchaseOrderDetailId)}
            >
              تایید
            </Button>
          }
        />
      
    </div>
  );
}

export default CartItem;