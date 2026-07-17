'use client';

import { useCallback, useState } from 'react';
import {
  UnifiedListGridPage,
  createServerActionFetcher,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import PackagingRequestListCard from './ListCard';
import PackagingRequestListCardSkeleton from './ListCardSkeleton';
import PackagingRequestFilter from './PackagingRequestFilter';
import { PackagingRequestListItem } from './types';

const API_URL = '/user/packaging-request/main-list';

const DEFAULT_FILTER: SearchQueryFilter = {
  status: 'ALL',
  fieldOperation: 'DSC',
};

const packagingRequestFetcher = createServerActionFetcher(API_URL, {
  filterFieldMappings: [{ stateKey: 'status', fieldName: 'status' }],
});

export default function PackagingRequestListGridWrapper() {
  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);

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
        <PackagingRequestFilter
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
    <UnifiedListGridPage<PackagingRequestListItem>
      config={{
        title: 'درخواست‌های بسته ارزیابی',
        queryKey: 'user_packaging_request_list',
        textTotal: ['تعداد کل درخواست‌ها', 'عدد'],
        searchField: 'name',
        hasSidebarFilter: true,
        backHref: '/',
        onMobileFilterOpen: syncDraftFromApplied,
      }}
      slots={{
        CardComponent: PackagingRequestListCard,
        SkeletonComponent: PackagingRequestListCardSkeleton,
        FilterComponent: FilterSlot,
      }}
      fetcher={packagingRequestFetcher}
      searchBoxList={createDefaultSearchBoxList('name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل درخواست‌ها"
    />
  );
}
