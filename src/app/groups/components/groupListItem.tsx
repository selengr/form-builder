'use client';

import React, { Suspense} from 'react';
import { useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';

export interface IGroup {
  id: number;
  name: string;
  description: string;
  userCount: number;
  invalid?: boolean;
}

interface IGroupListItemProps {
  group: IGroup;
  handleChangeStatus: (isActive: boolean, id: number, rememberAllocation?: boolean) => void;
  disabledSwitches: number[];
}


export function GroupListItem({ group, handleChangeStatus, disabledSwitches }: IGroupListItemProps) {
  const router = useRouter();

  const handleViewGroup = (groupId: string | number, groupName: string) => {
    router.push(`/groups/${groupId}?groupName=${groupName}`);
  };

  return (
    <div className='relative border border-gray-200 rounded-xl p-4 transition flex flex-col gap-[10px]'>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <InfoRow label='نام' value={group.name} bold />
        <InfoRow label='تعداد اعضا' value={`${group.userCount} نفر`} bold />
      </Suspense>
      <div className="flex w-full gap-2">
        <button
          className="bg-[#1758BA] hover:bg-[#216ee1] transition duration-200 px-2 h-[42px] w-[50%] text-sm rounded-lg text-white"
          onClick={() => handleViewGroup(group.id, group.name)}
        >
          مشاهده
        </button>

        <SwitchButton
          sx={{ position: "absolute", top: 15, right: 15 }}
          checked={!group.invalid}
          disabled={disabledSwitches.includes(group.id)}
          onChange={() => handleChangeStatus(group.invalid!, group.id)}
        />
      </div>
    </div>
  );
}
