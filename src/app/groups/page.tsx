'use client';
// React & Libs
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
// utils
import { getAuthToken } from '@/utils/getAuthToken';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
// components
import SearchInput from '@/components/ListGrid/SearchInput';
import { GroupListItem, IGroup } from './components/groupListItem';
import { GroupDialogTrigger } from './components/GroupDialogTrigger';
import { CreateGroupDialog } from '@/app/groups/components/createGroupDialog';

export interface GroupItemAPI {
  groupName: string;
  groupId: number;
  groupMemberCount: number;
}

export interface GroupListResponse {
  content: GroupItemAPI[];
  totalElements: number;
}

const fetchGroups = async ({ pageParam = 0 }): Promise<{ groups: IGroup[]; total: number; nextPage: number | null }> => {
  const token = await getAuthToken();

  const defaultSearchFilterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: pageParam,
    rows: 10,
  };
  const encodedSearchFilterModel = encodeURIComponent(
    JSON.stringify(defaultSearchFilterModel)
  );

  const response = await fetch(
    `/api/group/list?searchFilterModel=${encodedSearchFilterModel}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch groups');
  }

  const data: GroupListResponse = await response.json();

  return {
    groups: data.content.map((item) => ({
      id: item.groupId,
      name: item.groupName,
      description: '',
      userCount: item.groupMemberCount,
    })),
    total: data.totalElements,
    nextPage: data.content.length > 0 ? pageParam + 1 : null,
  };
};

export default function GroupsPage() {
  const router = useRouter();
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const queryClient = useQueryClient();
  const pathWithoutQuery = '/groups';
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

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

  const handleViewGroup = (groupId: string | number) => {
    router.push(`/groups/${groupId}`);
  };

  const handleDeleteGroup = (groupId: string | number) => {
    console.log(`Delete group with ID: ${groupId}`);
  };

  const handleCreateGroupSubmit = async () => {
    router.replace(pathWithoutQuery);
    await queryClient.invalidateQueries({ queryKey: ['groups'] });
  };

  return (
    <div className='p-2 w-full h-[calc(100vh - 60px)] md:h-screen flex flex-col' draggable={false}>
      <main className='p-4 bg-white flex flex-col rounded-xl h-full'>
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
                <Suspense fallback={<div>...</div>}>
                  <Image src={TotalGrid} width={20} height={20} alt='filter' draggable={false} />
                </Suspense>
                <span>تعداد کل گروه‌ها:</span>
              </div>
              <span className='font-semibold text-[#2a2a2a]'> {data?.pages[0]?.total ?? 0} عدد</span>
            </div>

            <button
              onClick={() => router.push('/groups?new')}
              className='w-[50px] h-[50px] border border-[#1758BA] rounded-xl flex items-center justify-center hover:bg-gray-100 transition'
              aria-label='افزودن گروه جدید'>
              <Suspense fallback={<div>...</div>}>
                <Image src={PlusIcon} alt='افزودن' width={24} height={24} draggable={false} />
              </Suspense>
            </button>
          </div>
        </div>

        <div className='flex justify-center mb-3'>
          <div className='w-full max-w-lg'>
            <Suspense fallback={<div>در حال بارگذاری جستجو...</div>}>
              <SearchInput />
            </Suspense>
          </div>
        </div>

        <div className='flex justify-center flex-1 pb-6 min-h-0'>
          {isLoading ? (
            <p className='text-gray-600'>در حال بارگذاری گروه‌ها...</p>
          ) : isError ? (
            <p className='text-red-500'>خطا در بارگذاری گروه‌ها: {(error as Error).message}</p>
          ) : (
            <div className='w-full max-w-lg flex flex-col gap-[10px] overflow-y-auto'>
              {data?.pages.flatMap((page) =>
                page.groups.map((group) => (
                  <GroupListItem key={group.id} group={group} onViewGroup={handleViewGroup} onDeleteGroup={handleDeleteGroup} />
                ))
              )}

              <div ref={loadMoreRef} className='flex justify-center p-4'>
                {isFetchingNextPage ? (
                  <div className='w-full'>
                  <LinearProgress />
                  </div>
                ) : !hasNextPage ? (
                  <p className='text-gray-400'>همه گروه‌ها بارگذاری شدند.</p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <GroupDialogTrigger setShowCreateGroupDialog={setShowCreateGroupDialog} />
      </Suspense>

      {showCreateGroupDialog && <CreateGroupDialog onClose={() => router.back()} onSubmit={handleCreateGroupSubmit} />}
    </div>
  );
}
