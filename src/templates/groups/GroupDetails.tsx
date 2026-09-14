'use client';

import { toast } from 'sonner';
import Image from 'next/image';
import { LinearProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import type { IUserGroupMemmerInfo } from '@/types/setting';
import { InfoRow } from '@/components/common/infoRow';
import { SearchBoxItem } from '@/components/ListGrid/ListGrid';
import ImmediateSearchInput from '@/components/ListGrid/ImmediateSearchInput';
import { changeMemberStatusAction } from '@actions/groups/member';
import { MemberListItem } from './MemberListItem';
import MemberListSkeleton from './MemberListSkeleton';
import { InvalidConfirmDialog } from './invalidConfirmDialog';
import { CancelGroupAllocationModal } from './createMemberDialog';
import { useFetchGroupMembers } from './hooks/useFetchGroupMembers';

export default function GroupDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('groupName');
  const groupId = typeof params.id === 'string' ? parseInt(params.id, 10) : null;

  const queryClient = useQueryClient();
  const [scrollRoot, setScrollRoot] = useState<Element | null>(null);
  const { ref: loadMoreRef, inView } = useInView({
    root: scrollRoot,
    threshold: 0,
    rootMargin: '120px',
  });

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [storedisActive, setStoredisActive] = useState(false);
  const [disabledSwitches, setDisabledSwitches] = useState<number[]>([]);
  const [showCreateMemberDialog, setShowCreateMemberDialog] = useState(false);
  const [onenConfirmationDialog, setOnenConfirmationDialog] = useState(false);
  const [storedIntroducedUserJTGroupId, setStoredIntroducedUserJTGroupId] = useState(0);
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    {
      fieldName: 'introducedUser.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'AND',
    },
  ]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFetchGroupMembers({
    groupId,
    searchBoxList,
    pageSize: 10,
  });

  const members: IUserGroupMemmerInfo[] = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    setSearchBoxList([
      {
        fieldName: 'introducedUser.name',
        fieldOperation: 'MATCH',
        fieldValue: query.trim(),
        nextConditionOperator: 'AND',
      },
    ]);
  }, [query]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const handleUserCheckboxChange = (userId: number, isChecked: boolean) => {
    setSelectedUsers((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  const handleOpen = useCallback(() => {
    setShowCreateMemberDialog((prev) => !prev);
  }, []);

  const handleChangeStatus = useCallback(
    async (
      isActive: boolean,
      introducedUserJTGroupId: number,
      rememberAllocation?: boolean,
    ) => {
      setDisabledSwitches((prev) => [...prev, introducedUserJTGroupId]);
      if (rememberAllocation === undefined) {
        if (isActive) {
          setOnenConfirmationDialog(true);
          setStoredIntroducedUserJTGroupId(introducedUserJTGroupId);
          setStoredisActive(isActive);
          return;
        }
      }

      try {
        const res = await changeMemberStatusAction({
          groupId,
          introducedUserJTGroupId,
          invalid: !isActive,
          rememberAllocation: rememberAllocation ?? false,
        });

        if (!res.success) {
          throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
        }

        toast.success('عملیات با موفقیت انجام شد');
        setOnenConfirmationDialog(false);
        await queryClient.invalidateQueries({
          queryKey: ['members-setting', groupId],
          exact: false,
        });
      } catch (error: any) {
        toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
      } finally {
        setLoading(false);
        setDisabledSwitches((prev) =>
          prev.filter((id) => id !== introducedUserJTGroupId),
        );
      }
    },
    [groupId, queryClient],
  );

  const onConfirm = (rememberAllocation: boolean) => {
    setLoading(true);
    void handleChangeStatus(
      storedisActive,
      storedIntroducedUserJTGroupId,
      rememberAllocation,
    );
  };

  const handleCloseConfirmationDialog = () => {
    setDisabledSwitches((prev) =>
      prev.filter((id) => id !== storedIntroducedUserJTGroupId),
    );
    setOnenConfirmationDialog(false);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        خطا در بارگذاری اعضا: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-1 sm:py-2 h-full w-full flex flex-col overflow-hidden">
      <main className="p-4 mx-1 bg-white flex flex-col rounded-xl h-full">
        <div className="min-h-[52px] flex items-center justify-center relative rounded-xl bg-[#F7F7FF] mb-4 px-2">
          <p className="text-[16px] font-bold text-[#2a2a2a]">جزئیات گروه</p>
          <button
            onClick={() => router.push('/groups')}
            className="absolute right-2 p-1 rounded-full hover:bg-gray-200">
            <MdOutlineKeyboardArrowRight size={24} color="#292D32" />
          </button>
        </div>

        <div className="border relative border-gray-200 rounded-xl p-4 pt-6 pb-3 flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-[10px]">
            <InfoRow label="نام گروه" value={groupName ?? '---'} bold />
            {isLoading ? (
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <InfoRow label="تعداد اعضا" value={`${members.length} نفر`} bold />
            )}
          </div>

          <div className="w-full md:w-[40%]">
            <ImmediateSearchInput onSearch={setQuery} />
          </div>

          <div className="absolute top-5 left-5 md:static flex md:justify-center">
            <button
              onClick={() => setShowCreateMemberDialog(true)}
              className="w-[50px] h-[50px] border border-[#1758BA] rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="افزودن عضو جدید">
              <Image src={PlusIcon} alt="افزودن" width={24} height={24} draggable={false} />
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-[#2a2a2a]">لیست کاربران</h3>
          </div>

          <div
            ref={setScrollRoot}
            className="flex-1 overflow-y-auto border border-gray-200 rounded-xl">
            {isLoading ? (
              <MemberListSkeleton />
            ) : members.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                هیچ کاربری در این گروه وجود ندارد.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {members.map((m) => (
                    <MemberListItem
                      key={m.introducedUserJTGroupId}
                      member={m}
                      selectedUsers={selectedUsers}
                      handleUserCheckboxChange={handleUserCheckboxChange}
                      handleChangeStatus={handleChangeStatus}
                      disabledSwitches={disabledSwitches}
                    />
                  ))}
                </ul>

                <div ref={loadMoreRef} className="flex justify-center p-4 min-h-12">
                  {isFetchingNextPage ? (
                    <div className="w-full px-4">
                      <LinearProgress />
                    </div>
                  ) : hasNextPage ? (
                    <p className="text-gray-400 text-sm">در حال آماده‌سازی...</p>
                  ) : (
                    <p className="text-gray-400 text-sm">همه اعضا بارگذاری شدند.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {showCreateMemberDialog && (
        <CancelGroupAllocationModal
          showCreateMemberDialog={showCreateMemberDialog}
          handleOpen={handleOpen}
          groupName={groupName!}
          groupId={groupId!}
        />
      )}

      {onenConfirmationDialog && (
        <InvalidConfirmDialog
          open={onenConfirmationDialog}
          onClose={handleCloseConfirmationDialog}
          onConfirm={onConfirm}
          loading={loading}
          title="این عضو"
        />
      )}
    </div>
  );
}
