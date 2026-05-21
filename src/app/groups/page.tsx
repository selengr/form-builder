'use client';
// React & Libs
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { useState, useRef, useEffect, useCallback } from 'react';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
// components
import { GroupListItem } from './components/groupListItem';
import GroupsListSkeleton from './components/GroupListSkeleton';
import { GroupDialogTrigger } from './components/GroupDialogTrigger';
import { InvalidConfirmDialog } from './components/invalidConfirmDialog';
import { CreateGroupDialog } from '@/app/groups/components/createGroupDialog';
import ImmediateSearchInput from '@/components/ListGrid/ImmediateSearchInput';
// action
import { useGroupsList } from './[id]/_hook/useGroupslist';
import { changeGroupStatusAction } from '../../../actions/groups/group';

export interface GroupItemAPI {
  groupName: string;
  groupId: number;
  groupMemberCount: number;
  invalid?: boolean
}
export interface GroupListResponse {
  content: GroupItemAPI[];
  totalElements: number;
}
// ----------------------------------------------------------------------
const GroupsPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const pathWithoutQuery = '/groups';
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [onenConfirmationDialog, setOnenConfirmationDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [storedGroupId, setStoredGroupId] = useState<number>(0)
  const [storedisActive, setStoredisActive] = useState<boolean>(false)
  const [disabledSwitches, setDisabledSwitches] = useState<number[]>([])

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGroupsList(query);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      // { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const handleCreateGroupSubmit = async () => {
    router.replace(pathWithoutQuery);
    await queryClient.invalidateQueries({ queryKey: ['groups'] });
  };

  const handleCloseConfirmationDialog = () => {
    setDisabledSwitches((prev) =>
      prev.filter((id) => id !== storedGroupId)
    )
    setOnenConfirmationDialog(false)
  }


  const onConfirm = (rememberAllocation: boolean) => {
    setLoading(true)
    handleChangeStatus(storedisActive, storedGroupId, rememberAllocation)
  }

  const handleChangeStatus = useCallback(async (isActive: boolean, groupId: number, rememberAllocation?: boolean) => {
    setDisabledSwitches((prev) => [...prev, groupId])
    if (rememberAllocation === undefined) {
      if (isActive) {
        setOnenConfirmationDialog(true)
        setStoredGroupId(groupId)
        setStoredisActive(isActive)
        return
      }
    }

    try {
      const res = await changeGroupStatusAction({
        groupId,
        invalid: !isActive,
        rememberAllocation: rememberAllocation ?? false,
      });

      if (res.ok) {
        toast.success('عملیات با موفقیت انجام شد');
        await queryClient.invalidateQueries({ queryKey: ['groups'] });
        setOnenConfirmationDialog(false);
      }

    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false)
      setDisabledSwitches((prev) =>
        prev.filter((id) => id !== groupId)
      )
    }
  }, [queryClient]);

  return (
   <div className="p-1 sm:py-2 h-full w-full flex flex-col overflow-hidden">
      <main className='p-4 mx-1 bg-white flex flex-col rounded-xl h-full'>
        <div className='min-h-[52px] flex items-center justify-center relative rounded-xl bg-[#F7F7FF] mb-4 px-2'>
          <p className='text-[16px] font-bold text-[#2a2a2a]'>گروه‌ها</p>
          <button onClick={() => router.push('/')} className='absolute right-2 p-1 rounded-full hover:bg-gray-200' aria-label='بازگشت به صفحه اصلی'>
            <MdOutlineKeyboardArrowRight size={24} color='#292D32' />
          </button>
        </div>

        <div className='flex justify-center items-center mb-2'>
          <div className='flex w-full max-w-lg items-center'>
            <div className='flex-1 bg-[#ECFAFF] rounded-xl px-4 py-3.5 flex justify-between items-center ml-2'>
              <div className='flex items-center gap-2 text-sm text-[#393939]'>
                <Image src={TotalGrid} width={20} height={20} alt='filter' draggable={false} />
                <span>تعداد کل گروه‌ها:</span>
              </div>
              {isLoading ? (
                <div className="w-10 h-6 bg-gray-200 rounded animate-pulse" />
              ) : (
                <span className='font-semibold text-[#2a2a2a]'>
                  {data?.pages[0]?.total ?? 0} عدد
                </span>
              )}

            </div>

            <button
              onClick={() => router.push('/groups?new')}
              className='w-[50px] h-[50px] border border-[#1758BA] rounded-xl flex items-center justify-center hover:bg-gray-100 transition'
              aria-label='افزودن گروه جدید'>
              <Image src={PlusIcon} alt='افزودن' width={24} height={24} draggable={false} />
            </button>
          </div>
        </div>

        <div className='flex justify-center mb-3'>
          <div className='w-full max-w-lg'>
            <ImmediateSearchInput onSearch={setQuery} />
          </div>
        </div>

        <div className='flex justify-center flex-1 pb-6 min-h-0'>
          {isLoading && <GroupsListSkeleton />}
          {isError && (
            <p className='text-red-500'>خطا در بارگذاری گروه‌ها: {(error as Error).message}</p>
          )}
          {!isError && !isLoading &&
            <div className='w-full max-w-lg flex flex-col gap-[10px] overflow-y-auto'>
              {data?.pages?.flatMap((page: any) =>
                page.groups.map((group: any) => (
                  <GroupListItem
                    key={group.id} group={group}
                    handleChangeStatus={handleChangeStatus}
                    disabledSwitches={disabledSwitches}
                  />
                ))
              )}

              <div ref={loadMoreRef} className='flex justify-center p-4'>
                {isFetchingNextPage ? (
                  <div className='w-full'>
                    <LinearProgress />
                  </div>
                ) : !hasNextPage && !isLoading ? (
                  <p className='text-gray-400'>همه گروه‌ها بارگذاری شدند.</p>
                ) : null}
              </div>
            </div>
          }
        </div>
      </main>

      <GroupDialogTrigger setShowCreateGroupDialog={setShowCreateGroupDialog} />

      {showCreateGroupDialog && <CreateGroupDialog onClose={() => router.back()} onSubmit={handleCreateGroupSubmit} />}

      {onenConfirmationDialog && <InvalidConfirmDialog
        open={onenConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
        onConfirm={onConfirm}
        loading={loading}
        title='اعضای این گروه'
      />}
    </div>
  );
}

export default GroupsPage
