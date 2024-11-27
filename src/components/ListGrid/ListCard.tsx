/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwitchButton } from "@/components/Switch/SwitchButton";
import { IconButton } from "@mui/material";
import Image from "next/image";
import EditIcon from "@/../public/images/home-page/edit-2.svg";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import CopyIcon from "@/../public/images/home-page/copy.svg";

export default function ListCard(props: any) {
  return (
    <div className="border-[1px] flex flex-col gap-3 rounded-[20px] border-[#DDE1E6] p-4">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">نام:</span>
          <p className="text-[14px] font-bold">{props.data.name}</p>
        </div>
        <div>
          <SwitchButton />
        </div>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">نوع:</span>
        {/* <p>{props.data.formType}</p> */}
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">دسترسی:</span>
        <p className="text-[14px] font-bold">
          {props.data.name ? props.data.type : "عمومی"}
        </p>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">تعداد شرکت‌کننده:</span>
        <p className="text-[14px] font-bold">{props.data.participants}</p>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">تعداد گویه:</span>
        <p className="text-[14px] font-bold">{props.data.questionListSize}</p>
      </div>
      <div className="flex w-full gap-2 justify-center">
        <button className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-[350px] px-2 h-[36px] w-full text-[14px] rounded-lg text-white">
          مشاهده
        </button>
        <IconButton>
          <Image src={TrashIcon} alt="" width={24} height={24} />
        </IconButton>
        <IconButton>
          <Image src={CopyIcon} alt="" width={24} height={24} />
        </IconButton>
        <IconButton>
          <Image src={EditIcon} alt="" width={24} height={24} />
        </IconButton>
      </div>
    </div>
  );
}
