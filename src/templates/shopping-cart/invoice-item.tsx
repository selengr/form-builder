import Image from "next/image";
import { IconButton } from "@mui/material";
// public
import TrashIcon from "@/../public/images/home-page/trash.svg";

interface CartItemProps {
  item: {
    id: string;
    title: string;
    quantity: number;
    type?: string;
  };
  onRemove: () => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-[#DDE1E6] rounded-2xl">
      <div className="flex flex-col">
        <span className="text-xs text-[#393939]">بابت: </span>
        <h6 className="text-[#393939] font-bold">{item.title}</h6>
        <span className="text-xs text-[#393939]">
          تعداد:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد
          </span>
        </span>
      </div>

      <IconButton
        onClick={onRemove}
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
