import React, { Suspense } from "react";
import { InfoRow } from "@/components/common/infoRow";
import Image from "next/image";
import TrashIcon from "@/../public/images/purchase-order/trashMts.svg";

export interface IGroup {
  id: number;
  name: string;
  description: string;
  userCount: number;
}

interface IGroupListItemProps {
  group: IGroup;
  onViewGroup: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
}

export function GroupListItem({ group, onViewGroup, onDeleteGroup }: IGroupListItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 transition flex flex-col gap-[10px]">
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <InfoRow label="نام:" value={group.name} bold />
        <InfoRow label="تعداد اعضا:" value={`${group.userCount} نفر`} bold />
      </Suspense>
      {/*<div className="flex w-full gap-2">*/}
      {/*  <button*/}
      {/*    className="bg-[#1758BA] hover:bg-[#216ee1] transition duration-200 px-2 h-[42px] w-full text-sm rounded-lg text-white"*/}
      {/*    onClick={() => onViewGroup(group.id)}*/}
      {/*  >*/}
      {/*    مشاهده*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    onClick={() => onDeleteGroup(group.id)}*/}
      {/*    className="w-[42px] h-[42px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition"*/}
      {/*  >*/}
      {/*    <Suspense fallback={<div>...</div>}>*/}
      {/*      <Image src={TrashIcon} alt="trash" width={24} height={24} draggable={false} />*/}
      {/*    </Suspense>*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
}