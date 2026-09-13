'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import CreateFormBtn from '@/components/CreateFormBtn/CreateFormBtn';
import ListCard from './ListCard';
import ListCardSkeleton from './ListCardSkeleton';
import BuilderFilter from './BuilderFilter';
import { builderListFetcher } from './builderListFetcher';
import { BUILDER_LIST_QUERY_KEY, BuilderListItem } from './types';

const DEFAULT_FILTER: SearchQueryFilter = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function ListGridWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);

  useEffect(() => {
    setOpenCreateModal(searchParams.get('new') !== null);
  }, [searchParams]);

  const handleOpenCreate = () => {
    router.push('?new');
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    const next = new URLSearchParams(searchParams.toString());
    next.delete('new');
    router.replace(`?${next.toString()}`);
  };

  const syncDraftFromApplied = useCallback(() => {
    setDraftFilter(appliedFilter);
  }, [appliedFilter]);

  const FilterSlot = useCallback(
    ({ mode, closeMobileFilter, refreshList }: UnifiedListGridFilterSlotProps) => {
      const isMobile = mode === 'mobile';
      const filter = isMobile ? draftFilter : appliedFilter;

      const handleChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>> = (
        updater,
      ) => {
        if (isMobile) {
          setDraftFilter(updater);
          return;
        }

        setAppliedFilter((prev) =>
          typeof updater === 'function' ? updater(prev) : updater,
        );
      };

      const handleApply = () => {
        if (isMobile) {
          setAppliedFilter(draftFilter);
          closeMobileFilter();
          return;
        }

        setAppliedFilter(filter);
        refreshList();
      };

      const handleReset = () => {
        setDraftFilter(DEFAULT_FILTER);
        setAppliedFilter(DEFAULT_FILTER);
        if (isMobile) {
          closeMobileFilter();
          return;
        }
        refreshList();
      };

      return (
        <BuilderFilter
          mode={mode}
          filter={filter}
          onChange={handleChange}
          onApply={handleApply}
          onReset={handleReset}
        />
      );
    },
    [appliedFilter, draftFilter],
  );

  return (
    <>
      <UnifiedListGridPage<BuilderListItem>
        config={{
          title: 'فرم‌های من',
          queryKey: BUILDER_LIST_QUERY_KEY,
          textTotal: ['تعداد کل فرم‌ها', 'عدد'],
          searchField: 'formSetting.name',
          hasSidebarFilter: true,
          backHref: '/',
          onMobileFilterOpen: syncDraftFromApplied,
        }}
        slots={{
          CardComponent: ListCard,
          SkeletonComponent: ListCardSkeleton,
          FilterComponent: FilterSlot,
          CreateButton: (
            <div className="min-w-[50px] w-[50px] h-full">
              <IconButton
                onClick={handleOpenCreate}
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  border: '1px solid #1758BA',
                }}>
                <Image src={PlusIcon} alt="" width={22} height={22} unoptimized />
              </IconButton>
            </div>
          ),
        }}
        fetcher={builderListFetcher}
        searchBoxList={createDefaultSearchBoxList('formSetting.name')}
        searchQueryFilter={appliedFilter}
        skeletonHeaderName="تعداد کل فرم‌ها"
        loadingHasCreateBtn
      />

      <CreateFormBtn
        open={openCreateModal}
        onClose={handleCloseCreate}
        redirectBasePath="/builder"
      />
    </>
  );
}
