'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
} from '@/components/unified-list-grid';
import { CreateGroupDialog } from './createGroupDialog';
import ListCard from './ListCard';
import ListCardSkeleton from './ListCardSkeleton';
import { groupsListFetcher } from './groupsListFetcher';
import { GROUPS_LIST_QUERY_KEY, GroupListItem } from './types';

export default function ListGridWrapper() {
  const queryClient = useQueryClient();
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);

  const handleCreateGroupSubmit = async () => {
    await queryClient.invalidateQueries({ queryKey: [GROUPS_LIST_QUERY_KEY] });
    setShowCreateGroupDialog(false);
  };

  return (
    <>
      <UnifiedListGridPage<GroupListItem>
        config={{
          title: 'گروه‌ها',
          queryKey: GROUPS_LIST_QUERY_KEY,
          textTotal: ['تعداد کل گروه‌ها', 'عدد'],
          searchField: 'name',
          disableFilter: true,
          hasSidebarFilter: false,
          backHref: '/',
        }}
        slots={{
          CardComponent: ListCard,
          SkeletonComponent: ListCardSkeleton,
          CreateButton: (
            <div className="min-w-[50px] w-[50px] h-full">
              <IconButton
                onClick={() => setShowCreateGroupDialog(true)}
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  border: '1px solid #1758BA',
                }}
                aria-label="افزودن گروه جدید">
                <Image src={PlusIcon} alt="افزودن" width={22} height={22} unoptimized />
              </IconButton>
            </div>
          ),
        }}
        fetcher={groupsListFetcher}
        searchBoxList={createDefaultSearchBoxList('name')}
        skeletonHeaderName="تعداد کل گروه‌ها"
        loadingHasCreateBtn
      />

      {showCreateGroupDialog && (
        <CreateGroupDialog
          onClose={() => setShowCreateGroupDialog(false)}
          onSubmit={handleCreateGroupSubmit}
        />
      )}
    </>
  );
}
