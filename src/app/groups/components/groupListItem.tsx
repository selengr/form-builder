'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { Suspense } from 'react';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
// icon 
import EditIcon from '@/../public/images/home-page/edit-2.svg';
// components
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

  return (
    <div className='relative border border-gray-200 rounded-xl p-4 transition flex flex-col gap-[10px]'>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <InfoRow label='نام' value={group.name} bold />
        <InfoRow label='تعداد اعضا' value={`${group.userCount} نفر`} bold />
      </Suspense>
      <div className="flex w-full gap-2">
        <Link className='absolute top-[6px] left-16' href={`/groups/${group.id}?groupName=${group.name}`}>
          <IconButton color='primary'>
            <Image src={EditIcon} alt='edit' width={24} height={24} />
          </IconButton>
        </Link>

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
