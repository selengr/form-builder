'use client';

import { useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import React, { Suspense, useCallback, useState } from 'react';
import { SwitchButton } from '@/components/Switch/SwitchButton';

export interface IGroup {
  id: number;
  name: string;
  description: string;
  userCount: number;
  isSelected?: boolean;
}

interface IGroupListItemProps {
  group: IGroup;
  onDeleteGroup: (groupId: number) => void;
}

export function GroupListItem({ group, onDeleteGroup }: IGroupListItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handlePublishStatus = useCallback(async () => {
    // try {
    //   setLoading(true);
    //   const newStatus = group.status === 'PUBLISH' ? 'UN_PUBLISH' : 'PUBLISH';
    //   const res = await AxiosApi.put('/form/change-status', {
    //     formId: group.id,
    //     formBuilderStatusEnum: newStatus,
    //   });
    //   if (res.data) {
    //     toast.success('عملیات با موفقیت انجام شد');
    //     // setRefreshGrid((prev) => !prev);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error('عملیات ناموفق بود. مجدداً تلاش کنید.');
    // } finally {
    //   setLoading(false);
    // }
  }, [group.id]);

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
        <SwitchButton sx={{ position: "absolute", top: 15, right: 15 }} checked={true} onChange={handlePublishStatus} />
      </div>
    </div>
  );
}
