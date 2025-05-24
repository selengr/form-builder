"use client";
import Image from "next/image";
import { IconButton } from "@mui/material";
// public
import TrashIcon from "@/../public/images/home-page/trash.svg";
import { ICartItemProps } from "@/types/shoppingCart";



export function CartItem({ detail, index, isSelected, onSelect, onRemove }: ICartItemProps) {
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
        <span className="font-bold text-[#161616] line-clamp-2">{detail.description || "محصول"}</span>
        {/* {detail.description && <span className="text-sm text-[#404040]">{detail.description}</span>} */}
      </div>

      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        sx={{
          width: "52px",
          height: "52px",
        }}
      >
        <Image src={TrashIcon} alt="delete" width={24} height={24} />
      </IconButton>
    </div>
  );
}
