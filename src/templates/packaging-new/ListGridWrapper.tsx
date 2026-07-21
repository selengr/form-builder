'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import CreatePackagingModal from '@/templates/packaging/CreatePackagingModal';
import PackagingListCard from './ListCard';
import PackagingListCardSkeleton from './ListCardSkeleton';
import PackagingFilter from './PackagingFilter';
import { packagingListFetcher } from './packagingListFetcher';
import { PackagingListItem } from './types';

const DEFAULT_FILTER: SearchQueryFilter = {
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function PackagingNewListGridWrapper() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);

  const FilterSlot = useCallback(
    ({ mode, closeMobileFilter, refreshList }: UnifiedListGridFilterSlotProps) => {
      const isMobile = mode === 'mobile';

      const handleChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>> = (
        updater,
      ) => {
        setDraftFilter((prev) =>
          typeof updater === 'function' ? updater(prev) : updater,
        );
      };

      const handleApply = () => {
        setAppliedFilter(draftFilter);
        refreshList();
        if (isMobile) {
          closeMobileFilter();
        }
      };

      const handleReset = () => {
        setDraftFilter(DEFAULT_FILTER);
        setAppliedFilter(DEFAULT_FILTER);
        refreshList();
        if (isMobile) {
          closeMobileFilter();
        }
      };

      return (
        <PackagingFilter
          mode={mode}
          filter={draftFilter}
          onChange={handleChange}
          onApply={handleApply}
          onReset={handleReset}
        />
      );
    },
    [draftFilter],
  );

  return (
    <>
      <UnifiedListGridPage<PackagingListItem>
        config={{
          title: 'بسته های ارزیابی',
          queryKey: 'packaging_new_list',
          textTotal: ['تعداد کل بسته ها', 'عدد'],
          searchField: 'name',
          searchMode: 'url',
          hasSidebarFilter: true,
          backHref: '/',
        }}
        slots={{
          CardComponent: PackagingListCard,
          SkeletonComponent: PackagingListCardSkeleton,
          FilterComponent: FilterSlot,
          CreateButton: (
            <div className="min-w-[50px] w-[50px] h-full">
              <IconButton
                onClick={() => setOpenCreateModal(true)}
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  border: '1px solid #1758BA',
                }}>
                <Image src={PlusIcon} alt="" width={22} height={22} />
              </IconButton>
            </div>
          ),
        }}
        fetcher={packagingListFetcher}
        searchBoxList={createDefaultSearchBoxList('name')}
        searchQueryFilter={appliedFilter}
        skeletonHeaderName="تعداد کل بسته ها"
        loadingHasCreateBtn
      />

      <CreatePackagingModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />
    </>
  );
}
